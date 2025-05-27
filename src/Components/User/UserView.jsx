import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import './UserView.css';
import {
  adminAddQuaeyLastAPI,
  getLastEmployeeAPI,
  queryDataAPI,
  getLastSerialNumberAPI
} from '../../Server/allAPI';

function UserView() {
  const [queryData, setQueryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const printRef = useRef();

const [serialno, setSerialNo] = useState(null);
  const [manualSerialNo,setManualSerialNo] =useState()
  const [currentSerial, setCurrentSerial] = useState('');
  const [latestQuery, setLatestQuery] = useState(null);


   useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [leaseResponse, dispatchResponse] = await Promise.all([
          adminAddQuaeyLastAPI(),
          getLastEmployeeAPI(),
        ]);

        const leaseData = leaseResponse.data?.data || leaseResponse.data;
        const dispatchData = dispatchResponse.data;
        console.log(leaseData.SerialNo);
        
        setManualSerialNo(leaseData.SerialNo)
    
        if (!leaseData || !dispatchData) throw new Error('Missing required data');

        const combinedData = {
          ...leaseData,
          ...dispatchData,
          SerialNo: manualSerialNo || serialno,
          time: new Date().toLocaleString(),
        };

        setQueryData(combinedData);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

    useEffect(() => {
    const fetchLatestQuery = async () => {
      try {
        const response = await getLastSerialNumberAPI();
        if (response.data.success) {
          const data = response.data.data;
          setLatestQuery(data);

          const nextSerialNo = parseInt(data.SerialNo, 10) + 1;
          setSerialNo(nextSerialNo); // set it as state
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

      

// const finalSerialNo = manualSerialNo || serialno;

const handleAfterPrint = async () => {
  try {
    const current = parseInt(manualSerialNo || serialno || 0, 10);
    const updatedSerial = current + 1;

    const newEntry = {
      ...queryData,
      SerialNo: current,
      time: new Date().toLocaleString()
    };

    // Send current serial to DB
    await queryDataAPI(newEntry);
    console.log("Data sent to backend:", newEntry);

    // Now prepare for next serial
    setSerialNo(updatedSerial);
    setManualSerialNo('');
    setCurrentSerial(current);
  } catch (err) {
    console.error('Failed to update after print:', err);
  }
};


  const convertToImage = async () => {
    if (printRef.current) {
      try {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const dataUrl = await toPng(printRef.current, {
          quality: 1,
          pixelRatio: 2,
          backgroundColor: '#ffffff'
        });
        setImageUrl(dataUrl);
      } catch (error) {
        console.error('Error converting to image:', error);
        setError('Failed to convert to image');
      }
    }
  };


const handlePrint = async () => {
  try {
    // First ensure we have data to print
    if (!printRef.current || !queryData) {
      setError('No data available to print');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setError('Please allow popups for printing');
      return;
    }

    printWindow.document.write(`
      <html>
<head>
          <title>Print Document</title>
          <link href="https://fonts.googleapis.com/css2?family=DotGothic16&display=swap" rel="stylesheet">
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">

          <style>
            @page { 
              size: A4; 
              margin: 4mm; /* Reduced margin for more space */
              margin-left:70px
               
            }
              body{
               font-family: "Roboto", sans-serif;
  font-optical-sizing: auto;
  font-weight: <weight>;
  font-style: normal;
  font-variation-settings:
 
    "wdth" 100;
   }
             
              body, h5, p {
              font-weight:bold;
             font-sty
              margin-Top:20px;
             padding:3;
             
}
              
            }

            .print-table-container {
              height: auto !important;
              page-break-inside: avoid;
            }
              .generate-number{
               color: rgb(87, 84, 84);
               gap:20px;
               font-size:18px;
               
            }
              .generate-number {
               color: rgb(87, 84, 84);
  font-weight: 350;
  font-style: normal;
  font-size:18px;
              }
  .serial{
 font-family: "DotGothic16", sans-serif;
  font-weight: 750;
  font-style: italic;
  transform: skewX(-5deg);
  font-size:4px
  letter-spacing:50px;
  gap:12px;
}
            .query-table {
              width: 623px;
              border-collapse: collapse;
              font-size: 8px;
              border:0.5px solid black;
              margin:right:20px
              
               
               justtify-content:center;
            }
            .query-table td {
              border: 1.5px solid black;
              padding: 3.2px; /* Reduced padding */
              line-height: 1.2;
              font-weight:500;
              
              font-size:10px;
              color:black;
            }
              .query-table input[type="text"] {
              
    font-size: 9px;
    color: green;
    font-weight: bolder;
    line-height: 1.2;
    padding: 4px; /* Optional: to match your td padding */
    border: 0.5px solid black; /* Optional: to match the table cell border */
}
            .header-info p {
              margin: 2px 0;
              font-size: 10px;
              font-weight:normal;
               font-weight:500;
            }
          
  
          </style>
        </head>        <body>
          <div class="print-table-container">
  ${printRef.current.innerHTML.replace(
            /SerialNo:.*?(<span[^>]*>)(.*?)(<\/span>)/,
            `SerialNo: $1${currentSerial}$3`
          )}
                    </div>
          <script>
            window.onload = function() {
              setTimeout(() => {
                window.print();
                // Only after printing is done, notify parent window
                window.opener.postMessage('printCompleted', '*');
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();

    // Listen for print completion message
    window.addEventListener('message', (e) => {
      if (e.data === 'printCompleted') {
        // Only now increment the serial number
        handleAfterPrint();
      }
    });

  } catch (err) {
    console.error('Print error:', err);
    setError('Failed to print document');
  }
};



  const renderTable = (data, isDuplicate = false) => (
    <div className="fontc table-wrapper">

      <div className='img' style={{display:'flex', marginTop:'50px',marginLeft:'452px'}} >
        <div className='generatediv'>
        <h4 style={{marginLeft:'10px',marginTop:'0px'}} className="generate-number" > {serialno}</h4>

        </div>
        {serialno && (
          <div style={{marginLeft:'23px'}} >
            <QRCodeSVG 
  value={serialno }
  size={55}
  level="H"

/>

          </div>
        )}
      </div>
      <div style={{display:'flex',gap:'385px'}} className="header-info">
        <p className="font-semibold" style={{ marginLeft: '-27px' }}>HSN Code: {data.hsnCode || "-"}</p>
      <p style={{ marginLeft: '0px' }}>
  Date & Time of Dispatch: {(data.time && data.time
    .replace(/\//g, '-')         
    .replace(',', '')            
    .replace(/ ?[AP]M/i, '')     
    .trim()) || "-"}
</p>

      </div>
      <div className='text'>
      <table className="query-table">
        <tbody className="table-body">
          <tr>
            <td>Lessee Id: {data.lesseeId}</td>
            <td>Minecode: {data.minecode}</td>
            <td>Lease Area Details:</td>
            <td >Serial No:{data.SerialNo}{serialno}</td>
          </tr>
          <tr>
            <td>Lessee Name and Address:</td>
            <td>{data.lesseeName}</td>
            <td>District Name:</td>
            <td>{data.districtName}</td>
          </tr>
          <tr>
            <td style={{ textAlign: 'left', verticalAlign: 'top'}} colSpan="2" rowSpan="3">{data.lesseeNameAddress}</td>
            <td>Taluk Name</td>
            <td>{data.Taluk}</td>
          </tr>
          <tr>
            <td>Village</td>
            <td>{data.village}</td>
          </tr>
          <tr>
            <td>SF.NoExtent</td>
            <td>{data.sfNoExtent}</td>
          </tr>
          <tr>
            <td>Mineral Name: {data.mineralName}</td>
            <td>Bulk Permit No: {data.bulkPermitNo}</td>
            <td>Classification</td>
            <td>{data.classification}</td>
          </tr>
          <tr>
            <td colSpan="2">Order Ref: {data.orderRef}</td>
            <td>Lease Period:</td>
            <td>{data.leasePeriod}</td>
          </tr>
          <tr>
            <td>Dispatch Slip No:</td>
            <td>{data.dispatchNo}  </td>
            <td>Within Tamil Nadu</td>
            <td>{data.withinTamilNadu}</td>
          </tr>
          <tr>
            <td>Delivered To:</td>
            <td colSpan="3">{data.deliveredTo}</td>
          </tr>
          <tr>
            <td>Vehicle No:</td>
            <td>{data.vehicleNo}</td>
            <td colSpan="2">Destination Address:</td>
          </tr>
          <tr>
            <td>Vehicle Type:</td>
            <td>{data.vehicleType}</td>
            <td  style={{ textAlign: 'left', verticalAlign: 'top'}}  colSpan="2" rowSpan="4">{data.destinationAddress}</td>
          </tr>
          <tr>
            <td>Total Distance (in Kms):</td>
            <td>{data.totalDistance}</td>
          </tr>
         <tr>
  <td>Travelling Date:</td>
  <td>
    {data.travellingDate
      ? new Date(data.travellingDate).toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
        .replace(/\//g, '-')
        .replace(',', '')    
      : '-'}
  </td>
</tr>
<tr>
  <td>Required Time:</td>
  <td>
    {data.travellingDate && data.requiredTime ? (() => {
      const start = new Date(data.travellingDate);
      const end = new Date(data.requiredTime);
      const diffMs = end - start;
      const diffHours = Math.round(diffMs / (1000 * 60 * 60)); // rounded hours

      const formatted = end
        .toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
        .replace(/\//g, '-')
        .replace(',', '');

      return `${diffHours} hrs (${formatted})`;
    })() : '-'}
  </td>
</tr>

          <tr>
            <td>Quantity (in MT):</td>
            <td>{data.quantity}</td>
            <td>Driver Name:</td>
            <td>{data.driverName}</td>
          </tr>
          <tr>
            <td>Driver License No:</td>
            <td>{data.driverLicenseNo}</td>
            <td>Via</td>
            <td>{data.via}</td>
          </tr>
          <tr>
            <td>Driver Phone No:</td>
            <td>{data.driverPhoneNo}</td>
            <td>Lessee / Authorized Person Name:</td>
            <td>{data.authorizedPersonName}</td>
          </tr>
          <tr>
            <td>Driver Signature:</td>
            <td>
             
            </td>
            <td>Signature of AD / DD:</td>
            <td>
              {data.signature ? 
                <img src={data.signature} alt="AD Signature" style={{ maxHeight: '30px' }} /> : 
                'N/A'}
            </td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  );

  if (loading) return <div className="container"><p className="loading">Loading data...</p></div>;
  if (error || !queryData) return <div className="container"><p className="error-message">{error || 'No data available'}</p></div>;

  return (
    <div className="container">
      {/* Printable content (hidden) - contains both tables */}
      <div style={{ position: 'absolute', left: '-9999px' }}>
        <div ref={printRef}>
          {renderTable(queryData)}
          {renderTable(queryData, true)}
        </div>
      </div>

      {/* Visible content */}
      <div className="section">
        {renderTable(queryData)}
        {renderTable(queryData, true)}
      </div>

      {/* Action buttons */}
      <div className="print-button-container no-print">
        <button className="print-button" onClick={handlePrint}>
          🖨 Print
        </button>
        <button className="image-button" onClick={convertToImage}>
          Convert to Image
        </button>
        <button className="reset-button" onClick={() => localStorage.setItem('printSerialNumber', '0')}>
          🔄 Reset Serial Number
        </button>
      </div>

      {/* Image preview */}
      {imageUrl && (
        <div className="image-preview no-print">
          <h3>Image Preview:</h3>
          <img src={imageUrl} alt="Converted document" style={{ maxWidth: '100%' }} />
          <a href={imageUrl} download="document.png" className="download-link">
            Download Image
          </a>
        </div>
      )}
    </div>
  );
}

export default UserView