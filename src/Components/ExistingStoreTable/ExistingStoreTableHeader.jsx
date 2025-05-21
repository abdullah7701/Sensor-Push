export default function ExistingStoreTableHeader() {
    return (
      <thead className="bg-gray-100 sticky top-0 z-10 border-b border-gray-200">
        <tr>
          <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm uppercase tracking-wide whitespace-nowrap min-w-[140px] max-w-[160px]">Store Short Code</th>
          <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm uppercase tracking-wide whitespace-nowrap min-w-[140px] max-w-[160px]">Store Name</th>
          <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm uppercase tracking-wide whitespace-nowrap min-w-[140px] max-w-[160px]">Notification Status</th>
          <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm uppercase tracking-wide whitespace-nowrap min-w-[180px] max-w-[200px]">Phone Numbers Level 1</th>
          <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm uppercase tracking-wide whitespace-nowrap min-w-[180px] max-w-[200px]">Phone Numbers Level 2</th>
          <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm uppercase tracking-wide whitespace-nowrap min-w-[180px] max-w-[200px]">Phone Numbers Level 3</th>
          <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm uppercase tracking-wide whitespace-nowrap min-w-[180px] max-w-[200px]">Email Recipients Level 1</th>
          <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm uppercase tracking-wide whitespace-nowrap min-w-[180px] max-w-[200px]">Email Recipients Level 2</th>
          <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm uppercase tracking-wide whitespace-nowrap min-w-[180px] max-w-[200px]">Email Recipients Level 3</th>
          <th className="px-4 py-3 text-left text-gray-700 font-semibold text-sm uppercase tracking-wide whitespace-nowrap min-w-[180px] max-w-[200px]">Cooler SMS Subscribers</th>
        </tr>
      </thead>
    );
  }