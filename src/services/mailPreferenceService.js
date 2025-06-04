import axios from 'src/utils/axios';

class MailPreferenceService {
  getMailPreference = (id) =>
    new Promise((resolve, reject) => {
      axios
        .get(`/myPreferences/${id}`)
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

    updateMailPreference = (payload) =>
    new Promise((resolve, reject) => {
      axios
        .put(`/myPreferences`,payload)
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


}

const mailPreferenceService = new MailPreferenceService();

export default mailPreferenceService;
