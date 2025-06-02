import axios from '../utils/axios';

class HospitalsService {
  getHospitals = () =>
    new Promise((resolve, reject) => {
      axios
        .get('/admin/hospitals/')
        .then(response => {
          if (response.data) {
            resolve(response.data.data);
          } else {
            reject(response.data.error);
          }
        })
        .catch(error => {
          reject(error);
        });
    });

    getAdminHospitals = () =>
      new Promise((resolve, reject) => {
        axios
          .get('/teamCmeCompliance/get-hospitals')
          .then(response => {
            if (response.data) {
              resolve(response.data);
            } else {
              reject(response.data.error);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
}

const hospitalsService = new HospitalsService();

export default hospitalsService;
