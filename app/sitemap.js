import { getAssessments } from "./api/assessment";

export default async function sitemap() {
  const baseUrl = "https://hire.mn";

  let tests = [];
  try {
    const response = await getAssessments();
    if (response.success && response.data) {
      tests = response.data.data;
    }
  } catch (error) {
    console.error("Error fetching tests for sitemap:", error);
  }

  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const testPages = tests.map((test) => ({
    url: `${baseUrl}/test/${test.data.id}`,
    lastModified: test.updatedAt || new Date(),
    changeFrequency: "weekly",
    priority: 1,
  }));

  return [...routes, ...testPages];
}
