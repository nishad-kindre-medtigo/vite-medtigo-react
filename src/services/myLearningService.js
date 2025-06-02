import axios from '../utils/axios';

class MyLearningService {
  getMyLearningData = (userID) =>
    new Promise((resolve, reject) => {
      axios
        .get(`/myLearning/${userID}`)
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

  getCourseMyLearningData = (userID, courseID) =>
    new Promise((resolve, reject) => {
      axios
        .get(`/myLearning/${userID}/${courseID}`)
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

  getCourseLatestOrder = (userID, courseID) =>
    new Promise((resolve, reject) => {
      axios
        .get(`/myLearning/latest-order/${userID}/${courseID}`)
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

  getCMEStepperData = (userID) =>
    new Promise((resolve, reject) => {
      axios
        .get(`/myLearning/cme-stepper/${userID}`)
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

const myLearningService = new MyLearningService();

export default myLearningService;
