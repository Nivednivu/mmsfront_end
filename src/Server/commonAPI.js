import axios from "axios";

export const commonAPI = async (httpRequest, url, reqBody, reqHeader) => {
  const isFormData = reqBody instanceof FormData;

  const reqConfig = {
    method: httpRequest,
    url,
    data: reqBody,
    headers: reqHeader
      ? reqHeader
      : isFormData
      ? {} // Let Axios handle content-type for FormData
      : { "Content-Type": "application/json" },
  };

  return await axios(reqConfig)
    .then((res) => res)
    .catch((err) => {
      console.error("API Error:", err);
      throw err.response || err;
    });
};
