// src/lib/axios.js
import axios from "axios";

// Ensure this BASE_URL points to your backend's URL and PORT
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/api"; // Make sure port is 5001!

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // <--- THIS IS ABSOLUTELY ESSENTIAL for sending/receiving cookies
});