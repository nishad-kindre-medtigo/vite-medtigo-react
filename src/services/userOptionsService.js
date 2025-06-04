import axios from 'src/utils/axios';

class UseroptionsService {

    getUserOptions = () => new Promise((resolve, reject) => {
        axios.get(`/userOptions`)
            .then((response) => {
                if (response.data) {
                    resolve(response.data.data[0]);
                } else {
                    reject(response.data.error);
                }
            })
            .catch((error) => {
                reject(error);
            });
    });

    updateUserOptions = (data) => new Promise((resolve, reject) => {
        axios.put('/userOptions', data)
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

const useroptionsServices = new UseroptionsService();

export default useroptionsServices;
