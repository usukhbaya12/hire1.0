import axios from "axios";
import { getAuthToken } from "../utils/auth";
import { api } from "../utils/routes";

export const getAssessments = async () => {
  try {
    const res = await axios.get(`${api}assessment/all?limit=200&page=0`);
    return {
      data: res.data.payload,
      token: true,
      message: res.data?.message,
      status: res.data?.status,
      success: res.data.succeed,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message:
        error.response?.data?.message || "Сервертэй холбогдоход алдаа гарлаа.",
    };
  }
};

export const getHome = async () => {
  try {
    const res = await axios.get(`${api}assessment/home/page`);
    return {
      data: res.data.payload,
      token: true,
      message: res.data?.message,
      status: res.data?.status,
      success: res.data.succeed,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message:
        error.response?.data?.message || "Сервертэй холбогдоход алдаа гарлаа.",
    };
  }
};

export const getAssessmentCategory = async () => {
  try {
    const res = await axios.get(`${api}assessmentCategory`);
    return {
      data: res.data.payload,
      token: true,
      message: res.data?.message,
      status: res.data?.status,
      success: res.data.succeed,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message:
        error.response?.data?.message || "Сервертэй холбогдоход алдаа гарлаа.",
    };
  }
};

export const getAssessmentById = async (id) => {
  try {
    const res = await axios.get(`${api}assessment/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return {
      data: res.data.payload,
      token: true,
      message: res.data?.message,
      status: res.data?.status,
      success: res.data.succeed,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message:
        error.response?.data?.message || "Сервертэй холбогдоход алдаа гарлаа.",
    };
  }
};

export const getUserTestHistory = async (id) => {
  const token = await getAuthToken();
  if (!token) return { token: false };

  try {
    const res = await axios.get(`${api}userService/user/${id}/200/1`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return {
      data: res.data.payload,
      token: true,
      message: res.data?.message,
      status: res.data?.status,
      success: res.data.succeed,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message:
        error.response?.data?.message || "Сервертэй холбогдоход алдаа гарлаа.",
    };
  }
};
