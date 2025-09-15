"use server";

import { NextResponse } from "next/server";
import axios from "axios";
import { api } from "@/app/utils/routes";

export async function GET(req, context) {
  const params = await context.params;
  const { id } = params;

  try {
    // 🟢 Чиний backend PDF URL
    const backendUrl = `${api}exam/pdf/${id}`;
    // Backend руу request явуулж PDF-ийг татаж авна
    const response = await axios.get(backendUrl, {
      responseType: "arraybuffer", // PDF-г binary татна
    });

    // Response-г шууд client рүү дамжуулж өгнө
    return new NextResponse(response.data, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="report-${id}.pdf"`,
      },
    });
  } catch (err) {
    console.error(err);
    return new NextResponse("PDF download failed", { status: 500 });
  }
}
