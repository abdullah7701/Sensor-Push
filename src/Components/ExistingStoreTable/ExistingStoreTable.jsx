import { useState, useEffect, useMemo } from "react";
import ExistingStoreTableHeader from "./ExistingStoreTableHeader";
import ExistingStoreTableRow from "./ExistingStoreTableRow";
import { fetchExistingStoreData, addOrUpdateExistingStore } from "../../api/api";

export default function ExistingStoreTable() {
  const [storeData, setStoreData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [formData, setFormData] = useState({
    storeShortCode: "",
    storeName: "",
    notificationStatus: "off",
    emailRecipientsLevel1: "",
    emailRecipientsLevel2: "",
    emailRecipientsLevel3: "",
    phoneNumbersLevel1: "",
    phoneNumbersLevel2: "",
    phoneNumbersLevel3: "",
    coolerSmsSubscribers: "",
  });

  useEffect(() => {
    const getData = async () => {
      const data = await fetchExistingStoreData();
      setStoreData(data || []);
    };
    getData();
  }, []);

  const filteredStoreData = useMemo(
    () =>
      storeData.filter((store) => {
        const query = searchQuery.toLowerCase();
        return (
          store["Store Short Code"]?.toLowerCase()?.includes(query) ||
          store["Store Name"]?.toLowerCase()?.includes(query) ||
          store.notification_status?.toLowerCase()?.includes(query) ||
          store["Phone_Numbers_Level_1"]?.toLowerCase()?.includes(query) ||
          store["Phone_Numbers_Level_2"]?.toLowerCase()?.includes(query) ||
          store["Phone_Numbers_Level_3"]?.toLowerCase()?.includes(query) ||
          store["Email_Recipients_Level_1"]?.toLowerCase()?.includes(query) ||
          store["Email_Recipients_Level_2"]?.toLowerCase()?.includes(query) ||
          store["Email_Recipients_Level_3"]?.toLowerCase()?.includes(query) ||
          store["Cooler SMS Subscribers"]?.toLowerCase()?.includes(query)
        );
      }),
    [storeData, searchQuery]
  );

  // Checkbox handler
  const handleRowSelect = (shortCode, isChecked) => {
    if (isChecked) {
      setSelectedRows([shortCode]);
      const row = storeData.find((s) => s["Store Short Code"] === shortCode);
      setFormData({
        storeShortCode: row["Store Short Code"],
        storeName: row["Store Name"] || "",
        notificationStatus: row.notification_status || "off",
        emailRecipientsLevel1: row["Email_Recipients_Level_1"] || "",
        emailRecipientsLevel2: row["Email_Recipients_Level_2"] || "",
        emailRecipientsLevel3: row["Email_Recipients_Level_3"] || "",
        phoneNumbersLevel1: row["Phone_Numbers_Level_1"] || "",
        phoneNumbersLevel2: row["Phone_Numbers_Level_2"] || "",
        phoneNumbersLevel3: row["Phone_Numbers_Level_3"] || "",
        coolerSmsSubscribers: row["Cooler SMS Subscribers"] || "",
      });
      setIsEditPopupOpen(true);
    } else {
      setSelectedRows([]);
      setIsEditPopupOpen(false);
    }
  };

  // Open add popup
  const handleAddNew = () => {
    setFormData({
      storeShortCode: "",
      storeName: "",
      notificationStatus: "off",
      emailRecipientsLevel1: "",
      emailRecipientsLevel2: "",
      emailRecipientsLevel3: "",
      phoneNumbersLevel1: "",
      phoneNumbersLevel2: "",
      phoneNumbersLevel3: "",
      coolerSmsSubscribers: "",
    });
    setIsEditPopupOpen(true);
    setShowCheckboxes(false);
  };

  // Toggle checkboxes for update
  const toggleCheckboxes = () => {
    setShowCheckboxes((prev) => !prev);
    setSelectedRows([]);
    setIsEditPopupOpen(false);
  };

  // Handle popup form changes
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "on" : "off") : value,
    }));
  };

  // Handle tag input changes
  const handleTagInput = (name, tags) => {
    setFormData((prev) => ({
      ...prev,
      [name]: tags.join(","),
    }));
  };

  // Update store API
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        "Store Short Code": formData.storeShortCode,
        "Store Name": formData.storeName,
        notification_status: formData.notificationStatus,
        Email_Recipients_Level_1: formData.emailRecipientsLevel1,
        Email_Recipients_Level_2: formData.emailRecipientsLevel2,
        Email_Recipients_Level_3: formData.emailRecipientsLevel3,
        Phone_Numbers_Level_1: formData.phoneNumbersLevel1,
        Phone_Numbers_Level_2: formData.phoneNumbersLevel2,
        Phone_Numbers_Level_3: formData.phoneNumbersLevel3,
        "Cooler SMS Subscribers": formData.coolerSmsSubscribers,
      };
      const response = await fetch("http://161.35.107.143:5000/update-existing-store/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.status === "success") {
        setStoreData((prev) =>
          prev.map((row) =>
            row["Store Short Code"] === formData.storeShortCode ? { ...row, ...payload } : row
          )
        );
        setIsEditPopupOpen(false);
        setShowCheckboxes(false);
        setSelectedRows([]);
      } else {
        alert(result.message || "Update failed");
      }
    } catch (err) {
      alert("Failed to update store: " + err.message);
    }
  };

  // Add API
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        "Store Short Code": formData.storeShortCode,
        "Store Name": formData.storeName,
        notification_status: formData.notificationStatus,
        Email_Recipients_Level_1: formData.emailRecipientsLevel1,
        Email_Recipients_Level_2: formData.emailRecipientsLevel2,
        Email_Recipients_Level_3: formData.emailRecipientsLevel3,
        Phone_Numbers_Level_1: formData.phoneNumbersLevel1,
        Phone_Numbers_Level_2: formData.phoneNumbersLevel2,
        Phone_Numbers_Level_3: formData.phoneNumbersLevel3,
        "Cooler SMS Subscribers": formData.coolerSmsSubscribers,
      };
      const result = await addOrUpdateExistingStore(payload);
      if (result.status === "success") {
        setStoreData((prev) => [...prev, payload]);
        setIsEditPopupOpen(false);
        setShowCheckboxes(false);
      } else {
        alert(result.message || "Add failed");
      }
    } catch (err) {
      alert("Failed to add store: " + err.message);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Store Name, Short Code, Contacts, or Status"
            className="w-full px-4 py-3 pl-10 border border-transparent rounded-lg bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-400 transition-all"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-gradient-to-r from-[#151c27] via-[#232946] to-[#232946] text-white rounded-xl hover:from-[#232946] hover:to-[#8bc6ec] transition-all shadow-md flex items-center gap-2"
            onClick={handleAddNew}
          >
            Add Store
          </button>
          <button
            className="px-4 py-2 bg-gradient-to-r from-[#151c27] via-[#232946] to-[#232946] text-white rounded-xl hover:from-[#232946] hover:to-[#8bc6ec] transition-all shadow-md flex items-center gap-2"
            onClick={toggleCheckboxes}
          >
            Update Store
          </button>
        </div>
      </div>

      <div className="relative overflow-x-auto max-h-[70vh] rounded-xl shadow-inner">
        <table className="min-w-full table-fixed border border-gray-200 divide-y divide-gray-200 bg-white rounded-xl">
          <ExistingStoreTableHeader showCheckboxes={showCheckboxes} />
          <tbody>
            {filteredStoreData.map((store, index) => (
              <ExistingStoreTableRow
                key={store["Store Short Code"] || index}
                store={{
                  storeShortCode: store["Store Short Code"],
                  storeName: store["Store Name"],
                  coolerSmsSubscribers: store["Cooler SMS Subscribers"],
                  phoneNumbersLevel1: store["Phone_Numbers_Level_1"],
                  phoneNumbersLevel2: store["Phone_Numbers_Level_2"],
                  phoneNumbersLevel3: store["Phone_Numbers_Level_3"],
                  emailRecipientsLevel1: store["Email_Recipients_Level_1"],
                  emailRecipientsLevel2: store["Email_Recipients_Level_2"],
                  emailRecipientsLevel3: store["Email_Recipients_Level_3"],
                  notificationStatus: store.notification_status,
                }}
                checked={selectedRows.includes(store["Store Short Code"])}
                onRowSelect={handleRowSelect}
                showCheckboxes={showCheckboxes}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit/Add Popup */}
      {isEditPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-[#232946]">
              {formData.storeShortCode && selectedRows.length === 1 ? "Edit Store" : "Add Store"}
            </h2>
            <form
              onSubmit={formData.storeShortCode && selectedRows.length === 1 ? handleUpdate : handleAdd}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Store Short Code</label>
                  <input
                    type="text"
                    name="storeShortCode"
                    value={formData.storeShortCode}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded bg-gray-50 focus:outline-none"
                    required
                    disabled={selectedRows.length === 1}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                  <input
                    type="text"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded bg-gray-50 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notification Status</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="notificationStatus"
                      checked={formData.notificationStatus === "on"}
                      onChange={handleFormChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-[#151c27] peer-checked:via-[#232946] peer-checked:to-[#8bc6ec] transition-all"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </label>
                </div>
                <TagInputField
                  label="Email Recipients Level 1"
                  name="emailRecipientsLevel1"
                  value={formData.emailRecipientsLevel1}
                  onChange={handleTagInput}
                />
                <TagInputField
                  label="Email Recipients Level 2"
                  name="emailRecipientsLevel2"
                  value={formData.emailRecipientsLevel2}
                  onChange={handleTagInput}
                />
                <TagInputField
                  label="Email Recipients Level 3"
                  name="emailRecipientsLevel3"
                  value={formData.emailRecipientsLevel3}
                  onChange={handleTagInput}
                />
                <TagInputField
                  label="Phone Numbers Level 1"
                  name="phoneNumbersLevel1"
                  value={formData.phoneNumbersLevel1}
                  onChange={handleTagInput}
                />
                <TagInputField
                  label="Phone Numbers Level 2"
                  name="phoneNumbersLevel2"
                  value={formData.phoneNumbersLevel2}
                  onChange={handleTagInput}
                />
                <TagInputField
                  label="Phone Numbers Level 3"
                  name="phoneNumbersLevel3"
                  value={formData.phoneNumbersLevel3}
                  onChange={handleTagInput}
                />
                <TagInputField
                  label="Cooler SMS Subscribers"
                  name="coolerSmsSubscribers"
                  value={formData.coolerSmsSubscribers}
                  onChange={handleTagInput}
                  className="md:col-span-3"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditPopupOpen(false);
                    setShowCheckboxes(false);
                    setSelectedRows([]);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#151c27] via-[#232946] to-[#232946] text-white rounded-xl hover:from-[#232946] hover:to-[#8bc6ec] transition-all shadow-md flex items-center gap-2"
                >
                  {formData.storeShortCode && selectedRows.length === 1 ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Tag Input Component
function TagInputField({ label, name, value, onChange, className }) {
  const [inputValue, setInputValue] = useState("");
  const tags = value ? value.split(",").map((item) => item.trim()).filter((item) => item) : [];

  const handleKeyDown = (e) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      if (inputValue.trim()) {
        const newTags = [...tags, inputValue.trim()];
        onChange(name, newTags);
        setInputValue("");
      }
    }
  };

  const removeTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index);
    onChange(name, newTags);
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="w-full border border-gray-200 rounded bg-gray-50 p-2">
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-2 py-1 bg-transparent focus:outline-none text-gray-800"
          placeholder={`Enter ${label}, press comma or enter`}
        />
      </div>
    </div>
  );
}