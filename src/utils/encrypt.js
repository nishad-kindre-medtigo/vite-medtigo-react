import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

const encrypt = (value) => {
  try {
    return CryptoJS.AES.encrypt(value, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error("Encryption failed:", error);
    throw error;
  }
};

export default encrypt;
