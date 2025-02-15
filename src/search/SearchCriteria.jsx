import { useState, useEffect } from "react";
import DisplayResults from "../display/DisplayResults";

const SearchCriteria = () => {
  // State for form inputs
  const [status, setStatus] = useState("");
  const [msisdn, setMsisdn] = useState("");
  const [date, setDate] = useState("");
  const [packCode, setPackage] = useState("");

  const [csvData, setCsvData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle form submission
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    setError("");

    const API =
      "http://localhost:8888/apis/dtac/getResponseLogs/66948078978_20250211080238787";

    try {
      // Replace with your API endpoint

      const response = await fetch(API, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

    
      const data = await response.json(); // Assuming the API returns CSV data
      console.log('res ', data.response);
      
      console.log(data);
    //   setCsvData(data);
      setCsvData(JSON.stringify(data));
    } catch (err) {
      setError("An error occurred while fetching data.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
//     const mockCSVData = `
//     ID|Status|MSISDN|Date|Package
//     1|FULS|1234567890|2023-10-01|Basic
//     2|FULF|0987654321|2023-10-02|Premium
//     3|FULS|5555555555|2023-10-03|Standard
//   `;
//     setCsvData(mockCSVData.trim()); //

    console.log("Search Criteria:", { status, msisdn, date, packCode });
    // Simulate an API call
    setTimeout(() => {
      setLoading(false);
      // You can perform your search/filter logic here
    }, 2000);
  };

  // Handle form reset
  const handleReset = () => {
    setStatus("");
    setMsisdn("");
    setDate("");
    setPackage("");
    setCsvData("");
  };

  return (
    <div className="container mx-auto py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Status Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">---</option>
              <option value="FULS">FULS</option>
              <option value="FULF">FULF</option>
            </select>
          </div>

          {/* MSISDN Text Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              MSISDN
            </label>
            <input
              type="text"
              value={msisdn}
              onChange={(e) => setMsisdn(e.target.value)}
              placeholder="Enter MSISDN"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Package Text Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Package
            </label>
            <input
              type="text"
              value={packCode}
              onChange={(e) => setPackage(e.target.value)}
              placeholder="Enter Package"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            onClick={handleSearch}
            disabled={isLoading}
            type="submit"
            className="mt-1 w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
          <button
            onClick={handleReset}
            type="button"
            className="mt-1 ml-2 w-full sm:w-auto px-6 py-2 bg-red-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Reset
          </button>
        </div>
      </form>

      <div className="container w-screen place-items-center">
        {error && <p className="mt-4 text-red-500">{error}</p>}
        {csvData && <DisplayResults csvData={csvData} />}
      </div>
    </div>
  );
};

export default SearchCriteria;
