import { NextResponse } from "next/server";
import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";
import fs from "fs";
import { getAssessmentById } from "../../assessment";
import { api } from "@/app/utils/routes";

const SCALE = 1.5;
const CANVAS_WIDTH = 1600 * SCALE;
const CANVAS_HEIGHT = Math.round(837.7 * SCALE);
const FONT_DIR = path.join(process.cwd(), "app/fonts");
const PLACEHOLDER_IMG_URL = "https://www.hire.mn/placeholder.png";
const NOTES_ICON_URL = "https://www.hire.mn/notes.png"; // Your notes.png
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
registerFontIfExists("Gilroy-Regular.ttf", "Gilroy3", "normal");

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
  const ctx = fallbackCanvas.getContext("2d");
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.font = `${48 * SCALE}px Gilroy3, Arial, sans-serif`;
  ctx.fillStyle = "#f36421";
  ctx.textAlign = "center";
  ctx.fillText("Тест / Hire.mn", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
  return fallbackCanvas.toBuffer("image/png");
}

export async function GET(request, { params }) {
  const testId = (await params).id;

  if (!testId) {
    console.error("Error: Missing 'id' parameter in request.");
    return new NextResponse(generateFallbackImageBuffer(), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": CACHE_CONTROL_ERROR,
      },
      status: 400,
    });
  }

  try {
    const assessmentResponse = await getAssessmentById(testId);

    if (!assessmentResponse.success || !assessmentResponse.data?.data) {
      throw new Error("Invalid assessment data structure.");
    }

    const assessmentData = assessmentResponse.data.data;
    const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    const ctx = canvas.getContext("2d");

    await drawBackground(ctx, assessmentData.icons);

    try {
      try {
        const brainIcon = await loadImage(HEADER_ICON_URL);
        ctx.drawImage(brainIcon, -345 * SCALE, 0, 961 * SCALE, 371 * SCALE);
      } catch (e) {
        console.error("Error loading brain icon (non-critical):", e);
      }

      const assessmentName = assessmentData.name || "Test";
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
      const startY = bottomY - (lines.length - 1) * lineHeight;
      lines.forEach((textLine, index) => {
        const y = startY + index * lineHeight;
        ctx.fillText(textLine, CANVAS_WIDTH - 83 * SCALE, y);
      });

      ctx.textAlign = "left";
      try {
        const notesIcon = await loadImage(NOTES_ICON_URL);
        const notesSize = 350 * SCALE;
        const notesX = 78 * SCALE;
        const notesY = 400 * SCALE;
        ctx.drawImage(notesIcon, notesX, notesY, notesSize, notesSize);
      } catch (e) {
        console.error("Error loading notes icon (non-critical):", e);
      }
    } catch (drawingError) {
      console.error(
        `Error during drawing phase for test ${testId}:`,
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
    console.error(
      `Failed to generate test share image for id ${testId}:`,
      error
    );
    return new NextResponse(generateFallbackImageBuffer(), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": CACHE_CONTROL_ERROR,
      },
      status: 500,
    });
  }
}
