import csvtojson from "csvtojson";

export const fetchCSVAndConvertToJson = async (csvFileUrl: string) => {
  try {
    // Fetch CSV file
    const response = await fetch(csvFileUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch CSV file`);
    }

    // Get CSV data as text
    const csvData = await response.text();

    // Convert CSV text to JSON
    const jsonData = await csvtojson().fromString(csvData);

    return jsonData;
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
};

export const isWhiteListed = async (email: string, csvFileUrl: string) => {
  const whitelistedEmails = await fetchCSVAndConvertToJson(csvFileUrl);
  return whitelistedEmails.some((entry) => entry.email === email);
};
