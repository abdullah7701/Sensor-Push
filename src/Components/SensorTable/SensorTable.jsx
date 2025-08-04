import { useState, useEffect, useMemo } from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import SensorTableRow from "./SensorTableRow";
import { addOrUpdateSensor, fetchSensorData } from "../../api/api";

const DraggableHeader = ({ header, table }) => {
  const [, drag] = useDrag({
    type: "column",
    item: { id: header.id },
  });

  const [, drop] = useDrop({
    accept: "column",
    drop: (draggedItem) => {
      const draggedIndex = table.getAllColumns().findIndex((col) => col.id === draggedItem.id);
      const targetIndex = table.getAllColumns().findIndex((col) => col.id === header.id);
      if (draggedIndex !== targetIndex) {
        table.setColumnOrder((old) => {
          const newOrder = [...old];
          newOrder.splice(targetIndex, 0, newOrder.splice(draggedIndex, 1)[0]);
          return newOrder;
        });
      }
    },
  });

  return (
    <th
      ref={(node) => drag(drop(node))}
      className="px-4 py-3 text-left text-gray-600 font-medium bg-gray-100 cursor-move"
    >
      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
    </th>
  );
};

export default function SensorTable() {
  const [sensorData, setSensorData] = useState([]);
  const [selectedTemperatures, setSelectedTemperatures] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [columnOrder, setColumnOrder] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [newSensor, setNewSensor] = useState({
    sensorId: "",
    sensorName: "",
    notificationStatus: "off",
    avgTemp: "",
  });
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [editingSensor, setEditingSensor] = useState(null);

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

  const handleRowSelect = (sensorId, isChecked) => {
    setSelectedRows((prev) =>
      isChecked ? [...prev, sensorId] : prev.filter((id) => id !== sensorId)
    );
  };

  const handleEditClick = () => {
    if (selectedRows.length === 0) {
      alert("Please select a sensor to edit.");
      return;
    }
    if (selectedRows.length > 1) {
      alert("Please select only one sensor to edit.");
      return;
    }
    const sensorId = selectedRows[0];
    const sensor = data.find((s) => s.sensorId === sensorId);
    if (sensor) {
      setEditingSensor({
        sensorId: sensor.sensorId,
        name: sensor.name,
        status: sensor.status,
        sensortype: sensor.sensortype,
        notification: sensor.notification,
        brand: sensor.brand,
        location: sensor.location,
        readableTime: sensor.readableTime,
        pushToSite: sensor.pushToSite,
        allTemperatures: sensor.allTemperatures,
        maxTemp: sensor.maxTemp,
        currentTemp: sensor.currentTemp,
        minTemp: sensor.minTemp,
        avgTemp: sensor.avgTemp,
        avgTempHours: sensor.avgTempHours,
        locationBusiness: sensor.locationBusiness,
        costPerCustomer: sensor.costPerCustomer,
        currentdate: sensor.currentdate,
      });
      setIsEditPopupOpen(true);
    }
  };

  const handleEditSensorSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      Sensors_Id: editingSensor.sensorId,
      Sensor_Name: editingSensor.name,
      'Sensor Type': editingSensor.sensortype,
      '-dashboard Brand': editingSensor.brand,
      Location: editingSensor.location,
      'Business Location': editingSensor.locationBusiness,
      'Cost Per Customer': Number(editingSensor.costPerCustomer),
      Average_Temperature_Hours: Number(editingSensor.avgTempHours),
    };
    try {
      await addOrUpdateSensor(payload);
      setIsEditPopupOpen(false);
      const data = await fetchSensorData();
      setSensorData(data);
    } catch (error) {
      alert(error.message || "Failed to update sensor");
    }
  };

  const handleAddSensorSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      Sensors_Id: newSensor.sensorId,
      Average_Temperature_Hours: Number(newSensor.avgTemp),
      notification_status: newSensor.notificationStatus,
      Sensor_Name: newSensor.sensorName,
    };
    try {
      await addOrUpdateSensor(payload);
      setIsAddPopupOpen(false);
      setNewSensor({ sensorId: "", sensorName: "", notificationStatus: "off", avgTemp: "" });
      const data = await fetchSensorData();
      setSensorData(data);
    } catch (error) {
      alert(error.message || "Failed to add/update sensor");
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "",
        accessorKey: "select",
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={selectedRows.includes(row.original.sensorId)}
            onChange={(e) => handleRowSelect(row.original.sensorId, e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
        ),
        meta: { className: "min-w-[50px] max-w-[50px]" },
        enableSorting: false,
        enableDragging: false,
      },
      { header: "Sensor ID", accessorKey: "sensorId", meta: { className: "min-w-[120px] max-w-[150px]" } },
      { header: "Sensor Name", accessorKey: "name", meta: { className: "min-w-[150px] max-w-[180px]" } },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => {
          const status = getValue();
          const getStatusTagClass = (status) => {
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
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusTagClass(status)}`}>
              {status ?? '-'}
            </span>
          );
        },
        meta: { className: "min-w-[100px] max-w-[120px]" },
      },
      { header: "Sensor Type", accessorKey: "sensortype", meta: { className: "min-w-[120px] max-w-[150px]" } },
      { header: "Notification", accessorKey: "notification", meta: { className: "min-w-[100px] max-w-[120px]" } },
      { header: "Brand", accessorKey: "brand", meta: { className: "min-w-[100px] max-w-[120px]" } },
      { header: "Location", accessorKey: "location", meta: { className: "min-w-[150px] max-w-[180px]" } },
      { header: "Readable Time", accessorKey: "readableTime", meta: { className: "min-w-[150px] max-w-[180px]" } },
      {
        header: "Push to Site",
        accessorKey: "pushToSite",
        meta: { className: "min-w-[100px] max-w-[120px]" },
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.original.pushToSite === "checked"}
            onChange={async (e) => {
              try {
                await addOrUpdateSensor({
                  Sensors_Id: row.original.sensorId,
                  push_to_site: e.target.checked ? "checked" : "unchecked"
                });
                setSensorData((prev) =>
                  prev.map((s) =>
                    s.sensorId === row.original.sensorId
                      ? { ...s, pushToSite: e.target.checked ? "checked" : "unchecked" }
                      : s
                  )
                );
              } catch (err) {
                alert("Failed to update Push to Site");
              }
            }}
            className="w-5 h-5 accent-blue-600"
          />
        )
      },
      {
        header: "All Temperatures",
        accessorKey: "allTemperatures",
        cell: ({ row }) => (
          <button
            onClick={() => setSelectedTemperatures(row.original.allTemperatures)}
            className="px-3 py-1 bg-gradient-to-r from-[#151c27] via-[#232946] to-[#232946] text-white rounded-xl hover:from-[#232946] hover:to-[#8bc6ec] transition-all disabled:opacity-50 text-sm"
            disabled={!row.original.allTemperatures || row.original.allTemperatures.length === 0}
          >
            View All
          </button>
        ),
        meta: { className: "min-w-[120px] max-w-[150px]" },
      },
      { header: "Max Temp (°F)", accessorKey: "maxTemp", meta: { className: "min-w-[100px] max-w-[120px]" } },
      { header: "Current Temp (°F)", accessorKey: "currentTemp", meta: { className: "min-w-[100px] max-w-[120px]" } },
      { header: "Min Temp (°F)", accessorKey: "minTemp", meta: { className: "min-w-[100px] max-w-[120px]" } },
      { header: "Avg Temp (°F)", accessorKey: "avgTemp", meta: { className: "min-w-[100px] max-w-[120px]" } },
      { header: "Avg Temp Hours", accessorKey: "avgTempHours", meta: { className: "min-w-[100px] max-w-[120px]" } },
      { header: "Business Location", accessorKey: "locationBusiness", meta: { className: "min-w-[150px] max-w-[180px]" } },
      { header: "Cost Per Customer", accessorKey: "costPerCustomer", meta: { className: "min-w-[100px] max-w-[120px]" } },
      { header: "Last Updated", accessorKey: "currentdate", meta: { className: "min-w-[150px] max-w-[180px]" } },
    ],
    []
  );

  const data = useMemo(
    () => sensorData.map((sensor) => ({
      sensorId: sensor['Sensors_Id'] || sensor.sensor_id,
      name: sensor['Sensor_Name'] || sensor.sensor_name,
      status: sensor['Sensor_Status'] || sensor.sensor_status,
      sensortype: sensor['Sensor Type'] || sensor.sensor_type,
      notification: sensor.notification_status,
      brand: sensor['-dashboard Brand'] || sensor.sensor_brand,
      location: sensor['Location'] || sensor.location,
      readableTime: sensor['Readable Time'] || sensor.readable_time,
      pushToSite: sensor['Push_To_Site'] || sensor.push_to_site,
      allTemperatures: getTemperatures(sensor),
      maxTemp: sensor['Max_Temperature'] || sensor.max_temperature,
      currentTemp: sensor['Current_Temperature'] || sensor.current_temperature_f,
      minTemp: sensor['Min_Temperature'] || sensor.min_temperature,
      avgTemp: sensor['Average_Temperature'] || sensor.average_temperature,
      avgTempHours: sensor['Average_Temperature_Hours'] || sensor.average_temperature_hours,
      locationBusiness: sensor['Business Location'] || sensor.business_location,
      costPerCustomer: sensor['Cost Per Customer'] || sensor.cost_per_customer,
      currentdate: sensor['Last Updated'] || sensor.updated_at,
    })),
    [sensorData]
  );

  const filteredSensorData = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return data.filter((sensor) =>
      (sensor.sensorId?.toLowerCase()?.includes(query) ||
       sensor.name?.toLowerCase()?.includes(query) ||
       sensor.sensortype?.toLowerCase()?.includes(query) ||
       sensor.location?.toLowerCase()?.includes(query))
    );
  }, [data, searchQuery]);

  const table = useReactTable({
    data: filteredSensorData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { columnOrder },
    onColumnOrderChange: setColumnOrder,
    enableColumnOrdering: true,
    defaultColumn: {
      cell: ({ getValue }) => getValue() ?? "-",
    },
  });

  useEffect(() => {
    const getData = async () => {
      const data = await fetchSensorData();
      setSensorData(data);
    };
    getData();
  }, []);

  useEffect(() => {
    setColumnOrder(columns.map((col) => col.accessorKey));
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-md flex items-center">
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
            <button
              onClick={async () => {
                const data = await fetchSensorData();
                setSensorData(data);
              }}
              className="ml-2 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-all"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 12a8 8 0 0116 0 8 8 0 01-16 0zm8-8v4m0 0l-3-3m3 3l3-3m-9 9v4m0 0l-3 3m3-3l3 3"
                />
              </svg>
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleEditClick}
              className="px-4 py-2 bg-gradient-to-r from-[#151c27] via-[#232946] to-[#232946] text-white rounded-xl hover:from-[#232946] hover:to-[#8bc6ec] transition-all shadow-md flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </button>
            <button
              onClick={() => setIsAddPopupOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-[#151c27] via-[#232946] to-[#232946] text-white rounded-xl hover:from-[#232946] hover:to-[#8bc6ec] transition-all shadow-md flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Sensor
            </button>
          </div>
        </div>

        <div className="overflow-auto max-h-[70vh] scroll-container rounded-xl shadow-inner">
          <table className="min-w-full table-fixed border border-gray-100 divide-y divide-gray-100 bg-white rounded-xl">
            <thead className="bg-gray-100 sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <DraggableHeader key={header.id} header={header} table={table} />
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <SensorTableRow
                  key={row.id}
                  sensor={row.original}
                  openPopup={setSelectedTemperatures}
                  setSensorData={setSensorData}
                  row={row}
                  onRowSelect={handleRowSelect}
                  isSelected={selectedRows.includes(row.original.sensorId)}
                />
              ))}
            </tbody>
          </table>
        </div>

        {selectedTemperatures && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
            onClick={() => setSelectedTemperatures(null)}
          >
            <div
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-[#151c27] via-[#232946] to-[#232946] p-4 rounded-t-2xl">
                <h2 className="text-xl font-bold text-white">All Temperature Readings</h2>
              </div>
              <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                <div className="grid grid-cols-2">
                  <div className="px-4 py-3 text-left text-gray-600 font-medium">Temperature (°F)</div>
                  <div className="px-4 py-3 text-left text-gray-600 font-medium">Timestamp</div>
                </div>
              </div>
              <div className="overflow-y-auto flex-1">
                {selectedTemperatures.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {selectedTemperatures.map((temp, index) => (
                      <div key={index} className="grid grid-cols-2 hover:bg-gray-50">
                        <div className="px-4 py-3 text-gray-800">{temp.temperature ?? '-'}</div>
                        <div className="px-4 py-3 text-gray-800">{temp.timestamp ?? '-'}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-gray-600">No temperature data available.</div>
                )}
              </div>
              <div className="border-t border-gray-200 bg-white p-4">
                <button
                  onClick={() => setSelectedTemperatures(null)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-[#151c27] via-[#232946] to-[#232946] text-white rounded-xl hover:from-[#232946] hover:to-[#8bc6ec] transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {isAddPopupOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
            onClick={() => setIsAddPopupOpen(false)}
          >
            <div
              className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden transform transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-[#151c27] via-[#232946] to-[#232946] p-5 flex justify-between items-center rounded-t-2xl">
                <h2 className="text-xl font-semibold text-white">Add New Sensor</h2>
                <button
                  onClick={() => setIsAddPopupOpen(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleAddSensorSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sensor ID</label>
                  <input
                    type="text"
                    value={newSensor.sensorId}
                    onChange={(e) => setNewSensor({ ...newSensor, sensorId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    placeholder="Enter Sensor ID"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sensor Name</label>
                  <input
                    type="text"
                    value={newSensor.sensorName}
                    onChange={(e) => setNewSensor({ ...newSensor, sensorName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    placeholder="Enter Sensor Name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enable Notification</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newSensor.notificationStatus === "on"}
                      onChange={e => setNewSensor({ ...newSensor, notificationStatus: e.target.checked ? "on" : "off" })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-[#151c27] peer-checked:via-[#232946] peer-checked:to-[#8bc6ec] transition-all"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Average Temperature (°F)</label>
                  <input
                    type="number"
                    value={newSensor.avgTemp}
                    onChange={(e) => setNewSensor({ ...newSensor, avgTemp: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    placeholder="Enter Average Temperature"
                    step="0.1"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddPopupOpen(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-[#151c27] via-[#232946] to-[#232946] text-white rounded-xl hover:from-[#232946] hover:to-[#8bc6ec] transition-all font-medium"
                  >
                    Add Sensor
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isEditPopupOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            onClick={() => setIsEditPopupOpen(false)}
          >
            <div
              className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all scrollbar-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-[#151c27] via-[#232946] to-[#232946] p-5 flex justify-between items-center rounded-t-2xl">
                <h2 className="text-xl font-semibold text-white">Edit Sensor</h2>
                <button
                  onClick={() => setIsEditPopupOpen(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleEditSensorSubmit} className="p-6 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sensor ID</label>
                  <input
                    type="text"
                    value={editingSensor.sensorId || ""}
                    disabled
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-200 text-gray-600 placeholder-gray-400"
                    placeholder="Sensor ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sensor Name</label>
                  <input
                    type="text"
                    value={editingSensor.name || ""}
                    onChange={(e) => setEditingSensor({ ...editingSensor, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    placeholder="Enter Sensor Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <input
                    type="text"
                    value={editingSensor.status || ""}
                    disabled
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-200 text-gray-600 placeholder-gray-400"
                    placeholder="Status"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sensor Type</label>
                  <input
                    type="text"
                    value={editingSensor.sensortype || ""}
                    onChange={(e) => setEditingSensor({ ...editingSensor, sensortype: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    placeholder="Enter Sensor Type"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notification</label>
                  <input
                    type="text"
                    value={editingSensor.notification || ""}
                    disabled
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-200 text-gray-600 placeholder-gray-400"
                    placeholder="Notification"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={editingSensor.brand || ""}
                    onChange={(e) => setEditingSensor({ ...editingSensor, brand: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    placeholder="Enter Brand"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={editingSensor.location || ""}
                    onChange={(e) => setEditingSensor({ ...editingSensor, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    placeholder="Enter Location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Readable Time</label>
                  <input
                    type="text"
                    value={editingSensor.readableTime || ""}
                    disabled
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-200 text-gray-600 placeholder-gray-400"
                    placeholder="Readable Time"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Push to Site</label>
                  <input
                    type="text"
                    value={editingSensor.pushToSite || ""}
                    disabled
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-200 text-gray-600 placeholder-gray-400"
                    placeholder="Push to Site"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Temp (°F)</label>
                  <input
                    type="text"
                    value={editingSensor.maxTemp || ""}
                    disabled
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-200 text-gray-600 placeholder-gray-400"
                    placeholder="Max Temp"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Temp (°F)</label>
                  <input
                    type="text"
                    value={editingSensor.currentTemp || ""}
                    disabled
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-200 text-gray-600 placeholder-gray-400"
                    placeholder="Current Temp"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Temp (°F)</label>
                  <input
                    type="text"
                    value={editingSensor.minTemp || ""}
                    disabled
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-200 text-gray-600 placeholder-gray-400"
                    placeholder="Min Temp"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Avg Temp (°F)</label>
                  <input
                    type="text"
                    value={editingSensor.avgTemp || ""}
                    disabled
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-200 text-gray-600 placeholder-gray-400"
                    placeholder="Avg Temp"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Avg Temp Hours</label>
                  <input
                    type="number"
                    value={editingSensor.avgTempHours || ""}
                    onChange={(e) => setEditingSensor({ ...editingSensor, avgTempHours: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    placeholder="Enter Avg Temp Hours"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Location</label>
                  <input
                    type="text"
                    value={editingSensor.locationBusiness || ""}
                    onChange={(e) => setEditingSensor({ ...editingSensor, locationBusiness: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    placeholder="Enter Business Location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost Per Customer</label>
                  <input
                    type="number"
                    value={editingSensor.costPerCustomer || ""}
                    onChange={(e) => setEditingSensor({ ...editingSensor, costPerCustomer: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    placeholder="Enter Cost Per Customer"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                  <input
                    type="text"
                    value={editingSensor.currentdate || ""}
                    disabled
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-200 text-gray-600 placeholder-gray-400"
                    placeholder="Last Updated"
                  />
                </div>
                <div className="col-span-2 flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditPopupOpen(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-[#151c27] via-[#232946] to-[#232946] text-white rounded-xl hover:from-[#232946] hover:to-[#8bc6ec] transition-all font-medium"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
}