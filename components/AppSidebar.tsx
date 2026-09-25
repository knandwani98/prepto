"use client";

import { Link } from "./UnsavedChanges";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { api } from "@/lib/api";
import { cn } from "@/lib/cn";
import { KIT_CREATED_EVENT, kitTitle, statusLabel } from "@/lib/format";
import type { KitListItem } from "@/lib/types";
import { ConfirmDialog } from "./ui/Dialog";
import { Skeleton } from "./ui/Skeleton";
import { ThreeDotMenu } from "./ui/ThreeDotMenu";
import { useToast } from "./ui/Toast";

const MAX_PINNED_KITS = 5;
const LIST_PAGE_SIZE = 25;
const LOAD_MORE_THROTTLE_MS = 400;

function isPinned(kit: KitListItem) {
  return Boolean(kit.pinnedAt);
}

function throttle(fn: () => void, wait: number) {
  let last = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const wrapped = () => {
    const remaining = wait - (Date.now() - last);
    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = undefined;
      }
      last = Date.now();
      fn();
      return;
    }
    if (!timer) {
      timer = setTimeout(() => {
        timer = undefined;
        last = Date.now();
        fn();
      }, remaining);
    }
  };

  wrapped.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }
  };

  return wrapped;
}

interface SidebarContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [openForPath, setOpenForPath] = useState<string | null>(null);
  const open = openForPath === pathname;

  const value = useMemo(
    () => ({
      open,
      setOpen: (next: boolean) => {
        setOpenForPath(next ? pathname : null);
      },
      toggle: () => {
        setOpenForPath((current) => (current === pathname ? null : pathname));
      },
    }),
    [open, pathname],
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
}

function kitHref(kit: KitListItem) {
  return `/kits/${kit.id}`;
}

