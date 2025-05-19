import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './QueryAdminView.css';
import { adminAddQuaeyByIdAPI, adminQuaeyIdupdateAPI } from '../../Server/allAPI';

function QueryAdminView() {
  const { id } = useParams();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await adminAddQuaeyByIdAPI(id);
        if (response.status === 200) {
          setEntry(response.data);
        } else {
          setError('Failed to fetch entry details. Please try again.');
        }
      } catch (error) {
        setError(`Error fetching entry: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchEntry();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntry((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const response = await adminQuaeyIdupdateAPI(id, entry);
      if (response.status === 200) {
        alert('Entry updated successfully!');
        setIsEditing(false);
      } else {
        alert('Failed to update entry. Please try again.');
      }
    } catch (error) {
      console.error('Error updating entry:', error);
      alert('An error occurred while updating the entry.');
    }
  };

  const formatLabel = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .replace('Hs n', 'HSN')
      .replace('Sf no', 'SF.No');
  };

  return (
    <div className="admin-view-container">
      <div className="view-header">
        <h2 className="view-title">Lease Entry Details</h2>
        <div className="breadcrumb">Admin Panel / Lease Entries / Details</div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading lease entry details...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
          <button 
            className="btn-retry"
            onClick={() => window.location.reload()}
          >
            <i className="fas fa-sync-alt"></i> Retry
          </button>
        </div>
      ) : entry ? (
        <div className="detail-card">
          <div className="card-body">
            <div className="detail-grid">
              {Object.entries(entry).map(([key, value]) => {
                if (['_id', '__v', 'createdAt', 'updatedAt'].includes(key)) return null;
                
                return (
                  <div className="detail-row" key={key}>
                    <label className="detail-label">{formatLabel(key)}</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name={key}
                        value={value || ''}
                        onChange={handleChange}
                        className="detail-input"
                      />
                    ) : (
                      <div className="detail-value">
                        {value || <span className="empty-value">Not specified</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="action-buttons">
              {isEditing ? (
                <>
                  <button 
                    onClick={handleUpdate}
                    className="btn btn-save"
                  >
                    <i className="fas fa-save"></i> Save Changes
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="btn btn-cancel"
                  >
                    <i className="fas fa-times"></i> Cancel
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn btn-edit"
                >
                  <i className="fas fa-edit"></i> Edit Entry
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <i className="fas fa-file-alt"></i>
          <p>No lease entry found with this ID</p>
        </div>
      )}
    </div>
  );
}

export default QueryAdminView;