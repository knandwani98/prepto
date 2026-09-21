import type { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { AppSidebar } from "@/components/AppSidebar";

export default async function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  await auth.protect();
  return (
    <div className="flex h-full min-h-0 flex-1 overflow-hidden">
      <AppSidebar />
      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="pt-14">{children}</div>
      </div>
    </div>
  );
}
