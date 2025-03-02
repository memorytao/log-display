import PropTypes from "prop-types";
import { RESPONSE_FILD, CONTACT_FIELD } from "./../api/fields";

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
    <div className="overflow-y-scroll rounded-3xl shadow-md dark:shadow-gray-800 max-w-lvw mx-auto">
      <table className="min-w-full bg-white">
        {/* Table Header */}
        <thead className="bg-gray-50 h-15 dark:bg-gray-700 max-h-150">
          <tr>
            {COLUMNS.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-200 ">
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
    </div>
  );
};

DisplayResults.propTypes = {
  csvData: PropTypes.string,
  logType: PropTypes.string,
};

export default DisplayResults;
