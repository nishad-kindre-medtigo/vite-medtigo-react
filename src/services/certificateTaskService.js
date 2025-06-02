import axios from '../utils/axios';

class CertificatesTaskService {

  getCertificateTask  = (certificateId) => new Promise((resolve, reject) => {
    console.log(certificateId);
    axios.get('/certificatesTask/'+certificateId)
      .then((response) => {
        if (response.data) {
          resolve(response.data.data);
        } else {
          reject(response.data.error);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });

  addCertificateTaskResponse  = (payload) => new Promise((resolve, reject) => {
    axios.post('/certificatesTask/addCertificateTaskUserResponse',payload)
      .then((response) => {
        if (response.data) {
          resolve(response.data.data);
        } else {
          reject(response.data.error);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}


const certificatesTaskService = new CertificatesTaskService();

export default certificatesTaskService;