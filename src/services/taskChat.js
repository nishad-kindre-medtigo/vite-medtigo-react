import axios from '../utils/axios';

class TaskChatService {
  // Fetch TaskChat messages (by senderID, receiverID, or message ID)
  getTaskChat = (taskID) =>
    new Promise((resolve, reject) => {
      axios
        .get(`/taskChat?&taskID=${taskID}`)
        .then(response => {
          if (response.data || response.message === "No chats found") {
            resolve(response.data.data);
          } else {
            reject(response.data.error);
          }
        })
        .catch(error => {
          console.log(error);
          if(error.message === "No chats found"){
            resolve([])
          }else reject(error);
        });
    });

  // Add a new TaskChat message
  addTaskChat = values =>
    new Promise((resolve, reject) => {
      axios
        .post('/taskChat', values)
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

  // Read TaskChat message
  readTaskChat = values =>
    new Promise((resolve, reject) => {
      axios
        .post('/taskChat/read', values)
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

  // Delete a TaskChat message (soft-delete by ID)
  deleteTaskChat = id =>
    new Promise((resolve, reject) => {
      axios
        .delete(`/taskChat/${id}`)
        .then(response => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response);
          }
        })
        .catch(error => {
          reject(error);
        });
    });

  // Update a TaskChat message (by ID)
  updateTaskChat = (id, values) =>
    new Promise((resolve, reject) => {
      axios
        .put(`/taskChat/${id}`, values)
        .then(response => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
}

const taskChatServices = new TaskChatService();

export default taskChatServices;