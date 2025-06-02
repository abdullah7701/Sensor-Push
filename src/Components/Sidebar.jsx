import { useState } from "react";
import { Search, Table, Check } from "lucide-react";

export default function Sidebar({ selectedView, setSelectedView, onLogout }) {
  const [searchQuery, setSearchQuery] = useState("");
  const views = ["Sensors_Data", "Existing Store"];

  const filteredViews = views.filter((view) =>
    view.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-64 bg-gray-200 border-r border-gray-300 p-6 flex flex-col justify-between h-screen shadow-lg">
      <div>
        <div className="relative mb-8">
          <Search className="absolute left-3 top-2.5 text-gray-500 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find a view"
            className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder-gray-500 text-sm transition-all"
          />
        </div>

        <ul className="space-y-2">
          {filteredViews.map((view) => (
            <li
              key={view}
              onClick={() => setSelectedView(view)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition-all ${
                selectedView === view
                  ? "bg-gradient-to-r from-gray-300 to-blue-200 text-gray-800 font-semibold shadow-md"
                  : "hover:bg-gray-100 text-gray-700 hover:text-blue-600"
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

      <button
        onClick={onLogout}
        className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md"
      >
        Logout
      </button>
    </aside>
  );
}