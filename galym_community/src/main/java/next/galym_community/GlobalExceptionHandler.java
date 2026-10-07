package next.galym_community;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ValidationException;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.stream.Collectors;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleNotFound(EntityNotFoundException ex) {
        return error(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponseDTO> handleValidation(ValidationException ex) {
        return error(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDTO> handleInvalidBody(MethodArgumentNotValidException ex) {
        String message =
                ex.getBindingResult().getFieldErrors().stream()
                        .map(e -> e.getField() + " " + e.getDefaultMessage())
                        .collect(Collectors.joining("; "));
        return error(HttpStatus.BAD_REQUEST, message);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponseDTO> handleBadCredentials(BadCredentialsException ex) {
        return error(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    /** Unparseable JSON, an unknown enum value, or text where an id was expected. */
    @ExceptionHandler({
        HttpMessageNotReadableException.class,
        MethodArgumentTypeMismatchException.class
    })
    public ResponseEntity<ErrorResponseDTO> handleMalformed(Exception ex) {
        return error(HttpStatus.BAD_REQUEST, "The request could not be understood");
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponseDTO> handleDataIntegrity(
            DataIntegrityViolationException ex) {
        String sqlState =
                ex.getMostSpecificCause() instanceof SQLException sql ? sql.getSQLState() : "";
        // 23505: unique violation, e.g. an email that is already registered.
        if ("23505".equals(sqlState)) {
            return error(HttpStatus.CONFLICT, "This already exists");
        }
        // Class 22: data the database cannot store, such as a NUL byte in a search term.
        if (sqlState != null && sqlState.startsWith("22")) {
            return error(HttpStatus.BAD_REQUEST, "The request could not be understood");
        }
        // Anything else (a missing required column, a broken foreign key) is a bug on our
        // side and must show up as a logged 500, not be blamed on the caller.
        throw ex;
    }

    private static ResponseEntity<ErrorResponseDTO> error(HttpStatus status, String message) {
        return ResponseEntity.status(status)
                .body(new ErrorResponseDTO(message, status.value(), LocalDateTime.now()));
    }
}
