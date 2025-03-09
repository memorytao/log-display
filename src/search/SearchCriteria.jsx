import { useState, useEffect, useRef } from "react";
import DisplayResults from "../display/DisplayResults";
import { getDtacResponseLogs, getDtacContactLogs } from "../api/DtacAPI";
import { getTrueResponseLogs, getTrueContactLogs } from "../api/TrueAPI";
import Loading from "./Loading";
import "./criteria.css";

const SearchCriteria = () => {
  // State for form inputs
  const [status, setStatus] = useState("");
  const [msisdn, setMsisdn] = useState("");
  const [date, setDate] = useState("");
  const [packCode, setPackage] = useState("");
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
    setMsisdn("");
    setDate(new Date().toISOString().split("T")[0]); // Reset to current date
    setPackage("");
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

  // const handleMSISDNChange = (e) => {
  //   const { value } = e.target;
  //   if (value.match(/^[0-9]*$/)) {
  //     setMsisdn(value);
  //   }
  // };
  // Set current date when the component mounts
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    setDate(formattedDate); // Set the current date
  }, []);

  // Handle form submission
  const handleSearch = async () => {
    setCsvData("");
    setIsLoading(true);
    setError("");

    const searchParams = {
      status: status,
      msisdn: msisdn,
      date: date,
      packageCode: packCode,
      selectedLog: selectedLog,
      selectedBrand: selectedBrand,
    };

    // if (!searchParams.packageCode || searchParams.packageCode.length < 3) {
    //   searchParams.packageCode = selectedBrand;
    //   console.log(searchParams.packageCode);
    // }

    console.log("search param :", searchParams);

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
    const csvContent = rows.map((row) => row.join(",")).join("\n");

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
    <div className="w-5/6 mx-auto py-8 rounded-lg mt-10 nova-mono">
      <form
        onSubmit={(e) => e.preventDefault()} // Prevent default form submission
        className="bg-neutral-50 p-6 rounded-2xl shadow-md border-2 border-gray-200"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-balance font-semibold text-gray-700 ">
              Brand
            </label>
            <select
              value={selectedBrand}
              // onChange={(e) => setSelectedBrand(e.target.value)}
              onChange={handleSelectedBrand}
              className=" mt-1 block w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-400"
            >
              <option value="DTAC">DTAC</option>
              <option value="TRUE">TRUE</option>
            </select>
          </div>

          {/* Select Menu */}
          <div>
            <label className="block text-balance font-semibold text-gray-700">
              Logs
            </label>
            <select
              value={selectedLog}
              onChange={handleSelectedLog}
              className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-400"
            >
              <option value="Response History">Response History</option>
              <option value="Contact History">Contact History</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block text-balance font-semibold text-gray-700">
              Status
            </label>
            <select
              value={status}
              // placeholder="Select Status"
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-400"
            >
              <option value="">Select Status</option>
              <option value="FULS">FULS</option>
              <option value="FULF">FULF</option>
            </select>
          </div>

          {/* MSISDN Text Field */}
          <div>
            <label className="block text-balance font-semibold text-gray-700">
              Main Search
            </label>
            <input
              required
              maxLength={30}
              type="tel"
              value={msisdn}
              onChange={(e) => setMsisdn(e.target.value)}
              // onChange={handleMSISDNChange}
              // placeholder="input at least 8 letters"
              className="required:border-red-600 required:border-2 mt-1 block w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-1"
            />
          </div>

          {/* Package Text Field */}
          <div>
            <label className="block text-balance font-semibold text-gray-700">
              Optional Search
            </label>
            <input
              // required
              type="text"
              value={packCode}
              maxLength={35}
              onChange={(e) => setPackage(e.target.value)}
              // placeholder="input at least 3 letters"
              className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-400"
              // className="required:border-red-600 required:border-2 mt-1 block w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Date Input */}
          <div>
            <label className="block text-balance font-semibold text-gray-700">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-400"
            />
          </div>
          <span className="text-xs text-red-500">
            Plase input the required fields
          </span>
        </div>

        {/* Submit Button */}
        <div className="flex flex-row mt-6">
          {msisdn ? (
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
