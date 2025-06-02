import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = import.meta.env.VITE_REACT_APP_ENCRYPTION_KEY;

const encrypt = (value) => {
  return CryptoJS.AES.encrypt(
    value,
    ENCRYPTION_KEY
  ).toString();
};

export default encrypt