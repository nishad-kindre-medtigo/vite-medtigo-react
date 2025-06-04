import axios from 'src/utils/axios';

class LicenseReportServices {

    getLicenseStatusCountReport = (data) => new Promise((resolve, reject) => {

        axios.post(`/admin/license/count`,data)
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
    })


    getLicenseStatusDetailedReport = (data) => new Promise((resolve, reject) => {

        axios.post(`/admin/license/user/`,data)
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
    })


}

const licenseReportServices = new LicenseReportServices();
export default licenseReportServices;
