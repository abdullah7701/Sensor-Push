export const fetchSensorData = async () => {
  try {
    const response = await fetch('http://161.35.107.143:8080/get-sensor-data/');
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
