export default function SensorTableHeader() {
    return (
      <thead className="bg-gray-50 sticky top-0 z-10">
        <tr>
          <th className="px-4 py-3 text-left text-gray-600 font-medium">Sensor ID</th>
          <th className="px-4 py-3 text-left text-gray-600 font-medium">Sensor Name</th>
          <th className="px-4 py-3 text-left text-gray-600 font-medium">Status</th>
          <th className="px-4 py-3 text-left text-gray-600 font-medium">Sensor Type</th>
          <th className="px-4 py-3 text-left text-gray-600 font-medium">Notification</th>
          <th className="px-4 py-3 text-left text-gray-600 font-medium">Brand</th>
          <th className="px-4 py-3 text-left text-gray-600 font-medium">Location</th>
          <th className="px-4 py-3 text-left text-gray-600 font-medium">Readable Time</th>
          <th className="px-4 py-3 text-left text-gray-600 font-medium">Push to Site</th>
          <th className="px-4 py-3 text-left text-gray-600 font-medium">All Temperatures</th>
          <th className="px-4 py-3 text-left text-gray-600 font-medium">Max Temp (°F)</th>
          <th className="px-4 py-3 text-left text-gray-600 font-medium">Current Temp (°F)</th>
          <th className="px-4 py-3 text-left text-gray-600 font-medium">Min Temp (°F)</th>
          <th className="px-4 py-3 text-left text-gray-600 font-medium">Avg Temp (°F)</th>
          <th className="px-4 py-3 text-left text-gray-600 font-medium">Business Location</th>
          <th className="px-4 py-3 text-left text-gray-600 font-medium">Cost Per Customer</th>
          <th className="px-4 py-3 text-left text-gray-600 font-medium">Last Updated</th>
        </tr>
      </thead>
    );
  }