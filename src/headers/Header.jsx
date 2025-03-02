import { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import HeaderModal from "../modal/HeaderModal";
import { HiOutlineArchiveBox } from "react-icons/hi2";

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [clickIcon, setClickIcon] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark"); // Toggle dark class on <html>
  };

  const onclickAndroidIcon = () => {
    console.log("click", !clickIcon);
    setClickIcon(!clickIcon);
  };

  useEffect(() => {}, [clickIcon]);

  return (
    <header className="bg-white shadow-md dark:bg-gray-900 dark:text-white rounded-t-2xl rounded-b-sm">
      <div className="container mx-auto py-4 flex justify-between items-center">
        {/* Logo */}
        <div>
          <HiOutlineArchiveBox
            onClick={onclickAndroidIcon}
            className="text-cyan-50 text-4xl"
          />
        </div>
        <div className="text-2xl font-mono text-gray-800 dark:text-gray-200">
          Search Engine Logs
        </div>

        <button
          onClick={toggleDarkMode}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg dark:bg-gray-200 dark:text-gray-800 flex items-center"
        >
          {isDarkMode ? <FaSun className="" /> : <FaMoon className="" />}
          {/* {isDarkMode ? "Light Mode" : "Dark Mode"} */}
        </button>

        {clickIcon && <HeaderModal isClick={clickIcon} />}
      </div>
    </header>
  );
};

export default Header;
