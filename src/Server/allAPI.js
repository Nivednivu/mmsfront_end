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
  return await commonAPI("POST", `${SERVER_URL}/query`, reqBody);
};      

export const getLastSerialNumberAPI = async () => {
  return await commonAPI("GET", `${SERVER_URL}/serial`);
};


export const updateSerialNumberAPI = async () => {
  return await commonAPI("POST", `${SERVER_URL}/queryserialno`);
};
// export const queryLastData= async (reqBody) => {
//   return await commonAPI("GET", `${SERVER_URL}/querylast`, reqBody);
// };

export const deleteQueryAPI = async (id) => {
  return await commonAPI("DELETE", `${SERVER_URL}/deleteQuery/${id}`);
};      

export const deleteAllQueriesAPI = async () => {
  return await commonAPI("DELETE", `${SERVER_URL}/deleteAllQueries`);
};

export const querySingleGetAPI = async (id) => {
  return await commonAPI("GET", `${SERVER_URL}/queryget/${id}`);
};




export const getLastDispatchNumberAPI = async () => {
  return await commonAPI("GET", `${SERVER_URL}/dispatch`);
};

export const updateDispatchNumberAPI = async (reqBody) => {
  return await commonAPI("POST", `${SERVER_URL}/dispatchno`, reqBody);
};
      export const queryGetAPI = async (reqBody) => {
        return await commonAPI("GET", `${SERVER_URL}/queryget`,reqBody);
      };      
      export const getQueriesByLessee = async (lesseeId) => {
        return await commonAPI("GET", `${SERVER_URL}/getQueriesByLessee/${lesseeId}`);
      };      


export const adminAddQuaeyAPI = async (reqBody) => {
  return await commonAPI("POST", `${SERVER_URL}/adminadd`,reqBody);
};
    

export const checkLesseeIdExists = async (lesseeId) => {
  return await commonAPI("GET", `${SERVER_URL}/check-lessee/${lesseeId}`);
};
// In your allAPI.js
export const updateAdminData = async (data) => {
  return await commonAPI("PUT", `${SERVER_URL}/update-admin`, data);
};
export const updateAdminWithCredentials = async (data) => {
  return await commonAPI("PUT", `${SERVER_URL}/admin/update-credentials`, data);
};

export const loginAdmin = async (data) => {
  return await commonAPI("POST", `${SERVER_URL}/loginAdmin`, data);
};


// export const updateAdminWithCredentials = async (data) => {
//   try {
//   return  const response = await axios.put(`${baseURL}/admin/update-credentials`, data);
//   } catch (error) {
//     throw error;
//   }
// };
  // adminQuaeyIdupdateAPI,
  // adminAddQuaeyLastAPI


export const adminAddQuaeyAllAPI = async (reqBody) => {
  return await commonAPI("GET", `${SERVER_URL}/adminadd`,reqBody);
};

export const adminAddQuaeyLastAPI = async (reqBody) => {
  return await commonAPI("GET", `${SERVER_URL}/admingetlast`,reqBody);
};
    //  adminAddQuaeyByIdAPI, updateAdminData 
export const adminAddQuaeyByIdAPI = async (id) => {
  return await commonAPI("GET", `${SERVER_URL}/adminadd/${id}`,);
};


export const adminQuaeyIdupdateAPI = async (id, updatedData) => {
  return await commonAPI("PUT", `${SERVER_URL}/adminupdate/${id}`, updatedData);
};


export const adminDeleteQueryByIdAPI = async (id) => {
  return await commonAPI("DELETE", `${SERVER_URL}/admin/delete/${id}`);
};



export const employeeAddtAPI = async (reqBody) => {
  return await commonAPI("POST", `${SERVER_URL}/employeeadd/`,reqBody);
};
    
export const employeeGetAPI = async (id) => {
  return await commonAPI("GET", `${SERVER_URL}/employeeget/${id}`);
};


export const getLastEmployeeAPI = async () => {
  return await commonAPI("GET", `${SERVER_URL}/employee/last`);
};