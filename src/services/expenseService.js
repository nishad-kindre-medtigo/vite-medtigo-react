import axios from '../utils/axios';

class InvoiceService {

  addTravelExpenses  = (values, fileUploadAction) => new Promise((resolve, reject) => {
    axios.post('invoice/travelExpenses/add/', values, fileUploadAction)
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

  addMealsExpenses  = (values, fileUploadAction) => new Promise((resolve, reject) => {
    axios.post('invoice/mealsExpenses/add/', values, fileUploadAction)
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

  addSiteExpenses  = (values) => new Promise((resolve, reject) => {
    axios.post('invoice/siteExpenses/add/', values)
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

  getSiteExpenses = (limit, page) => new Promise((resolve, reject) => {
    axios.get('invoice/siteExpenses/user?page=' + page + '&limit=' + limit)
      .then((response) => {
        if (response.data) {
          resolve(response.data.data.data);
        } else {
          reject(response.data.error);
        }
      })
      .catch((error) => {
        reject(error);
      });
  })

  getMealExpenses = (limit, page) => new Promise((resolve, reject) => {
    axios.get('invoice/mealsExpenses/user?page=' + page + '&limit=' + limit)
      .then((response) => {
        if (response.data) {
          resolve(response.data.data.data);
        } else {
          reject(response.data.error);
        }
      })
      .catch((error) => {
        reject(error);
      });
  })

  getTravelExpenses = (limit, page) => new Promise((resolve, reject) => {
    axios.get('invoice/travelExpenses/user?page=' + page + '&limit=' + limit)
      .then((response) => {
        if (response.data) {
          resolve(response.data.data.data);
        } else {
          reject(response.data.error);
        }
      })
      .catch((error) => {
        reject(error);
      });
  })
  

}

const invoiceService = new InvoiceService();

export default invoiceService;
