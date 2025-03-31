import axios from "axios";
import { getAuthToken } from "../utils/auth";
import { api } from "../utils/routes";

export const signup = async (data) => {
  try {
    const response = await axios.post(`${api}register`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return {
      data: response.data.payload,
      message: response.data?.message,
      status: response.data?.status,
      success: response.data.succeed,
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

export const purchaseTest = async (count, testId) => {
  try {
    const token = await getAuthToken();
    if (!token) return { token: false };
    const response = await axios.post(
      `${api}userService`,
      {
        count: count,
        assessment: parseInt(testId),
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      data: response.data.payload,
      message: response.data?.message,
      status: response.data?.status,
      success: response.data.succeed,
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

export const userService = async (testId, count = 1) => {
  try {
    const token = await getAuthToken();
    if (!token) return { token: false };
    const response = await axios.post(
      `${api}userService`,
      { count, assessment: parseInt(testId) },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      data: response.data.payload,
      token: true,
      message: response.data?.message,
      status: response.data?.status,
      success: response.data.succeed,
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

export const checkPayment = async (serviceId, invoiceId) => {
  try {
    const token = await getAuthToken();
    if (!token) return { token: false };

    const response = await axios.get(
      `${api}userService/checkPayment/${serviceId}/${invoiceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      data: response.data.payload,
      token: true,
      message: response.data?.message,
      status: response.data?.status,
      success: response.data.succeed,
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

export const getCode = async ({ service, count, startDate, endDate }) => {
  try {
    const token = await getAuthToken();
    if (!token) return { token: false };

    const payload = { service, count };
    if (startDate) payload.startDate = startDate;
    if (endDate) payload.endDate = endDate;

    const { data } = await axios.post(`${api}userService/exam`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return {
      data: data.payload,
      token: true,
      message: data?.message,
      status: data?.status,
      success: data.succeed,
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

export const emailVerify = async (email) => {
  try {
    const response = await axios.post(
      `${api}user/email`,
      { email },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return {
      data: response.data.payload,
      message: response.data?.message,
      status: response.data?.status,
      success: response.data.succeed,
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

export const sendInvite = async (links) => {
  const token = await getAuthToken();
  if (!token) return { token: false };

  try {
    const response = await axios.post(
      `${api}userService/send`,
      { links },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      data: response.data.payload,
      token: true,
      message: response.data?.message,
      status: response.data?.status,
      success: response.data.succeed,
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

export const sendPasswordResetCode = async (email) => {
  try {
    const response = await axios.get(`${api}user/forget/send/${email}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return {
      data: response.data.payload,
      message: response.data?.message,
      status: response.data?.status,
      success: response.data.succeed,
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

export const verifyPasswordResetCode = async (code, email) => {
  try {
    const response = await axios.get(
      `${api}user/forget/verify/${code}/${email}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return {
      data: response.data.payload,
      message: response.data?.message,
      status: response.data?.status,
      success: response.data.succeed,
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

export const resetPassword = async (email, password) => {
  try {
    const response = await axios.post(
      `${api}user/forget/password`,
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return {
      data: response.data.payload,
      message: response.data?.message,
      status: response.data?.status,
      success: response.data.succeed,
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

export const updatePassword = async (oldPassword, password) => {
  const token = await getAuthToken();
  if (!token) return { token: false };
  try {
    const response = await axios.post(
      `${api}user/password`,
      {
        oldPassword,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      data: response.data.payload,
      message: response.data?.message,
      status: response.data?.status,
      success: response.data.succeed,
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

export const updateUserProfile = async (userId, userData) => {
  const token = await getAuthToken();
  if (!token) return { token: false };
  try {
    const response = await axios.patch(`${api}user/${userId}`, userData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      data: response.data.payload,
      message: response.data?.message,
      status: response.data?.status,
      success: response.data.succeed,
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

export const getCurrentUser = async () => {
  try {
    const token = await getAuthToken();
    if (!token) return { token: false };

    const response = await axios.get(`${api}user/get/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return {
      data: response.data.payload,
      token: true,
      message: response.data?.message,
      status: response.data?.status,
      success: response.data.succeed,
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

export const getPaymentHistory = async (
  role = 0,
  id,
  page = 1,
  limit = 1000
) => {
  try {
    const token = await getAuthToken();
    if (!token) return { token: false };
    const response = await axios.get(
      `${api}payment/view/${role}/${id}/${page}/${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      data: response.data.payload,
      token: true,
      message: response.data?.message,
      status: response.data?.status,
      success: response.data.succeed,
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

export const extendExamDate = async (id, endDate) => {
  const token = await getAuthToken();
  if (!token) return { token: false };
  try {
    const response = await axios.patch(`${api}exam/date/${id}`, endDate, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      data: response.data.payload,
      message: response.data?.message,
      status: response.data?.status,
      success: response.data.succeed,
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
