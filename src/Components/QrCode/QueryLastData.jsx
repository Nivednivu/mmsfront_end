import React, { useEffect, useState } from 'react';
import { getLastSerialNumberAPI } from '../../Server/allAPI';

function QueryLastData() {
  const [latestQuery, setLatestQuery] = useState(null);
  const [serialno, setSerialNo] = useState('');

  useEffect(() => {
    const fetchLatestQuery = async () => {
      try {
        const response = await getLastSerialNumberAPI();
        if (response.data.success) {
          const data = response.data.data;
          setLatestQuery(data);

          // Convert SerialNo to number and increment by 1
          const nextSerialNo = parseInt(data.SerialNo, 10) + 1;
          setSerialNo(nextSerialNo);

          console.log("Next Serial No:", nextSerialNo);
        } else {
          console.error('No data:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching latest query:', error);
      }
    };

    fetchLatestQuery();
  }, []);

  return (
    <div>
      <h2>Latest Query Data</h2>
      {latestQuery ? (
        <div>
          <p><strong>Serial No:</strong> {serialno}</p>
          <p><strong>hsnCode:</strong> {latestQuery.hsnCode}</p>
          <p><strong>lesseeId:</strong> {latestQuery.lesseeId}</p>
          <p><strong>minecode:</strong> {latestQuery.minecode}</p>
          <p><strong>lesseeName:</strong> {latestQuery.lesseeName}</p>
          <p><strong>Created At:</strong> {new Date(latestQuery.createdAt).toLocaleString()}</p>
          {/* Add more fields if needed */}
        </div>
      ) : (
        <p>Loading latest data...</p>
      )}
    </div>
  );
}

export default QueryLastData;
