// app/test/[id]/metadata.js
import { getAssessmentById } from "@/app/api/assessment";
import { api } from "@/app/utils/routes";

export async function generateTestMetadata({ params, searchParams }) {
  // Await params and searchParams
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const testId = resolvedParams.id;
  const shareCode = resolvedSearchParams.share;

  // Default metadata
  let metadata = {
    title: "Hire.mn | Test Results",
    description: "Онлайн тест, хөндлөнгийн үнэлгээ",
    openGraph: {
      title: "Hire.mn | Test Results",
      description: "Онлайн тест, хөндлөнгийн үнэлгээ",
      url: `https://www.hire.mn/test/${testId}`,
      siteName: "Hire.mn",
      type: "website",
      images: [
        {
          url: "https://www.hire.mn/misc.png",
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
    },
  };

  // If there's a share code, update metadata with share image
  if (shareCode) {
    try {
      // Fetch test details to get the test name
      const assessmentResponse = await getAssessmentById(testId);
      const testName = assessmentResponse.data?.data?.name || "Test Results";

      metadata = {
        ...metadata,
        title: `Hire.mn | ${testName}`,
        description: `Миний '${testName}' тестийн үр дүн`,
        openGraph: {
          ...metadata.openGraph,
          title: `Hire.mn | ${testName}`,
          description: `Миний '${testName}' тестийн үр дүн`,
          images: [
            {
              url: `https://www.hire.mn/api/share/${shareCode}`,
              width: 1600,
              height: 837.7,
              alt: "Test Results",
            },
          ],
        },
      };
    } catch (error) {
      console.error("Error generating share metadata:", error);
    }
  }

  return metadata;
}
