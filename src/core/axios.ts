import axios from 'axios';

export const localApi = axios.create({
  baseURL: 'http://localhost:3000/',
});

export const herokuApi = axios.create({
  baseURL: 'https://refinery-finance.herokuapp.com/',
});
