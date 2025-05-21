import { useState } from "react";
import Sidebar from "./Sidebar";
import SensorTable from "./SensorTable/SensorTable";
import ExistingStoreTable from "./ExistingStoreTable/ExistingStoreTable";

export default function Dashboard() {
  const [selectedView, setSelectedView] = useState("Sensors_Data");

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar selectedView={selectedView} setSelectedView={setSelectedView} />
      <main className="flex-1 overflow-hidden">
        <nav className="bg-[#0D4715] p-4 shadow-md">
          <h1 className="text-2xl font-semibold text-white pl-4">
            {selectedView === "Sensors_Data" ? "Sensor Data" : "Existing Store"}
          </h1>
        </nav>
        {selectedView === "Sensors_Data" ? <SensorTable /> : <ExistingStoreTable />}
      </main>
    </div>
  );
}