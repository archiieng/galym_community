import { useEffect } from "react";

const SITE = "Galym";

// Gives each screen its own browser-tab title ("Opportunities | Galym"), which
// is also what a screen reader announces after a navigation.
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title
      ? `${title} | ${SITE}`
      : `${SITE}: scholarships, internships and exchanges`;
  }, [title]);
}
