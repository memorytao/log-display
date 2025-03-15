import PropTypes from "prop-types";
import { RESPONSE_FILD, CONTACT_FIELD } from "../utl/Fields";

const DisplayResults = ({ csvData, logType }) => {
  const COLUMNS =
    logType === "Response History"
      ? RESPONSE_FILD.split("|")
      : CONTACT_FIELD.split("|");
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

  return (
    <div className="overflow-x-auto max-w-400 min-w-3xl mt-10 min-h-auto max-h-120 rounded-2xl mx-auto mb-auto border-l-10 border-l-gray-300  border-b-15 border-b-gray-300 border-r-12 border-r-gray-300">
      <table className="bg-white">
        {/* Table Header */}
        <thead className="h-15 max-h-150 bg-gradient-to-b from-gray-900 to-gray-700">
          <tr>
            {COLUMNS.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 "
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-400 border-2 border-gray-400 rounded-b-lg ">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-300 transition-colors">
              {row
                ? row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-6 py-4 text-sm text-gray-700"
                    >
                      {cell}
                    </td>
                  ))
                : "not found"}
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
