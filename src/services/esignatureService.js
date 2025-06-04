import axios from 'src/utils/axios';
import authService from './authService';

class ESignatureService {
  addSignature = (formData) => {
    const accessToken = authService.getAccessToken();
    return new Promise((resolve, reject) => {
      axios.post('/esignature', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then((response) => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response.data.error);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  getSignature = async (signatureID, senderID, type) => {
    try {
      const accessToken = authService.getAccessToken();
  console.log('signatureID',signatureID)
  console.log('senderID',senderID)
  console.log('type',type)
      // Validate required parameters
      if (!signatureID && !senderID) {
        throw new Error('Either signatureID or senderID must be provided');
      }
  
      if (!signatureID && !type) {
        throw new Error('type parameter is required when signatureID is not provided');
      }
  
      // Construct the API endpoint
      const endpoint = signatureID
        ? `/esignature?signatureID=${signatureID}`
        : `/esignature?senderID=${senderID}&type=${type}`;
  
        console.log("endpoint", endpoint)
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("response on service", response)
      return {
        status: true,
        data: response.data,
      };
    } catch (error) {
      console.error('API Error:', error);
      return {
        status: false,
        error: error.message,
        data: null,
      };
    }
  };
  

 updateSignature = async (signatureID, formData) => {
    try {
      const accessToken = authService.getAccessToken();
  
      const response = await axios.put(`/esignature/${signatureID}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`
        }
      });
  
      if (response.data) {
        return response.data;
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };
}

const eSignatureService = new ESignatureService();

export default eSignatureService;