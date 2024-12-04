import axios from "axios";

// Set up global default configuration for axios requests
axios.defaults.baseURL =
  "https://groovemates-backend-b16861eb6026.herokuapp.com/"; // The base URL for all requests
axios.defaults.headers.post["Content-Type"] = "multipart/form-data"; // Set default content type for POST requests (for file uploads)
axios.defaults.withCredentials = true; // Ensure that cookies (including authentication cookies) are sent with requests

// Create a custom instance for request interception
export const axiosReq = axios.create(); // This instance can be used to intercept requests

// Create a custom instance for response interception
export const axiosRes = axios.create(); // This instance can be used to intercept responses
