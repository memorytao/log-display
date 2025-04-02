import PropTypes from "prop-types";
import { RESPONSE_FILD, CONTACT_FIELD } from "../utl/Fields";
import { useState } from "react";
import { BsSortAlphaDown, BsSortAlphaUp } from "react-icons/bs";

const DisplayResults = ({ csvData, logType }) => {
  const COLUMNS =
    logType === "Response History"
      ? RESPONSE_FILD.split("|")
      : CONTACT_FIELD.split("|");

  const [sortConfig, setSortConfig] = useState({ key: 0, direction: "asc" });

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
      const dataByCol = dataString.split("|"); // Split the pipe-separated string
      return [...dataByCol, item.machine]; // Add the machine field to the row
    });
  });

  // Sort rows based on the sortConfig
  const sortedRows = [...rows];
  if (sortConfig.key !== null) {
    sortedRows.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  const handleSort = (columnIndex) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === columnIndex) {
        // Toggle sort direction
        return {
          key: columnIndex,
          direction: prevConfig.direction === "asc" ? "desc" : "asc",
        };
      }
      // Set new sort key and default to ascending
      return { key: columnIndex, direction: "asc" };
    });
  };

  return (
    <div className="overflow-x-auto max-w-400 min-w-3xl mt-20 min-h-auto max-h-120 rounded-2xl mx-auto mb-auto border-l-10 border-l-gray-300 border-b-15 border-b-gray-300 border-r-12 border-r-gray-300">
      <table className="bg-white">
        {/* Table Header */}
        <thead className="h-15 max-h-150 bg-gradient-to-b from-gray-900 to-gray-700 sticky top-0">
          <tr>
            {COLUMNS.map((column, index) => (
              <th
                key={index}
                onClick={() => handleSort(index)}
                className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 cursor-pointer hover:bg-gray-800 "
              >
                <div className="inline-flex items-center">
                  {column}
                  <span className="ml-5">
                    {sortConfig.key === index ? (
                      sortConfig.direction === "asc" ? (
                        <BsSortAlphaDown size={20} />
                      ) : (
                        <BsSortAlphaUp size={20} />
                      )
                    ) : (
                      <BsSortAlphaDown size={20} /> // Default icon for unsorted columns
                    )}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-400 border-2 border-gray-400 rounded-b-lg bg-gray-200">
          {sortedRows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-300 transition-colors">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="antialiased font-normal px-6 py-4 text-sm text-gray-700"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

DisplayResults.propTypes = {
  csvData: PropTypes.string,
  logType: PropTypes.string,
};

export default DisplayResults;
