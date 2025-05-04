import React, { useState } from 'react';
import './DispatchList.css';

const DispatchList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="dispatch-container">
      <h3>Dispatch Slip</h3>
      <div className="dispatch-controls">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="button-group">
          <button className="btn btn-add">Add</button>
          <button className="btn btn-refresh">Refresh</button>
        </div>
      </div>

      <table className="dispatch-table">
        <thead>
          <tr>
            <th>Permit Number</th>
            <th>Dispatch Number</th>
            <th>Minecode</th>
            <th>Security Paper Number</th>
            <th>Mineral</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <button>Edit</button>
              <button onClick={() => window.print()}>Print</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DispatchList;
