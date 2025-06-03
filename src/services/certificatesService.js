import axios from '../utils/axios';

class CertificatesService {

  getUserCertificates  = (type) => new Promise((resolve, reject) => {
    axios.get(`/certificates${type ? `?type=${type}` : ''}`)
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

  getDummyCertificates  = () => new Promise((resolve, reject) => {
    axios.get(`/certificates/dummy`)
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

  getDEACertificates  = () => new Promise((resolve, reject) => {
    axios.get(`/certificates/user/dea`)
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

  getStateCSRCertificates  = () => new Promise((resolve, reject) => {
    axios.get(`/certificates/user/state-csr`)
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

  deleteUserCertificates  = (certificateID, type) => new Promise((resolve, reject) => {
    axios.delete(`/certificates/${certificateID}${type ? `?type=${type}` : ''}`)
      .then((response) => {
        if (response.data) {
          resolve(response.data);
        } else {
          reject(response.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });

  addUserCertificates  = (values, fileUploadAction) => new Promise((resolve, reject) => {
    axios.post('/certificates', values, fileUploadAction)
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

  sendCertificateEmail  = (values, certificateID) => new Promise((resolve, reject) => {
    axios.post('/certificates/send-email/' + certificateID, values)
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

  sendProviderCardEmail  = (payload) => new Promise((resolve, reject) => {
    axios.post('/certificates/send-provider-card-email', payload)
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
  
  sendCMECertificateEmail  = (payload) => new Promise((resolve, reject) => {
    axios.post('/certificates/send-cme-certificate-email', payload)
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

  editUserCertificate  = (values, certificateID, fileUploadAction) => new Promise((resolve, reject) => {
    axios.put('/certificates/' + certificateID, values, fileUploadAction)
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

  addCertificateStepOne  = (values) => new Promise((resolve, reject) => {
    axios.post('/auth/createDoctor', values)
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

  editCertificate = (certificate_id, values) => new Promise((resolve, reject) => {
    axios.put(`/certificates/${certificate_id}`,values)
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

  getCertificateStatus = (certificateId) => new Promise((resolve, reject) => {
    axios.get(`/certificateEdit/`+certificateId)
    .then((response) => {
      if(response.data){
        resolve(response.data.data)
      }else{
        reject(response.data.error)
      }
    }).catch((error) => {
      reject(error);
    });
  });

  getNotesData  = (certificateId) => new Promise((resolve, reject) => {
    axios.get('/certificatesNotes/'+certificateId)
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

    getAnalyst  = () => new Promise((resolve, reject) => {
    axios.get('/certificatesNotes/')
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

  getCertificateTask  = (certificateId) => new Promise((resolve, reject) => {
    // axios.get('/certificatesNotes/'+certificateId)
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

  sendCertificateRegenerateEmail  = (values) => new Promise((resolve, reject) => {
    axios.post('/certificateEdit/certificate-regenerate-user-email',values)
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

  sendGenerateCertificateErrorMail  = (values) => new Promise((resolve, reject) => {
    axios.post('/certificates/send-certificate-error-mail', values)
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

  addLicenseTypeCertificates  = (values, fileUploadAction) => new Promise((resolve, reject) => {
    axios.post('/certificates/licenseType', values, fileUploadAction)
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

  fullCertificateRequest  = (values) => new Promise((resolve, reject) => {
    axios.post('/certificateEdit/fullCourse/Certificate/Request/', values)
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

  ifCertificateExist  = () => new Promise((resolve, reject) => {
    axios.get(`/certificates/certificate/exist`)
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

  isCertificateValiditExpired  = (id) => new Promise((resolve, reject) => {
    axios.get(`/certificates/expired?Certificate_Name=${id}`)
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

  getUserCertificatesByState  = (state) => new Promise((resolve, reject) => {
    axios.get(`/certificates/user-certificates?state=${state}`)
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

  // service for retake exam, it will provide latest full access order when passed course id
  getFullAccessOrder  = (id) => new Promise((resolve, reject) => {
    axios.get(`/order/get-latest-full-access-order/${id}`)
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


const certificatesService = new CertificatesService();

export default certificatesService;
