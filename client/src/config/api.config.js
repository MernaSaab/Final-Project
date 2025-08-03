/**
 * API Configuration
 * Contains settings for connecting to the backend server
 */
//חיובר הקליינט לסירביר
const API_CONFIG = {
  BASE_URL: "http://localhost:3001",
  TIMEOUT: 10000, // 10 seconds
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export default API_CONFIG;
