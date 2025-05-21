import { useState, useEffect } from "react";
import SensorTableHeader from "./SensorTableHeader";
import SensorTableRow from "./SensorTableRow";
import { fetchSensorData } from "../../api/api";

export default function SensorTable() {
  const [sensorData, setSensorData] = useState([]);
  const [selectedTemperatures, setSelectedTemperatures] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const getData = async () => {
      const data = await fetchSensorData();
      setSensorData(data);
    };
    getData();
  }, []);

  const getTemperatures = (sensor) => {
    try {
      if (sensor.All_Temperatures && Array.isArray(sensor.All_Temperatures)) {
        return sensor.All_Temperatures;
      }
      if (sensor.all_temperatures && typeof sensor.all_temperatures === 'string') {
        return JSON.parse(sensor.all_temperatures);
      }
      return [];
    } catch (error) {
      console.error('Error parsing temperature data:', error);
      return [];
    }
  };

  const openPopup = (temperatures) => {
    setSelectedTemperatures(temperatures);
  };

  const closePopup = () => {
    setSelectedTemperatures(null);
  };

  const filteredSensorData = sensorData.filter((sensor) => {
    const query = searchQuery.toLowerCase();
    return (
      (sensor['Sensors_Id']?.toLowerCase()?.includes(query) ||
        sensor.sensor_id?.toLowerCase()?.includes(query) ||
        false) ||
      (sensor['Sensor_Name']?.toLowerCase()?.includes(query) ||
        sensor.sensor_name?.toLowerCase()?.includes(query) ||
        false) ||
      (sensor['Sensor Type']?.toLowerCase()?.includes(query) ||
        sensor.sensor_type?.toLowerCase()?.includes(query) ||
        false) ||
      (sensor['Location']?.toLowerCase()?.includes(query) ||
        sensor.location?.toLowerCase()?.includes(query) ||
        false)
    );
  });

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-xl">
      <div className="relative mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Sensor ID, Name, Type, or Location"
          className="w-full px-4 py-3 pl-10 border border-transparent rounded-lg bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-400 transition-all"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <div className="overflow-auto h-[670px] scroll-container rounded-xl shadow-inner">
        <table className="min-w-full table-fixed border border-gray-100 divide-y divide-gray-100 bg-white rounded-xl">
          <SensorTableHeader />
          <tbody>
            {filteredSensorData.map((sensor, index) => (
              <SensorTableRow
                key={sensor['Sensors_Id'] || sensor.sensor_id || index}
                sensor={{
                  sensorId: sensor['Sensors_Id'] || sensor.sensor_id,
                  name: sensor['Sensor_Name'] || sensor.sensor_name,
                  status: sensor['Sensor_Status'] || sensor.sensor_status,
                  sensortype: sensor['Sensor Type'] || sensor.sensor_type,
                  notification: sensor.notification_status,
                  brand: sensor['Sensor Brand'] || sensor.sensor_brand,
                  location: sensor['Location'] || sensor.location,
                  readableTime: sensor['Readable Time'] || sensor.readable_time,
                  pushToSite: sensor['Push_To_Site'] || sensor.push_to_site,
                  allTemperatures: getTemperatures(sensor),
                  maxTemp: sensor['Max_Temperature'] || sensor.max_temperature,
                  currentTemp:
                    sensor['Current_Temperature'] || sensor.current_temperature_f,
                  minTemp: sensor['Min_Temperature'] || sensor.min_temperature,
                  avgTemp:
                    sensor['Average_Temperature'] || sensor.average_temperature,
                  locationBusiness:
                    sensor['Business Location'] || sensor.business_location,
                  costPerCustomer:
                    sensor['Cost Per Customer'] || sensor.cost_per_customer,
                  currentdate: sensor['Last Updated'] || sensor.updated_at,
                }}
                openPopup={openPopup}
                setSensorData={setSensorData}
              />
            ))}
          </tbody>
        </table>
      </div>

      {selectedTemperatures && (
  <div 
    className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
    onClick={closePopup}
  >
    <div 
      className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden" // Changed to flex-col and overflow-hidden
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header Section - Fixed */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4">
        <h2 className="text-xl font-bold text-white">
          All Temperature Readings
        </h2>
      </div>

      {/* Table Header - Fixed */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="grid grid-cols-2">
          <div className="px-4 py-3 text-left text-gray-600 font-medium">Temperature (°F)</div>
          <div className="px-4 py-3 text-left text-gray-600 font-medium">Timestamp</div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto flex-1">
        {selectedTemperatures.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {selectedTemperatures.map((temp, index) => (
              <div key={index} className="grid grid-cols-2 hover:bg-gray-50">
                <div className="px-4 py-3 text-gray-800">{temp.temperature ?? 'N/A'}</div>
                <div className="px-4 py-3 text-gray-800">{temp.timestamp ?? 'N/A'}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-gray-600">No temperature data available.</div>
        )}
      </div>

      {/* Fixed Close Button */}
      <div className="border-t border-gray-200 bg-white p-4">
        <button
          onClick={closePopup}
          className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}