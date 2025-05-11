export const fetchSensorData = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/get-sensor-data/`, {
      mode: 'cors', // explicitly set CORS mode
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    const sanitizedText = text.replace(/Infinity/g, 'null');
    const result = JSON.parse(sanitizedText);
    
    if (result.status === 'success') {
      return result.data;
    } else {
      throw new Error('Failed to fetch sensor data: ' + (result.message || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    throw error; // Re-throw to let calling code handle it
  }
};