
import React, { useEffect, useState } from 'react';
import './QueryEntry.css';
import { adminAddQuaeyAPI } from '../../Server/allAPI';
import { useNavigate } from 'react-router-dom';

function QueryEntry() {
const navigate = useNavigate();

 const [isManualEntry, setIsManualEntry] = useState(false);
  const [isManualBulkEntry, setIsManualBulkEntry] = useState(false);
  
  // Constants for number generation
  const START_TN = 547350;
  const END_TN = 547440;
  const START_BULK = 250000000; // Starting number for bulk permits
  const END_BULK = 250999999;   
  
  

  const [formData, setFormData] = useState({
    hsnCode: '',
    lesseeId: '',
    minecode: '',
    lesseeName: '',
    SerialNo: '',
    lesseeNameAddress: '',
    districtName: '',
    Taluk: '',
    village: '',
    sfNoExtent: '',
    classification: '',
    leasePeriod: '',
    withinTamilNadu: '',
    mineralName: '',
    bulkPermitNo: '',
    signature: '',
  });

  // Initialize or get the last used TN number from localStorage
  useEffect(() => {
    const lastTnNumber = localStorage.getItem('lastTnNumber');
    if (lastTnNumber) {
      const nextNumber = parseInt(lastTnNumber) + 1;
      if (!isManualEntry && !formData.SerialNo) {
        setFormData(prev => ({
          ...prev,
          SerialNo: `TN00${nextNumber > END_TN ? START_TN : nextNumber}`
        }));
      }
    }

      const lastBulkNumber = localStorage.getItem('lastBulkNumber');
    if (lastBulkNumber) {
      const nextBulkNumber = parseInt(lastBulkNumber) + 1;
      if (!isManualBulkEntry && !formData.bulkPermitNo) {
        setFormData(prev => ({
          ...prev,
          bulkPermitNo: `TLR${nextBulkNumber > END_BULK ? START_BULK : nextBulkNumber}`
        }));
      }
    }
    
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (name === 'SerialNo') {
      handleManualEntry(e);
    }
     if (name === 'SerialNo') {
      handleManualEntry(e);
    } else if (name === 'bulkPermitNo') {
      handleManualBulkEntry(e);
    }
  };

  const handleManualEntry = (e) => {
    const value = e.target.value;
    const isManual = !!value.trim();
    setIsManualEntry(isManual);
    
    if (isManual) {
      localStorage.setItem('manualSerialNo', value);
    } else {
      localStorage.removeItem('manualSerialNo');
      // Auto-generate when field is cleared
      generateSerialNumber();
    }
  };

   const handleManualBulkEntry = (e) => {
    const value = e.target.value;
    const isManual = !!value.trim();
    setIsManualBulkEntry(isManual);
    
    if (isManual) {
      localStorage.setItem('manualBulkNo', value);
    } else {
      localStorage.removeItem('manualBulkNo');
      generateBulkNumber();
    }
  };

  
  const generateBulkNumber = () => {
    if (isManualBulkEntry) return;
    
    const lastNumber = parseInt(localStorage.getItem('lastBulkNumber') || START_BULK);
    let nextNumber = lastNumber + 1;
    
    if (nextNumber > END_BULK) {
      nextNumber = START_BULK;
    }
    
    const newBulkNo = `TLR${nextNumber}`;
    localStorage.setItem('lastBulkNumber', nextNumber.toString());
    
    setFormData(prev => ({
      ...prev,
      bulkPermitNo: newBulkNo
    }));
  };

  const generateSerialNumber = () => {
    if (isManualEntry) return; // Don't auto-generate if manual entry exists
    
    // Get the last used number or start from START_TN
    const lastNumber = parseInt(localStorage.getItem('lastTnNumber') || START_TN);
    let nextNumber = lastNumber + 1;
    
    // Reset if we exceed the range
    if (nextNumber > END_TN) {
      nextNumber = START_TN;
    }
    
    const newSerialNo = `TN00${nextNumber}`;
    localStorage.setItem('lastTnNumber', nextNumber.toString());
    
    setFormData(prev => ({
      ...prev,
      SerialNo: newSerialNo
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          signature: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // If manual entry exists, use that as base for next number
      if (isManualEntry && formData.SerialNo) {
        const manualNumber = parseInt(formData.SerialNo.replace('TN00', ''));
        localStorage.setItem('lastTnNumber', manualNumber.toString());
      } else {
        // Auto-generate new number for next submission
        generateSerialNumber();
      }

        if (isManualBulkEntry && formData.bulkPermitNo) {
        const manualNumber = parseInt(formData.bulkPermitNo.replace('TLR', ''));
        localStorage.setItem('lastBulkNumber', manualNumber.toString());
      } else {
        generateBulkNumber();
      }

      const response = await adminAddQuaeyAPI(formData);

      if (response.status === 201) {
        const existingEntries = JSON.parse(localStorage.getItem('leaseEntries')) || [];
        const updatedEntries = [...existingEntries, formData];
        localStorage.setItem('leaseEntries', JSON.stringify(updatedEntries));

        alert('Data submitted and saved locally!');
        navigate('/userdispatch');
        
        // Reset form but keep the serial number generation sequence
        setFormData({
          ...formData,
          hsnCode: '',
          lesseeId: '',
          minecode: '',
          SerialNo:'',
          lesseeName: '',
          lesseeNameAddress: '',
          districtName: '',
          Taluk: '',
          village: '',
          sfNoExtent: '',
          classification: '',
          leasePeriod: '',
          withinTamilNadu: '',
          mineralName: '',
          bulkPermitNo: '',
          signature: '',
          // Keep SerialNo for next auto-generation
        });
      } else {
        alert('Submission failed. Please check your data.');
      }
    } catch (error) {
      console.error('Submission Error:', error);
      alert('Error occurred while submitting. Check console for details.');
    }
  };

  return (
    <div className="lease-form-container">
      <h2>Lease Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* LEFT COLUMN */}
          <div className="form-column">
            <div>
              <label>HSN Code:</label>
              <input type="text" name="hsnCode" value={formData.hsnCode} onChange={handleChange} />
            </div>
   
            <div>
              <label>Lessee ID:</label>
              <input type="text" name="lesseeId" value={formData.lesseeId} onChange={handleChange} />
            </div>

            <div>
              <label>Mine Code:</label>
              <input type="text" name="minecode" value={formData.minecode} onChange={handleChange} />
            </div>

            <div>
              <label>Lessee Name :</label>
              <input name="lesseeName" value={formData.lesseeName} onChange={handleChange} />
            </div>

            <div>
              <label>Lessee  Address:</label>
              <input style={{height:'80px'}} name="lesseeNameAddress" value={formData.lesseeNameAddress} onChange={handleChange} />
            </div>
            <div>
              <label>Mineral Name:</label>
              <input type="text" name="mineralName" value={formData.mineralName} onChange={handleChange} />
            </div>

            {/* <div>
              <label>Dispatch Ship No:</label>
              <input type="text" name="dispatchNo" value={formData.dispatchNo} onChange={handleChange} />
            </div>
 */}

  <div>
              <label>Bulk Permit No:</label>
              <input 
                type="text" 
                name="bulkPermitNo" 
                value={formData.bulkPermitNo} 
                onChange={handleChange} 
                placeholder={isManualBulkEntry ? formData.bulkPermitNo : `TLR${START_BULK}`}
              />
              <small>
                {isManualBulkEntry ? 
                  "Using manual bulk permit number" : 
                  "Leave blank for auto-generation"}
              </small>
            </div>


      <div>
              <label>Serial No:</label>
              <input 
                type="text" 
                name="SerialNo" 
                value={formData.SerialNo} 
                onChange={handleChange} 
                placeholder={isManualEntry ? formData.SerialNo : `TN00${START_TN}`}
              />
              <small>
                {isManualEntry ? 
                  "Using manual entry (next will be +1 from this)" : 
                  "Leave blank for auto-generation"}
              </small>
            </div>
                      {/* <div>


              <label>Serial No:</label>
              <input type="text" name="SerialNo" value={formData.SerialNo} onChange={handleChange} />
            </div>
 */}
          </div>


          {/* RIGHT COLUMN */}
          

          <div className="form-column">
                        <div>
              <label>District Name:</label>
              <input type="text" name="districtName" value={formData.districtName} onChange={handleChange} />
            </div>

            <div>
              <label>Taluk Name</label>
             <input type="text" name="Taluk" value={formData.Taluk} onChange={handleChange} />

            </div>
            <div>
              <label>Village:</label>
              <input type="text" name="village" value={formData.village} onChange={handleChange} />
            </div>

            <div>
              <label>SF.NO / Extent:</label>
              <input type="text" name="sfNoExtent" value={formData.sfNoExtent} onChange={handleChange} />
            </div>

            <div>
              <label>Classification:</label>
              <input type="text" name="classification" value={formData.classification} onChange={handleChange} />
            </div>

            <div>
              <label>Lease Period:</label>
              <input type="text" name="leasePeriod" value={formData.leasePeriod} onChange={handleChange} />
            </div>

          

            <div>
              <label>Within Tamil Nadu:</label>
              <select name="withinTamilNadu" value={formData.withinTamilNadu} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>





            <div>
              <label>Signature</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {formData.signature && (
                <img
                  src={formData.signature}
                  alt="Preview"
                  style={{ width: '100px', marginTop: '10px' }}
                />
              )}
            </div>
          </div>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default QueryEntry;