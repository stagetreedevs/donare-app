import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// export const BASE_URL = "http://192.168.0.2:1337";
export const BASE_URL = 'http://137.184.180.94';
// export const BASE_URL = "https://donare-api.herokuapp.com";

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;

export async function getToken(token) {
  if (token) {
    api.defaults.headers = {Authorization: `Bearer ${token}`};
  } else {
    delete api.defaults.headers.Authorization;
    await AsyncStorage.clear();
  }
}
