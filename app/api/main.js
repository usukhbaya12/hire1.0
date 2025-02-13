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
      message: "Сервертэй холбогдоход алдаа гарлаа.",
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
      message: "Сервертэй холбогдоход алдаа гарлаа.",
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
      message: "Сервертэй холбогдоход алдаа гарлаа.",
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
      message: "Сервертэй холбогдоход алдаа гарлаа.",
    };
  }
};

export const getCode = async ({ service, count, startDate, endDate }) => {
  try {
    const token = await getAuthToken();
    if (!token) return { token: false };
    const { data } = await axios.post(
      `${api}userService/exam`,
      { service, count, startDate, endDate },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

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
      message: "Сервертэй холбогдоход алдаа гарлаа.",
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
      message: "Сервертэй холбогдоход алдаа гарлаа.",
    };
  }
};
