import { useState } from "react";

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark"); // Toggle dark class on <html>
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="px-4 py-2 bg-gray-800 text-white rounded-lg dark:bg-gray-200 dark:text-gray-800"
    >
      {isDarkMode ? "Light Mode" : "Dark Mode"}
    </button>
  );
};

export default DarkModeToggle;
