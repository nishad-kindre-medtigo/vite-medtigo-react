import axios from 'src/utils/axios';

class OrderServices {
  validateService  = (data) => new Promise((resolve, reject) => {
    axios.post(`/order/validate`, data)
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
  disableUrlService  = (data) => new Promise((resolve, reject) => {
    axios.post(`/order/disable-link`, data)
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

  addOrderFromMarket = (data) => new Promise((resolve, reject) => {
    
    axios.post(`/order/add`, data)
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


  orderGate = id =>
    new Promise((resolve, reject) => {
      axios
        .get(`/order/getUserOrderDetail/${id}`)
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

    getRecentOrderNumber = () =>
    new Promise((resolve, reject) => {
      axios
        .get(`/order?limit=1`)
        .then(response => {
          if (response.data) {
            resolve(response.data.data[0].order_number+1);
          } else {
            reject(response.data.error);
          }
        })
        .catch(error => {
          reject(error);
        });
    });

    isFullAccessOrder = () => new Promise((resolve, reject) => {
      
      axios.get(`/order/get-full-access-order`)
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

    getCourseLatestOrder = courseID => new Promise((resolve, reject) => {
      
      axios.get(`/order/latest/${courseID}`)
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

    oderValidationForSimulation = (userId) => new Promise((resolve, reject) => {
      
      axios.get(`/order/get-order-for-simulation-validation/${userId}`)
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

    getOrderItemsDetailsForCourses = (email) => new Promise((resolve, reject) => {
      axios.get(`/order/get-orderDetail-courses/${email}`)
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

    addBenefit = (orderId, benefitKey, benefitValue) => new Promise((resolve, reject) => {
      axios
        .post('/order/add-order-benefit', { orderId, benefitKey, benefitValue })
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

    addOrderQuizIDLink = (orderId, quizID) => new Promise((resolve, reject) => {
      axios
        .post('/order/add-quiz-link', { orderId, quizID })
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

    regenarateEmail = (email, productId) => new Promise((resolve, reject) => {
      axios.post("/order/regenarate", {
          email: email,
          productId: productId
      }).then(response => {
        if (response.data) resolve(response.data.data)
        else reject(response.data.error)
    }).catch(err => reject(err))
  })
    
}

const orderServices = new OrderServices();
export default orderServices;
