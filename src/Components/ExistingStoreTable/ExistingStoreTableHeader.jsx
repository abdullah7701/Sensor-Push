export default function ExistingStoreTableHeader({ showCheckboxes }) {
  return (
    <thead className="bg-gray-100 sticky top-0 z-10 border-b border-gray-200">
      <tr>
        <th
          className={`px-4 py-3 text-left text-gray-700 font-semibold text-sm uppercase tracking-wide whitespace-nowrap w-16 ${
            showCheckboxes ? "sticky left-0 bg-gray-100 z-20 border-r border-gray-200" : ""
          }`}
        >
          {showCheckboxes ? "" : ""}
        </th>
        <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm uppercase tracking-wide whitespace-nowrap min-w-[140px] max-w-[160px] border-r border-gray-200">
          Store Short Code
        </th>
        <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm uppercase tracking-wide whitespace-nowrap min-w-[140px] max-w-[160px] border-r border-gray-200">
          Store Name
        </th>
        <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm uppercase tracking-wide whitespace-nowrap min-w-[140px] max-w-[160px] border-r border-gray-200">
          Notification Status
        </th>
        <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm uppercase tracking-wide whitespace-nowrap min-w-[180px] max-w-[200px] border-r border-gray-200">
          Phone Numbers Level 1
        </th>
        <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm uppercase tracking-wide whitespace-nowrap min-w-[180px] max-w-[200px] border-r border-gray-200">
          Phone Numbers Level 2
        </th>
        <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm uppercase tracking-wide whitespace-nowrap min-w-[180px] max-w-[200px] border-r border-gray-200">
          Phone Numbers Level 3
        </th>
        <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm uppercase tracking-wide whitespace-nowrap min-w-[180px] max-w-[200px] border-r border-gray-200">
          Email Recipients Level 1
        </th>
        <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm uppercase tracking-wide whitespace-nowrap min-w-[180px] max-w-[200px] border-r border-gray-200">
          Email Recipients Level 2
        </th>
        <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm uppercase tracking-wide whitespace-nowrap min-w-[180px] max-w-[200px] border-r border-gray-200">
          Email Recipients Level 3
        </th>
        <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm uppercase tracking-wide whitespace-nowrap min-w-[180px] max-w-[200px] border-r border-gray-200">
          Cooler SMS Subscribers
        </th>
      </tr>
    </thead>
  );
}