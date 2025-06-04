import { CertificateVariants } from 'src/appConstants';
import axios from 'src/utils/axios';

class RenewOrderService {

  getCertificateRenewalData = (
    course_id=null, 
    Certificate_Id=null, 
    Certificate_UID=null,
    limit=null,
    sort_by=null,
    Renewal_Complete=null,
    order=null) => new Promise((resolve, reject) => {
    if (course_id && course_id!=null) {
      const data = CertificateVariants.find(it => it.Course_id == course_id);
      Certificate_Id = data.id;
    }
  
    axios.get(`/renewOrders/renewal?Certificate_UID=${Certificate_UID}&Certificate_Id=${Certificate_Id}&limit=${limit}&sort_by=${sort_by}&order=${order}&Renewal_Complete=${Renewal_Complete}`)
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

  testAddOrder = (values) => new Promise((resolve, reject) => {
    axios.post(`/order/add`, values)
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

  getClaimedData = (id, user_id) => new Promise((resolve, reject) => {
    axios.get(`/renewOrders/renewal/claim?certificate_id=${id}&user_id=${user_id}`)
      .then((response) => {
        if (response.data.data) {
          resolve(response.data);
        } else {
          reject(response.data.error);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });

  getBLSSyllabusPDF = async () => {
    axios({
      url: `renewOrders/renewal/BLSPdf`,
      method: 'GET',
      responseType: 'blob',
      headers: {
        Accept: 'application/pdf',
      },
    }).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.style.display = 'none';
      link.setAttribute('download', 'BLSSyllabusPDF.pdf');
      document.body.appendChild(link);
      link.click();
    })

  };

  getACLSSyllabusPDF = async () => {
    axios({
      url: `renewOrders/renewal/ACLSPdf`,
      method: 'GET',
      responseType: 'blob',
      headers: {
        Accept: 'application/pdf',
      },
    }).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.style.display = 'none';
      link.setAttribute('download', 'ACLSSyllabusPDF.pdf');
      document.body.appendChild(link);
      link.click();
    })

  };

  getPALSSyllabusPDF = async () => {
    axios({
      url: `renewOrders/renewal/PALSPdf`,
      method: 'GET',
      responseType: 'blob',
      headers: {
        Accept: 'application/pdf',
      },
    }).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.style.display = 'none';
      link.setAttribute('download', 'PALSSyllabusPDF.pdf');
      document.body.appendChild(link);
      link.click();
    })

  };

  getRenewalFalseRecords = (Certificate_Id) => new Promise((resolve, reject) => {
    axios.get(`/renewOrders/renewal/renewal-records/${Certificate_Id}`)
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

  isOrderItemWithValidHash = (course_id) => new Promise((resolve, reject) => {
    axios.get(`/renewOrders/renewal/getOrderWithHash?course_id=${course_id}`)
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

const RenewOrderServices = new RenewOrderService();
export default RenewOrderServices;
