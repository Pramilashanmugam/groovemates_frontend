import axios from "axios";

axios.defaults.baseURL = 'https://groovemates-backend-b16861eb6026.herokuapp.com/'
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
axios.defaults.withCredentials = true

export const axiosReq = axios.create(); // intercept the request
export const axiosRes = axios.create(); // intercept the response
