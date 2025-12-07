import { useState, useEffect } from "react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  return (
    <button onClick={() => setDark(!dark)} className="ml-4 p-2 rounded bg-gray-200 dark:bg-gray-700">
      {dark ? "🌙" : "☀️"}
    </button>
  );
}
