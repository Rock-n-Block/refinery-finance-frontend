import axios from 'axios';

export const localApi = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3001/'
      : 'https://refineryfinance.herokuapp.com/',
});
