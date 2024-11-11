import axios from 'axios'
export const instanceAxios = axios.create({
  // proxy: {
  //   protocol: 'https',
  //   host: import.meta.env.VITE_APP_MIDDLEWARE_API_URL,
  //   port: 443,
  // },
  method: 'POST',
  baseURL: import.meta.env.VITE_APP_MIDDLEWARE_API_URL
});

export const instanceAxiosUploadFiles = axios.create({
  // proxy: {
  //   protocol: 'http',
  //   host: import.meta.env.VITE_APP_MIDDLEWARE_API_URL,
  //   port: 443,
  // },
  method: 'POST',
  baseURL: import.meta.env.VITE_APP_URL_UPLOAD_SERVER,
});


// export const instanceAxiosTestApi = axios.create({
//   // proxy: {
//   //   protocol: 'http',
//   //   host: import.meta.env.VITE_APP_MIDDLEWARE_API_URL,
//   //   port: 443,
//   // },
//   method: 'GET',
//   // baseURL: import.meta.env,
// });

