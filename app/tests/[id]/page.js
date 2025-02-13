"use client";

import React, { useState, useEffect } from "react";
import { Button, Form, message, Spin } from "antd";

const MyTests = () => {
  const [messageApi, contextHolder] = message.useMessage();
  return <>{contextHolder}</>;
};

export default MyTests;
