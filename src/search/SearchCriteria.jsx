import { useEffect, useMemo, useRef, useState } from "react";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { LuDownload } from "react-icons/lu";
import DisplayResults from "../display/DisplayResults";
import "./criteria.css";
import { getDtacContactLogs, getDtacResponseLogs } from "../api/DtacAPI";
import { getTrueContactLogs, getTrueResponseLogs } from "../api/TrueAPI";

const SearchCriteria = () => {
  // State for form inputs
  const [status, setStatus] = useState("");
  const [mainSearch, setMainSearch] = useState("");
  const [sorting, setSorting] = useState("latest");
  const [optionalSearch, setOptionalSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState("Response History");
  const [selectedBrand, setSelectedBrand] = useState("DTAC");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const abortControllerRef = useRef(null);

  const keepResults = useMemo(() => {
    return searchResults &&
      searchResults.response &&
      searchResults.response.length > 0
      ? searchResults
      : null;
  }, [searchResults]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleReset = () => {
    setStatus("");
    setMainSearch("");
    setSorting("latest");
    setOptionalSearch("");
    setSelectedLog("Response History");
    setSelectedBrand("DTAC");
    setIsLoading(false);
    setError("");
    setSearchResults(null);
  };

  const handleSelectedBrand = (e) => {
    setSelectedBrand(e.target.value);
  };

  const handleSelectedLog = (e) => {
    setSelectedLog(e.target.value);
  };

  const handleSearch = async () => {
    // Cancel any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setIsLoading(true);
    setError("");
    setSearchResults(null);

    const searchParams = {
      status: status,
      mainSearch: mainSearch.trim(),
      sort: sorting,
      optionalSearch: optionalSearch.trim(),
      selectedLog: selectedLog,
      selectedBrand: selectedBrand,
    };

    try {
      let response;
      if (selectedBrand === "DTAC") {
        response =
          selectedLog === "Response History"
            ? await getDtacResponseLogs(searchParams, { signal })
            : await getDtacContactLogs(searchParams, { signal });
      } else {
        response =
          selectedLog === "Response History"
            ? await getTrueResponseLogs(searchParams, { signal })
            : await getTrueContactLogs(searchParams, { signal });
      }

      if (!signal.aborted) {
        await new Promise((resolve) => {
          setTimeout(() => {
            const processedData =
              typeof response === "string" ? JSON.parse(response) : response;
            setSearchResults(processedData);
            resolve(); // Resolve after timeout + data processing
          }, 1500);
        });
      }
    } catch (err) {
      if (!signal.aborted) {
        setError(err.message || "Failed to fetch data");
      }
    } finally {
      if (!signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  const exportToCSV = () => {
    // Check if parsedData or parsedData.response is undefined
    if (!searchResults || !searchResults.response) {
      setError("No data available to export.");
      return;
    }

    // Process each item in the response array
    const rows = searchResults.response.flatMap((item) => {
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

  const Loading = () => {
    return (
      <svg
        className="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
    );
  };

  return (
    <div className="w-5/6 mx-auto py-8 rounded-lg nova-mono">
      <form
        onSubmit={(e) => e.preventDefault()} // Prevent default form submission
        className="bg-gray-200 p-6 rounded-2xl border-2 border-gray-200 shadow-[0px_9px_45px_22px_rgba(255,_26,117,_0.5)]"
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
                  mainSearch
                    ? "mt-1 block w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    : "mt-1 block w-full px-4 py-2 border border-red-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-400"
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
          {mainSearch && (
            <button
              onClick={handleSearch}
              disabled={isLoading}
              type="submit"
              className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-blue-400 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isLoading ? (
                <div className="flex flex-row">
                  <div role="status">
                    <Loading />
                    <span className="sr-only">Loading...</span>
                  </div>
                  <span className="ml-1"> Searching...</span>
                </div>
              ) : (
                "Search"
              )}
            </button>
          )}

          {!isLoading && (
            <button
              onClick={handleReset}
              type="button"
              className="ml-2 w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 hover:from-pink-400 hover:to-rose-600"
            >
              Reset
            </button>
          )}

          {searchResults && !isLoading && (
            <button
              onClick={exportToCSV}
              className="ml-2 w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 hover:from-slate-400 hover:to-slate-600"
            >
              <LuDownload />
            </button>
          )}
        </div>
      </form>

      <div className="justify-items-center">
        {error && <p className="mt-20 text-red-500">{error}</p>}
        {keepResults && (
          <DisplayResults data={keepResults} logType={selectedLog} />
        )}
      </div>
    </div>
  );
};

export default SearchCriteria;
