const DisplayResults = ({ csvData }) => {
  // Parse the CSV data (pipe-separated values)
  const parseCSV = (csvData) => {
    const rows = csvData.split("\n"); // Split by new lines
    const parsedData = rows.map((row) => row.split("|")); // Split each row by pipe
    return parsedData;
  };

  // Get parsed data
  const parsedData = parseCSV(csvData);

  // Column names (assuming the first row contains headers)
  // const HEADER =
    // "CAMP_ID|OFFER_ID|TNX_LOG|MSISDN|COL_5|COL_6|COL_7|COL_8|COL_9|FROM_CHANEL|HOME_PERSONAL|SECTION|COL_10|COL_11|STATE|STATUS|COL_17|COL_18|COL_19|COL_20|COL_21|COL_22|COL_23|COL_24|COL_25|interest_date|CHANNEL";
  const headers = parsedData[0];
  // const headers = HEADER.map( (row) => row.split('|') )

  // Data rows (excluding the header row)
  const rows = parsedData.slice(1);
  // const rows = parsedData;

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-stretch-semi-expanded text-blue-900 mb-6">
        Search Results
      </h2>
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full bg-white">
          {/* Table Header */}
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header.trim()}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {cell.trim()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DisplayResults;
