import Sidebar from "./Sidebar";
import Table from "./Table";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <nav className="bg-[#0D4715] p-4 shadow-md">
          <h1 className="text-2xl font-semibold text-white pl-4">Sensor Data</h1>
        </nav>
        <Table />
      </main>
    </div>
  );
}