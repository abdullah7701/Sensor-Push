import { useState } from "react";

export default function ExistingStoreTableRow({ store }) {
  const [selectedNumbers, setSelectedNumbers] = useState(null);
  const [popupField, setPopupField] = useState(null);

  const getStatusTagClass = (status) => {
    switch (status?.toLowerCase()) {
      case "on":
        return "bg-green-100 text-green-800";
      case "off":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format multi-value fields for preview (show 1-2 entries with ... as tags)
  const formatMultiValuePreview = (value) => {
    if (!value) return { preview: 'N/A', allValues: [] };
    const values = value.split(',').map(item => item.trim()).filter(item => item);
    if (values.length === 0) return { preview: 'N/A', allValues: [] };
    const previewText = values.length > 2 
      ? `${values.slice(0, 2).join(', ')} ...`
      : values.join(', ');
    return { preview: previewText, allValues: values };
  };

  // Handle popup opening on tag click
  const openPopup = (values, field) => {
    if (values.length > 0) {
      setSelectedNumbers(values);
      setPopupField(field);
    }
  };

  // Handle popup closing
  const closePopup = () => {
    setSelectedNumbers(null);
    setPopupField(null);
  };

  // Render multi-value field with tag-like preview
  const renderMultiValueField = (value, field) => {
    const { preview, allValues } = formatMultiValuePreview(value);
    return (
      <div
        onClick={() => allValues.length > 0 && openPopup(allValues, field)}
        className="flex items-center space-x-1 cursor-pointer hover:opacity-80"
      >
        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
          {preview}
        </span>
      </div>
    );
  };

  return (
    <>
      <tr className="border-t border-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-200">
        <td className="px-4 py-3 text-gray-800 text-sm font-medium min-w-[120px] max-w-[150px] truncate">{store.storeShortCode ?? 'N/A'}</td>
        <td className="px-4 py-3 text-gray-800 text-sm font-medium min-w-[150px] max-w-[180px] truncate">{store.storeName ?? 'N/A'}</td>
        <td className="px-4 py-3 text-sm font-medium min-w-[100px] max-w-[120px]">
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusTagClass(store.notificationStatus)}`}>
            {store.notificationStatus ?? 'N/A'}
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

      {selectedNumbers && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-auto shadow-xl">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-t-lg">
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
              className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}