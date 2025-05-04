import React from 'react';
import './VehicleManagement.css'; // Assuming you have a separate CSS file

const VehicleManagement = () => {
  return (
    <div className="container">
      <h2>Vehicle Management</h2>
      <form>
        <div className="form-grid">
          <div className="left-column">
            <label htmlFor="registrationNumber">Registration Number</label>
            <input type="text" id="registrationNumber" name="registrationNumber" />

            <label htmlFor="ownerName">Owner Name</label>
            <input type="text" id="ownerName" name="ownerName" />
            
            <label htmlFor="District">District</label>
            <select id="currentStatus" name="currentStatus">
              <option value="Erode">Erode</option>
              <option value="kallakurichi">kallakurichi</option>
              <option value="kancheepuram">kancheepuram</option>
              <option value="kallakurichi">kallakurichi</option>
              <option value="ikanyakumari">kanyakumari</option>
              <option value="karur">karur</option>
            </select>

            <label htmlFor="vehicleRCNumber">Vehicle RC Number</label>
            <input type="text" id="vehicleFCNumber" name="vehicleFCNumber" />
            

            <label htmlFor="vehicleFCNumber">Vehicle FC Number</label>
            <input type="text" id="vehicleFCNumber" name="vehicleRCNumber" />

            <label htmlFor="insuranceNumber">Insurance Number</label>
            <input type="text" id="insuranceNumber" name="insuranceNumber" />

            <label htmlFor="vehicleWeight">Vehicle Weight (in Empty)</label>
            <input type="number" id="Maximum capacity" name="Maximum capacity" />
            

            <h2 className='h2'>Attachments</h2>

            <label htmlFor="vehicleImage">Vehicle Image (file type: jpg, jpeg)</label>
            <input
              type="file"
              id="vehicleImage"
              name="vehicleImage"
              accept=".jpg, .jpeg" // Accept only jpg and jpeg formats
            />
               
               <label htmlFor="current status">Current status</label>
            <select id="currentStatus" name="currentStatus">
              <option value="active">active</option>
              <option value="inactive">Inactive</option>
            </select>
           
           
          </div>
          

          <div className="right-column">
            <label htmlFor=" Vehicle Type">Vehicle FC Number</label>
            <select id="currentStatus" name="currentStatus">
              <option value="active">Tractor</option>
              <option value="inactive">Lorry</option>
              <option value="inactive">Tarus 9</option>
              <option value="inactive">Tipper</option>
              <option value="inactive">Tarus 12</option>
            </select>

            <label htmlFor="Owner Contact">Owner Contact</label>
            <input type="Text" id="Contact number" name="Contact number" />

            <label htmlFor="Chassis Number">Owner Contact</label>
            <input type="Text" id="Chasis number" name="Chasis number" />

            <label htmlFor="rcValidTill">Rc Valid Till</label>
            <input type="date" id="rcValidTill" name="rcValidTill" />

            <label htmlFor="rcValidTill">Fc Valid Till</label>
            <input type="date" id="fcValidTill" name="fcValid Till" />

            <label htmlFor="Insurance Valid Till">Insurance Valid Till</label>
            <input type="date" id="Insurance ValidTill" name="Insurance Valid Till" />

            <label htmlFor="Maximum Capacity">Maximum Capacity</label>
            <input type="Text" id="Maximum capacity" name="Maximum Capacity" />

           

            <label htmlFor="Number Plate with image">Number plate with image(file Type:jpg,jpeg)Image (file type: jpg, jpeg)</label>
            <input
              type="file"
              id="Number plate Image"
              name="Number Plate Image"
              accept=".jpg, .jpeg" // Accept only jpg and jpeg formats
            />


          </div>
        </div>
        <div className="button-container">
          <button type="button" className="submit-button">Submit</button>
          <button type="button" className="cancel-button">Cancel</button>
        </div>
      </form>
      
    </div>
  );
};

export default VehicleManagement;