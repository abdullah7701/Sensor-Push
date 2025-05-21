import { useState, useEffect } from "react";
import ExistingStoreTableHeader from "./ExistingStoreTableHeader";
import ExistingStoreTableRow from "./ExistingStoreTableRow";
import { fetchExistingStoreData } from "../../api/api";

export default function ExistingStoreTable() {
  const [storeData, setStoreData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const getData = async () => {
      const data = await fetchExistingStoreData();
      console.log("Fetched data:", data);
      setStoreData(data || []);
    };
    getData();
  }, []);

  const filteredStoreData = storeData.filter((store) => {
    const query = searchQuery.toLowerCase();
    return (
      store['Store Short Code']?.toLowerCase()?.includes(query) ||
      store['Store Name']?.toLowerCase()?.includes(query) ||
      store.notification_status?.toLowerCase()?.includes(query) ||
      store['Phone_Numbers_Level_1']?.toLowerCase()?.includes(query) ||
      store['Phone_Numbers_Level_2']?.toLowerCase()?.includes(query) ||
      store['Phone_Numbers_Level_3']?.toLowerCase()?.includes(query) ||
      store['Email_Recipients_Level_1']?.toLowerCase()?.includes(query) ||
      store['Email_Recipients_Level_2']?.toLowerCase()?.includes(query) ||
      store['Email_Recipients_Level_3']?.toLowerCase()?.includes(query) ||
      store['Cooler SMS Subscribers']?.toLowerCase()?.includes(query)
    );
  });

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-xl">
      <div className="relative mb-6">
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

      <div className="overflow-auto h-[670px] scroll-container rounded-xl shadow-inner">
        <table className="min-w-full table-fixed border border-gray-100 divide-y divide-gray-100 bg-white rounded-xl">
          <ExistingStoreTableHeader />
          <tbody>
            {filteredStoreData.map((store, index) => (
              <ExistingStoreTableRow
                key={store['Store Short Code'] || index}
                store={{
                  storeShortCode: store['Store Short Code'],
                  storeName: store['Store Name'],
                  coolerSmsSubscribers: store['Cooler SMS Subscribers'],
                  phoneNumbersLevel1: store['Phone_Numbers_Level_1'],
                  phoneNumbersLevel2: store['Phone_Numbers_Level_2'],
                  phoneNumbersLevel3: store['Phone_Numbers_Level_3'],
                  emailRecipientsLevel1: store['Email_Recipients_Level_1'],
                  emailRecipientsLevel2: store['Email_Recipients_Level_2'],
                  emailRecipientsLevel3: store['Email_Recipients_Level_3'],
                  notificationStatus: store.notification_status,
                }}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}