export const fetchSensorData = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/get-sensor-data/`);
    const text = await response.text();
    const sanitizedText = text.replace(/Infinity/g, 'null');
    const result = JSON.parse(sanitizedText);
    if (result.status === 'success') {
      return result.data;
    } else {
      throw new Error('Failed to fetch sensor data');
    }
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    return [];
  }
};