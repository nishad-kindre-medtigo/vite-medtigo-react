import axios from 'src/utils/axios';

class serviceFormRegistration {

    addForm = data =>
    new Promise((resolve, reject) => {
      axios
        .post('/serviceRegistrationForm', data )
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

const serviceFormRegistrationInstance = new serviceFormRegistration()

export default serviceFormRegistrationInstance