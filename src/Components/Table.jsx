import { useState, useEffect } from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import { fetchSensorData } from "../api/api";

export default function Table() {
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
          <TableHeader />
          <tbody>
            {filteredSensorData.map((sensor, index) => (
              <TableRow
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
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-auto shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800 bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-t-lg">
              All Temperature Readings
            </h2>
            {selectedTemperatures.length > 0 ? (
              <table className="min-w-full border border-gray-100 rounded-lg">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-blue-50">
                    <th className="px-4 py-3 text-left text-gray-600 font-medium">Temperature (°F)</th>
                    <th className="px-4 py-3 text-left text-gray-600 font-medium">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTemperatures.map((temp, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-800">{temp.temperature ?? 'N/A'}</td>
                      <td className="px-4 py-3 text-gray-800">{temp.timestamp ?? 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600 p-4">No temperature data available.</p>
            )}
            <button
              onClick={closePopup}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}