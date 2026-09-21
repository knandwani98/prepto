import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LandingHome } from "@/components/LandingHome";

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) {
    redirect("/new");
  }

  return <LandingHome />;
}
