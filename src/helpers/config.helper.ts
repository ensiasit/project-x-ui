export const API_BASE_URL =
  process.env.REACT_APP_ENV === "production"
    ? "/api/v1"
    : "http://localhost:8080/api/v1";
