import React, { useEffect, useState } from 'react';

function UserView() {
  const [viewData, setViewData] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('viewDispatch'));
    setViewData(data);
  }, []);

  return (
    <div>
      <h2>Dispatch View Page</h2>
      {!viewData ? (
        <p>No data to display.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%' }}>
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
            <tr>
              <td>{viewData.deliveredTo}</td>
              <td>{viewData.vehicleNo}</td>
              <td>{viewData.vehicleType}</td>
              <td>{viewData.totalDistance}</td>
              <td>{viewData.travellingDate}</td>
              <td>{viewData.requiredTime}</td>
              <td>{viewData.quantity}</td>
              <td>{viewData.driverName}</td>
              <td>{viewData.driverPhoneNo}</td>
              <td>{viewData.driverLicenseNo}</td>
              <td>{viewData.destinationAddress}</td>
              <td>
                {viewData.driverSignature ? (
                  <img
                    src={viewData.driverSignature}
                    alt="Signature"
                    style={{ height: '50px' }}
                  />
                ) : (
                  'N/A'
                )}
              </td>
              <td>{viewData.via}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserView;
