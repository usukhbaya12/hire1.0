import axios from "axios";
import { getAuthToken } from "../utils/auth";
import { api } from "../utils/routes";

export const getExamQuestions = async (id, category = null) => {
  const token = await getAuthToken();

  try {
    const { data } = await axios.post(
      `${api}exam/code`,
      {
        code: parseInt(id),
        ...(category !== null && { category: parseInt(category) }),
      },
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
      message:
        error.response?.data?.message || "Сервертэй холбогдоход алдаа гарлаа.",
    };
  }
};

export const postUserAnswers = async (data, startDate, end) => {
  const token = await getAuthToken();

  try {
    const response = await axios.post(
      `${api}userAnswer`,
      { data, startDate, end },
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

export const getUserAnswer = async (code, id) => {
  const token = await getAuthToken();

  try {
    const response = await axios.get(`${api}userAnswer/${code}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return {
      data: response.data.payload.data,
      startDate: response.data.payload.startDate,
      endDate: response.data.payload.endDate,
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
