
import axios from '../utils/axios';

class alertPage {

    submitLicenseFeedback = data =>
    new Promise((resolve, reject) => {
      axios
        .post('/alertPage/submit/userLicenseFeedback/', data )
        .then(response => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response.error);
          }
        })
        .catch(error => {
          reject(error.error);
        });
    });

    // UNAUTHENTICATED (FROM FEEDBACK FROM CRON EMAIL)
    submitFeedbackFromEmail = data =>
    new Promise((resolve, reject) => {
      axios
        .post('/alertPage/submit/userFeedback/', data )
        .then(response => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response.error);
          }
        })
        .catch(error => {
          reject(error.error);
        });
    });

    // Generic feedback submission
    submitGenericFeedback = data =>
    new Promise((resolve, reject) => {
      axios
        .post('/alertPage/submit/userGenericFeedback/', data )
        .then(response => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response.error);
          }
        })
        .catch(error => {
          reject(error.error);
        });
    });

    certificateTaskUserResponse = (data, files) =>{
      const formData = new FormData()
        for (const key in data){
          formData.append(key, data[key])
        }

        files.forEach(item=>{
          formData.append('file', item.file);
        })

     return new Promise((resolve, reject) => {
        axios
        .post('/alertPage/addCertificateTaskUserResponse/', formData)
        .then(response => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response.error);
          }
        })
        .catch(error => {
          reject(error.error);
        });
      });
    }

    certificateTaskUserDismiss = data =>{
      const formData = new FormData()
        for (const key in data){
          formData.append(key, data[key])
        }
     return new Promise((resolve, reject) => {
        axios
        .post('/alertPage/addCertificateTaskUserDismiss/', formData)
        .then(response => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response.error);
          }
        })
        .catch(error => {
          reject(error.error);
        });
      });
    }

    getInvoiceDetail = (id) => 
    new Promise((resolve, reject) => {
        axios
        .get(`/invoice/get/InvoiceDetail/${id}`)
        .then(response => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response.error);
          }
        })
        .catch(error => {
          reject(error.error);
        });
    })

    getUserLicenseTask = (userID, taskStatus = "In-Progress", licenseID = null, category = 'all') => 
    new Promise((resolve, reject) => {
        axios
        .get(`/alertPage/get/userTask/${userID}/${taskStatus}?Certificate_Id=${licenseID ? licenseID : ''}&category=${category}`)
        .then(response => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response.error);
          }
        })
        .catch(error => {
          reject(error.error);
        });
    })

    getUserLicenseNote = userID => 
    new Promise((resolve, reject) => {
        axios
        .get(`/alertPage/get/userNotes/${userID}`)
        .then(response => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response.error);
          }
        })
        .catch(error => {
          reject(error.error);
        });
    })

    getUserDismissedTask = userID => 
    new Promise((resolve, reject) => {
        axios
        .get(`/alertPage/get/userDismissedTask/${userID}`)
        .then(response => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response.error);
          }
        })
        .catch(error => {
          reject(error.error);
        });
    })

    getAnalyst = userID => 
    new Promise((resolve, reject) => {
        axios
        .get(`/alertPage/get/analyst/${userID}`)
        .then(response => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response.error);
          }
        })
        .catch(error => {
          reject(error.error);
        });
    })

    getCount = userID => 
    new Promise((resolve, reject) => {
        axios
        .get(`/alertPage/get/alertCount/${userID}`)
        .then(response => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response.error);
          }
        })
        .catch(error => {
          reject(error.error);
        });
    })

    getLicenseSearch = (userID, char) => 
      new Promise((resolve, reject) => {
        const searchParams = char?.split(" - ");
        const licenseName = searchParams[0];
        const stateAbbr = searchParams[1];
          axios
          .post(`/alertPage/get/userLicenseSearch/${userID}`, {
            licenseName: licenseName,
            stateAbbr: stateAbbr
          })
          .then(response => {
            if (response.data) {
              resolve(response.data);
            } else {
              reject(response.error);
            }
          })
          .catch(error => {
            reject(error.error);
          });
      })

    getLicenseSummary = userID => 
    new Promise((resolve, reject) => {
        axios
        .get(`/alertPage/get/userLicense/${userID}`)
        .then(response => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response.error);
          }
        })
        .catch(error => {
          reject(error.error);
        });
    })

    getGrantedActiveLicenses = userID => 
    new Promise((resolve, reject) => {
        axios
        .get(`/alertPage/get/granted-active-userLicense/${userID}`)
        .then(response => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response.error);
          }
        })
        .catch(error => {
          reject(error.error);
        });
    })


}

const alertPageInstance = new alertPage()

export default alertPageInstance