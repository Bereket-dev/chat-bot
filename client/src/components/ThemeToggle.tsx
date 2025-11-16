import Sun from "../assets/sun.svg";
import Moon from "../assets/moon-stars-fill.svg";
import { useState, useEffect } from "react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const storedTheme: String = localStorage.getItem("theme") || "light";
    return storedTheme == "dark" ? "dark" : "light";
  });

  useEffect(() => {
    const html = document.documentElement;

    if (theme == "dark") {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);
  return (
    <button
      type="button"
      onClick={() => setTheme(theme == "dark" ? "light" : "dark")}
    >
      <img
        src={theme == "dark" ? Sun : Moon}
        alt={theme == "dark" ? "Sun Icon" : "Moon Icon"}
        className="w-5 md:w-7"
      />
    </button>
  );
};

export default ThemeToggle;
