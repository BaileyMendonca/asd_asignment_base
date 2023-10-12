import axios from "axios";

// const API_URL = "http://localhost:4000";
const API_URL = "https://41026asdspa.com";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

type Availbility = {
  email: string;
  StartTime: string;
  EndTime: string;
  status: string;
};
export const submitAvailability = async (data: Availbility) => {
  try {
    const response = await axiosInstance.post(
      "/availabilities/submitleave",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteAvailability = async (id: number) => {
  try {
    const response = await axiosInstance.post(
      "/availabilities/deleteavailability",
      {
        params: {
          id: id,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const handleAvailabilityStatusChange = async (
  id: number,
  status: string
) => {
  try {
    const response = await axiosInstance.post(
      "/availabilities/updateavailability",
      {
        params: {
          id: id,
          status: status,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllPendingAvailabilities = async () => {
  try {
    const response = await axiosInstance.get(
      "/availabilities/getpendingavailabilities"
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAvailabilities = async (email: string) => {
  try {
    const response = await axiosInstance.get(
      "/availabilities/getavailabilities",
      {
        params: {
          email: email,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
