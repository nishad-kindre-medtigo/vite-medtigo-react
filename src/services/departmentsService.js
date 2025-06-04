import axios from 'src/utils/axios';

class DepartmentsService {
  getDepartments = (hospitalId = null) =>
    new Promise((resolve, reject) => {
      let url = '/admin/departments/';
      if (hospitalId) {
        url += '?hospital=' + hospitalId;
      }
      axios
        .get(url)
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

  getDepartmentAdmins = hospitalId =>
    new Promise((resolve, reject) => {
      let url = '/admin/departments/admin/' + hospitalId;

      axios
        .get(url)
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

    getDepartmentsTeamCmeCompliance = (payload) =>
      new Promise((resolve, reject) => {
        axios
          .post('/teamCmeCompliance/get-departments',payload)
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

const departmentsService = new DepartmentsService();

export default departmentsService;
