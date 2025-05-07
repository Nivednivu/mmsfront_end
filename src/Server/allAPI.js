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

    export const getVehiclesAPI = async () => {
        return await commonAPI("GET", `${SERVER_URL}/vehicles`);
      };   