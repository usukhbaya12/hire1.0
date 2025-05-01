// app/test/[id]/metadata.js
import { getAssessmentById } from "@/app/api/assessment";
import { api } from "@/app/utils/routes";

export async function generateTestMetadata({ params }) {
  const resolvedParams = await params;
  const testId = resolvedParams.id;

  let metadata = {
    title: "Тест / Hire.mn",
    description: "Онлайн тест, хөндлөнгийн үнэлгээ",
    openGraph: {
      title: "Тест / Hire.mn",
      description: "Онлайн тест, хөндлөнгийн үнэлгээ",
      url: `https://hire.mn/test/${testId}`,
      siteName: "Hire.mn",
      type: "website",
      images: [
        {
          url: "https://hire.mn/misc.png",
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
    },
  };

  try {
    const assessmentResponse = await getAssessmentById(testId);

    if (assessmentResponse.success && assessmentResponse.data?.data) {
      const testName = assessmentResponse.data.data.name || "Тестийн үр дүн";
      const icon = assessmentResponse.data.data.icons;

      // Update metadata with actual data
      metadata.title = `${testName} / Hire.mn`;
      metadata.description =
        assessmentResponse.data.data.description ||
        "Онлайн тест, хөндлөнгийн үнэлгээ";
      metadata.openGraph.title = `${testName} / Hire.mn`;
      metadata.openGraph.description =
        assessmentResponse.data.data.description ||
        "Онлайн тест, хөндлөнгийн үнэлгээ";

      // Fix: Use full URL for the icon
      if (icon) {
        // If your API is on a different domain, make sure to use the full API URL
        const fullApiUrl = api.replace(/\/$/, ""); // Remove trailing slash if present
        metadata.openGraph.images = [
          {
            url: `${fullApiUrl}/file/${icon}`,
            width: 1200,
            height: 630,
            alt: testName,
          },
        ];
      }
    }
  } catch (error) {
    console.error("Error generating test metadata:", error);
  }

  return metadata;
}
