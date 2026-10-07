# Galym Community

A platform for finding scholarships, internships, research and exchange opportunities.

| Folder             | What it is                                             |
| ------------------ | ------------------------------------------------------ |
| `galym_community/` | Backend: Spring Boot 4, Java 21, PostgreSQL, JWT auth  |
| `galym_frontend/`  | Frontend: React 19, Vite, React Router                 |

## Run everything with Docker

```bash
cp .env.example .env      # then fill in POSTGRES_PASSWORD and JWT_SECRET
docker compose up --build
```

- Frontend: http://localhost:5173
- API: http://localhost:8080

`docker compose down` stops the stack; add `-v` to also delete the database.

### Making someone an admin

Registration always creates a regular user. Promote one by hand:

```bash
docker compose exec db psql -U galym -d galym -c "UPDATE users SET role = 'ADMIN' WHERE email = 'you@example.com';"
```

(`galym` is the database name and user from `.env`.)

## Run without Docker

Both apps read the same root `.env`.

```bash
# backend (needs JDK 21 and a PostgreSQL matching .env)
cd galym_community && ./mvnw spring-boot:run

# frontend
cd galym_frontend && npm install && npm run dev
```

## Configuration

Every setting is an environment variable, documented in [.env.example](.env.example). Nothing secret is committed.

## Database changes

The schema is managed by Flyway. To change it, add a new `V<n>__description.sql` file in
`galym_community/src/main/resources/db/migration/`; never edit a migration that has already run.

## Lint and format

From the repo root:

```bash
npm run lint      # ESLint + Prettier check (frontend), Checkstyle + Spotless check (backend)
npm run format    # Prettier (frontend) and Spotless (backend) rewrite the files
```

The backend half runs Maven inside Docker, so it needs Docker running but no local JDK.
With JDK 21 installed you can run it directly: `cd galym_community && ./mvnw spotless:apply checkstyle:check`.

CI (`.github/workflows/ci.yml`) runs the same checks plus the frontend build and backend tests on every push.

## API overview

| Route                         | Who       | What                                   |
| ----------------------------- | --------- | -------------------------------------- |
| `POST /auth/register`, `/auth/login` | anyone | create an account, get a token      |
| `GET /galym`, `/galym/{id}`   | anyone    | published opportunities                |
| `GET /users/me`               | signed in | own profile                            |
| `GET/PUT/DELETE /users/me/saved[/{id}]` | signed in | saved opportunities          |
| `/admin/galym/**`             | admin     | create, edit, publish, delete          |
| `/admin/user/**`              | admin     | manage users                           |
