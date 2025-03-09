// import Header from "./headers/Header";
import SearchCriteria from "./search/SearchCriteria";
import { useEffect, useState } from "react";

function App() {
  const [animate, setAnimate] = useState("animate-bounce");

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate("");
    }, 501); // Timeout duration in milliseconds (e.g., 3000ms = 3 seconds)

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  return (
    <div className={animate}>
      <div className="bg-white w-screen max-h-screen">
        <SearchCriteria />
      </div>
    </div>
  );
}

export default App;
