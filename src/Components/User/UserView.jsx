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
    const { previewData,userData,travellingDate,requiredTime,destinationAddress,deliveredTo,vehicleNo,vehicleType,totalDistance,quantity,driverName,driverPhoneNo,driverLicenseNo,driverSignature,via } = location.state || {};
 

 
  const userId = userData?.data._id;
  const serialNumber = previewData?.SerialNo || '';
  const dispatchNumber = previewData?.dispatchNo
  const [queryData, setQueryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const printRef = useRef();

  const [currentTime, setCurrentTime] = useState(new Date());

  // Function to generate random 2-digit number (00-59)
  const getRandomSeconds = () => {
    return Math.floor(Math.random() * 60).toString().padStart(2, '0');
  };

  // Modified format function with random seconds
  const formatDateTimeWithRandomSeconds = (date) => {
    if (!date) return '-';
    
    const formattedDate = date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
    .replace(/\//g, '-')
    .replace(',', '')
    .replace(/\s?[AP]M/i, '')
    .trim();

    // Insert random seconds
    return `${formattedDate}:${getRandomSeconds()}`;
  };

  // Live time updater effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      try {
        if (previewData) {
          // Use data passed from previous screen
          setQueryData(previewData);
        } else if (userId) {
          // Fetch data if not passed via location state
          const response = await adminAddQuaeyByIdAPI(userId);
          if (response.data) {
            setQueryData(response.data);
          } else {
            throw new Error("No data received from server");
          }
        } else {
          throw new Error("No user ID or preview data available");
        }
      } catch (err) {
        console.error('Data initialization error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [userId, previewData]);

  const refreshPage = () => {
    navigate(0); // Reload current page
  };

  const handleAfterPrint = async () => {
    try {
      if (!queryData) {
        throw new Error("No query data available");
      }

      const lastAdminResponse = await adminAddQuaeyByIdAPI(userId);
      if (!lastAdminResponse?.data) {
        throw new Error("Failed to fetch last admin data");
      }

      const lastAdmin = lastAdminResponse.data;
      if (!lastAdmin?._id) {
        throw new Error("No valid admin ID found");
      }

      const updatedData = {
        ...queryData,
        SerialNo: serialNumber,
        dispatchNo:dispatchNumber,
        time: new Date().toLocaleString(),
        _id: lastAdmin._id
      };

      const response = await adminQuaeyIdupdateAPI(userId, updatedData);
      
      if (response.status >= 200 && response.status < 300) {
        setQueryData(updatedData);
        refreshPage();
      } else {
        throw new Error(response.data?.message || "Update failed");
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
console.log("query data",queryData);

    // Combine queryData and dispatchData for saving
    const combinedData = {
      ...queryData,
      // Ensure these fields are properly formatted
      SerialNo:serialNumber,
      dispatchNo:dispatchNumber,
      time: new Date().toLocaleString()
    };

    // Save to query API before printing
    try {
      const response = await queryDataAPI(combinedData);
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to save query data');
      }
      console.log('Data saved to query API:', response.data);
      
      // Update local state with the saved data
      setQueryData(prev => ({
        ...prev,
        SerialNo:serialNumber,
        dispatchNo:dispatchNumber
      }));
    } catch (apiError) {
      console.error('Error saving to query API:', apiError);
      // You might want to show a warning but continue with printing
      setError(`Warning: Data not saved - ${apiError.message}`);
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
              margin: 5mm; /* Reduced margin for more space */
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
               color: rgba(48, 46, 46, 1);
  font-weight: 350;
  font-style: normal;
  font-size:15px;
              }
  .serial{
   font-family: "DotGothic16";
  font-weight: 650;
 font-style:normal;
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
              padding: 3.8px; /* Reduced padding */
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
    <div className="fontc table-wrapper" style={isDuplicate ? { marginTop: '-0px' } : {}}>

      <div className='img' style={{display:'flex', marginTop:'60px',marginLeft:'452px'}} >
        <div className='generatediv' style={{ width: '100px'}}>
<h4 style={{marginLeft:'25px',marginTop:'15px',fontSize:'14px', fontWeight:'600',letterSpacing:'0px'}} className="generate-number" >{`TN${serialNumber}`}</h4>
        </div>
        {dispatchNumber && (
          <div style={{marginLeft:'33px',fontWeight:'500'}} >
            <QRCodeSVG 
value={`TN${serialNumber},DISP${dispatchNumber},${queryData.minecode},${
 travellingDate
      ? new Date(travellingDate).toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
        .replace(/\//g, '-')
        .replace(',', '')    
      : '-'
},${totalDistance}Kms,${travellingDate && requiredTime ? (() => {
      const start = new Date(travellingDate);
      const end = new Date(requiredTime);
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

      return` ${diffHours} hrs`;
    })() : '-'} ,${data.mineralName}(${quantity}MT),${vehicleNo},${destinationAddress}`} size={49}
      level="H"
      fgColor='#000000'
    />
          </div>
        )}
      </div>
        <div style={{ 
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  marginLeft:'-2px'
}} className="header-info">
    <div style={{ minWidth: '150px', marginTop:'10px' }}>
    <p className="font-semibold" style={{fontSize: '9px', fontWeight: 400 }}>HSN Code: {data.hsnCode || "-"}</p>
  </div>
  <div style={{ minWidth: '250px', marginRight:'9px',  marginTop:'8px',fontSize:'9px'}}>
    <p>Date & Time of Dispatch:  <td>
{travellingDate
                ? formatDateTimeWithRandomSeconds(new Date(travellingDate))
                : '-'}  </td>

</p>
  </div>
</div> 

      <div className='text'>
      <table style={{marginTop:'-3px'}} className="query-table">
        <tbody className="table-body">
          <tr>
            <td style={{width:'130px'}}>Lessee Id : {data.lesseeId}</td>
            <td style={{width:'130px'}}>Minecode : {data.minecode}</td>
            <td style={{width:'130px'}}>Lease Area Details </td>
            <td style={{width:'130px'}}>Serial No: <span className='serial' style={{letterSpacing:'1px',fontSize:'9px'}}>{`TN${serialNumber}`}</span></td>
          </tr>
          <tr>
            <td>Lessee Name and Address :</td>
            <td>{data.lesseeName}</td>
            <td>District Name :</td>
            <td>{data.districtName}</td>
          </tr>
          <tr>
            <td style={{ textAlign: 'left', verticalAlign: 'top',maxWidth:'35px',whiteSpace: 'pre-line'}} colSpan="2" rowSpan="3">{data.lesseeNameAddress}</td>
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
            <td>{`DISP${dispatchNumber}`}</td>
            <td>Within Tamil Nadu</td>
            <td>{data.withinTamilNadu}</td>
          </tr>
          <tr>
            <td>Delivered To :</td>
            <td colSpan="3">{deliveredTo}</td>
          </tr>
          <tr>
            <td>Vehicle No :</td>
            <td>{vehicleNo}</td>
            <td colSpan="2">Destination Address :</td>
          </tr>
          <tr>
            <td>Vehicle Type :</td>
            <td>{vehicleType}</td>
            <td  style={{ textAlign: 'left', verticalAlign: 'top'}}  colSpan="2" rowSpan="4">{destinationAddress}</td>
          </tr>
          <tr>
            <td>Total Distance (in Kms) :</td>
            <td>{totalDistance}</td>
          </tr>
         <tr>
  <td>Travelling Date :</td>
  <td>
    {travellingDate
      ? new Date(travellingDate).toLocaleString('en-GB', {
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
    {travellingDate && requiredTime ? (() => {
      const start = new Date(travellingDate);
      const end = new Date(requiredTime);
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
            <td>{quantity}</td>
            <td>Driver Name:</td>
            <td>{driverName}</td>
          </tr>
          <tr>
            <td>Driver License No:</td>
            <td>{driverLicenseNo}</td>
            <td>Via</td>
            <td>{via}</td>
          </tr>
          <tr>
            <td>Driver Phone No :</td>
            <td>{driverPhoneNo}</td>
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
                <img src={data.signature} alt="AD Signature"  style={{ width: '140px', height: '25px', objectFit: 'contain' }} /> : 
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

    </div>
  );
}

export default UserView
