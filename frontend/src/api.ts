import axios from "axios";

// const API_URL = "http://localhost:4000";
const API_URL = "https://41026asdspa.com";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Define the type for the user data you're sending to the signup endpoint.
type SignupData = {
  email: string;
  password: string;
  // ... other fields
};

// Function to handle user signup
export const signup = async (data: SignupData) => {
  try {
    const response = await axiosInstance.post("/auth/signup", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

type loginData = {
  email: string;
  password: string;
};

export const login = async (data: loginData) => {
  try {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
