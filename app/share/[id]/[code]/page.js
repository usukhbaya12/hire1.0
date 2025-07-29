import { getAssessmentById } from "@/app/api/assessment";
import { api } from "@/app/utils/routes";
import { redirect } from "next/navigation";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { id, code } = resolvedParams;

  let metadata = {
    title: "Тестийн үр дүн / localhost:3000",
    description: "Онлайн тест, хөндлөнгийн үнэлгээ",
    openGraph: {
      title: "Тестийн үр дүн / localhost:3000",
      description: "Онлайн тест, хөндлөнгийн үнэлгээ",
      url: `https://localhost:3000/share/${id}/${code}`,
      type: "website",
      images: [
        {
          url: `https://localhost:3000/api/share/${code}`,
          width: 1600,
          height: 837.7,
          alt: "Test Results",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [`https://localhost:3000/api/share/${code}`],
    },
  };

  try {
    const assessmentResponse = await getAssessmentById(id);

    if (assessmentResponse.success && assessmentResponse.data?.data?.name) {
      const testName = assessmentResponse.data.data.name;

      metadata.title = `${testName} / localhost:3000`;
      metadata.description = `Миний "${testName}" тестийн үр дүн`;
      metadata.openGraph.title = `${testName} / localhost:3000`;
      metadata.openGraph.description = `Миний "${testName}" тестийн үр дүн`;
    }
  } catch (error) {
    console.error("Error fetching assessment data for metadata:", error);
  }

  return metadata;
}

export default async function SharePage({ params }) {
  const resolvedParams = await params;
  const { id, code } = resolvedParams;

  return (
    <html>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            // Check if Facebook crawler
            const userAgent = navigator.userAgent || '';
            const isFacebookCrawler = userAgent.includes('facebookexternalhit') || 
                                     userAgent.includes('Facebot');
            
            if (!isFacebookCrawler) {
              // Redirect after a short delay to ensure metadata is processed
              setTimeout(() => {
                window.location.href = '/test/${id}';
              }, 1000);
            }
          `,
          }}
        />
      </head>
      <body>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h1>Түр хүлээнэ үү...</h1>
        </div>
      </body>
    </html>
  );
}
