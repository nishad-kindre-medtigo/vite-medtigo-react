import axios from 'src/utils/axios';

class ShiftServices {
  getShift = () =>
    new Promise((resolve, reject) => {
      let url = '/shift/';
      axios
        .get(url)
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

    getShiftsForASchedule = (scheduleId) =>
    new Promise((resolve, reject) => {
      let url = `/shift/get/${scheduleId}`;
      axios
        .get(url)
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
    })

}

const shiftServices = new ShiftServices();

export default shiftServices;
