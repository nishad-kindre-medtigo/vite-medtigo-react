import axios from '../utils/axios';

class SimulationService {

  getSimulationCaseStatus  = (email) => new Promise((resolve, reject) => {
    
    axios.get('/simulation/userSimulationCaseStatus/'+email)
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

  getSimulationCaseAttempt  = (email) => new Promise((resolve, reject) => {
    axios.get('/simulation/userSimulationAttemptedCaseStatus/'+email)
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


const simulationService = new SimulationService();

export default simulationService;
