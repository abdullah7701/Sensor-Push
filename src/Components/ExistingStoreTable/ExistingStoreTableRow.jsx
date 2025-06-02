import { useState } from "react";

export default function ExistingStoreTableRow({ store, checked, onRowSelect }) {
  const [popupField, setPopupField] = useState(null);
  const [selectedNumbers, setSelectedNumbers] = useState(null);

  // Format multi-value fields
  const formatMultiValuePreview = (value) => {
    if (!value) return { preview: 'N/A', allValues: [] };
    const values = value.split(',').map(item => item.trim()).filter(item => item);
    if (values.length === 0) return { preview: 'N/A', allValues: [] };
    const previewText = values.length > 2
      ? `${values.slice(0, 2).join(', ')} ...`
      : values.join(', ');
    return { preview: previewText, allValues: values };
  };

  // Click to view numbers
  const openPopup = (values, field) => {
    if (values.length > 0) {
      setSelectedNumbers(values);
      setPopupField(field);
    }
  };
  const closePopup = () => {
    setSelectedNumbers(null);
    setPopupField(null);
  };

  const renderMultiValueField = (value, field) => {
    const { preview, allValues } = formatMultiValuePreview(value);
    return (
      <div
        onClick={() => allValues.length > 0 && openPopup(allValues, field)}
        className="flex items-center space-x-1 cursor-pointer hover:opacity-80"
        title={`View all ${field}`}
      >
        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
          {preview}
        </span>
      </div>
    );
  };

  return (
    <>
      <tr className="border-t border-gray-100 transition-all duration-200">
        <td className="px-4 py-3 min-w-[50px]">
          <input
            type="checkbox"
            checked={checked}
            onChange={e => onRowSelect(store.storeShortCode, e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
        </td>
        <td className="px-4 py-3 text-gray-800 text-sm font-medium min-w-[120px] max-w-[150px] truncate">{store.storeShortCode ?? 'N/A'}</td>
        <td className="px-4 py-3 text-gray-800 text-sm font-medium min-w-[150px] max-w-[180px] truncate">{store.storeName ?? 'N/A'}</td>
        {/* Notification Toggle */}
        <td className="px-4 py-3 text-sm font-medium min-w-[100px] max-w-[120px]">
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
        <td className="px-4 py-3 text-gray-800 text-sm font-medium min-w-[200px] max-w-[250px]">
          {renderMultiValueField(store.phoneNumbersLevel1, "Phone Numbers Level 1")}
        </td>
        <td className="px-4 py-3 text-gray-800 text-sm font-medium min-w-[200px] max-w-[250px]">
          {renderMultiValueField(store.phoneNumbersLevel2, "Phone Numbers Level 2")}
        </td>
        <td className="px-4 py-3 text-gray-800 text-sm font-medium min-w-[200px] max-w-[250px]">
          {renderMultiValueField(store.phoneNumbersLevel3, "Phone Numbers Level 3")}
        </td>
        <td className="px-4 py-3 text-gray-800 text-sm font-medium min-w-[200px] max-w-[250px] truncate">{store.emailRecipientsLevel1 ?? 'N/A'}</td>
        <td className="px-4 py-3 text-gray-800 text-sm font-medium min-w-[200px] max-w-[250px] truncate">{store.emailRecipientsLevel2 ?? 'N/A'}</td>
        <td className="px-4 py-3 text-gray-800 text-sm font-medium min-w-[200px] max-w-[250px] truncate">{store.emailRecipientsLevel3 ?? 'N/A'}</td>
        <td className="px-4 py-3 text-gray-800 text-sm font-medium min-w-[200px] max-w-[250px]">
          {renderMultiValueField(store.coolerSmsSubscribers, "Cooler SMS Subscribers")}
        </td>
      </tr>
      {/* Numbers Popup */}
      {selectedNumbers && (
        <tr>
          <td colSpan={12}>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-auto shadow-xl">
                <h2 className="text-lg font-semibold mb-4 text-white bg-gradient-to-r from-[#151c27] via-[#232946] to-[#8bc6ec] p-3 rounded-t-lg">
                  {popupField}
                </h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedNumbers.map((number, index) => (
                    <span
                      key={index}
                      className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                    >
                      {number}
                    </span>
                  ))}
                </div>
                <button
                  onClick={closePopup}
                  className="w-full px-4 py-2 bg-gradient-to-r from-[#151c27] via-[#232946] to-[#8bc6ec] text-white rounded-xl hover:from-[#232946] hover:to-[#8bc6ec] transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
