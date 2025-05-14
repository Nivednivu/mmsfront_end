import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { querySingleGetAPI } from '../Server/allAPI';
import './QueryView.css';
import image from '../upload/img.png';

function QueryView() {
  const { id } = useParams();
  const [queryData, setQueryData] = useState(null);

  useEffect(() => {
    const fetchSingleQuery = async () => {
      try {
        const response = await querySingleGetAPI(id);
        if (response.status === 200) {
          setQueryData(response.data);
        } else {
          console.error("Failed to fetch query");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchSingleQuery();
  }, [id]);

  if (!queryData) {
    return <p className="loading">Loading query details...</p>;
  }
console.log(queryData);

  const renderTable = () => (
    <div className="fontc table-wrapper" style={{marginTop:'60px',height:'70%'}}>
      <div style={{marginBottom:'-60px'}}>
      <img className='fontc-img' style={{ width: "65px", height: "65px", marginLeft: '1005px' }} src={image} alt="Logo" />

      </div>
      <div className="pc " >
        <p className="font-semibold"style={{marginLeft:'74px'}}>HSN Code: {queryData.hsnCode || "-"}</p>
        <p className="font-semibold text-right" style={{marginRight:'-77px'}} >
          Date & Time of Dispatch: {"time"|| "-"}
        </p>
      </div>

      <table className="query-table" >
        <tbody>
          <tr>
            <td>LesseeId: {queryData.hsnCode}</td>
            <td>MineCode: {queryData.minecode}</td>
            <td>Lease Area Details: {queryData.minecode}</td>
            <td>Serial No: {queryData.serialNo}</td>
          </tr>
          <tr>
            <td>Lessee Name and Address:</td>
            <td>{queryData.lesseeNameAddress}</td>
            <td>District Name:</td>
            <td>{queryData.districtName}</td>
          </tr>
          <tr>
            <td colSpan="2" rowSpan="3">{queryData.lesseeNameAddress}</td>
            <td>Taluk Name</td>
            <td>{queryData.talukName}</td>
          </tr>
          <tr>
            <td>Village</td>
            <td>{queryData.village}</td>
          </tr>
          <tr>
            <td>SF.NoExtent</td>
            <td>{queryData.sfNoExtent}</td>
          </tr>
          <tr>
            <td>Mineral Name: {queryData.mineralName}</td>
            <td>Bulk Permit No: {queryData.bulkPermitNo}</td>
            <td>Classification</td>
            <td>{queryData.classification}</td>
          </tr>
          <tr>
            <td colSpan="2">Order Ref: {queryData.orderRef}</td>
            <td>Lease Period:</td>
            <td>{queryData.leasePeriod}</td>
          </tr>
          <tr>
            <td>Dispatch Ship No:</td>
            <td>{queryData.dispatchSlipNo}</td>
            <td>Within Tamil Nadu</td>
            <td>{queryData.withinTamilNadu}</td>
          </tr>
          <tr>
            <td>Delivered To:</td>
            <td colSpan="3">{queryData.deliveredTo}</td>
          </tr>
          <tr>
            <td>Vehicle No:</td>
            <td>{queryData.vehicleNo}</td>
            <td colSpan="2">Destination Address:</td>
          </tr>
          <tr>
            <td>Vehicle Type:</td>
            <td>{queryData.vehicleType}</td>
            <td colSpan="2" rowSpan="4">{queryData.destinationAddress}</td>
          </tr>
          <tr>
            <td>Total Distance (in Kms):</td>
            <td>{queryData.totalDistance}</td>
          </tr>
          <tr>
            <td>Travelling Date:</td>
            <td>{queryData.travellingDate}</td>
          </tr>
          <tr>
            <td>Required Time:</td>
            <td>{queryData.requiredTime}</td>
          </tr>
          <tr>
            <td>Quantity (in MT):</td>
            <td>{queryData.quantity}</td>
            <td>Driver Name:</td>
            <td>{queryData.driverName}</td>
          </tr>
          <tr>
            <td>Driver License No:</td>
            <td>{queryData.driverLicenseNo}</td>
            <td>Via</td>
            <td>{queryData.via}</td>
          </tr>
          <tr>
            <td>Driver Phone No:</td>
            <td>{queryData.driverPhoneNo}</td>
            <td>Lessee / Authorized Person Name:</td>
            <td>{queryData.authorizedPersonName}</td>
          </tr>
          <tr>
            <td>Driver Signature:</td>
            <td></td>
            <td>Signature of AD / DD:</td>
            <td> {queryData.adSignature}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container">
      <div className="section">{renderTable()}</div>
      <div className="section " >{renderTable()}</div>

      {/* Print button hidden in print */}
      <div className="print-button-container no-print" style={{marginLeft:'120px'}}>
        <button className="print-button" onClick={() => window.print()}>🖨 Print</button>
      </div>
    </div>
  );
}

export default QueryView;