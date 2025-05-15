import React, { useEffect, useState } from 'react';

function UserList() {
  const [dispatchData, setDispatchData] = useState([]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('dispatchData')) || [];
    setDispatchData(storedData);
  }, []);
console.log(dispatchData);

  return (
    <div>
      <h2>Dispatch List</h2>
      {dispatchData.length === 0 ? (
        <p>No dispatch records found.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Delivered To</th>
              <th>Vehicle No</th>
              <th>Vehicle Type</th>
              <th>Total Distance</th>
              <th>Traveling Date</th>
              <th>Required Time</th>
              <th>Quantity</th>
              <th>Driver Name</th>
              <th>Driver Phone</th>
              <th>License No</th>
              <th>Address</th>
              <th>Signature</th>
              <th>Via</th>
            </tr>
          </thead>
          <tbody>
            {dispatchData.map((item, index) => (
              <tr key={index}>
                <td>{item.deliveredTo}</td>
                <td>{item.vehicleNo}</td>
                <td>{item.vehicleType}</td>
                <td>{item.totalDistance}</td>
                <td>{item.travellingDate}</td>
                <td>{item.requiredTime}</td>
                <td>{item.quantity}</td>
                <td>{item.driverName}</td>
                <td>{item.driverPhoneNo}</td>
                <td>{item.driverLicenseNo}</td>
                <td>{item.destinationAddress}</td>
                <td>{item.driverSignature}</td>
                <td>{item.via}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserList;
