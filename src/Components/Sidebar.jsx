import { useState } from "react";
import { Search, Table, Check } from "lucide-react";

export default function Sidebar() {
  const [selectedView, setSelectedView] = useState("Sensors_Data");

  const views = ["Sensors_Data", "Existing Store"];

  return (
    <aside className="w-64 bg-white border-r p-6 flex flex-col justify-between h-screen shadow-lg">
      <div>
        <div className="relative mb-8">
          <Search className="absolute left-3 top-2.5 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Find a view"
            className="pl-10 pr-3 py-2 w-full border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-sm transition-all"
          />
        </div>

        <ul className="space-y-2">
          {views.map((view) => (
            <li
              key={view}
              onClick={() => setSelectedView(view)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition-all ${
                selectedView === view
                  ? "bg-blue-500 text-white font-semibold shadow-md"
                  : "hover:bg-gray-100 text-gray-700 hover:text-blue-500"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Table className="w-5 h-5" />
                <span>{view}</span>
              </div>
              {selectedView === view && <Check className="w-5 h-5" />}
            </li>
          ))}
        </ul>
      </div>

      <button className="px-4 py-2 bg-[#0D4715] text-white rounded-lg hover:bg-[#113b16] transition-all duration-300 shadow-md">
        Logout
      </button>
    </aside>
  );
}