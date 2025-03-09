import React, { useState } from "react";
import PropTypes from "prop-types";
import { RESPONSE_FILD, CONTACT_FIELD } from "./../api/fields";

const DisplayResults = ({ csvData, logType }) => {
  const COLUMNS =
    logType === "Response History"
      ? RESPONSE_FILD.split("|")
      : CONTACT_FIELD.split("|");

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Number of rows per page

  // Parse the JSON string
  let parsedData;
  try {
    parsedData = JSON.parse(csvData);
  } catch (error) {
    console.error("Failed to parse csvData:", error);
    return (
      <div className="text-center text-red-500">
        Invalid data format. Please check the API response.
      </div>
    );
  }

  // Check if parsedData or parsedData.response is undefined
  if (!parsedData || !parsedData.response) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        No data available.
      </div>
    );
  }

  // Process each item in the response array
  const rows = parsedData.response.flatMap((item) => {
    return item.data.map((dataString) => {
      const columns = dataString.split("|"); // Split the pipe-separated string
      return [...columns, item.machine]; // Add the machine field to the row
    });
  });

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = rows.slice(indexOfFirstRow, indexOfLastRow);

  // Change page
  // const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="overflow-x-auto h-auto max-h-120 rounded-lg shadow-md max-w-lvw mx-auto mb-auto border-b-5 border-b-gray-600 border-r-12 border-r-gray-200">
        <table className="w-96 bg-white mb-auto pb-5">
          {/* Table Header */}
          <thead className="h-15 max-h-150 bg-gradient-to-b from-gray-900 to-gray-700">
            <tr>
              {COLUMNS.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-400">
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-gray-300 transition-colors"
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      {/* Pagination Controls */}
      </div>
      {/* <div className="flex justify-self-end items-center mt-1 m-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.ceil(rows.length / rowsPerPage)}
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to the first page
            }}
            className="px-2 py-1 border border-gray-300 rounded-lg"
          >
            <option value={10}>10 rows</option>
            <option value={20}>20 rows</option>
            <option value={50}>50 rows</option>
          </select>
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(rows.length / rowsPerPage)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
        >
          Next
        </button>
      </div> */}
    </>
  );
};

DisplayResults.propTypes = {
  csvData: PropTypes.string,
  logType: PropTypes.string,
};

export default DisplayResults;
