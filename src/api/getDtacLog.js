const API_HOST = "http://localhost:8888";

export const getDtacResponseLogs = async (searchTerm) => {
  try {
    const response = await fetch(`${API_HOST}/apis/dtac/getResponseLog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: searchTerm.status,
        msisdn: searchTerm.msisdn,
        date: searchTerm.date,
        packageCode: searchTerm.packageCode,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.text(); // Assuming the API returns CSV data
    return data;
  } catch (err) {
    console.error("Failed to fetch data:", err);
    throw err; // Re-throw the error to handle it in the component
  }
};

export const getDtacContactLogs = async (searchTerm) => {
  try {
    const response = await fetch(`${API_HOST}/apis/dtac/getContactLog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: searchTerm.status,
        msisdn: searchTerm.msisdn,
        date: searchTerm.date,
        packageCode: searchTerm.packageCode,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.text(); // Assuming the API returns CSV data
    return data;
  } catch (err) {
    console.error("Failed to fetch data:", err);
    throw err; // Re-throw the error to handle it in the component
  }
};
