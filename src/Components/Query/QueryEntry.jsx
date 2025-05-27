
import React, { useEffect, useState } from 'react';
import './QueryEntry.css';
import { adminAddQuaeyAPI } from '../../Server/allAPI';
import { useNavigate } from 'react-router-dom';

function QueryEntry() {
const navigate = useNavigate();

  const [formData, setFormData] = useState({
    hsnCode: '',
    lesseeId: '',
    minecode: '',
    lesseeName: '',
    SerialNo: '',
    dispatchNo:'',
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
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

      const response = await adminAddQuaeyAPI(formData);

      if (response.status === 201) {

        alert('Data submitted and saved locally!');
        navigate('/userdispatch');
        
        // Reset form but keep the serial number generation sequence
        // setFormData({
        //   ...formData,
        //   hsnCode: '',
        //   lesseeId: '',
        //   minecode: '',
        //   SerialNo:'',
        //   lesseeName: '',
        //   lesseeNameAddress: '',
        //   districtName: '',
        //   Taluk: '',
        //   village: '',
        //   sfNoExtent: '',
        //   classification: '',
        //   leasePeriod: '',
        //   withinTamilNadu: '',
        //   mineralName: '',
        //   bulkPermitNo: '',
        //   signature: '',
        //   // Keep SerialNo for next auto-generation
        // });
      } else {
        alert('Submission failed. Please check your data.');
      }
    } catch (error) {
      console.error('Submission Error:', error);
      alert('Error occurred while submitting. Check console for details.');
    }
  };
console.log(formData);

  

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


  <div>
              <label>Bulk Permit No:</label>
              <input 
                type="text"  name="bulkPermitNo"   value={formData.bulkPermitNo}      onChange={handleChange} 
              />
            </div>


      <div>
              <label>Serial No:</label>
              <input 
                type="text"  name="SerialNo" value={formData.SerialNo}       onChange={handleChange} 
              />
            </div>

      <div>
              <label>Dispatch No:</label>
              <input 
                type="text"  name="dispatchNo" value={formData.dispatchNo}       onChange={handleChange} 
              />
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