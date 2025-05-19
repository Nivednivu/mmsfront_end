import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import './UserView.css';

function UserView() {
  const [queryData, setQueryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const printRef = useRef();

const START_DISP = 1000;
const END_DISP = 1999;
const START_TN = 547350;
const END_TN = 547440;
const START_SERIAL = 1; // Add a starting value for the serial number
const START_BULK = 1; // Add a starting value for the serial number

const [generateNo, setGenerateNo] = useState('');
const [generateDispatchNo, setGenerateDispatchNo] = useState('');
const [currentSerial, setCurrentSerial] = useState('');
const [lastBulkNumber,setLastBulkNumber] = useState('')

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
  const storedDisp = parseInt(localStorage.getItem('dispNumber') || START_DISP);
  const storedTn = parseInt(localStorage.getItem('tnNumber') || START_TN);
  const storedSerial = parseInt(localStorage.getItem('lastTnNumber') || START_SERIAL);
  const lastBulkNumber = parseInt(localStorage.getItem('lastBulkNumber') || START_BULK);
  
  updateGeneratedNumbers(storedDisp, storedTn, storedSerial,lastBulkNumber);
}, []);

const generateSerialNumber = () => {
  const currentDisp = parseInt(localStorage.getItem('dispNumber') || START_DISP);
  const currentTn = parseInt(localStorage.getItem('tnNumber') || START_TN);
  const lastNumber = parseInt(localStorage.getItem('lastTnNumber') || START_SERIAL);
  const lastBulkNumber = parseInt(localStorage.getItem('lastBulkNumber') || START_BULK);

  const nextDisp = currentDisp >= END_DISP ? START_DISP : currentDisp + 1;
  const nextTn = currentTn >= END_TN ? START_TN : currentTn + 1;
  const nextNumber = lastNumber + 1;
  const nextBulkNumber = lastBulkNumber + 1;

  updateGeneratedNumbers(nextDisp, nextTn, nextNumber,nextBulkNumber);
};

const updateGeneratedNumbers = (disp, tn, nextNum,Bulk) => {
  const newDispatchNo = `DISP36${disp}`;
  const newGenerateNo = `TN00${tn}`;
  const newSerialNo =`TN00${nextNum}`;
  const newBulkNum = `${Bulk}`;

  localStorage.setItem('dispNumber', disp.toString());
  localStorage.setItem('tnNumber', tn.toString());
  localStorage.setItem('lastTnNumber', nextNum.toString());
  localStorage.setItem('lastBulkNumber', Bulk.toString());

  setGenerateDispatchNo(newDispatchNo);
  setGenerateNo(newGenerateNo);
  setCurrentSerial(newSerialNo);
  setLastBulkNumber(newBulkNum);
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
               gap:30px;
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
              width: 650px;
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
    <div className="fontc table-wrapper" style={isDuplicate ? { marginTop: '-25px' } : {}}>
     
      <div className='img' style={{display:'flex', marginTop:'70px',marginLeft:'452px'}} >
        <div className='generatediv'>
        <h4 style={{marginLeft:'47px',marginTop:'5px',fontSize:'14px', fontWeight:'600',letterSpacing:'1px'}} className="generate-number" >{currentSerial}</h4>

        </div>
        {currentSerial && (
          <div style={{marginLeft:'20px',fontWeight:'500'}} >
            <QRCodeSVG 
  value={generateDispatchNo  }
  size={55}
  level="H"

/>

          </div>
        )}
      </div>
      <div style={{display:'flex',gap:'385px'}} className="header-info">
        <p className="font-semibold" style={{ marginLeft: '0px' }}>HSN Code: {data.hsnCode || "-"}</p>
    <p style={{ marginLeft: '-17px' }}>
  Date & Time of Dispatch: {data.travellingDate ? 
    new Date(data.travellingDate).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).replace(/\//g, '-')
    .replace(',', '')
    .replace(/\s?[AP]M$/i, '')
    : "-"}
    
</p>



      </div>
      <div className='text'>
      <table className="query-table">
        <tbody className="table-body">
          <tr>
            <td>Lessee Id: {data.lesseeId}</td>
            <td>Minecode: {data.minecode}</td>
            <td>Lease Area Details</td>
            <td >Serial No: <span className='serial' style={{letterSpacing:'1px',fontSize:'8px'}} >{currentSerial}</span></td>
          </tr>
          <tr>
            <td >Lessee Name and Address:</td>
            <td>{data.lesseeName}</td>
            <td>District Name:</td>
            <td>{data.districtName}</td>
          </tr>
          <tr>
            <td style={{ textAlign: 'left', verticalAlign: 'top',maxWidth:'65px'}} colSpan="2" rowSpan="3">{data.lesseeNameAddress}</td>
            <td>Taluk Name</td>
            <td>{data.Taluk}</td>
          </tr>
          <tr>
            <td>Village</td>
            <td>{data.village}</td>
          </tr>
          <tr>
            <td>SF.NoExtent:</td>
            <td>{data.sfNoExtent}</td>
          </tr>
          <tr>
            <td>Mineral Name: {data.mineralName}</td>
            <td>Bulk Permit No: {lastBulkNumber}</td>
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
            <td>{generateDispatchNo} </td>
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
    </div>
  );
}

export default UserView;