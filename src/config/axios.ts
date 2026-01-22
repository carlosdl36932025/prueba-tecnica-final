import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { API_URL } from './env';

if (!API_URL) {
  console.warn('⚠️ API_URL está vacío. Revisa variables de entorno.');
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      console.error(`Error API [${error.response.status}]:`, error.response.data);
    } else if (error.request) {
      console.error('Error de red: Sin respuesta del servidor', error.request);
    } else {
      console.error('Error de configuración:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
