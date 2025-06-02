import axios from '../utils/axios';

class PasswordManagerService {
  getPasswords = (userID, searchText) =>
    new Promise((resolve, reject) => {
      axios
        .get(`/passwordManager?userID=${userID}&searchText=${searchText}`)
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

  getPasswordTask = (taskID) =>
    new Promise((resolve, reject) => {
      axios
        .get(`/passwordManager/task?taskID=${taskID}`)
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

  addPassword = values =>
    new Promise((resolve, reject) => {
      axios
        .post('/passwordManager', values)
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

  deletePassword = id =>
    new Promise((resolve, reject) => {
      axios
        .delete(`/passwordManager/${id}`)
        .then(response => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response);
          }
        })
        .catch(error => {
          reject(error);
        });
    });

  updatePassword = (id, value) =>
    new Promise((resolve, reject) => {
      axios
        .put(`/passwordManager/${id}`, value)
        .then(response => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
}

const passwordManagerServices = new PasswordManagerService();

export default passwordManagerServices;
