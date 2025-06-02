import axios from 'axios';
import { APP_URL, PYTHON_SERVER_URL } from '../settings';

const instance = axios.create(
  {
    baseURL: APP_URL
  }
);

const PYTHON_SERVER = axios.create(
  {
    baseURL: PYTHON_SERVER_URL
  }
);
export default instance;
export { PYTHON_SERVER };