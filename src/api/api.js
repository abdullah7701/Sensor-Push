const BASE_URL = "http://161.35.107.143:8080";

export const fetchSensorData = async () => {
  try {
    const response = await fetch(`${BASE_URL}/get-sensor-data/`);
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

export const updateNotificationStatus = async (sensorId, notificationStatus) => {
  try {
    const payload = {
      Sensors_Id: sensorId,
      notification_status: notificationStatus,
    };
    const response = await fetch(`${BASE_URL}/update-sensor/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload), // Updated line: Removed { payload } wrapper
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const result = await response.json();
    if (result.status !== "success") {
      throw new Error(result.message || "Failed to update notification status");
    }

    return result;
  } catch (error) {
    console.error('Error updating notification status:', error);
    throw error;
  }
};
export const fetchExistingStoreData = async () => {
  try {
    const response = await fetch(`${BASE_URL}/get-existing-store-data/`);
    const result = await response.json();
    if (result.status === 'success') {
      return result.data;
    } else {
      throw new Error('Failed to fetch existing store data');
    }
  } catch (error) {
    console.error('Error fetching existing store data:', error);
    return [];
  }
};
export const addOrUpdateSensor = async (payload) => {
  try {
    const response = await fetch(`${BASE_URL}/update-sensor/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (result.status === "success") {
      return result;
    } else {
      throw new Error(result.message || "Failed to add/update sensor");
    }
  } catch (error) {
    console.error("Error updating sensor:", error);
    throw error;
  }
};
export const addOrUpdateExistingStore = async (payload) => {
  const response = await fetch(`${BASE_URL}/update-existing-store/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (result.status === "success") return result;
  throw new Error(result.message || "Failed to add/update store");
};

