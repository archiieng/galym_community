import { useState } from "react";
import { MoonIcon, SunIcon } from "./icons";

// The theme lives on <html data-theme>, set before first paint by index.html.
function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || "light",
  );
  const next = theme === "dark" ? "light" : "dark";

  function handleToggle() {
    const apply = () => {
      document.documentElement.dataset.theme = next;
    };

    // Cross-fade where the browser can; switch instantly where it cannot.
    if (document.startViewTransition) {
      document.startViewTransition(apply);
    } else {
      apply();
    }

    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage blocked: the choice simply lasts for this visit.
    }

    setTheme(next);
  }

  return (
    <button
      type="button"
      className="icon-btn theme-toggle"
      onClick={handleToggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      {/* key restarts the turn-in animation on every switch */}
      <span key={theme} style={{ display: "grid" }}>
        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      </span>
    </button>
  );
}

export default ThemeToggle;
