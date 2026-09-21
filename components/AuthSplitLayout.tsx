import Link from "next/link";
import type { ReactNode } from "react";
import { BrandMark } from "./BrandMark";

export const authClerkAppearance = {
  elements: {
    rootBox: "mx-auto w-full max-w-[440px]",
    cardBox: "w-full shadow-none",
    card: "bg-transparent border-0 shadow-none p-0",
    headerTitle: "text-3xl font-semibold tracking-tight text-foreground",
    headerSubtitle: "text-muted",
    footerItem: "hidden",
    socialButtonsBlockButton:
      "relative mx-auto h-10 w-auto overflow-visible bg-transparent border border-primary text-foreground",
    socialButtonsBlockButtonText: "text-foreground",
    lastAuthenticationStrategyBadge:
      "bg-primary text-background border-0 font-semibold !top-0 !leading-tight",
    formFieldLabel: "text-muted",
    formFieldInput: "bg-input text-foreground",
    formButtonPrimary: "bg-primary text-background hover:opacity-90",
    footer: "bg-transparent border-0 shadow-none",
    footerAction: "bg-transparent",
    footerActionText: "text-muted",
    footerActionLink: "text-secondary",
    dividerText: "text-muted",
    identityPreviewText: "text-foreground",
  },
};

export function AuthSplitLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-split flex min-h-dvh flex-1">
      <aside className="relative hidden w-[42%] overflow-hidden bg-background lg:flex">
        <div className="auth-halftone" />
        <div className="relative z-10 flex flex-col justify-center px-14 xl:px-20">
          <BrandMark className="h-14 w-14" />
          <p className="mt-10 max-w-sm text-[32px] leading-[1.15] font-semibold tracking-tight text-foreground">
            Turn a job description into a personalised prep kit.
          </p>
        </div>
      </aside>

      <section className="relative flex flex-1 flex-col bg-background">
        <Link
          href="/"
          className="absolute top-5 left-5 z-10 inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
        >
          <span aria-hidden="true">←</span>
          Home
        </Link>

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-20">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <BrandMark className="h-7 w-7" />
            <span className="text-[15px] font-semibold tracking-tight">
              Prepto
            </span>
          </div>
          {children}
        </div>
      </section>
    </div>
  );
}
