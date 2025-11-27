import { NextResponse } from "next/server";
import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";
import fs from "fs";
import { getExamCalculation } from "../../exam";

const SCALE = 1.5;
const CANVAS_WIDTH = 1600 * SCALE;
const CANVAS_HEIGHT = Math.round(837.7 * SCALE);
const FONT_DIR = path.join(process.cwd(), "app/fonts");
const PLACEHOLDER_IMG_URL = "https://hire.mn/placeholder.png";
const NAME_URL = "https://hire.mn/Group.png";
const HEADER_ICON_URL = "https://hire.mn/header-top-white.png";
const CACHE_CONTROL_SUCCESS = "public, max-age=31536000, immutable";
const CACHE_CONTROL_ERROR = "no-cache";

function registerFontIfExists(filePath, family, weight) {
  const fullPath = path.join(FONT_DIR, filePath);
  if (fs.existsSync(fullPath)) {
    registerFont(fullPath, { family, weight });
  } else {
    console.warn(`Font file not found, skipping registration: ${fullPath}`);
  }
}

registerFontIfExists("Gilroy-Bold.ttf", "Gilroy", "bold");
registerFontIfExists("Gilroy-Black.ttf", "Gilroy2", "normal");
registerFontIfExists("Gilroy-Regular.ttf", "Gilroy3", "normal");

async function getExamData(code) {
  try {
    const response = await getExamCalculation(code);
    if (response.success && response.data) return response.data;
    throw new Error(
      `Failed to get exam data: ${response.message || "Unknown API error"}`
    );
  } catch (error) {
    console.error(`Error fetching exam data for code ${code}:`, error);
    throw new Error(`Could not retrieve exam data. ${error.message}`);
  }
}

