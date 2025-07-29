import { NextResponse } from "next/server";
import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";
import fs from "fs";
import { getExamCalculation } from "../../exam";
import { api } from "@/app/utils/routes";

const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 837.7;
const FONT_DIR = path.join(process.cwd(), "app/fonts");
const PLACEHOLDER_IMG_URL = "https://www.hire.mn/placeholder.png";
const LOGO_URL = "https://www.hire.mn/hire-all-white.png";
const HEADER_ICON_URL = "https://www.hire.mn/header-top-white.png";
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
registerFontIfExists("Gilroy-Regular.ttf", "Gilroy", "normal");

async function getExamData(code) {
  try {
    const response = await getExamCalculation(code);

    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(
        `Failed to get exam data: ${response.message || "Unknown API error"}`
      );
    }
  } catch (error) {
    console.error(`Error fetching exam data for code ${code}:`, error);
    throw new Error(`Could not retrieve exam data. ${error.message}`);
  }
}

async function drawBackground(ctx, icons) {
  const imageUrl = icons ? `${api}file/${icons}` : PLACEHOLDER_IMG_URL;

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
  const fallbackCtx = fallbackCanvas.getContext("2d");

  fallbackCtx.fillStyle = "#000000";
  fallbackCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  fallbackCtx.font = "bold 48px Gilroy, Arial, sans-serif";
  fallbackCtx.fillStyle = "#f36421";
  fallbackCtx.textAlign = "center";
  fallbackCtx.fillText(
    "Тестийн үр дүн / Hire.mn",
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT / 2
  );

  fallbackCtx.font = "24px Gilroy, Arial, sans-serif";
  fallbackCtx.fillStyle = "rgba(255, 255, 255, 0.6)";
  fallbackCtx.textAlign = "left";
  fallbackCtx.fillText("© Hire.mn", 1430, 770);

  return fallbackCanvas.toBuffer("image/png");
}

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const code = resolvedParams.code;

  if (!code) {
    console.error("Error: Missing 'code' parameter in request.");
    const errorBuffer = generateFallbackImageBuffer();
    return new NextResponse(errorBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": CACHE_CONTROL_ERROR,
      },
      status: 400,
    });
  }

  try {
    const examData = await getExamData(code);
    if (
      !examData ||
      typeof examData.value !== "object" ||
      examData.value === null
    ) {
      throw new Error(
        "Fetched exam data is missing the expected 'value' object."
      );
    }
    const examDetails = examData.value;

    const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    const ctx = canvas.getContext("2d");

    await drawBackground(ctx, examData.icons);

    try {
      try {
        const brainIcon = await loadImage(HEADER_ICON_URL);
        ctx.drawImage(brainIcon, -345, 0, 961, 371);
      } catch (e) {
        console.error("Error loading brain icon (non-critical):", e);
      }

      const assessmentName = examDetails.assessmentName || "Assessment Results";
      ctx.font = "86px Gilroy2, sans-serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "right";

      const maxWidth = 835;
      const lineHeight = 115;
      const words = assessmentName.split(" ");
      let line = "";
      let lines = [];

      // Wrap text by maxWidth
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

      // Bottom padding (72px from bottom)
      const bottomY = CANVAS_HEIGHT - 72;
      const totalTextHeight = lines.length * lineHeight;
      const startY = bottomY - (lines.length - 1) * lineHeight;

      // Draw each line from bottom upward
      lines.forEach((textLine, index) => {
        const y = startY + index * lineHeight;
        ctx.fillText(textLine, CANVAS_WIDTH - 83, y);
      });

      ctx.textAlign = "right";

      ctx.font = "bold 36px Gilroy, Arial, sans-serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(`${examDetails.firstname || ""}`, 83, 515);

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(86, 583);
      ctx.lineTo(192, 583);
      ctx.stroke();

      const examType = examDetails.type;
      if (examType === 11 || examType === 10) {
        const score = examDetails.point ?? 0;
        const total = examDetails.total ?? 0;
        const percent = total > 0 ? Math.round((score / total) * 100) : 0;

        ctx.font = "60px Gilroy2, Arial, sans-serif";
        ctx.fillStyle = "#fff";
        ctx.fillText(`${score}/${total}`, 222, 567);

        const centerX = 130;
        const centerY = 550;
        const radius = 60;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(
          centerX,
          centerY,
          radius,
          -0.5 * Math.PI,
          (percent / 100) * 2 * Math.PI - 0.5 * Math.PI,
          false
        );
        ctx.strokeStyle = "#f36421";
        ctx.lineWidth = 15;
        ctx.stroke();

        ctx.font = "bold 32px Gilroy, Arial, sans-serif";
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.fillText(`${percent}%`, centerX + 2, centerY + 10);
        ctx.textAlign = "left"; // Reset alignment
      } else {
        ctx.font = "50px Gilroy2, Arial, sans-serif";
        ctx.fillStyle = "#fff";

        let resultText = examDetails.result || "";
        if (examDetails.value && resultText) {
          resultText += ` / ${examDetails.value}`;
        } else if (examDetails.value) {
          resultText = examDetails.value; // Use value if result is empty
        }

        ctx.fillText(resultText, 72, 600);
      }

      ctx.font = "24px Gilroy, Arial, sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.fillText("© Hire.mn", 72, 770);
    } catch (drawingError) {
      console.error(
        `Error occurred during canvas drawing phase for code ${code}:`,
        drawingError
      );
      throw new Error(`Failed to draw image content. ${drawingError.message}`);
    }

    const buffer = canvas.toBuffer("image/png");
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": CACHE_CONTROL_SUCCESS, // Use constant
      },
    });
  } catch (error) {
    console.error(`Failed to generate share image for code ${code}:`, error);
    try {
      const fallbackBuffer = generateFallbackImageBuffer();
      return new NextResponse(fallbackBuffer, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": CACHE_CONTROL_ERROR, // Use constant
        },
        status: 500, // Internal Server Error
      });
    } catch (fallbackError) {
      console.error("CRITICAL: Error creating fallback image:", fallbackError);
      return new NextResponse("Failed to generate image.", { status: 500 });
    }
  }
}
