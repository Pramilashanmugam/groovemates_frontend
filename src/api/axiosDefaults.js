import axios from "axios";

axios.defaults.baseURL = 'https://groovemates-frontend-b3335269700f.herokuapp.com'
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
axios.defaults.withCredentials = true
