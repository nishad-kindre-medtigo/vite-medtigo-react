import axios from '../utils/axios';

class UserAccessServices {

  getAllAccesses = () => new Promise((resolve, reject) => {
    axios.get('/user/get-access')
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

  getAllInstitutes = () => new Promise((resolve, reject) => {
    axios.get('/user/get-institutes')
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

  removeAccess = (recordId) => new Promise((resolve, reject) => {
    axios.delete(`user/delete-access/${recordId}`)
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

  addAdmin = (addAdminForm) => new Promise((resolve, reject) => {
    axios.post('user/invite-institute', addAdminForm)
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


const UserAccessService = new UserAccessServices();

export default UserAccessService;
