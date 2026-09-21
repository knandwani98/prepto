import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LandingHome } from "@/components/LandingHome";
import { SiteFooter } from "@/components/SiteFooter";

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) {
    redirect("/new");
  }

  return (
    <>
      <LandingHome />
      <SiteFooter />
    </>
  );
}
