import axios from '../utils/axios';

class UpdateProfileServices {

    addMyCredPoints = (id) => new Promise((resolve, reject) => {
      axios.post('/credPoints/'+id)
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
  
  const UpdateProfileService = new UpdateProfileServices();
  
  export default UpdateProfileService;