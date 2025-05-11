export default function TableHeader() {
  return (
    <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 sticky top-0 z-10 shadow-sm">
      <tr>
        <th className="px-4 py-3 text-left text-gray-600 font-medium min-w-[120px] max-w-[150px] truncate">Sensor ID</th>
        <th className="px-4 py-3 text-left text-gray-600 font-medium min-w-[150px] max-w-[180px] truncate">Sensor Name</th>
        <th className="px-4 py-3 text-left text-gray-600 font-medium min-w-[100px] max-w-[120px] truncate">Status</th>
        <th className="px-4 py-3 text-left text-gray-600 font-medium min-w-[120px] max-w-[150px] truncate">Sensor Type</th>
        <th className="px-4 py-3 text-left text-gray-600 font-medium min-w-[100px] max-w-[120px] truncate">Notification</th>
        <th className="px-4 py-3 text-left text-gray-600 font-medium min-w-[100px] max-w-[120px] truncate">Brand</th>
        <th className="px-4 py-3 text-left text-gray-600 font-medium min-w-[150px] max-w-[180px] truncate">Location</th>
        <th className="px-4 py-3 text-left text-gray-600 font-medium min-w-[150px] max-w-[180px] truncate">Readable Time</th>
        <th className="px-4 py-3 text-left text-gray-600 font-medium min-w-[100px] max-w-[120px] truncate">Push to Site</th>
        <th className="px-4 py-3 text-left text-gray-600 font-medium min-w-[120px] max-w-[150px] truncate">All Temperatures</th>
        <th className="px-4 py-3 text-left text-gray-600 font-medium min-w-[100px] max-w-[120px] truncate">Max Temp (°F)</th>
        <th className="px-4 py-3 text-left text-gray-600 font-medium min-w-[100px] max-w-[120px] truncate">Current Temp (°F)</th>
        <th className="px-4 py-3 text-left text-gray-600 font-medium min-w-[100px] max-w-[120px] truncate">Min Temp (°F)</th>
        <th className="px-4 py-3 text-left text-gray-600 font-medium min-w-[100px] max-w-[120px] truncate">Avg Temp (°F)</th>
        <th className="px-4 py-3 text-left text-gray-600 font-medium min-w-[150px] max-w-[180px] truncate">Business Location</th>
        <th className="px-4 py-3 text-left text-gray-600 font-medium min-w-[100px] max-w-[120px] truncate">Cost Per Customer</th>
        <th className="px-4 py-3 text-left text-gray-600 font-medium min-w-[150px] max-w-[180px] truncate">Last Updated</th>
      </tr>
    </thead>
  );
}