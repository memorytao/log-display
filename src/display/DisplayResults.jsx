import PropTypes from "prop-types";
import { RESPONSE_FILD, CONTACT_FIELD } from "../utl/Fields";

const DisplayResults = ({ data, logType }) => {
  const COLUMNS =
    logType === "Response History"
      ? RESPONSE_FILD.split("|")
      : CONTACT_FIELD.split("|");

  if (!data?.response?.length) {
    return <div className="text-center py-4">No data available.</div>;
  }

  return (
    <div className="overflow-x-auto max-w-400 min-w-3xl mt-20 min-h-auto max-h-120 rounded-2xl mx-auto mb-auto border-l-10 border-l-gray-300 border-b-15 border-b-gray-300 border-r-12 border-r-gray-300">
      <table className="bg-white w-full">
        <thead className="h-15 max-h-150 bg-gradient-to-b from-gray-900 to-gray-700 sticky top-0">
          <tr>
            {COLUMNS.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-base font-medium text-gray-300 uppercase tracking-wider"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-400 border-2 border-gray-400 rounded-b-lg bg-gray-200">
          {data.response.flatMap((item, itemIndex) =>
            item.data.map((dataString, rowIndex) => {
              const columns = dataString.split("|");
              const row = [...columns, item.machine];
              return (
                <tr
                  key={`${itemIndex}-${rowIndex}`}
                  className="hover:bg-gray-300 transition-colors"
                >
                  {row ? (
                    row.map((cell, cellIndex) => (
                      <td
                        key={`${itemIndex}-${rowIndex}-${cellIndex}`}
                        className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                      >
                        {cell}
                      </td>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={COLUMNS.length} className="text-center py-4">
                        Data not available.
                      </td>
                    </tr>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

DisplayResults.propTypes = {
  data: PropTypes.shape({
    response: PropTypes.arrayOf(
      PropTypes.shape({
        data: PropTypes.arrayOf(PropTypes.string),
        machine: PropTypes.string,
      })
    ),
  }),
  logType: PropTypes.string.isRequired,
};

export default DisplayResults;
