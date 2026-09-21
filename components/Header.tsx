"use client";

import { Link } from "./UnsavedChanges";
import { usePathname } from "next/navigation";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { useSidebar } from "./AppSidebar";
import { Button } from "./ui/Button";
import { BrandMark } from "./BrandMark";
import { HashLink } from "./HashLink";

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      {open ? (
        <path
          d="M5 5l10 10M15 5L5 15"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M4 6h12M4 10h12M4 14h12"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export function Header() {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useAuth();
  const { open, toggle } = useSidebar();
  const isAuthPage =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const isAppRoute =
    pathname.startsWith("/new") || pathname.startsWith("/kits");
  const showAppChrome = isAppRoute || isSignedIn === true;

  if (isAuthPage) {
    return null;
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/55 backdrop-blur-xl">
      <div
        className={
          showAppChrome
            ? "flex h-14 w-full items-center justify-between px-4"
            : "mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4"
        }
      >
        <div className="flex items-center gap-2">
          {isAppRoute ? (
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-elevated hover:text-foreground lg:hidden"
              aria-label={open ? "Close kits sidebar" : "Open kits sidebar"}
              onClick={toggle}
            >
              <MenuIcon open={open} />
            </button>
          ) : null}

          <Link
            href={showAppChrome ? "/new" : "/"}
            className="flex items-center gap-2.5"
          >
            <BrandMark className="h-7 w-7" priority />
            <span className="text-lg font-semibold tracking-tight text-foreground">
              Prepto
            </span>
          </Link>
        </div>

        <nav className="flex items-center gap-2 sm:gap-6">
          {showAppChrome ? (
            isLoaded ? (
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8",
                  },
                }}
              />
            ) : (
              <span className="h-8 w-8 rounded-full bg-elevated" />
            )
          ) : (
            <>
              <div className="hidden items-center gap-5 text-[13px] font-medium text-muted md:flex">
                <HashLink href="#how-it-works" className="hover:text-foreground">
                  How it works
                </HashLink>
                <HashLink href="#inside" className="hover:text-foreground">
                  What&apos;s inside
                </HashLink>
                <HashLink href="#faq" className="hover:text-foreground">
                  FAQ
                </HashLink>
                <HashLink href="#contact" className="hover:text-foreground">
                  Contact
                </HashLink>
              </div>
              <SignInButton mode="redirect" forceRedirectUrl="/new">
                <Button variant="secondary" size="sm">
                  Sign in
                </Button>
              </SignInButton>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
