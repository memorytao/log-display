import { useState, useRef } from "react";
import DisplayResults from "../display/DisplayResults";
import { getDtacResponseLogs, getDtacContactLogs } from "../api/DtacAPI";
import { getTrueResponseLogs, getTrueContactLogs } from "../api/TrueAPI";
import Loading from "./Loading";
import "./criteria.css";
import { IoIosArrowDropdownCircle } from "react-icons/io";

const SearchCriteria = () => {
  // State for form inputs
  const [status, setStatus] = useState("");
  const [mainSearch, setMainSearch] = useState("");
  const [sorting, setSorting] = useState("latest");
  const [optionalSearch, setOptionalSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState("Response History"); // State for select log
  const [selectedBrand, setSelectedBrand] = useState("DTAC"); // State for select brand

  const [csvData, setCsvData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Refs for buttons
  const searchButtonRef = useRef(null);
  const resetButtonRef = useRef(null);

  // Handle form reset
  const handleReset = () => {
    setStatus("");
    setMainSearch("");
    setSorting("latest");
    setOptionalSearch("");
    setCsvData("");
    setSelectedLog("Response History"); // Reset select menu to default
    setSelectedBrand("DTAC");
    resetButtonRef.current.blur(); // Remove focus after click
  };

  const handleSelectedBrand = (e) => {
    setSelectedBrand(e.target.value);
    setCsvData("");
  };

  const handleSelectedLog = (e) => {
    setSelectedLog(e.target.value);
    setCsvData("");
  };

  // Handle form submission
  const handleSearch = async () => {
    setCsvData("");
    setIsLoading(true);
    setError("");

    const searchParams = {
      status: status,
      mainSearch: mainSearch.trim(),
      sort: sorting,
      optionalSearch: optionalSearch.trim(),
      selectedLog: selectedLog,
      selectedBrand: selectedBrand,
    };

    // console.log("search param :", searchParams);

    try {
      let data;
      if (selectedBrand === "DTAC") {
        if (selectedLog === "Response History") {
          data = await getDtacResponseLogs(searchParams); // Use the API function
        } else {
          data = await getDtacContactLogs(searchParams); // Use the API function
        }
      } else {
        if (selectedLog === "Response History") {
          data = await getTrueResponseLogs(searchParams); // Use the API function
        } else {
          data = await getTrueContactLogs(searchParams); // Use the API function
        }
      }
      setCsvData(data);
    } catch (err) {
      setError("An error occurred while fetching data.");
      console.error(err);
    } finally {
      setIsLoading(false);
      searchButtonRef.current.blur(); // Remove focus after click
    }
  };

  // Function to export CSV
  const exportToCSV = () => {
    if (!csvData) {
      alert("No data to export!");
      return;
    }

    // Parse the JSON string
    let parsedData;
    try {
      parsedData = JSON.parse(csvData);
    } catch (error) {
      console.error("Failed to parse csvData:", error);
      alert("Failed to export data. Invalid data format.");
      return;
    }

    // Check if parsedData or parsedData.response is undefined
    if (!parsedData || !parsedData.response) {
      alert("No data available to export.");
      return;
    }

    // Process each item in the response array
    const rows = parsedData.response.flatMap((item) => {
      return item.data.map((dataString) => {
        const columns = dataString.split("|"); // Split the pipe-separated string
        return [...columns, item.machine]; // Add the machine field to the row
      });
    });

    // Convert the data rows to CSV format (without headers)
    const csvContent = rows.map((row) => row.join("|")).join("\n");

    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Create a download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "exported_data.csv"; // File name
    document.body.appendChild(link);
    link.click(); // Trigger the download
    document.body.removeChild(link); // Clean up
    URL.revokeObjectURL(url); // Free up memory
  };

  return (
    <div className="w-5/6 mx-auto py-8 rounded-lg nova-mono">
      <form
        onSubmit={(e) => e.preventDefault()} // Prevent default form submission
        className="bg-gray-200 p-6 rounded-2xl border-2 border-gray-200 shadow-[0px_4px_70px_14px_rgba(147,_51,_234,0.5)]"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-balance font-semibold text-gray-700 ">
              Brand
            </label>
            <div className="relative">
              <select
                value={selectedBrand}
                onChange={handleSelectedBrand}
                className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-400 appearance-none"
              >
                <option value="DTAC">DTAC</option>
                <option value="TRUE">TRUE</option>
              </select>
              {/* Custom dropdown arrow using react-icons */}
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <IoIosArrowDropdownCircle className="h-5 w-5 text-gray-700" />
              </div>
            </div>
          </div>

          {/* Select Menu */}

          <div>
            <label className="block text-balance font-semibold text-gray-700">
              Logs
            </label>
            <div className="relative">
              <select
                value={selectedLog}
                onChange={handleSelectedLog}
                className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-400 appearance-none"
              >
                <option value="Response History">Response History</option>
                <option value="Contact History">Contact History</option>
              </select>
              {/* Custom dropdown arrow using react-icons */}
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <IoIosArrowDropdownCircle className="h-5 w-5 text-gray-700" />
              </div>
            </div>
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block text-balance font-semibold text-gray-700">
              Status
            </label>
            <div className="relative">
              <select
                value={status}
                // placeholder="Select Status"
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-400 appearance-none"
              >
                <option value="">Select Status</option>
                <option value="FULS">FULS</option>
                <option value="FULF">FULF</option>
                <option value="SUCCESS">SUCCESS</option>
                <option value="Success">Success</option>
              </select>
              {/* Custom dropdown arrow using react-icons */}
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <IoIosArrowDropdownCircle className="h-5 w-5 text-gray-700" />
              </div>
            </div>
          </div>

          {/* MAIN Text Search */}
          <div>
            <label className="block text-balance font-semibold text-gray-700">
              Main Search
            </label>
            <div className="relative">
              <input
                required
                maxLength={30}
                type="tel"
                value={mainSearch}
                onChange={(e) => setMainSearch(e.target.value)}
                className={
                  !mainSearch
                    ? "required:border-red-600 required:border-2 mt-1 block w-full px-4 py-2 rounded-lg focus:outline focus:outline-pink-400"
                    : "mt-1 block w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-400"
                }
              />
              {!mainSearch ? (
                <span className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-1/2">
                  <span className="relative flex size-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex size-3 rounded-full bg-rose-600"></span>
                  </span>
                </span>
              ) : (
                ""
              )}
            </div>
          </div>

          {/* Optional Text Search */}
          <div>
            <label className="block text-balance font-semibold text-gray-700">
              Optional Search
            </label>
            <input
              // required
              type="text"
              value={optionalSearch}
              maxLength={35}
              onChange={(e) => setOptionalSearch(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
          </div>

          {/* Sort by oldest/newest data */}
          <div>
            <label className="block text-balance font-semibold text-gray-700">
              Sort By
            </label>
            <div className="relative">
              <select
                value={sorting}
                onChange={(e) => setSorting(e.target.value)}
                className=" mt-1 block w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-400 appearance-none"
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
              </select>
              {/* Custom dropdown arrow using react-icons */}
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <IoIosArrowDropdownCircle className="h-5 w-5 text-gray-700" />
              </div>
            </div>
          </div>
          {/* <span className="text-xs text-red-500">
            Please input the required field first
          </span> */}
        </div>

        {/* Submit Button */}
        <div className="flex flex-row mt-6">
          {mainSearch ? (
            <button
              ref={searchButtonRef}
              onClick={handleSearch}
              disabled={isLoading}
              type="submit" // Use type="button" to prevent form submission
              // className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-blue-400 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isLoading ? (
                <div className="flex flex-row">
                  <div role="status">
                    <Loading />
                  </div>
                  <span className="ml-1"> Searching...</span>
                </div>
              ) : (
                "Search"
              )}
            </button>
          ) : (
            ""
          )}
          {!isLoading ? (
            <button
              ref={resetButtonRef}
              onClick={handleReset}
              type="button"
              // className="ml-2 w-full sm:w-auto px-6 py-2 bg-red-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              className="ml-2 w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 hover:from-pink-400 hover:to-rose-600"
            >
              Reset
            </button>
          ) : (
            ""
          )}

          {csvData && !isLoading ? (
            <button
              onClick={exportToCSV}
              className="ml-2 w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 hover:from-slate-400 hover:to-slate-600"
            >
              Export as CSV
            </button>
          ) : (
            ""
          )}
        </div>
      </form>

      <div className="justify-items-center">
        {error && <p className="mt-4 text-red-500">{error}</p>}
        {csvData && (
          <div className="mt-6">
            <DisplayResults csvData={csvData} logType={selectedLog} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchCriteria;
