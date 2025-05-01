import { getAssessmentById } from "@/app/api/assessment";
import { redirect } from "next/navigation";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;

  const { id, code } = resolvedParams;

  let metadata = {};

  try {
    const assessmentResponse = await getAssessmentById(id);
    const testName = assessmentResponse.data?.data?.name || "Тестийн үр дүн";
    const icon = assessmentResponse.data?.data?.icons;

    metadata = {
      ...metadata,
      title: `${testName} / Hire.mn`,
      description: `Миний "${testName}" тестийн үр дүн`,
      openGraph: {
        ...metadata.openGraph,
        title: `${testName} / Hire.mn`,
        description: `Миний "${testName}" тестийн үр дүн`,
        url: `https://hire.mn/share/${id}/${code}`,
        type: "website",
        images: [
          {
            url: `https://hire.mn/api/share/${code}`,
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

  return metadata;
}

export default async function SharePage({ params }) {
  const resolvedParams = await params;

  const { id, code } = resolvedParams;

  redirect(`/test/${id}`);
}
