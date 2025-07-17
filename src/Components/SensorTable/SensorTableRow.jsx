import { useState } from "react";
import { updateNotificationStatus, addOrUpdateSensor } from "../../api/api";
import { flexRender } from "@tanstack/react-table";

export default function SensorTableRow({ sensor, openPopup, setSensorData, row, onRowSelect, isSelected }) {
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
      alert(`Failed to update notification status: ${error.message || "Please try again."}`);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <tr className="border-t hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all">
      {row.getVisibleCells().map((cell) => {
        const columnDef = cell.column.columnDef;
        if (columnDef.accessorKey === "select") {
          return (
            <td key={cell.id} className={`px-4 py-3 ${columnDef.meta?.className || "min-w-[50px] max-w-[50px]"}`}>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onRowSelect(sensor.sensorId, e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </td>
          );
        }
        if (columnDef.accessorKey === "notification") {
          return (
            <td key={cell.id} className={`px-4 py-3 ${columnDef.meta?.className || "min-w-[100px] max-w-[120px]"}`}>
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
          );
        }
        if (columnDef.accessorKey === "allTemperatures") {
          return (
            <td key={cell.id} className={`px-4 py-3 ${columnDef.meta?.className || "min-w-[120px] max-w-[150px]"}`}>
              <button
                onClick={() => openPopup(sensor.allTemperatures)}
                className="px-3 py-1 bg-gradient-to-r from-[#151c27] via-[#232946] to-[#232946] text-white rounded-xl hover:from-[#232946] hover:to-[#8bc6ec] transition-all disabled:opacity-50 text-sm"
                disabled={!sensor.allTemperatures || sensor.allTemperatures.length === 0}
              >
                View All
              </button>
            </td>
          );
        }
        if (columnDef.accessorKey === "avgTempHours") {
          return (
            <td
              key={cell.id}
              className={`px-4 py-3 text-gray-800 text-sm font-medium truncate ${columnDef.meta?.className || ""}`}
            >
              {sensor.avgTempHours ?? "-"}
            </td>
          );
        }
        return (
          <td
            key={cell.id}
            className={`px-4 py-3 text-gray-800 text-sm font-medium truncate ${columnDef.meta?.className || ""}`}
          >
            {flexRender(columnDef.cell || cell.getValue, cell.getContext()) ?? '-'}
          </td>
        );
      })}
    </tr>
  );
}