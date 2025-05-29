import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { queryGetAPI } from '../Server/allAPI';

function Quaryyy() {
  const [queryData, setQueryData] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    fetchQueryData();
  }, []);
 
  const fetchQueryData = async () => {
    try {
      const res = await queryGetAPI();
      setQueryData(res.data); // Adjust depending on response format
    } catch (error) {
      console.error("Error fetching query data:", error);
    }
  };

  // Delete single query
  const deleteQuery = async (id) => {
    try {
      await axios.delete(`http://localhost:3005/queries/${id}`);
      fetchQueryData(); // Refresh data after delete
      alert('Query deleted successfully');
    } catch (error) {
      console.error("Error deleting query:", error);
      alert('Failed to delete query');
    }
  };

  // Delete all queries
  const deleteAllQueries = async () => {
    if (window.confirm('Are you sure you want to delete ALL queries? This cannot be undone.')) {
      try {
        await axios.delete('http://localhost:3005/queries');
        fetchQueryData(); // Refresh data after delete
        alert('All queries deleted successfully');
      } catch (error) {
        console.error("Error deleting all queries:", error);
        alert('Failed to delete all queries');
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Query Data</h2>
        {queryData.length > 0 && (
          <button
            onClick={deleteAllQueries}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Delete All
          </button>
        )}
      </div>
      
      {queryData.length === 0 ? (
        <p>No data found.</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Serial No</th>
              <th className="border px-4 py-2">Dispatch Number</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {queryData.map((item, index) => (
              <tr key={item._id}>
                <td className="border px-4 py-2">{item.SerialNo}</td>
                <td className="border px-4 py-2">{item.dispatchNo}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => deleteQuery(item._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Quaryyy;