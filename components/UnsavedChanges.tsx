"use client";

import NextLink from "next/link";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { ConfirmDialog } from "./ui/Dialog";

type Href = ComponentProps<typeof NextLink>["href"];

function hrefToPath(href: Href) {
  if (typeof href === "string") return href;
  return href.pathname ?? "";
}

function isSameDocument(href: string) {
  const next = new URL(href, window.location.href);
  return (
    next.origin === window.location.origin &&
    next.pathname === window.location.pathname &&
    next.search === window.location.search
  );
}

interface UnsavedChangesContextValue {
  blocked: boolean;
  setBlocked: (blocked: boolean) => void;
  requestLeave: (href: string) => void;
  consumeAllowNext: () => boolean;
}

const UnsavedChangesContext = createContext<UnsavedChangesContextValue>({
  blocked: false,
  setBlocked: () => {},
  requestLeave: () => {},
  consumeAllowNext: () => false,
});

export function useUnsavedChanges() {
  return useContext(UnsavedChangesContext);
}

export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [blocked, setBlockedState] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const pendingHrefRef = useRef<string | null>(null);
  const allowNextRef = useRef(false);

  const setBlocked = useCallback((next: boolean) => {
    setBlockedState(next);
    if (!next) {
      pendingHrefRef.current = null;
      setPendingHref(null);
    }
  }, []);

  const requestLeave = useCallback((href: string) => {
    pendingHrefRef.current = href;
    setPendingHref(href);
  }, []);

  const consumeAllowNext = useCallback(() => {
    if (!allowNextRef.current) return false;
    allowNextRef.current = false;
    return true;
  }, []);

  useEffect(() => {
    if (!blocked) return;

    function onBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [blocked]);

  const value = useMemo(
    () => ({ blocked, setBlocked, requestLeave, consumeAllowNext }),
    [blocked, setBlocked, requestLeave, consumeAllowNext],
  );

  return (
    <UnsavedChangesContext.Provider value={value}>
      {children}
      <ConfirmDialog
        open={pendingHref !== null}
        title="Discard unsaved changes?"
        description="If you leave this page, your edits will be lost."
        confirmLabel="Leave"
        cancelLabel="Stay"
        onConfirm={() => {
          const href = pendingHrefRef.current;
          pendingHrefRef.current = null;
          setPendingHref(null);
          allowNextRef.current = true;
          setBlockedState(false);
          if (href) {
            window.setTimeout(() => {
              router.push(href);
            }, 0);
          }
        }}
        onClose={() => {
          pendingHrefRef.current = null;
          setPendingHref(null);
        }}
      />
    </UnsavedChangesContext.Provider>
  );
}

export function Link({
  href,
  onNavigate,
  ...props
}: ComponentProps<typeof NextLink>) {
  const { blocked, requestLeave, consumeAllowNext } = useUnsavedChanges();

  return (
    <NextLink
      href={href}
      onNavigate={(event) => {
        onNavigate?.(event);
        if (event.defaultPrevented) return;
        if (consumeAllowNext() || !blocked) return;
        const next = hrefToPath(href);
        if (isSameDocument(next)) return;
        event.preventDefault();
        requestLeave(next);
      }}
      {...props}
    />
  );
}
