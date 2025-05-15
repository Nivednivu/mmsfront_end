import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './QueryAdminView.css';
import { adminAddQuaeyByIdAPI, adminQuaeyIdupdateAPI } from '../../Server/allAPI';

function QueryAdminView() {
  const { id } = useParams(); // Get ID from URL
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch the entry details
  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await adminAddQuaeyByIdAPI(id);
        if (response.status === 200) {
          setEntry(response.data);
        } else {
          console.error('Failed to fetch entry details.');
        }
      } catch (error) {
        console.error('Error fetching entry:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEntry();
  }, [id]);

  // Handle input changes during editing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntry((prev) => ({ ...prev, [name]: value }));
  };

  // Handle update submission
  const handleUpdate = async () => {
    try {
      const response = await adminQuaeyIdupdateAPI(id, entry); // assuming POST or PUT with payload
      console.log(response);

      if (response.status === 200) {
        alert('Entry updated successfully!');
        setIsEditing(false);
      } else {
        alert('Failed to update entry.');
      }
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  };

  return (
    <div className="admin-view-single-container">
      <h2>Lease Entry Details</h2>
      {loading ? (
        <p>Loading entry...</p>
      ) : entry ? (
        <div className="entry-details">
          {Object.entries(entry).map(([key, value]) => {
            if (key === '_id' || key === '__v') return null;
            return (
              <div key={key}>
                <strong>{key.replace(/([A-Z])/g, ' $1')}: </strong>
                {isEditing ? (
                  <input
                    type="text"
                    name={key}
                    value={value}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{value}</span>
                )}
              </div>
            );
          })}
          <div className="buttons">
            {isEditing ? (
              <>
                <button onClick={handleUpdate}>Save</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)}>Edit</button>
            )}
          </div>
        </div>
      ) : (
        <p>No entry found.</p>
      )}
    </div>
  );
}

export default QueryAdminView;
