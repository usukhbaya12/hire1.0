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
          url: `https://hire.mn/api/test/${testId}`,
          width: 1600,
          height: 837.7,
          alt: "Test",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [`https://hire.mn/api/test/${testId}`],
    },
  };

  try {
    const assessmentResponse = await getAssessmentById(testId);

    if (assessmentResponse.success && assessmentResponse.data?.data) {
      const testName = assessmentResponse.data.data.name || "Тестийн үр дүн";

      metadata.title = `${testName} / Hire.mn`;
      metadata.description =
        assessmentResponse.data.data.description ||
        "Онлайн тест, хөндлөнгийн үнэлгээ";
      metadata.openGraph.title = `${testName} / Hire.mn`;
      metadata.openGraph.description =
        assessmentResponse.data.data.description ||
        "Онлайн тест, хөндлөнгийн үнэлгээ";
    }
  } catch (error) {
    console.error("Error generating test metadata:", error);
  }

  return metadata;
}
