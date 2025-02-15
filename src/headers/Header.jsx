import { useState } from "react";
import { FaSun, FaMoon } from 'react-icons/fa';

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark"); // Toggle dark class on <html>
  };

//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

  return (
    <header className="bg-white shadow-md dark:bg-gray-700">
      <div className="container mx-auto  py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-mono text-gray-800 dark:text-gray-200">Search Engine Logs</div>

        <button
        onClick={toggleDarkMode}
        className="px-4 py-2 bg-gray-800 text-white rounded-lg dark:bg-gray-200 dark:text-gray-800 flex items-center"
      >
        {isDarkMode ? <FaSun className="" /> : <FaMoon className="" />}
        {/* {isDarkMode ? "Light Mode" : "Dark Mode"} */}
      </button>

        {/* Navigation Links - Desktop */}
        {/* <nav className="hidden md:flex space-x-6">
          <a href="#" className="text-gray-800 hover:text-blue-500">Home</a>
          <a href="#" className="text-gray-800 hover:text-blue-500">About</a>
          <a href="#" className="text-gray-800 hover:text-blue-500">Services</a>
          <a href="#" className="text-gray-800 hover:text-blue-500">Contact</a>
        </nav> */}

        {/* Mobile Menu Button */}
        {/* <button
          className="md:hidden text-gray-800 focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button> */}
      </div>

      {/* Mobile Menu - Dropdown */}
      {/* {isMenuOpen && (
        <div className="md:hidden bg-white">
          <nav className="flex flex-col space-y-4 px-6 py-4">
            <a href="#" className="text-gray-800 hover:text-blue-500">
              Home
            </a>
            <a href="#" className="text-gray-800 hover:text-blue-500">
              About
            </a>
            <a href="#" className="text-gray-800 hover:text-blue-500">
              Services
            </a>
            <a href="#" className="text-gray-800 hover:text-blue-500">
              Contact
            </a>
          </nav>
        </div>
      )} */}
    </header>
  );
};

export default Header;
