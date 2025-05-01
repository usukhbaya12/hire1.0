import Test from "@/components/Test";
import { generateTestMetadata } from "./metadata";

export async function generateMetadata({ params }) {
  return generateTestMetadata({ params });
}

export default async function Page({ params, searchParams }) {
  return <Test params={params} searchParams={searchParams} />;
}
