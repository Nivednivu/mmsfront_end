import { commonAPI } from "./commonAPI"
import { SERVER_URL } from "./serverUrl"

export const registerAPI = async (reqBody) =>{
    return await commonAPI("POST",`${SERVER_URL}/register`,reqBody)
    }
export const loginAPI = async (reqBody) =>{
    return await commonAPI("POST",`${SERVER_URL}/login`,reqBody)
    }
export const vehiclesAPI = async (formData) =>{
    return await commonAPI("POST",`${SERVER_URL}/vehicles`,formData)
    }
    
// api/vehicleAPI.js
export const vehiclesupdateAPI = async (id, formData) => {
    return await commonAPI("POST", `${SERVER_URL}/updatevehicles/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  };
  
      export const getVehiclesAPI = async () => {
        return await commonAPI("GET", `${SERVER_URL}/vehicles`);
      };   

      export const deleteVehicleAPI = async (vehicleId) => {
        return await commonAPI("DELETE", `${SERVER_URL}/vehicles/${vehicleId}`);
      };      

      export const sendOtpAPI = async (reqBody) => {
        return await commonAPI("POST", `${SERVER_URL}/sendotp`,reqBody);
      };      
      export const verifyOtpAPI = async (reqBody) => {
        return await commonAPI("POST", `${SERVER_URL}/verifyotp`,reqBody);
      };      
      export const resendOtpAPI = async (reqBody) => {
        return await commonAPI("POST", `${SERVER_URL}/sendotp`,reqBody);
      };      
      export const resetPasswordAPI = async (reqBody) => {
        return await commonAPI("POST", `${SERVER_URL}/resetpassword`,reqBody);
      };      

    
      export const queryDataAPI = async (reqBody) => {
        return await commonAPI("POST", `${SERVER_URL}/query`,reqBody);
      };      

      export const queryGetAPI = async (reqBody) => {
        return await commonAPI("GET", `${SERVER_URL}/queryget`,reqBody);
      };      

export const querySingleGetAPI = async (id) => {
  return await commonAPI("GET", `${SERVER_URL}/queryget/${id}`);
};
    