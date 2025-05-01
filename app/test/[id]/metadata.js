import { getAssessmentById } from "@/app/api/assessment";
import { api } from "@/app/utils/routes";

export async function generateTestMetadata({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const testId = resolvedParams.id;

  let metadata = {};

  try {
    const assessmentResponse = await getAssessmentById(testId);
    const testName = assessmentResponse.data?.data?.name || "Тестийн үр дүн";
    const icon = assessmentResponse.data?.data?.icons;

    metadata = {
      title: `${testName} / Hire.mn`,
      description: "Онлайн тест, хөндлөнгийн үнэлгээ",
      openGraph: {
        title: `${testName} / Hire.mn`,
        description: "Онлайн тест, хөндлөнгийн үнэлгээ",
        url: `https://hire.mn/test/${testId}`,
        siteName: "Hire.mn",
        type: "website",
        images: [
          {
            url: icon ? `${api}file/${icon}` : "https://hire.mn/misc.png",
            width: 1200,
            height: 630,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
      },
    };
  } catch (error) {
    console.error("Error generating share metadata:", error);
  }

  return metadata;
}
