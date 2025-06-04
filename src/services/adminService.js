import axios from 'src/utils/axios';

class AdminService {
  getAcquisitionLicenseSummary = (departments = [], usersFilterIds = [], states = []) =>
    new Promise((resolve, reject) => {
      axios
        .post(`/admin/acquisition/license/count`, {
          departments,
          usersFilterIds,
          states
        })
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

  getUserAcquisitionLicense = (departments = [], userIDs = [], statesFilter = []) =>
    new Promise((resolve, reject) => {
      axios
        .post(`/admin/acquisition/license/user`, { departments, userIDs, statesFilter })
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

    getUserAcquisitionLicenseOverdueTasks = (taskIds = []) =>
    new Promise((resolve, reject) => {
      axios
        .post(`/admin/acquisition/over-due-task-details`, { taskIds })
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

  getClinicalCertificateSummary = (
    departments = [],
    designation_id = [],
    certificateIds = [],
    usersFilterIds = [],
    date = null
  ) =>
    new Promise((resolve, reject) => {
      axios
        .post(`/admin/providerCard/count`, {
          departments,
          designation_id,
          certificateIds,
          usersFilterIds,
          date
        })
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

  getUserClinicalCertificate = (userIDs = [], certificateIds = [], date = null) =>
    new Promise((resolve, reject) => {
      axios
        .post(`/admin/providerCard/user`, { userIDs, certificateIds, date })
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

  getDEASummary = (departments = [], usersFilterIds = [], states = [], date = null) =>
    new Promise((resolve, reject) => {
      axios
        .post(`/admin/dea/count`, { departments, usersFilterIds, states, date })
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

  getUserDEA = (departments = [], userIDs = [], statesFilter = [], date = null) =>
    new Promise((resolve, reject) => {
      axios
        .post(`/admin/dea/user`, { departments, userIDs, statesFilter, date })
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

  getStateCSRSummary = (departments = [], usersFilterIds = [], states = [], date = null) =>
    new Promise((resolve, reject) => {
      axios
        .post(`/admin/csr/count`, { departments, usersFilterIds, states, date })
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

  getUserStateCSR = (departments = [], userIDs = [], states = [], date = null) =>
    new Promise((resolve, reject) => {
      axios
        .post(`/admin/csr/user`, { departments, userIDs, states, date })
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

  getCMEDonutChartData = (DepartmentIDs = [], HospitalIDs = []) =>
    new Promise((resolve, reject) => {
      axios
        .post(`/teamCmeCompliance/get-compliance-pie-chart-data`, {
          DepartmentIDs,
          HospitalIDs
        })
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

  getClinicalDonutChartData = (departments = []) =>
    new Promise((resolve, reject) => {
      axios
        .post(`/admin/providerCardDashboard/count`, {
          departments
        })
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

  getStateLicenseDonutChartData = (departments = []) =>
    new Promise((resolve, reject) => {
      axios
        .post(`/admin/licenseDashboard/count`, {
          departments
        })
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

  getDEADonutChartData = (departments = []) =>
    new Promise((resolve, reject) => {
      axios
        .post(`/admin/deaDashboard/count`, {
          departments
        })
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

  getStateCSRDonutChartData = (departments = []) =>
    new Promise((resolve, reject) => {
      axios
        .post(`/admin/csrDashboard/count`, {
          departments
        })
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

  getCMEBarChartData = (
    DepartmentIDs = [],
    HospitalIDs = [],
    startMonth,
    endMonth
  ) =>
    new Promise((resolve, reject) => {
      axios
        .post(`/teamCmeCompliance/get-compliance-bar-chart-data`, {
          DepartmentIDs,
          HospitalIDs,
          startMonth,
          endMonth
        })
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

  getRegulatoryBarChartData = (departments = [], dateRanges = []) =>
    new Promise((resolve, reject) => {
      axios
        .post(`/admin/regulatory/chart/count`, {
          departments,
          dateRanges
        })
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

const adminService = new AdminService();

export default adminService;
