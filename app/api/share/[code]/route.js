import { NextResponse } from "next/server";
import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";
import fs from "fs";
import { getAuthToken } from "@/app/utils/auth";
import axios from "axios";
import { api } from "@/app/utils/routes";
import { getExamCalculation } from "../../exam";

// Register fonts
const fontPath = path.join(process.cwd(), "app/fonts/Gilroy-Bold.ttf");
if (fs.existsSync(fontPath)) {
  registerFont(fontPath, { family: "Gilroy", weight: "bold" });
}

const blackFontPath = path.join(process.cwd(), "app/fonts/Gilroy-Black.ttf");
if (fs.existsSync(blackFontPath)) {
  registerFont(blackFontPath, { family: "Gilroy2", weight: "normal" });
}

const regularFontPath = path.join(
  process.cwd(),
  "app/fonts/Gilroy-Regular.ttf"
);
if (fs.existsSync(regularFontPath)) {
  registerFont(regularFontPath, { family: "Gilroy", weight: "normal" });
}

async function getExamData(code) {
  try {
    const response = await getExamCalculation(code);

    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message || "Failed to get exam data");
    }
  } catch (error) {
    console.error("Error fetching exam data:", error);
    throw error;
  }
}

export async function GET(request, { params }) {
  const { code } = params;

  try {
    const examData = await getExamData(code);

    // Higher resolution canvas (1600x900)
    const canvas = createCanvas(1600, 837.7);
    const ctx = canvas.getContext("2d");

    try {
      const backgroundImage = await loadImage(
        "https://www.hire.mn/placeholder.png"
      );

      // Get image dimensions
      const imgWidth = backgroundImage.width;
      const imgHeight = backgroundImage.height;

      // Calculate canvas and image aspect ratios
      const canvasRatio = 1600 / 837.7;
      const imageRatio = imgWidth / imgHeight;

      let drawWidth,
        drawHeight,
        offsetX = 0,
        offsetY = 0;

      // Determine which dimension to fill completely (cover approach)
      if (imageRatio > canvasRatio) {
        // Image is wider than canvas ratio - fill height and crop width
        drawHeight = 837.7;
        drawWidth = imgWidth * (837.7 / imgHeight);
        offsetX = (1600 - drawWidth) / 2; // Center horizontally
      } else {
        // Image is taller than canvas ratio - fill width and crop height
        drawWidth = 1600;
        drawHeight = imgHeight * (1600 / imgWidth);
        offsetY = (837.7 - drawHeight) / 2; // Center vertically
      }

      // Draw the image with calculated dimensions (some parts may be cropped)
      ctx.drawImage(backgroundImage, offsetX, offsetY, drawWidth, drawHeight);
    } catch (e) {
      console.error("Error loading background image:", e);
      // Fallback to a gradient background
      const gradient = ctx.createLinearGradient(0, 0, 1600, 837.7);
      gradient.addColorStop(0, "#362c1e");
      gradient.addColorStop(1, "#604c34");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1600, 837.7);
    }

    try {
      ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
      ctx.fillRect(0, 0, 1600, 837.7);

      // Load and draw white logo
      const logo = await loadImage("https://www.hire.mn/hire-all-white.png");
      ctx.drawImage(logo, 72, 72, 200, 58.5);

      // Load and draw brain icon (if available)
      try {
        const brainIcon = await loadImage(
          "https://www.hire.mn/header-top-white.png"
        );
        ctx.drawImage(brainIcon, 930, 0, 675, 261);
      } catch (e) {
        console.error("Error loading brain icon:", e);
      }

      // Get user initials
      const firstInitial = examData.value.firstname
        ? examData.value.firstname.charAt(0).toUpperCase()
        : "";
      const initials = `${firstInitial}`;

      const circleX = 120;
      const circleY = 730;
      const circleRadius = 45;

      ctx.beginPath();
      ctx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
      ctx.fillStyle = "#f36421"; // Orange circle
      ctx.fill();

      ctx.font = "48px Gilroy2, Arial, sans-serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(initials, circleX, circleY);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";

      const assessmentName =
        examData.value.assessmentName || "Assessment Results";
      ctx.font = "86px Gilroy2, sans-serif";
      ctx.fillStyle = "#FFFFFF";

      // Text wrapping function for max width of 300px
      const maxWidth = 800;
      const lineHeight = 80;
      const words = assessmentName.split(" ");
      let line = "";
      let y = 280;

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " ";
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth && i > 0) {
          ctx.fillText(line, 72, y);
          line = words[i] + " ";
          y += lineHeight;
        } else {
          line = testLine;
        }
      }

      ctx.fillText(line, 72, y);

      // Draw user's full name
      ctx.font = "bold 36px Gilroy, Arial, sans-serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(`${examData.value.lastname}`, 190, 720);
      ctx.font = "bold 36px Gilroy, Arial, sans-serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(`${examData.value.firstname}`, 190, 760);

      // Draw divider line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(72, 650);
      ctx.lineTo(900, 650);
      ctx.stroke();

      // Handle result display
      if (examData.value.type === 11 || examData.value.type === 10) {
        // Progress circle with score
        const score = examData.value.point;
        const total = examData.value.total;
        const percent = Math.round((score / total) * 100);

        // Draw score as fraction
        ctx.font = "60px Gilroy2, Arial, sans-serif";
        ctx.fillStyle = "#fff"; // Orange color
        ctx.fillText(`${score}/${total}`, 222, 567);

        // Draw percentage and progress
        const centerX = 130;
        const centerY = 550;
        const radius = 60;

        // Draw progress circle background
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.fill();

        // Draw progress arc
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

        // Draw percentage text
        ctx.font = "bold 32px Gilroy, Arial, sans-serif";
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.fillText(`${percent}%`, centerX + 2, centerY + 10);
        ctx.textAlign = "left";
      } else {
        // Just display the result text
        ctx.font = "50px Gilroy2, Arial, sans-serif";
        ctx.fillStyle = "#fff"; // Orange color

        let resultText = "";
        if (examData.value.result) {
          resultText = examData.value.result;
          if (examData.value.value) {
            resultText += ` • ${examData.value.value}`;
          }
        }

        ctx.fillText(resultText, 72, 600);
      }

      // Draw website URL at bottom
      ctx.font = "24px Gilroy, Arial, sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.fillText("© Hire.mn", 1430, 770);
    } catch (error) {
      console.error("Error drawing on canvas:", error);
      throw error;
    }

    const buffer = canvas.toBuffer("image/png");

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error generating share image:", error);
    try {
      // Create a fallback image on error
      const canvas = createCanvas(1600, 837.7);
      const ctx = canvas.getContext("2d");

      // Black background
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, 1600, 837.7);

      // Error message
      ctx.font = "bold 48px Gilroy, Arial, sans-serif";
      ctx.fillStyle = "#f36421";
      ctx.textAlign = "center";
      ctx.fillText("Тестийн үр дүн / Hire.mn", 800, 400);

      ctx.font = "24px Gilroy, Arial, sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.textAlign = "left";
      ctx.fillText("© Hire.mn", 1430, 770);

      const buffer = canvas.toBuffer("image/png");

      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "no-cache",
        },
      });
    } catch (fallbackError) {
      console.error("Error creating fallback image:", fallbackError);
      return NextResponse.error();
    }
  }
}
