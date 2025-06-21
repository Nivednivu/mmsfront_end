import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import './UserView.css';
import {
  adminQuaeyIdupdateAPI,
  adminAddQuaeyByIdAPI,
  queryDataAPI,
  
} from '../../Server/allAPI';
import { useLocation, useNavigate } from 'react-router-dom';
// adminAddQuaeyByIdAPI
// updateAdminData
function UserView() {
const navigate = useNavigate()
    const location = useLocation();
    const { userData } = location.state || {};
  const userId = userData?.data._id
console.log(userId);

  const [queryData, setQueryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const printRef = useRef();

  

  useEffect(() => {
    // Only fetch if we have a valid ID
    if (!userId) {
      console.error('No user ID available');
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Pass the ID directly to the API function
        const response = await adminAddQuaeyByIdAPI(userId);
        
        if (!response?.data) {
          throw new Error('No data received from server');
        }

        const data = response.data.data || response.data;
        if (!data) throw new Error('Empty response data');


        const formattedDate = data.travellingDate 
        ? (() => {
            const date = new Date(data.travellingDate);
            const pad = num => num.toString().padStart(2, '0');
            const randomSeconds = pad(Math.floor(Math.random() * 61)); // 00-60
            const hours = date.getHours();
            const twelveHour = hours % 12 || 12; // Convert to 12-hour format (1-12)
            
            return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()} ` +
                  ` ${pad(twelveHour)}:${pad(date.getMinutes())}:${randomSeconds}`;
          })()
        : "-";

      const completeData = {
        ...data,
        time: new Date().toLocaleString(),
        formattedTravellingDate: formattedDate
      };

      setQueryData(completeData);

      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, navigate]); // Add userId to dependencies

  // ... rest of your component

const handleAfterPrint = async () => {
  try {
    if (!queryData) {
      console.error("No query data available");
      return;
    }

    // First get the latest admin data to ensure we have the correct ID
    const lastAdminResponse = await adminAddQuaeyByIdAPI(userId);
    if (!lastAdminResponse.data) {
      throw new Error("Failed to fetch last admin data");
    }

    const lastAdmin = lastAdminResponse.data;
    console.log(lastAdmin?._id,"lastadmin id");
    
    if (!lastAdmin?._id) {
      throw new Error("No valid admin ID found");
    }

    const currentSerial = parseInt(queryData?.SerialNo || 0, 10);
    const currentDispatch = parseInt(queryData?.dispatchNo || 0, 10);

    const updatedData = {
      ...queryData,
      SerialNo: currentSerial.toString(),
      dispatchNo: currentDispatch.toString(),
      time: new Date().toLocaleString(),
      _id: lastAdmin._id // Use the fetched admin ID
    };
// updateAdminData
    const response = await adminQuaeyIdupdateAPI(userId, updatedData);
    
    // Check for successful update (200-299 status code or your API's success indicator)
    if (response.status >= 200 && response.status < 300) {
      console.log("Serial number updated in admin DB:", response.data);
      setQueryData(updatedData);
    } else {
      throw new Error(response.data?.message || "Update failed with unknown error");
    }
  } catch (err) {
    console.error('Failed to update serial number:', err);
    setError(`Update failed: ${err.message}`);
  }
};



const handlePrint = async () => {
  try {
    // First ensure we have data to print
    if (!printRef.current || !queryData) {
      setError('No data available to print');
      return;
    }
try {
      const response = await queryDataAPI(queryData);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to save query data');
      }
      console.log('Data saved to query API:', response.data);
    } catch (apiError) {
      console.error('Error saving to query API:', apiError);
      // You might choose to continue with printing even if API fails
      // or handle it differently based on your requirements
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
 font-family: "DotGothic16";
  font-weight: 550;
  font-style: italic;
  transform: skewX(-5deg);
  font-size:4px
  letter-spacing:50px;
  gap:12px;
  color: #b8b3b3;
}
            .query-table {
              width: 635px;
              border-collapse: collapse;
              font-size: 8px;
              border:0.5px solid black;
              margin:right:20px
             
               
               justtify-content:center;
            }
            .query-table td {
              border: 1.5px solid black;
              padding: 4px; /* Reduced padding */
              line-height: 1.2;
              font-weight:500;
              
              font-size:9px;
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
    <div className="fontc table-wrapper" style={isDuplicate ? { marginTop: '-30px' } : {}}>

      <div className='img' style={{display:'flex', marginTop:'60px',marginLeft:'452px'}} >
        <div className='generatediv'>
<h4 style={{marginLeft:'25px',marginTop:'15px',fontSize:'14px', fontWeight:'600',letterSpacing:'1px'}} className="generate-number" >{`TN00${data.SerialNo}`}</h4>
        </div>
        {data.dispatchNo && (
          <div style={{marginLeft:'18px',fontWeight:'500'}} >
            <QRCodeSVG 
value={`DISP${data.dispatchNo}`}  size={55}
  level="H"

/>

          </div>
        )}
      </div>
      <div style={{display:'flex',gap:'355px'}} className="header-info">
        <p className="font-semibold" style={{ marginLeft: '-0px' }}>HSN Code: {data.hsnCode || "-"}</p>
  <p style={{ marginLeft: '-27px' }}>
  Date & Time of Dispatch: {queryData.formattedTravellingDate || "-"}
</p>


      </div>
      <div className='text'>
      <table style={{marginTop:'-3px'}} className="query-table">
        <tbody className="table-body">
          <tr>
            <td style={{width:'130px'}}>Lessee Id : {data.lesseeId}</td>
            <td style={{width:'130px'}}>Minecode : {data.minecode}</td>
            <td style={{width:'130px'}}>Lease Area Details </td>
            <td style={{width:'130px'}}>Serial No: <span className='serial' style={{letterSpacing:'0px',fontSize:'9px'}}>{`TN00${data.SerialNo}`}</span></td>
          </tr>
          <tr>
            <td>Lessee Name and Address :</td>
            <td>{data.lesseeName}</td>
            <td>District Name :</td>
            <td>{data.districtName}</td>
          </tr>
          <tr>
            <td style={{ textAlign: 'left', verticalAlign: 'top',maxWidth:'35px'}} colSpan="2" rowSpan="3">{data.lesseeNameAddress}</td>
            <td>Taluk Name :</td>
            <td>{data.Taluk}</td>
          </tr>
          <tr>
            <td>Village</td>
            <td>{data.village}</td>
          </tr>
          <tr>
            <td>SF.No / Extent :</td>
            <td>{data.sfNoExtent}</td>
          </tr>
          <tr>
            <td>Mineral Name : {data.mineralName}</td>
            <td>Bulk Permit No : {data.bulkPermitNo}</td>
            <td>Classification : </td>
            <td>{data.classification}</td>
          </tr>
          <tr>
            <td colSpan="2">Order Ref: {data.orderRef}</td>
            <td>Lease Period :</td>
            <td>{data.leasePeriod}</td>
          </tr>
          <tr>
            <td>Dispatch Slip No :</td>
            <td>{`DISP${data.dispatchNo}`}</td>
            <td>Within Tamil Nadu</td>
            <td>{data.withinTamilNadu}</td>
          </tr>
          <tr>
            <td>Delivered To :</td>
            <td colSpan="3">{data.deliveredTo}</td>
          </tr>
          <tr>
            <td>Vehicle No :</td>
            <td>{data.vehicleNo}</td>
            <td colSpan="2">Destination Address :</td>
          </tr>
          <tr>
            <td>Vehicle Type :</td>
            <td>{data.vehicleType}</td>
            <td  style={{ textAlign: 'left', verticalAlign: 'top'}}  colSpan="2" rowSpan="4">{data.destinationAddress}</td>
          </tr>
          <tr>
            <td>Total Distance (in Kms) :</td>
            <td>{data.totalDistance}</td>
          </tr>
         <tr>
  <td>Travelling Date :</td>
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
  <td>Required Time :</td>
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

      return` ${diffHours} hrs (${formatted})`;
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
            <td>Driver Phone No :</td>
            <td>{data.driverPhoneNo}</td>
            <td>Lessee / Authorized Person Name :</td>
            <td>{data.lesseeName}</td>
          </tr>
          <tr>
            <td style={{ textAlign: 'left', verticalAlign: 'top'}} >Driver Signature :</td>
            <td>
             
            </td>
            <td style={{ textAlign: 'left', verticalAlign: 'top'}}>Signature of AD / DD :</td>
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
        
         
      
      
      </div>

      {/* Image preview */}
      {imageUrl && (
        <div className="image-preview no-print">
          <h3></h3>
          <img src={imageUrl} alt="Converted document" style={{ maxWidth: '100%' }} />
          <a href={imageUrl} download="document.png" className="download-link">
            
          </a>
        </div>
      )}
    </div>
  );
}

export default UserView
