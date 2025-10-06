"use server";

import { NextResponse } from "next/server";
import axios from "axios";
import { api } from "@/app/utils/routes";
import { getAuthToken } from "../../../utils/auth";

function createErrorPage(statusCode, title, message, showLoginButton = false) {
  return `
    <!DOCTYPE html>
    <html lang="mn">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900&display=swap" rel="stylesheet">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Montserrat', system-ui, -apple-system, sans-serif;
          background: linear-gradient(135deg, #f26522 0%, #ed1c45 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .error-container {
          background: white;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(255, 255, 255, 0.3);
          padding: 48px;
          max-width: 500px;
          width: 100%;
          text-align: center;
        }
        .error-icon {
          font-size: 40px;
        }
        .error-code {
          font-size: 48px;
          font-weight: 900;
          background: linear-gradient(135deg, #f26522 0%, #ed1c45 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 16px;
        }
        h1 {
          font-size: 20px;
          color: #1a202c;
          margin-bottom: 12px;
          font-weight: 700;
        }
        p {
          font-size: 16px;
          color: #4a5568;
          line-height: 1.6;
          margin-bottom: 32px;
        }
        .btn {
          padding: 12px 32px;
          border-radius: 99px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-block;
          margin: 6px;
        }
        .btn-primary {
          background: linear-gradient(135deg, #f26522 0%, #f26522 100%);
          color: white;
        }
        .btn-primary:hover {
          transform: translateY(-0.5px);
          box-shadow: 0 10px 20px rgba(243, 100, 33, 0.3);
        }
      </style>
    </head>
    <body>
      <div class="error-container">
        <div class="error-icon">${getErrorIcon(statusCode)}</div>
        <div class="error-code">${statusCode}</div>
        <h1>${title}</h1>
        <p>${message}</p>
        <div>
          ${
            showLoginButton
              ? `<a href="/auth/login" class="btn btn-primary">Нэвтрэх</a>`
              : ""
          }
        </div>
      </div>
    </body>
    </html>
  `;
}

function getErrorIcon(statusCode) {
  const icons = {
    202: "⚠️",
    403: "🔒",
    404: "🔍",
    500: "❌",
  };
  return icons[statusCode] || "⚠️";
}

export async function GET(req, context) {
  const params = await context.params;
  const { id } = params;

  try {
    const backendUrl = `${api}exam/pdf/${id}`;
    const token = await getAuthToken();

    const response = await axios.get(backendUrl, {
      responseType: "arraybuffer",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      validateStatus: () => true,
    });

    const parsed = JSON.parse(Buffer.from(response.data).toString());

    if (parsed.message === "Forbidden resource") {
      let errorMessage = "Хандах эрхгүй байна.";
      try {
        const parsed = JSON.parse(Buffer.from(response.data).toString());
        errorMessage = parsed?.message || errorMessage;
      } catch {}

      return new NextResponse(
        createErrorPage(403, "Хандах эрхгүй байна.", errorMessage, true),
        { status: 403, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    if (response.status !== 200) {
      let errorMessage = "Тайлан татахад алдаа гарлаа.";
      try {
        const parsed = JSON.parse(Buffer.from(response.data).toString());
        errorMessage = parsed?.message || errorMessage;
      } catch {}

      return new NextResponse(
        createErrorPage(
          response.status,
          errorMessage,
          "Эрхээ шалгана уу.",
          false
        ),
        {
          status: response.status,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }
      );
    }

    return new NextResponse(response.data, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="report-${id}.pdf"`,
      },
    });
  } catch (err) {
    console.error("PDF fetch error:", err);

    let errorMessage =
      "Серверийн алдаа гарлаа. Та түр хүлээгээд дахин оролдоно уу.";
    if (err.message) errorMessage = err.message;

    return new NextResponse(
      createErrorPage(500, "Серверийн алдаа", errorMessage, false),
      { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }
}
