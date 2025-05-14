import React, { useState, useEffect } from 'react';
// import { queryGetAPI } from '../Server/allAPI';  // Assuming queryGetAPI is defined correctly
import { useNavigate } from 'react-router-dom';
import { queryGetAPI } from '../Server/allAPI';

function QueryList() {
  const [queries, setQueries] = useState([]);
  const navigate = useNavigate();

  // Fetch query data when the component mounts
  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const response = await queryGetAPI();  // Call API to get query data
        if (response.status === 200) {
          setQueries(response.data);  // Assuming response.data contains the array of queries
        }
      } catch (error) {
        console.error('Error fetching queries:', error);
      }
    };

    fetchQueries();
  }, []);

  // Function to handle viewing the query details
  const handleView = (id) => {
    navigate(`/queryview/${id}`);  // Navigate to the View Query page
  };

  // Function to handle editing the query
  const handleEdit = (id) => {
    navigate(`/queryedit/${id}`);  // Navigate to the Edit Query page
  };

  // Function to handle adding a new query
  const handleAdd = () => {
    navigate('/queryadd');  // Navigate to the Add Query page
  };

  return (
    <div>
      <h2>Query List</h2>
      <button onClick={handleAdd}>Add New Query</button>
      
      {/* Table to display queries */}
      <table>
        <thead>
          <tr>
            <th>Query Details</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {queries.map(query => (
            <tr key={query._id}>  {/* Assuming _id is the unique identifier */}
              <td>{query.lesseeNameAddress}</td>  {/* Adjust based on the data you want to show */}
              <td>
                <button onClick={() => handleView(query._id)}>View</button>
                <button onClick={() => handleEdit(query._id)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default QueryList;
