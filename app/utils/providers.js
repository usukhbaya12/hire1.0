"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import {
  getAssessmentCategory,
  getAssessments,
  getHome,
} from "../api/assessment";
import { message } from "antd";

const AssessmentContext = createContext();

export const AssessmentProvider = ({ children }) => {
  const [assessments, setAssessments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [home, setHome] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const getData = async () => {
    if (dataFetched) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [categoriesResponse, assessmentsResponse, homeResponse] =
        await Promise.all([
          getAssessmentCategory(),
          getAssessments(),
          getHome(),
        ]);

      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data);
      }

      if (assessmentsResponse.success) {
        const filteredData = assessmentsResponse.data.res.filter((item) =>
          [10, 30].includes(item.data.status)
        );
        setAssessments(filteredData);
      }
      if (homeResponse.success) {
        setHome(homeResponse.data);
      }
      setDataFetched(true);
    } catch (error) {
      console.error("GET / Алдаа гарлаа.", error);
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <AssessmentContext.Provider
      value={{
        assessments,
        categories,
        home,
        loading,
        contextHolder,
      }}
    >
      {contextHolder}
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessments = () => useContext(AssessmentContext);
