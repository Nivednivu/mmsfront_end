import React, { useEffect, useState } from 'react';
import './QueryAdminList.css'

function AdminQueryList() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const storedEntries = JSON.parse(localStorage.getItem('leaseEntries')) || [];
    setEntries(storedEntries);
  }, []);

  return (
    <div className="admin-list">
      <h2>Admin Query List</h2>
      <table border="1">
        <thead>
          <tr>
              <th>HSN Code</th>
              <th>Lessee ID</th>
              <th>Mine Code</th>
              <th>Area Details</th>
              <th>District</th>
              <th>Taluk Name</th>
              <th>Village</th>
              <th>SF.NO / Extent</th>
              <th>Classification</th>
              <th>Lease Period</th>
              <th>Dispatch Ship No</th>
              <th>Within Tamil Nadu</th>
              <th>Mineral</th>
              <th>Signature</th>
             
            </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index}>
                 <td>{entry.hsnCode}</td>
                <td>{entry.lesseeId}</td>
                <td>{entry.minecode}</td>
                <td>{entry.lesseeNameAddress}</td>
                <td>{entry.districtName}</td>
                <td>{entry.Taluk}</td>
                <td>{entry.village}</td>
                <td>{entry.sfNoExtent}</td>
                <td>{entry.classification}</td>
                <td>{entry.leasePeriod}</td>
                <td>{entry.dispatchNo}</td>
                <td>{entry.withinTamilNadu}</td>
                <td>{entry.mineralName}</td>
              <td>
                {entry.signature ? (
                  <img src={entry.signature} alt="Signature" width="100"  height="20" />
                ) : (
                  <span>No image</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminQueryList;