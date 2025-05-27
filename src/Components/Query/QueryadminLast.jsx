import React, { useEffect, useState } from 'react';
import './QueryAdminList.css';
import { adminAddQuaeyLastAPI } from '../../Server/allAPI';

function QueryadminLast() {
  const [lastEntry, setLastEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  
  useEffect(() => {
    const fetchLastEntry = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await adminAddQuaeyLastAPI();
        console.log("API Response:", response);

        if (!response?.data?.success) {
          throw new Error(response?.data?.message || "Failed to fetch data");
        }

        const entry = response.data.data;

        // Validate required fields exist and aren't empty
        const requiredFields = ['hsnCode', 'lesseeId', 'minecode'];
        const missingFields = requiredFields.filter(
          field => !entry[field] || entry[field] === ""
        );

        if (missingFields.length > 0) {
          throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        setLastEntry(entry);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setLastEntry(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLastEntry();
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
if (loading) {
    return <div className="admin-view-container"><p>Loading last entry...</p></div>;
  }

  if (error) {
    return <div className="admin-view-container"><p className="error-message">{error}</p></div>;
  }

  if (!lastEntry) {
    return <div className="admin-view-container"><p>No recent lease entry available.</p></div>;
  }
console.log(lastEntry);

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
          <span className="detail-label">SerialNo:</span>
          <span className="detail-value">{lastEntry.SerialNo}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">dispatchNO:</span>
          <span className="detail-value">{lastEntry.dispatchNO}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Lessee Address:</span>
          <span className="detail-value">{lastEntry.lesseeNameAddress}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Area Details:</span>
          <span className="detail-value">{lastEntry.lesseeAreaDetails || 'N/A'}</span>
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
          {lastEntry.signature ? (
            <img 
              src={lastEntry.signature} 
              alt="Signature" 
              className="signature-image"
            />
          ) : (
            <span className="no-signature">No signature available</span>
          )}
        </div>
        
        <div className="navigation-container">
          <button className="dashboard-button">
            <a href="/side" className="dashboard-link">Back to Dashboard</a>
          </button>
        </div>
      </div>
    </div>
  );
}

export default QueryadminLast;