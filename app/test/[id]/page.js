import Test from "@/components/Test";
import { generateTestMetadata } from "./metadata";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function generateMetadata({ params }) {
  return generateTestMetadata({ params });
}

export default async function Page({
  params,
  searchParams: searchParamsPromise,
}) {
  const searchParams = await searchParamsPromise;
  const session = await getServerSession(authOptions);

  return <Test params={params} searchParams={searchParams} session={session} />;
}
