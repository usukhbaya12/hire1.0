import { getAssessmentById } from "@/app/api/assessment";
import { redirect } from "next/navigation";

export async function generateMetadata({ params }) {
  const { testId, code } = params;

  let metadata = {};

  try {
    const assessmentResponse = await getAssessmentById(testId);
    const testName = assessmentResponse.data?.data?.name || "Тестийн үр дүн";
    const icon = assessmentResponse.data?.icons;

    if (code) {
      metadata = {
        ...metadata,
        title: `${testName} / Hire.mn`,
        description: `Миний "${testName}" тестийн үр дүн`,
        openGraph: {
          ...metadata.openGraph,
          title: `${testName} / Hire.mn`,
          description: `Миний "${testName}" тестийн үр дүн`,
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
    }
  } catch (error) {
    console.error("Error generating share metadata:", error);
  }

  return metadata;

  //   return {
  //     title: `${testName} / Hire.mn`,
  //     openGraph: {
  //       title: `${testName} / Hire.mn`,
  //       description: `Миний "${testName}" тестийн үр дүн`,
  //       type: "website",
  //       images: [
  //         {
  //           url: `https://hire.mn/api/share/${code}`,
  //           width: 1600,
  //           height: 837.7,
  //         },
  //       ],
  //       url: `https://hire.mn/share/${testId}/${code}`,
  //     },
  //   };
}

export default function SharePage({ params }) {
  const { testId, code } = params;

  redirect(`/test/${testId}?share=${code}`);
}