async function drawBackground(ctx, icons) {
  const imageUrl = icons
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/file/${icons}`
    : PLACEHOLDER_IMG_URL;
  try {
    const image = await loadImage(imageUrl);
    const imageAspectRatio = image.width / image.height;
    const targetHeight = CANVAS_HEIGHT;
    const targetWidth = targetHeight * imageAspectRatio;
    const imageX = CANVAS_WIDTH - targetWidth;

    ctx.fillStyle = "#F36421";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(image, imageX, 0, targetWidth, targetHeight);

    const gradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, 0);
    gradient.addColorStop(0.2, "rgba(243, 100, 33, 1.0)");
    gradient.addColorStop(0.33, "rgba(243, 100, 33, 0.75)");
    gradient.addColorStop(1.0, "rgba(255, 255, 255, 0.0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  } catch (e) {
    console.error("Error loading icon or placeholder image:", e);
    const fallbackGradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, 0);
    fallbackGradient.addColorStop(0, "#362c1e");
    fallbackGradient.addColorStop(1, "#604c34");
    ctx.fillStyle = fallbackGradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}

function generateFallbackImageBuffer() {
  const fallbackCanvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  const ctx = fallbackCanvas.getContext("2d");
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.font = `${48 * SCALE}px Gilroy3, Arial, sans-serif`;
  ctx.fillStyle = "#f36421";
  ctx.textAlign = "center";
  ctx.fillText("Тестийн үр дүн / Hire.mn", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
  ctx.font = `${24 * SCALE}px Gilroy3, Arial, sans-serif`;
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.textAlign = "left";
  ctx.fillText("© Hire.mn", 1430 * SCALE, 770 * SCALE);
  return fallbackCanvas.toBuffer("image/png");
}

export async function GET(request, { params }) {
  const code = (await params).code;
  if (!code) {
    console.error("Error: Missing 'code' parameter in request.");
    return new NextResponse(generateFallbackImageBuffer(), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": CACHE_CONTROL_ERROR,
      },
      status: 400,
    });
  }

  try {
    const examData = await getExamData(code);
    const examDetails = examData;

    console.log("aaa", examData);
    if (!examDetails) throw new Error("Invalid exam data structure.");

    const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    const ctx = canvas.getContext("2d");
    await drawBackground(ctx, examData.icons);

    try {
      try {
        const brainIcon = await loadImage(HEADER_ICON_URL);
        ctx.drawImage(brainIcon, -345 * SCALE, 0, 961 * SCALE, 371 * SCALE);
      } catch (e) {
        console.error("Error loading brain icon (non-critical):", e);
      }

      const assessmentName = examDetails.assessmentName || "Assessment Results";
      ctx.font = `${86 * SCALE}px Gilroy2, sans-serif`;
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "right";

      const maxWidth = 835 * SCALE;
      const lineHeight = 90 * SCALE;
      const words = assessmentName.split(" ");
      let line = "",
        lines = [];
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " ";
        const testWidth = ctx.measureText(testLine).width;
        if (testWidth > maxWidth && i > 0) {
          lines.push(line.trim());
          line = words[i] + " ";
        } else {
          line = testLine;
        }
      }
      if (line) lines.push(line.trim());

      const bottomY = CANVAS_HEIGHT - 80 * SCALE;
      const totalTextHeight = lines.length * lineHeight;
      const startY = bottomY - (lines.length - 1) * lineHeight;
      lines.forEach((textLine, index) => {
        const y = startY + index * lineHeight;
        ctx.fillText(textLine, CANVAS_WIDTH - 83 * SCALE, y);
      });

      ctx.textAlign = "left";
      try {
        const nameIcon = await loadImage(NAME_URL);
        ctx.drawImage(
          nameIcon,
          78 * SCALE,
          445 * SCALE,
          60 * SCALE,
          48 * SCALE
        );
      } catch (e) {
        console.error("Error loading name icon (non-critical):", e);
      }

      ctx.font = `bold ${47 * SCALE}px Gilroy2, Arial, sans-serif`;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(
        `${(examDetails.firstname || "").toUpperCase()}`,
        78 * SCALE,
        555 * SCALE
      );

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3 * SCALE;
      ctx.beginPath();
      ctx.moveTo(78 * SCALE, 578 * SCALE);
      ctx.lineTo(189 * SCALE, 578 * SCALE);
      ctx.stroke();

      const examType = examDetails.type;
      if (examType === 11 || examType === 10) {
        const score = examDetails.point ?? 0;
        const total = examDetails.total ?? 100;

        ctx.font = `${60 * SCALE}px Gilroy2, Arial, sans-serif`;
        ctx.fillStyle = "#231e20";
        ctx.fillText(`${score}`, 78 * SCALE, 648 * SCALE + 8 * SCALE);

        const scoreWidth = ctx.measureText(`${score}`).width;
        ctx.font = `${40 * SCALE}px Gilroy2, Arial, sans-serif`;
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(
          `/ ${total}`,
          78 * SCALE + scoreWidth + 5 * SCALE,
          648 * SCALE + 6 * SCALE,
          650 * SCALE
        );
      } else {
        ctx.font = `${42 * SCALE}px Gilroy2, Arial, sans-serif`;
        ctx.fillStyle = "#231e20";

        let resultText = examDetails.result || "";
        if (examDetails.value && resultText) {
          resultText += ` / ${examDetails.value}`;
        } else if (examDetails.value) {
          resultText = examDetails.value;
        }

        const maxResultWidth = 650 * SCALE;
        const resultLineHeight = 50 * SCALE;
        const words = resultText.split(" ");
        let line = "";
        let resultLines = [];

        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + " ";
          const testWidth = ctx.measureText(testLine).width;
          if (testWidth > maxResultWidth && i > 0) {
            resultLines.push(line.trim());
            line = words[i] + " ";
          } else {
            line = testLine;
          }
        }
        if (line) resultLines.push(line.trim());

        resultLines.forEach((textLine, index) => {
          const y = 648 * SCALE + index * resultLineHeight;
          ctx.fillText(textLine, 78 * SCALE, y);
        });
      }

      ctx.font = `${24 * SCALE}px Gilroy3, Arial, sans-serif`;
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      const today = new Date();
      const formattedDate = `${today.getFullYear()}.${String(
        today.getMonth() + 1
      ).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;
      ctx.fillText(`${formattedDate} © Hire.mn`, 78 * SCALE, 760 * SCALE);
    } catch (drawingError) {
      console.error(
        `Error during drawing phase for code ${code}:`,
        drawingError
      );
      throw new Error(`Failed to draw image content. ${drawingError.message}`);
    }

    const buffer = canvas.toBuffer("image/png");
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": CACHE_CONTROL_SUCCESS,
      },
    });
  } catch (error) {
    console.error(`Failed to generate share image for code ${code}:`, error);
    return new NextResponse(generateFallbackImageBuffer(), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": CACHE_CONTROL_ERROR,
      },
      status: 500,
    });
  }
}
