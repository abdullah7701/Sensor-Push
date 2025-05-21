import { useState } from "react";
import { updateNotificationStatus } from "../../api/api";

export default function SensorTableRow({ sensor, openPopup, setSensorData }) {
  const [isToggling, setIsToggling] = useState(false);

  const handleNotificationToggle = async () => {
    if (isToggling) return;
    setIsToggling(true);

    const newStatus = sensor.notification === "on" ? "off" : "on";

    try {
      await updateNotificationStatus(sensor.sensorId, newStatus);

      setSensorData((prevData) =>
        prevData.map((item) =>
          (item['Sensors_Id'] || item.sensor_id) === sensor.sensorId
            ? { ...item, notification_status: newStatus }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating notification status:", error);
      alert(`Failed to update notification status: ${error.message || "Please try again."}`);
    } finally {
      setIsToggling(false);
    }
  };

  const getStatusTagClass = (status) => {
    // Check if status is a string and not null/undefined
    if (typeof status !== 'string' || status == null) {
      return "bg-gray-100 text-gray-800";
    }
    switch (status.toLowerCase()) {
      case "online":
        return "bg-green-100 text-green-800";
      case "offline":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <tr className="border-t hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all">
      <td className="px-4 py-3 text-gray-800 text-sm font-medium min-w-[120px] max-w-[150px] truncate">{sensor.sensorId ?? 'N/A'}</td>
      <td className="px-4 py-3 text-gray-800 text-sm font-medium min-w-[150px] max-w-[180px] truncate">{sensor.name ?? 'N/A'}</td>
      <td className="px-4 py-3 text-sm font-medium min-w-[100px] max-w-[120px]">
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusTagClass(sensor.status)}`}>
          {sensor.status ?? 'N/A'}
        </span>
      </td>
      <td className="px-4 py-3 text-gray-800 text-sm font-medium min-w-[120px] max-w-[150px] truncate">{sensor.sensortype ?? 'N/A'}</td>
      <td className="px-4 py-3 min-w-[100px] max-w-[120px]">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={sensor.notification === "on"}
            onChange={handleNotificationToggle}
            disabled={isToggling}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-indigo-500 transition-all"></div>
          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
        </label>
      </td>
      <td className="px-4 py-3 text-gray-800 text-sm font-medium min-w-[100px] max-w-[120px] truncate">{sensor.brand ?? 'N/A'}</td>
      <td className="px-4 py-3 text-gray-800 text-sm font-medium min-w-[150px] max-w-[180px] truncate">{sensor.location ?? 'N/A'}</td>
      <td className="px-4 py-3 text-gray-800 text-sm font-medium min-w-[150px] max-w-[180px] truncate">{sensor.readableTime ?? 'N/A'}</td>
      <td className="px-4 py-3 text-gray-800 text-sm font-medium min-w-[100px] max-w-[120px] truncate">{sensor.pushToSite ?? 'N/A'}</td>
      <td className="px-4 py-3 min-w-[120px] max-w-[150px]">
        <button
          onClick={() => openPopup(sensor.allTemperatures)}
          className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all disabled:opacity-50 text-sm"
          disabled={!sensor.allTemperatures || sensor.allTemperatures.length === 0}
        >
          View All
        </button>
      </td>
      <td className="px-4 py-3 text-gray-800 text-sm font-medium min-w-[100px] max-w-[120px] truncate">{sensor.maxTemp ?? 'N/A'}</td>
      <td className="px-4 py-3 text-gray-800 text-sm font-medium min-w-[100px] max-w-[120px] truncate">{sensor.currentTemp ?? 'N/A'}</td>
      <td className="px-4 py-3 text-gray-800 text-sm font-medium min-w-[100px] max-w-[120px] truncate">{sensor.minTemp ?? 'N/A'}</td>
      <td className="px-4 py-3 text-gray-800 text-sm font-medium min-w-[100px] max-w-[120px] truncate">{sensor.avgTemp ?? 'N/A'}</td>
      <td className="px-4 py-3 text-gray-800 text-sm font-medium min-w-[150px] max-w-[180px] truncate">{sensor.locationBusiness ?? 'N/A'}</td>
      <td className="px-4 py-3 text-gray-800 text-sm font-medium min-w-[100px] max-w-[120px] truncate">{sensor.costPerCustomer ?? 'N/A'}</td>
      <td className="px-4 py-3 text-gray-800 text-sm font-medium min-w-[150px] max-w-[180px] truncate">{sensor.currentdate ?? 'N/A'}</td>
    </tr>
  );
}