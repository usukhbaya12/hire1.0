import Test from "./Test";
import { generateTestMetadata } from "./metadata";

export async function generateMetadata({ params, searchParams }) {
  return generateTestMetadata({ params, searchParams });
}

export default async function Page({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  return <Test params={resolvedParams} searchParams={resolvedSearchParams} />;
}
