import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import './UserView.css';

function UserView() {
  const [queryData, setQueryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generateNo, setGenerateNo] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const printRef = useRef();
  const [generateDispatchNo, setGenerateDispatchNo] = useState('');

  useEffect(() => {
    try {
      const leaseData = JSON.parse(localStorage.getItem('leaseEntries') || '[]');
      const dispatchData = JSON.parse(localStorage.getItem('viewDispatch') || '{}');

      const validLease = leaseData.filter(entry =>
        entry.hsnCode && entry.lesseeId && entry.minecode
      );

      if (validLease.length === 0 || !dispatchData.vehicleNo) {
        setError('Incomplete lease or dispatch data');
        return;
      }

      const combinedData = {
        ...validLease[validLease.length - 1],
        ...dispatchData,
        time: new Date().toLocaleString(),
      };

      setQueryData(combinedData);
    } catch (err) {
      console.error('Data loading error:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

useEffect(() => {
    const initializeSerial = () => {
      const storedSerial = localStorage.getItem('printSerialNumber');
      if (storedSerial) {
        const current = parseInt(storedSerial);
        updateGeneratedNumbers(current);
      }
    };
    initializeSerial();
  }, []);

  const generateSerialNumber = () => {
    const currentSerial = parseInt(localStorage.getItem('printSerialNumber') || 0)
    const nextSerial = currentSerial >= 999999 ? 1 : currentSerial + 1; // Reset after 999999
    updateGeneratedNumbers(nextSerial);
  };

  const updateGeneratedNumbers = (serial) => {
    // Format with leading zeros for 6-digit display
    const paddedSerial = serial.toString().padStart(6, '0');
    const newDispatchNo =` DISP${paddedSerial}`;
    const newGenerateNo =` TN00${paddedSerial}`;

    localStorage.setItem('printSerialNumber', serial.toString());
    setGenerateNo(newGenerateNo);
    setGenerateDispatchNo(newDispatchNo);
  };

  const convertToImage = async () => {
    if (printRef.current) {
      try {
        generateSerialNumber();
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
    generateSerialNumber();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (!printRef.current) {
      setError('Nothing to print');
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
              
            
              margin-Top:20px;
             padding:3;
}
              
            }

            .print-table-container {
              height: auto !important;
              page-break-inside: avoid;
            }
              .generate-number{
               color: rgb(0, 0, 0);
               gap:30px;
               font-size:18px;
               
            }
              .generate-number {
               font-family: "DotGothic16", sans-serif;
  font-weight: 350;
  font-style: normal;
  font-size:18px;
              }
//   .serial{
//  font-family: "DotGothic16", sans-serif;
//   font-weight: 350;
//   font-style: normal;
// }
            .query-table {
              width: 650px;
              border-collapse: collapse;
              font-size: 8px;
              border:0.5px solid black;
              margin:right:20px
               
               justtify-content:center;
            }
            .query-table td {
              border: 0.5px solid black;
              padding: 3.2px; /* Reduced padding */
              line-height: 1.2;
              
              font-size:10px;
              color:black;
            }
              .query-table input[type="text"] {
    font-size: 9px;
    color: green;
    font-weight: bold;
    line-height: 1.2;
    padding: 4px; /* Optional: to match your td padding */
    border: 0.5px solid black; /* Optional: to match the table cell border */
}
            .header-info p {
              margin: 2px 0;
              font-size: 11px;
            }
          
  
          </style>
        </head>
        <body>
          <div class="print-table-container">
            ${printRef.current.innerHTML}
          </div>
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 200);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const renderTable = (data, isDuplicate = false) => (
    <div className="fontc table-wrapper">

      <div className='img' style={{display:'flex', marginTop:'50px',marginLeft:'452px'}} >
        <div className='generatediv'>
        <h5 style={{marginLeft:'10px',marginTop:'0px'}} className="generate-number" >{generateNo}</h5>

        </div>
        {generateNo && (
          <div style={{marginLeft:'36px'}} >
            <QRCodeSVG 
  value={generateDispatchNo  }
  size={55}
  level="H"

/>

          </div>
        )}
      </div>
      <div style={{display:'flex',gap:'306px'}} className="header-info">
        <p className="font-semibold" style={{ marginLeft: '0px' }}>HSN Code: {data.hsnCode || "-"}</p>
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
            <td >Serial No:{data.SerialNo}</td>
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
            <td>{data.dispatchNo} {generateDispatchNo} </td>
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

export default UserView;