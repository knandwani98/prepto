"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

export interface ThreeDotMenuItem {
  label: string;
  onSelect: () => void;
  icon?: ReactNode;
  tone?: "default" | "danger";
  disabled?: boolean;
  title?: string;
}

function DotsIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-4 w-4">
      <circle cx="10" cy="4.5" r="1.5" />
      <circle cx="10" cy="10" r="1.5" />
      <circle cx="10" cy="15.5" r="1.5" />
    </svg>
  );
}

export function ThreeDotMenu({
  items,
  label = "More actions",
  className,
  hoverReveal = false,
}: {
  items: ThreeDotMenuItem[];
  label?: string;
  className?: string;
  hoverReveal?: boolean;
}) {
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{
    top?: number;
    bottom?: number;
    right: number;
  } | null>(null);

  function placeMenu() {
    const button = buttonRef.current;
    const menu = menuRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const menuHeight = menu?.offsetHeight ?? 80;
    const gap = 6;
    const padding = 8;
    const right = Math.max(padding, window.innerWidth - rect.right);
    const openAbove =
      rect.bottom + gap + menuHeight + padding > window.innerHeight &&
      rect.top - gap - menuHeight > padding;

    setCoords(
      openAbove
        ? { bottom: window.innerHeight - rect.top + gap, right }
        : { top: rect.bottom + gap, right },
    );
  }

  useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }
    placeMenu();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    function onReposition() {
      placeMenu();
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, [open]);

  let menu: ReactNode = null;
  if (open && typeof document !== "undefined") {
    menu = createPortal(
      <div
        ref={menuRef}
        id={menuId}
        role="menu"
        aria-label={label}
        className="fixed z-50 min-w-36 rounded-md border border-border bg-surface py-1 shadow-[0_12px_35px_rgba(0,0,0,0.28)]"
        style={coords ?? { visibility: "hidden", top: 0, right: 0 }}
      >
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            role="menuitem"
            disabled={item.disabled}
            className={cn(
              "flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40",
              item.tone === "danger"
                ? "text-danger hover:bg-danger/10"
                : "text-foreground hover:bg-elevated",
            )}
            title={item.title}
            onClick={() => {
              if (item.disabled) return;
              setOpen(false);
              item.onSelect();
            }}
          >
            {item.icon ? (
              <span className="flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden="true">
                {item.icon}
              </span>
            ) : null}
            {item.label}
          </button>
        ))}
      </div>,
      document.body,
    );
  }

  return (
    <div
      className={cn(
        hoverReveal && "transition-opacity max-lg:opacity-100",
        hoverReveal &&
          !open &&
          "lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100",
        className,
      )}
      data-open={open || undefined}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        className="flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-elevated hover:text-foreground"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen((current) => !current);
        }}
      >
        <DotsIcon />
      </button>
      {menu}
    </div>
  );
}
