"use server";

import { NextResponse } from "next/server";
import axios from "axios";
import { api } from "@/app/utils/routes";
import { getAuthToken } from "../../../utils/auth";
export async function GET(req, context) {
  const params = await context.params;
  const { id } = params;

  try {
    const backendUrl = `${api}exam/pdf/${id}`;
    const token = await getAuthToken();
    const response = await axios.get(backendUrl, {
      responseType: "arraybuffer", // PDF-г binary татна
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      validateStatus: () => true,
    });

    if (response.status != 200) {
      const msg = Buffer.from(response.data).toString();
      return new NextResponse(
        JSON.parse(msg)?.message ?? "Тайлан татахад алдаа гарлаа.",
        {
          status: 202,
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
    console.log("errr", err);
    return new NextResponse(err.message ?? "Тайлан татахад алдаа гарлаа", {
      status: 500,
    });
  }
}
