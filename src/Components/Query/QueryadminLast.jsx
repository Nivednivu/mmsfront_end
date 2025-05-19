import React, { useEffect, useState } from 'react';
import './QueryAdminList.css';

function QueryadminLast() {
  const [lastEntry, setLastEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLastEntry = () => {
      try {
        setLoading(true);
        const storedData = localStorage.getItem('leaseEntries');
        
        if (!storedData) {
          setError("No lease entries found in storage");
          return;
        }

        const parsedEntries = JSON.parse(storedData);
        
        // Filter out empty entries (optional)
        const validEntries = parsedEntries.filter(entry => 
          entry.hsnCode && entry.lesseeId && entry.minecode
        );

        if (validEntries.length === 0) {
          setError("No valid lease entries found");
          return;
        }

        // Get the last valid entry
        const lastValidEntry = validEntries[validEntries.length - 1];
        setLastEntry(lastValidEntry);
        
      } catch (err) {
        console.error("Error loading last entry:", err);
        setError("Failed to load lease data");
      } finally {
        setLoading(false);
      }
    };

    loadLastEntry();
  }, []);

  if (loading) {
    return <div className="admin-view-container"><p>Loading last entry...</p></div>;
  }

  if (error) {
    return <div className="admin-view-container"><p className="error-message">{error}</p></div>;
  }

  if (!lastEntry) {
    return <div className="admin-view-container"><p>No recent lease entry available.</p></div>;
  }

  return (
    <div className="admin-view-container">
      <h2>Last Submitted Lease Entry</h2>
      <div className="entry-details">
        <div className="detail-row">
          <span className="detail-label">HSN Code:</span>
          <span className="detail-value">{lastEntry.hsnCode}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Lessee ID:</span>
          <span className="detail-value">{lastEntry.lesseeId}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Mine Code:</span>
          <span className="detail-value">{lastEntry.minecode}</span>
        </div>
        
        

        <div className="detail-row">
          <span className="detail-label"> SerialNo:</span>
          <span className="detail-value">{lastEntry.SerialNo}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Lessee Address:</span>
          <span className="detail-value">{lastEntry.lesseeNameAddress}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Area Details:</span>
          <span className="detail-value">{lastEntry.lesseeAreaDetails}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">District:</span>
          <span className="detail-value">{lastEntry.districtName}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Village:</span>
          <span className="detail-value">{lastEntry.village}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">SF.NO / Extent:</span>
          <span className="detail-value">{lastEntry.sfNoExtent}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Classification:</span>
          <span className="detail-value">{lastEntry.classification}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Lease Period:</span>
          <span className="detail-value">{lastEntry.leasePeriod}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Within Tamil Nadu:</span>
          <span className="detail-value">{lastEntry.withinTamilNadu}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Mineral:</span>
          <span className="detail-value">{lastEntry.mineralName}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Bulk Permit No:</span>
          <span className="detail-value">{lastEntry.bulkPermitNo}</span>
        </div>

        
        <div className="detail-row">
          <span className="detail-label">Signature:</span>
                  <img src={lastEntry.signature} alt="Signature" width="40"  height="20" />
        </div>
<div className="navigation-container">
  <button className="dashboard-button">
    <a href="/side" className="dashboard-link">Back to Dashboard</a>
  </button>
</div>      </div>
    </div>
  );
}

export default QueryadminLast;

