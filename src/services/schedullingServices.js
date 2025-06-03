import axios from '../utils/axios';

class SchedullingService {
  getUserSchedule = filters =>
    new Promise((resolve, reject) => {
      axios
        .get(`/schedule/personal?${filters}`)

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

  getSchedules = () =>
    new Promise((resolve, reject) => {
      axios
        // .get(
        //   `/schedule/?status=opened&schedule=${schedule.value}&start=${start}&end=${end}`
        // )
        .get(`/schedule/?status=opened`)
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

  userShifts = values =>
    new Promise((resolve, reject) => {
      axios
        .post(`/shift/user`, values)
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

  scheduleShift = filters =>
    new Promise((resolve, reject) => {
      axios
        .post(`/schedule/slots?${filters}`)
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

  shiftRequest = values =>
    new Promise((resolve, reject) => {
      axios
        .post(`/shift/request`, values)
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

  swapRequest = values =>
    new Promise((resolve, reject) => {
      axios
        .post(`/shift/request/swap`, values)
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

      deleteSwapRequest = id =>
    new Promise((resolve, reject) => {
      axios
        .delete(`/shift/request/swap/${id}`)
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

  acceptRequest = (id, name) =>
    new Promise((resolve, reject) => {
      axios
        .put(`/shift/request`, {
          id: id,
          status: 'providerAccepted',
          name: name
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

  rejectRequest = (id, name) =>
    new Promise((resolve, reject) => {
      axios
        .put(`/shift/request`, {
          id: id,
          status: 'rejected',
          name: name
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

  getSentRequest = (userId) =>
    new Promise((resolve, reject) => {
      axios
        .get(`/shift/request/get/${userId}`)
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

  getSwapRequest = (id) =>
    new Promise((resolve, reject) => {
      axios
        .get(`/shift/request/get/swap/${id}`)
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
    getTeamSchedule=Data =>

    new Promise((resolve,reject)=>{
      axios.get(`/schedule/teamSchedule`,Data)
      .then(response=>{
        if (response.data) {
          resolve(response.data);

        } else {
          reject(response.data.error);
        }
      })
    })

    getGroupSchedule=Data =>

      new Promise((resolve,reject)=>{
        axios.get(`/schedule/schedule/allschedule`,Data)
        .then(response=>{
          if (response.data) {
            resolve(response.data);

          } else {
            reject(response.data.error);
          }
        })
      })

    getDraftSchedule = id =>
      new Promise((resolve, reject) => {
        axios.get(`/schedule/draft/${id}`).then(response => {
          if (response.data) {
            resolve(response.data.data);
          } else {
            reject(response.data.error);
          }
        });
      });


    getUserSchedulednd=Data =>
    
    new Promise((resolve,reject)=>{
      axios.get(`/schedule/users/schedule`,Data)
      .then(response=>{
        if (response.data) {
          resolve(response.data);
          
        } else {
          reject(response.data.error);
        }
      })
    })

    getOpenSchedules = (scheduleId,userId) => 
    new Promise((resolve,reject)=>{
      axios.get(`/schedule/availability/${scheduleId}/${userId}`)
      .then(response=>{
        if (response.data) {
          resolve(response.data);
          
        } else {
          reject(response.data.error);
        }
      }).catch(response => {
          reject(response);
      })
    })


    getPublishedShift = (scheduleId) => 
      new Promise((resolve,reject)=>{
        axios.get(`schedule/info/${scheduleId}`)
        .then(response=>{
          if (response.data) {
            resolve(response.data);

          } else {
            reject(response.data.error);
          }
        }).catch(response => {
            reject(response);
        })
      })

      
    getScheduleForDepartment = (departmentId, userId) => 
    new Promise((resolve,reject)=>{
      axios.get(`/schedule/department/${departmentId}/${userId}`)
      .then(response=>{
        if (response.data) {
          resolve(response.data);
          
        } else {
          reject(response.data.error);
        }
      }).catch(response => {
          reject(response);
      })
    })

    saveProviderAvailability = data => 
    new Promise((resolve,reject)=>{
      axios.post(`/providerAvailability/add`, data)
      .then(response=>{
        if (response.data) {
          resolve(response.data);
          
        } else {
          reject(response.data.error);
        }
      })
    })
}

const schedullingServices = new SchedullingService();

export default schedullingServices;
