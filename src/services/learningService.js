import axios from 'src/utils/axios';

class LearningServices {

  getAllCourses = (id) => new Promise((resolve, reject) => {
    axios.get(`/lms/courses/${id ? id : ''}`)
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

  getAllBlogs = () => new Promise((resolve, reject) => {
    axios.get(`/lms/blogs/`)
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

  generateCertificate  = (values) => new Promise((resolve, reject) => {
    axios.post('/lms/generate-certificate', values)
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

  submitSurvey  = (values) => new Promise((resolve, reject) => {
    axios.post('/lms/submit-survey', values)
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

  // Submit Course Feedback After Provider Card Generation
  submitCourseFeedback = data =>
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

  getUserProgresses = email => new Promise((resolve, reject) => {
    axios.get(`/lms/course/progress?email=${email}`)
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

  getSingleCourseProgress = (userID, courseID) => new Promise((resolve, reject) => {
    axios.get(`/lms/course-progress/${userID}/${courseID}`)
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

  addQuizLog  = (values) => new Promise((resolve, reject) => {
    axios.post('/quizLog', values)
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

  getCompletedQuizDetails  = (uniqueID) => new Promise((resolve, reject) => {
    axios.get(`/quizLog/uniqueID/${uniqueID}`, uniqueID)
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

  updateCourseProgress = (id, courseID) => new Promise((resolve, reject) => {
    axios.put(`/lms/courses/update-progress/${id}`, {courseID})
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

  getQuizzesData = (id) => new Promise((resolve, reject) => {
    axios.get(`/lms/quiz/${id ? id : ''}`)
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

  generateCMECertificate  = (values) => new Promise((resolve, reject) => {
    axios.post('/lms/generate-cme-certificate', values)
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
  OpioidFormSubmit  = (values) => new Promise((resolve, reject) => {
    axios.post('/opioidForm/opioidForm', values)
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

  getCourseSubscriptionData  = (id) => new Promise((resolve, reject) => {

    axios.get('/user/get/courseSubscriptions/'+id)
      .then((response) => {
        if (response.data.response) {
          resolve(response.data.response);
        } else {
          reject(response.data.response.error);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });

redirectToPlace = (place) => new Promise((resolve, reject) => {
  axios.get(`/lms/redirect/:${place}`)
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

const LearningService = new LearningServices();

export default LearningService;
