"use server";

import axios from "axios";
import { getAuthToken } from "../utils/auth";
import { api } from "../utils/routes";

export const getExamQuestions = async (id, category = null, con = false) => {
  const token = await getAuthToken();

  try {
    const { data } = await axios.post(
      `${api}exam/code/${con}`,
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

export const getReport = async (code) => {
  try {
    const token = await getAuthToken();
    if (!token) return { token: false };

    const response = await axios.get(`${api}exam/pdf/${code}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      responseType: "arraybuffer",
    });

    if (response.status === 202) {
      const msg = Buffer.from(response.data).toString();
      console.log(msg);
      return new NextResponse(
        JSON.parse(msg)?.message ?? "PDF download failed",
        {
          status: 202,
        }
      );
    }

    return {
      data: response.data,
      token: true,
      status: response.status,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      token: true,
      message: error.response?.message || "Сервертэй холбогдоход алдаа гарлаа.",
    };
  }
};

export const postFeedback = async (data) => {
  const token = await getAuthToken();

  try {
    const response = await axios.post(`${api}feedback`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
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

export const getExamResults = async (id) => {
  const token = await getAuthToken();

  try {
    const { data } = await axios.post(`${api}exam/calculation/${id}`, {
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

export const getExamCalculation = async (id) => {
  try {
    const token = await getAuthToken();

    const response = await axios.get(`${api}exam/exam/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
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
    console.error("Error getting exam calculation:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Сервертэй холбогдоход алдаа гарлаа.",
    };
  }
};

export const getReportStatus = async (id) => {
  try {
    const endpoint = `${api}report/${id}/status`;
    const res = await fetch(endpoint);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    return {
      success: true,
      payload: data.payload,
    };
  } catch (error) {
    console.error("Error fetching report status:", error);
    return {
      success: false,
      message: error.message || "Статус шалгахад алдаа гарлаа.",
    };
  }
};
