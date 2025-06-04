import axios,{PYTHON_SERVER} from 'src/utils/axios';
import axiosMain from 'axios';

class StateSpecificCMECervice {

    GetMyPreferneces = () => new Promise((resolve, reject) => {
        axios.get('/userPreferences')
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

    GetMyStates = () => new Promise((resolve, reject) => {
        axios.get('/userPreferences/my-states')
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

    SaveMyPreferneces = (payload) => new Promise((resolve, reject) => {
        axios.post('/userPreferences', payload)
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

    UpdateMyPreferneces = (payload) => new Promise((resolve, reject) => {
        axios.put('/userPreferences', payload)
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


    GenerateCMEReport = (payload) => new Promise((resolve, reject) => {
        PYTHON_SERVER.post('/', payload)
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

    GenerateTeamCMEReport = (payload) => new Promise((resolve, reject) => {
        axios.post('/teamCmeCompliance', payload)
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


    CheckUserLicenseExists = (state, profession_certificate_id = '3993767000000019870') => new Promise((resolve, reject) => {
        axios.get(`/userPreferences/check-license-exist?state=${state}&profession_certificate_id=${profession_certificate_id}`)

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

    // GenerateTeamCMEReport = (payload) => new Promise((resolve, reject) => {
    //     PYTHON_SERVER.post('/report/', payload)
    //         .then((response) => {
    //             if (response.data) {
    //                 resolve(response.data.data);
    //             } else {
    //                 reject(response.data.error);
    //             }
    //         })
    //         .catch((error) => {
    //             reject(error);
    //         });
    // });

    GetUsers = (payload) => new Promise((resolve, reject) => {
        axios.post('/teamCmeCompliance/get-users', payload)
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

    GetReportStatus = (email) => new Promise((resolve, reject) => {
        axios.get(`/teamCmeCompliance/get-compliance-report-status/${email}`)
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

    SendCMEReportToProvider = (payload) => new Promise((resolve, reject) => {
        axios.post(`/userPreferences/send-report-mail`,payload)
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

}

const StateSpecificCMECervices = new StateSpecificCMECervice();

export default StateSpecificCMECervices;