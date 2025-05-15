import React, { useState, useEffect } from 'react';
import './QueryEntry.css';
import { adminAddQuaeyAPI } from '../../Server/allAPI';
import { useNavigate } from 'react-router-dom';

function QueryEntry() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    hsnCode: '',
    lesseeId: '',
    minecode: '',
    lesseeNameAddress: '',
    lesseeAreaDetails: '',
    districtName: '',
    village: '',
    sfNoExtent: '',
    classification: '',
    leasePeriod: '',
    withinTamilNadu: '',
    mineralName: '',
    signature: null
  });

  const [previewURL, setPreviewURL] = useState(null);

  // Generate preview when signature is updated
  useEffect(() => {
    if (formData.signature) {
      const url = URL.createObjectURL(formData.signature);
      setPreviewURL(url);

      return () => URL.revokeObjectURL(url); // Clean up memory
    }
  }, [formData.signature]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'signature') {
      setFormData((prev) => ({
        ...prev,
        signature: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Use FormData if signature is included
      const dataToSend = new FormData();
      for (const key in formData) {
        dataToSend.append(key, formData[key]);
      }

      const response = await adminAddQuaeyAPI(dataToSend);

      if (response.status === 201) {
        const existingEntries = JSON.parse(localStorage.getItem('leaseEntries')) || [];
        const updatedEntries = [...existingEntries, { ...formData, signature: undefined }];
        localStorage.setItem('leaseEntries', JSON.stringify(updatedEntries));

        alert('Data submitted and saved locally!');
        navigate('/adminqlist');

        setFormData({
          hsnCode: '',
          lesseeId: '',
          minecode: '',
          lesseeNameAddress: '',
          lesseeAreaDetails: '',
          districtName: '',
          village: '',
          sfNoExtent: '',
          classification: '',
          leasePeriod: '',
          withinTamilNadu: '',
          mineralName: '',
          signature: null,
        });
        setPreviewURL(null);
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
      <form onSubmit={handleSubmit} encType="multipart/form-data">
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
              <label>Lessee Name and Address:</label>
              <textarea name="lesseeNameAddress" value={formData.lesseeNameAddress} onChange={handleChange} />
            </div>

            <div>
              <label>Lease Area Details:</label>
              <textarea name="lesseeAreaDetails" value={formData.lesseeAreaDetails} onChange={handleChange} />
            </div>

            <div>
              <label>District Name:</label>
              <input type="text" name="districtName" value={formData.districtName} onChange={handleChange} />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="form-column">
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
              <label>Mineral Name:</label>
              <input type="text" name="mineralName" value={formData.mineralName} onChange={handleChange} />
            </div>

            {/* Signature Input */}
            <div className="signature-box">
              <label className="signature-title">Signature of AD / DD:</label>
              <input type="file" name="signature" accept="image/*" onChange={handleChange} />
              {previewURL && (
                <div className="signature-preview">
                  <img src={previewURL} alt="Signature Preview" />
                </div>
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
