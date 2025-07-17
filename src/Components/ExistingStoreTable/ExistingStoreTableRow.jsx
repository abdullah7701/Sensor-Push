import { useState } from "react";

export default function ExistingStoreTableRow({ store, checked, onRowSelect, showCheckboxes }) {
  const [expandedField, setExpandedField] = useState(null);

  // Format multi-value fields
  const formatMultiValuePreview = (value) => {
    if (!value) return { preview: "N/A", allValues: [] };
    const values = value.split(",").map((item) => item.trim()).filter((item) => item);
    if (values.length === 0) return { preview: "N/A", allValues: [] };
    const previewText = values[0];
    return { preview: previewText, allValues: values };
  };

  // Toggle expanded view for multi-value fields
  const toggleExpanded = (field) => {
    setExpandedField(expandedField === field ? null : field);
  };

  const renderMultiValueField = (value, field) => {
    const { preview, allValues } = formatMultiValuePreview(value);
    return (
      <div className="relative">
        <div
          onClick={() => allValues.length > 1 && toggleExpanded(field)}
          className={`flex items-center space-x-1 ${allValues.length > 1 ? "cursor-pointer hover:opacity-80" : ""}`}
          title={allValues.length > 1 ? `View all ${field}` : ""}
        >
          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full truncate max-w-[150px]">
            {preview}
          </span>
          {allValues.length > 1 && (
            <span className="text-blue-600 text-xs font-semibold">+{allValues.length - 1}</span>
          )}
        </div>
        {expandedField === field && allValues.length > 1 && (
          <div className="absolute z-10 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
            <div className="flex flex-wrap gap-2">
              {allValues.map((item, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <tr className="border-t border-gray-200 hover:bg-gray-50 transition-all duration-200">
      <td
        className={`px-4 py-3 min-w-[60px] ${
          showCheckboxes ? "sticky left-0 bg-white z-10 border-r border-gray-200" : ""
        }`}
      >
        {showCheckboxes && (
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onRowSelect(store.storeShortCode, e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
        )}
      </td>
      <td className="px-4 py-3 text-gray-800 text-sm font-medium min-w-[120px] max-w-[150px] truncate border-r border-gray-200">
        {store.storeShortCode ?? "N/A"}
      </td>
      <td className="px-4 py-3 text-gray-800 text-sm font-medium min-w-[150px] max-w-[180px] truncate border-r border-gray-200">
        {store.storeName ?? "N/A"}
      </td>
      <td className="px-4 py-3 text-sm font-medium min-w-[100px] max-w-[120px] border-r border-gray-200">
        <span className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={store.notificationStatus === "on"}
            disabled
            readOnly
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-[#151c27] peer-checked:via-[#232946] peer-checked:to-[#8bc6ec] transition-all"></div>
          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
        </span>
      </td>
      <td className="px-4 py-3 text-gray-800 text-sm font-medium min-w-[200px] max-w-[250px] border-r border-gray-200">
        {renderMultiValueField(store.phoneNumbersLevel1, "Phone Numbers Level 1")}
      </td>
      <td className="px-4 py-3 text-gray-800 text-sm font-medium min-w-[200px] max-w-[250px] border-r border-gray-200">
        {renderMultiValueField(store.phoneNumbersLevel2, "Phone Numbers Level 2")}
      </td>
      <td className="px-4 py-3 text-gray-800 text-sm font-medium min-w-[200px] max-w-[250px] border-r border-gray-200">
        {renderMultiValueField(store.phoneNumbersLevel3, "Phone Numbers Level 3")}
      </td>
      <td className="px-4 py-3 text-gray-800 text-sm font-medium min-w-[200px] max-w-[200px] border-r border-gray-200">
        {renderMultiValueField(store.emailRecipientsLevel1, "Email Recipients Level 1")}
      </td>
      <td className="px-4 py-3 text-gray-800 text-sm font-medium min-w-[200px] max-w-[200px] border-r border-gray-200">
        {renderMultiValueField(store.emailRecipientsLevel2, "Email Recipients Level 2")}
      </td>
      <td className="px-4 py-3 text-gray-800 text-sm font-medium min-w-[200px] max-w-[200px] border-r border-gray-200">
        {renderMultiValueField(store.emailRecipientsLevel3, "Email Recipients Level 3")}
      </td>
      <td className="px-4 py-3 text-gray-800 text-sm font-medium min-w-[200px] border-r border-gray-200">
        {renderMultiValueField(store.coolerSmsSubscribers, "Cooler SMS Subscribers")}
      </td>
    </tr>
  );
}