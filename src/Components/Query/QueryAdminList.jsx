import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './QueryAdminList.css';
import { adminAddQuaeyAllAPI } from '../../Server/allAPI';
// import { adminAddQuaeyAllAPI } from '../../Server/allAPI';

function QueryAdminList() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all lease entries from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await adminAddQuaeyAllAPI();
        if (response.status === 200) {
          setEntries(response.data.data);
        } else {
          console.error("Failed to fetch entries. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching entries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="admin-view-container">
      <h2>Lease Entries</h2>
      {loading ? (
        <p>Loading entries...</p>
      ) : entries.length === 0 ? (
        <p>No lease entries available.</p>
      ) : (
        <table className="entries-table">
          <thead>
            <tr>
              <th>HSN Code</th>
              <th>Lessee ID</th>
              <th>Mine Code</th>
              <th>Lessee Address</th>
              <th>Area Details</th>
              <th>District</th>
              <th>Village</th>
              <th>SF.NO / Extent</th>
              <th>Classification</th>
              <th>Lease Period</th>
              <th>Within Tamil Nadu</th>
              <th>Mineral</th>
              <th>Actions</th> {/* New column for View button */}
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={index}>
                <td>{entry.hsnCode}</td>
                <td>{entry.lesseeId}</td>
                <td>{entry.minecode}</td>
                <td>{entry.lesseeNameAddress}</td>
                <td>{entry.lesseeAreaDetails}</td>
                <td>{entry.districtName}</td>
                <td>{entry.village}</td>
                <td>{entry.sfNoExtent}</td>
                <td>{entry.classification}</td>
                <td>{entry.leasePeriod}</td>
                <td>{entry.withinTamilNadu}</td>
                <td>{entry.mineralName}</td>
                <td>
                  <Link to={`/adminqview/${entry._id}`} className="view-link">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default QueryAdminList;
