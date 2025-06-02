import axios from 'axios';
import authService from './authService';
const token = authService.getAccessToken();
class StaffingServices {
  getAllJobs = () =>
    new Promise((resolve, reject) => {
      axios
        .get(`https://connect.medtigo.com/api/v1/staffing/jobs`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
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

  submitResume = (values, fileUploadAction) =>
    new Promise((resolve, reject) => {
      axios
        .post(
          'https://connect.medtigo.com/api/v1/staffing/formSubmit/add',
          values, // The data payload
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            ...fileUploadAction // Other configurations like file upload should go here
          }
        )
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

  saveJob = (id) =>
    new Promise((resolve, reject) => {
      axios
        .get(`https://connect.medtigo.com/api/v1/staffing/save/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          if (response) {
            resolve(response);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });

  getSavedJobs = () =>
    new Promise((resolve, reject) => {
      axios
        .get(`https://connect.medtigo.com/api/v1/staffing/getstatus`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          if (response) {
            resolve(response);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });

  getAppliedJobs = (id) =>
    new Promise((resolve, reject) => {
      axios
        .get(`https://connect.medtigo.com/api/v1/staffing/getIntendedjobs`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          if (response) {
            resolve(response);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });

  submitContactForm = (values) =>
    new Promise((resolve, reject) => {
      axios
        .post(
          'https://dev.medtigo.com/api/v1/staffing/contact-internal-mail',
          values, // The data payload
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
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

const staffingServices = new StaffingServices();
export default staffingServices;