function isKitActive(pathname: string, kit: KitListItem) {
  return pathname === kitHref(kit) || pathname.startsWith(`${kitHref(kit)}/`);
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={cn("h-4 w-4 transition-transform", open ? "rotate-180" : "rotate-0")}
    >
      <path
        d="M6 8l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
      <path
        d="M12 17v5M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UnpinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
      <path
        d="M12 17v5M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89M2 2l20 20M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
      <path
        d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function KitRow({
  kit,
  pathname,
  pinCount,
  onPin,
  onDelete,
}: {
  kit: KitListItem;
  pathname: string;
  pinCount: number;
  onPin: (kit: KitListItem, pinned: boolean) => void;
  onDelete: (kit: KitListItem) => void;
}) {
  const active = isKitActive(pathname, kit);
  const pinned = isPinned(kit);
  const pinDisabled = !pinned && pinCount >= MAX_PINNED_KITS;

  return (
    <li className="group relative">
      <Link
        href={kitHref(kit)}
        className={cn(
          "block rounded-md border px-3 py-2 pr-9",
          active
            ? "border-primary bg-elevated text-foreground"
            : "border-transparent text-muted hover:bg-elevated/70 hover:text-foreground",
        )}
        aria-current={active ? "page" : undefined}
      >
        <span className="block truncate text-sm font-medium">{kitTitle(kit)}</span>
        <span className="mt-0.5 block truncate text-[11px] text-subtle">
          {kit.roleTitle ?? statusLabel(kit.status)}
        </span>
      </Link>
      <ThreeDotMenu
        hoverReveal
        label={`Actions for ${kitTitle(kit)}`}
        className="absolute top-1/2 right-1 z-10 -translate-y-1/2"
        items={[
          {
            label: pinned ? "Unpin" : "Pin",
            icon: pinned ? <UnpinIcon /> : <PinIcon />,
            disabled: pinDisabled,
            title: pinDisabled ? "You can pin up to 5 kits" : undefined,
            onSelect: () => onPin(kit, !pinned),
          },
          {
            label: "Delete",
            icon: <BinIcon />,
            tone: "danger",
            onSelect: () => onDelete(kit),
          },
        ]}
      />
    </li>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { getToken } = useAuth();
  const { toast } = useToast();
  const { open, setOpen } = useSidebar();
  const [kits, setKits] = useState<KitListItem[] | null>(null);
  const [pinnedKits, setPinnedKits] = useState<KitListItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pinnedOpen, setPinnedOpen] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<KitListItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingMoreRef = useRef(false);
  const nextCursorRef = useRef<string | null>(null);
  const loadMoreRef = useRef<() => void>(() => {});

  const loadPage = useCallback(
    async (cursor?: string | null) => {
      const token = await getToken();
      return api.listKits(token, { cursor, limit: LIST_PAGE_SIZE });
    },
    [getToken],
  );

  const loadInitial = useCallback(async () => {
    const data = await loadPage();
    setPinnedKits(data.pinned);
    setKits(data.kits);
    setNextCursor(data.nextCursor);
    nextCursorRef.current = data.nextCursor;
    setError(null);
  }, [loadPage]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        await loadInitial();
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load kits");
        }
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [loadInitial]);

  useEffect(() => {
    function onCreated(event: Event) {
      const item = (event as CustomEvent<KitListItem>).detail;
      if (!item?.id) return;
      setKits((current) => {
        if (current?.some((kit) => kit.id === item.id)) return current;
        return [item, ...(current ?? [])];
      });
    }

    window.addEventListener(KIT_CREATED_EVENT, onCreated);
    return () => window.removeEventListener(KIT_CREATED_EVENT, onCreated);
  }, []);

  const loadMore = useCallback(async () => {
    const cursor = nextCursorRef.current;
    if (!cursor || loadingMoreRef.current) return;

    loadingMoreRef.current = true;
    setLoadingMore(true);
    try {
      const data = await loadPage(cursor);
      setKits((current) => {
        const seen = new Set((current ?? []).map((kit) => kit.id));
        const incoming = data.kits.filter((kit) => !seen.has(kit.id));
        return [...(current ?? []), ...incoming];
      });
      setNextCursor(data.nextCursor);
      nextCursorRef.current = data.nextCursor;
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not load more kits", "error");
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [loadPage, toast]);

  loadMoreRef.current = () => {
    void loadMore();
  };

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const root = navRef.current;
    if (!sentinel || !root || !nextCursor) return;

    const onIntersect = throttle(() => {
      loadMoreRef.current();
    }, LOAD_MORE_THROTTLE_MS);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          onIntersect();
        }
      },
      { root, rootMargin: "120px", threshold: 0 },
    );

    observer.observe(sentinel);
    return () => {
      onIntersect.cancel();
      observer.disconnect();
    };
  }, [nextCursor, kits]);

  async function handleRetry() {
    try {
      await loadInitial();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load kits");
    }
  }

  async function handlePin(kit: KitListItem, pinned: boolean) {
    if (pinned && pinnedKits.length >= MAX_PINNED_KITS && !isPinned(kit)) {
      toast("You can pin up to 5 kits", "error");
      return;
    }

    try {
      const token = await getToken();
      const updated = await api.patchKit(token, kit.id, { pinned });
      const next: KitListItem = {
        ...kit,
        pinnedAt: updated.pinnedAt ?? null,
      };

      if (pinned) {
        setKits((current) => current?.filter((item) => item.id !== kit.id) ?? null);
        setPinnedKits((current) => [
          next,
          ...current.filter((item) => item.id !== kit.id),
        ]);
      } else {
        setPinnedKits((current) => current.filter((item) => item.id !== kit.id));
        setKits((current) => {
          const rest = (current ?? []).filter((item) => item.id !== kit.id);
          return [...rest, next].sort((a, b) =>
            b.createdAt.localeCompare(a.createdAt),
          );
        });
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not update pin", "error");
    }
  }

  const closeDeleteDialog = useCallback(() => {
    if (deleting) return;
    setPendingDelete(null);
  }, [deleting]);

  async function confirmDelete() {
    if (!pendingDelete) return;
    const name = kitTitle(pendingDelete);
    setDeleting(true);
    try {
      const token = await getToken();
      await api.deleteKit(token, pendingDelete.id);
      setKits(
        (current) => current?.filter((item) => item.id !== pendingDelete.id) ?? null,
      );
      setPinnedKits((current) =>
        current.filter((item) => item.id !== pendingDelete.id),
      );
      setPendingDelete(null);
      toast(`${name} has been deleted`, "success");
      router.push("/new");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not delete kit", "error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Close kits sidebar"
          className="fixed inset-0 top-14 z-20 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={cn(
          "fixed top-14 bottom-0 left-0 z-30 flex w-80 flex-col overflow-hidden border-r border-border bg-surface/95 backdrop-blur-md transition-transform lg:sticky lg:top-0 lg:z-auto lg:h-full lg:bg-surface/70 lg:pt-14 lg:backdrop-blur-none",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="shrink-0 border-b border-border bg-surface/95 p-3">
          <Link
            href="/new"
            className={cn(
              "inline-flex h-10 w-full items-center justify-center rounded-md px-4 text-[15px] font-medium transition-opacity",
              pathname === "/new"
                ? "border border-primary bg-elevated text-primary hover:opacity-100"
                : "bg-primary text-background hover:opacity-80",
            )}
          >
            New Kit
          </Link>
        </div>

        <nav
          ref={navRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2"
        >
          {error ? (
            <div className="px-2 py-3">
              <p className="text-[13px] text-danger">{error}</p>
              <button
                type="button"
                className="mt-2 text-[13px] text-secondary hover:underline"
                onClick={() => void handleRetry()}
              >
                Retry
              </button>
            </div>
          ) : kits === null ? (
            <div className="flex flex-col gap-2 px-1">
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
            </div>
          ) : kits.length === 0 && pinnedKits.length === 0 ? (
            <p className="px-2 py-3 text-[13px] leading-5 text-muted">
              No kits yet. Create one to see it here.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {pinnedKits.length > 0 ? (
                <div>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-md px-2 py-1 text-muted hover:bg-elevated/70 hover:text-foreground"
                    aria-expanded={pinnedOpen}
                    onClick={() => setPinnedOpen((current) => !current)}
                  >
                    <span className="text-[13px] font-semibold">
                      Pinned Kits
                    </span>
                    <Chevron open={pinnedOpen} />
                  </button>
                  {pinnedOpen ? (
                    <ul className="mt-1 flex flex-col gap-0.5">
                      {pinnedKits.map((kit) => (
                        <KitRow
                          key={kit.id}
                          kit={kit}
                          pathname={pathname}
                          pinCount={pinnedKits.length}
                          onPin={(item, next) => void handlePin(item, next)}
                          onDelete={setPendingDelete}
                        />
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : null}

              {kits.length > 0 ? (
                <div>
                  <p className="px-2 pt-1 pb-2 text-[11px] font-bold tracking-[0.12em] text-muted uppercase">
                    Kits
                  </p>
                  <ul className="flex flex-col gap-0.5">
                    {kits.map((kit) => (
                      <KitRow
                        key={kit.id}
                        kit={kit}
                        pathname={pathname}
                        pinCount={pinnedKits.length}
                        onPin={(item, next) => void handlePin(item, next)}
                        onDelete={setPendingDelete}
                      />
                    ))}
                  </ul>
                </div>
              ) : null}

              {nextCursor ? (
                <div ref={sentinelRef} className="px-1 py-2">
                  {loadingMore ? (
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-9" />
                      <Skeleton className="h-9" />
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          )}
        </nav>
      </aside>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete kit?"
        description={
          pendingDelete
            ? `This will permanently delete ${kitTitle(pendingDelete)}. This cannot be undone.`
            : null
        }
        confirmLabel="Delete"
        confirmingLabel="Deleting…"
        confirming={deleting}
        onConfirm={() => void confirmDelete()}
        onClose={closeDeleteDialog}
      />
    </>
  );
}
