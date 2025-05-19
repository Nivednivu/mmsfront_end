import React, { useState, useEffect, useRef } from 'react';
import { toPng } from 'html-to-image';

function QRCodeGenerator() {
  const [queryData, setQueryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const printRef = useRef();

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
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

        setQueryData({
          ...validLease[validLease.length - 1],
          ...dispatchData,
          time: new Date().toLocaleString(),
        });
      } catch (err) {
        console.error('Data loading error:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Convert table to image
  const convertToImage = async () => {
    if (printRef.current) {
      try {
        const dataUrl = await toPng(printRef.current, {
          quality: 1,
          pixelRatio: 2,
          backgroundColor: '#ffffff'
        });
        setImageUrl(dataUrl);
      } catch (error) {
        console.error('Error converting to image:', error);
        setError('Failed to convert table to image');
      }
    }
  };

  // Native print function
  const handlePrint = () => {
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
          <title>Print Table</title>
          <style>
            body { font-family: Arial; margin: 0; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            td { border: 1px solid #ddd; padding: 8px; vertical-align: top; }
            img { max-width: 100px; height: auto; }
            @page { size: A4; margin: 15mm; }
          </style>
        </head>
        <body>
          ${printRef.current.innerHTML}
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

  // Function to render the table (reusable)
  const renderTable = (data) => {
    return (
      <table className="query-table">
        <tbody className="table-body">
          <tr>
            <td>LesseeId: {data.lesseeId}</td>
            <td>MineCode: {data.minecode}</td>
            <td>Lease Area Details: {data.lesseeAreaDetails}</td>
            <td>Serial No: {data.serialNo}</td>
          </tr>
          <tr>
            <td>Lessee Name and Address:</td>
            <td>{data.lesseeNameAddress}</td>
            <td>District Name:</td>
            <td>{data.districtName}</td>
          </tr>
          <tr>
            <td colSpan="2" rowSpan="3">{data.lesseeNameAddress}</td>
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
            <td>Dispatch Ship No:</td>
            <td>{data.dispatchSlipNo}</td>
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
            <td colSpan="2" rowSpan="4">{data.destinationAddress}</td>
          </tr>
          <tr>
            <td>Total Distance (in Kms):</td>
            <td>{data.totalDistance}</td>
          </tr>
          <tr>
            <td>Travelling Date:</td>
            <td>{data.travellingDate}</td>
          </tr>
          <tr>
            <td>Required Time:</td>
            <td>{data.requiredTime}</td>
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
            <td>Authorized Person Name:</td>
            <td>{data.authorizedPersonName}</td>
          </tr>
          <tr>
            <td>Driver Signature:</td>
            <td>
              {data.driverSignature ? 
                <img src={data.driverSignature} alt="Driver Signature" style={{ maxHeight: '30px' }} /> : 
                'N/A'}
            </td>
            <td>Signature of AD / DD:</td>
            <td>
              {data.image ? 
                <img src={data.image} alt="AD Signature" style={{ maxHeight: '30px' }} /> : 
                'N/A'}
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  if (loading) return <div className="loading-message">Loading data...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!queryData) return <div className="no-data-message">No data available</div>;

  return (
    <div className="qr-generator-container">
      {/* Printable content (hidden) */}
      <div style={{ position: 'absolute', left: '-9999px' }}>
        <div ref={printRef} className="printable-content">
          {renderTable(queryData)}
        </div>
      </div>

      {/* Visible content */}
      <div className="section">
        {renderTable(queryData)}
      </div>

      {/* Action buttons */}
      <div className="action-buttons">
        <button 
          onClick={handlePrint}
          className="print-button"
        >
          Print Table
        </button>
        <button 
          onClick={convertToImage}
          className="image-button"
        >
          Convert to Image
        </button>
      </div>

      {/* Display converted image */}
      {imageUrl && (
        <div className="image-preview">
          <h3>Image Preview:</h3>
          <img src={imageUrl} alt="Converted table" className="preview-image" />
          <a 
            href={imageUrl} 
            download="table-image.png"
            className="download-link"
          >
            Download Image
          </a>
        </div>
      )}
    </div>
  );
}

export default QRCodeGenerator;