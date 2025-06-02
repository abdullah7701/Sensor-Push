import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import SensorTable from "./SensorTable/SensorTable";
import ExistingStoreTable from "./ExistingStoreTable/ExistingStoreTable";

export default function Dashboard({ setIsAuthenticated }) {
  const [selectedView, setSelectedView] = useState("Sensors_Data");
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-blue-50">
      <Sidebar selectedView={selectedView} setSelectedView={setSelectedView} onLogout={handleLogout} />
      <main className="flex-1 overflow-hidden">
        <nav className="bg-gray-800 p-4 shadow-lg">
          <h1 className="text-2xl font-semibold text-white pl-4">
            {selectedView === "Sensors_Data" ? "Sensor Data" : "Existing Store"}
          </h1>
        </nav>
        {selectedView === "Sensors_Data" ? <SensorTable /> : <ExistingStoreTable />}
      </main>
    </div>
  );
}