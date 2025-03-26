// import Header from "./headers/Header";
import SearchCriteria from "./search/SearchCriteria";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [animate, setAnimate] = useState("animate-bounce");

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate("");
    }, 501); // Timeout duration in milliseconds (e.g., 3000ms = 3 seconds)

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  return (
    // <div className={animate}>
      <div className={`${animate} main-bg w-full h-svh pt-10`}>
        <SearchCriteria />
      </div>
    // </div>
  );
}

export default App;
