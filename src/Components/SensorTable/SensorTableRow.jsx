import { useState } from "react";
import { updateNotificationStatus, addOrUpdateSensor } from "../../api/api";
import { flexRender } from "@tanstack/react-table";

export default function SensorTableRow({ sensor, openPopup, setSensorData, row, onRowSelect, isSelected }) {
  const [isToggling, setIsToggling] = useState(false);

  // Edit state for only Avg Temp Hours in this row
  const [isEditingAvgTempHours, setIsEditingAvgTempHours] = useState(false);
  const [editAvgTempHoursValue, setEditAvgTempHoursValue] = useState(sensor.avgTempHours);

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

  // Handle save for avg temp hours
  const handleSaveAvgTempHours = async () => {
    try {
      await addOrUpdateSensor({
        Sensors_Id: sensor.sensorId,
        Average_Temperature_Hours: Number(editAvgTempHoursValue)
      });
      setSensorData((prev) =>
        prev.map((s) =>
          s.sensorId === sensor.sensorId
            ? { ...s, avgTempHours: Number(editAvgTempHoursValue) }
            : s
        )
      );
      setIsEditingAvgTempHours(false);
    } catch (err) {
      alert("Failed to update Avg Temp Hours");
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

        // Editable Avg Temp Hours with edit icon
        if (columnDef.accessorKey === "avgTempHours") {
          return (
            <td
              key={cell.id}
              className={`px-4 py-3 text-gray-800 text-sm font-medium truncate relative ${isEditingAvgTempHours ? "bg-blue-50" : ""}`}
            >
              {isEditingAvgTempHours ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={editAvgTempHoursValue}
                    onChange={e => setEditAvgTempHoursValue(e.target.value)}
                    className="w-16 px-2 py-1 rounded border border-gray-300 text-sm"
                    autoFocus
                  />
                  <button
                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
                    onClick={handleSaveAvgTempHours}
                  >OK</button>
                  <button
                    className="px-2 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-xs"
                    onClick={() => {
                      setIsEditingAvgTempHours(false);
                      setEditAvgTempHoursValue(sensor.avgTempHours);
                    }}
                  >Cancel</button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>{sensor.avgTempHours ?? "-"}</span>
                  <button
                    title="Edit"
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => setIsEditingAvgTempHours(true)}
                  >
                    {/* You can use a real icon library here */}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 10-4-4l-8 8v3z"></path>
                    </svg>
                  </button>
                </div>
              )}
            </td>
          );
        }

        // All other cells, unchanged
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
