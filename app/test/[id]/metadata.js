import { getAssessmentById } from "@/app/api/assessment";
import { api } from "@/app/utils/routes";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function generateTestMetadata({ params, searchParams }) {
  const session = await getServerSession(authOptions);

  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const testId = resolvedParams.id;
  const shareCode = resolvedSearchParams.share;

  let metadata = {};

  try {
    const assessmentResponse = await getAssessmentById(testId);
    const testName = assessmentResponse.data?.data?.name || "Тестийн үр дүн";

    if (shareCode) {
      metadata = {
        ...metadata,
        title: `${testName} / Hire.mn`,
        description: `${session.user?.name}-н "${testName}" тестийн үр дүн`,
        openGraph: {
          ...metadata.openGraph,
          title: `${testName} / Hire.mn`,
          description: `${session.user?.name}-н "${testName}" тестийн үр дүн`,
          url: `https://hire.mn/test/${testId}`,
          type: "website",
          images: [
            {
              url: `https://hire.mn/api/share/${shareCode}`,
              width: 1600,
              height: 837.7,
              alt: "Test Results",
            },
          ],
        },
      };
    } else {
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
    }
  } catch (error) {
    console.error("Error generating share metadata:", error);
  }

  return metadata;
}
