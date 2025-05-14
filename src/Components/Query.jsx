import React, { useState } from 'react';
import './Query.css';
import { useNavigate } from 'react-router-dom';
import { queryDataAPI } from '../Server/allAPI';

const Query = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    hsnCode: '',
    minecode: '',
    lesseeId: '',
    serialNo: '',
    lesseeName:'',
    lesseeNameAddress: '',
    mineralName: '',
    bulkPermitNo: '',
    classification: '',
    orderRef: '',
    leasePeriod: '',
    withinTamilNadu: '',
    dispatchSlipNo: '',
    districtName: '',
    deliveredTo: '',
    talukName: '',
    vehicleNo: '',
    village: '',
    vehicleType: '',
    sfNoExtent: '',
    totalDistance: '',
    destinationAddress: '',
    travellingDate: '',
    driverName: '',
    requiredTime: '',
    via: '',
    quantity: '',
    driverLicenseNo: '',
    driverPhoneNo: '',
    authorizedPersonName: '',
    driverSignature: '',
    adSignature: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault(); // Prevent form reload

  // List of required fields
  const requiredFields = [
    'hsnCode', 'minecode', 'lesseeId', 'serialNo','lesseeName',
    'lesseeNameAddress', 'mineralName', 'bulkPermitNo', 'classification',
    'orderRef', 'leasePeriod', 'withinTamilNadu', 'dispatchSlipNo',
    'districtName', 'deliveredTo', 'talukName', 'vehicleNo', 'village',
    'vehicleType', 'sfNoExtent', 'totalDistance', 'destinationAddress',
    'travellingDate', 'driverName', 'requiredTime', 'via', 'quantity',
    'driverLicenseNo', 'driverPhoneNo', 'authorizedPersonName',
    'driverSignature', 'adSignature'
  ];

  // Find missing fields
  const missingFields = requiredFields.filter(field => !formData[field].trim());

  if (missingFields.length > 0) {
    alert(`Please fill all required fields.\nMissing: ${missingFields.join(', ')}`);
    return;
  }

  // If all required fields are filled, proceed with API call
  try {
    const response = await queryDataAPI(formData);
    if (response.status === 200 || response.status === 201) {
      alert("Query submitted successfully!");
      navigate('/querylist'); // Navigate after successful submit
    } else {
      alert("Failed to submit. Please try again.");
      console.log(response);
    }
  } catch (error) {
    console.error("API Error:", error);
    alert("Error occurred while submitting.");
  }
};


return (
    <form className="permit-form" onSubmit={handleSubmit}>
      <div className="row">
        
        <label>HSN Code:</label>
        <input type="text" name="hsnCode" value={formData.hsnCode} onChange={handleChange} />
        <label>Minecode:</label>
        <input type="text" name="minecode" value={formData.minecode} onChange={handleChange} />
{/* <label>Date & Time of Dispatch:</label>
<input
  type="datetime-local"
  name="dispatchDateTime"
  value={formData.dispatchDateTime}
  onChange={handleChange}
/> */}
        <label>Lessee Name :</label>
        <input type="text" name="lesseeName" value={formData.lesseeName} onChange={handleChange} />

      </div>

      <div className="row">
        <label>Lessee Id:</label>
        <input type="text" name="lesseeId" value={formData.lesseeId} onChange={handleChange} />
        <label>Serial No:</label>
        <input type="text" name="serialNo" value={formData.serialNo} onChange={handleChange} />
      </div>

      <div className="row">
        <label>Lessee Name and Address:</label>
        <input type="text" className="full" name="lesseeNameAddress" value={formData.lesseeNameAddress} onChange={handleChange} />
      </div>

      <div className="row">
        <label>Mineral Name:</label>
        <input type="text" name="mineralName" value={formData.mineralName} onChange={handleChange} />
        <label>Bulk Permit No:</label>
        <input type="text" name="bulkPermitNo" value={formData.bulkPermitNo} onChange={handleChange} />
        <label>Classification:</label>
        <input type="text" name="classification" value={formData.classification} onChange={handleChange} />
      </div>

      <div className="row">
        <label>Order Ref:</label>
        <input type="text" name="orderRef" value={formData.orderRef} onChange={handleChange} />
        <label>Lease Period:</label>
        <input type="text" name="leasePeriod" value={formData.leasePeriod} onChange={handleChange} />
        <label>Within Tamil Nadu:</label>
        <input type="text" name="withinTamilNadu" value={formData.withinTamilNadu} onChange={handleChange} />
      </div>

      <div className="row">
        <label>Dispatch Slip No:</label>
        <input type="text" name="dispatchSlipNo" value={formData.dispatchSlipNo} onChange={handleChange} />
        <label>District Name:</label>
        <input type="text" name="districtName" value={formData.districtName} onChange={handleChange} />
      </div>

      <div className="row">
        <label>Delivered To:</label>
        <input type="text" name="deliveredTo" value={formData.deliveredTo} onChange={handleChange} />
        <label>Taluk Name:</label>
        <input type="text" name="talukName" value={formData.talukName} onChange={handleChange} />
      </div>

      <div className="row">
        <label>Vehicle No:</label>
        <input type="text" name="vehicleNo" value={formData.vehicleNo} onChange={handleChange} />
        <label>Village:</label>
        <input type="text" name="village" value={formData.village} onChange={handleChange} />
      </div>

      <div className="row">
        <label>Vehicle Type:</label>
        <input type="text" name="vehicleType" value={formData.vehicleType} onChange={handleChange} />
        <label>SF.No / Extent:</label>
        <input type="text" name="sfNoExtent" value={formData.sfNoExtent} onChange={handleChange} />
      </div>

      <div className="row">
        <label>Total Distance (in Kms):</label>
        <input type="text" name="totalDistance" value={formData.totalDistance} onChange={handleChange} />
        <label>Destination Address:</label>
        <input type="text" name="destinationAddress" value={formData.destinationAddress} onChange={handleChange} />
      </div>

      <div className="row">
        <label>Travelling Date:</label>
        <input type="text" name="travellingDate" value={formData.travellingDate} onChange={handleChange} />
        <label>Driver Name:</label>
        <input type="text" name="driverName" value={formData.driverName} onChange={handleChange} />
      </div>

      <div className="row">
        <label>Required Time:</label>
        <input type="text" name="requiredTime" value={formData.requiredTime} onChange={handleChange} />
        <label>Via:</label>
        <input type="text" name="via" value={formData.via} onChange={handleChange} />
      </div>

      <div className="row">
        <label>Quantity (in MT):</label>
        <input type="text" name="quantity" value={formData.quantity} onChange={handleChange} />
        <label>Driver License No:</label>
        <input type="text" name="driverLicenseNo" value={formData.driverLicenseNo} onChange={handleChange} />
      </div>

      <div className="row">
        <label>Driver Phone No:</label>
        <input type="text" name="driverPhoneNo" value={formData.driverPhoneNo} onChange={handleChange} />
        <label>Lessee / Authorized Person Name:</label>
        <input type="text" name="authorizedPersonName" value={formData.authorizedPersonName} onChange={handleChange} />
      </div>

      <div className="row">
        <label>Driver Signature:</label>
        <input type="text" name="driverSignature" value={formData.driverSignature} onChange={handleChange} />
        <label>Signature of AD / DD:</label>
        <input type="file" name="adSignature" value={formData.adSignature} onChange={handleChange} />

                    {/* <label>Number Plate Image (JPG/JPEG)</label>
            <input type="file" name="numberPlateImage" accept=".jpg,.jpeg" onChange={handleChange} /> */}

      </div>

      <div className="row">
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default Query;
