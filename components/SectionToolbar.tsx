"use client";

import { useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { Button } from "./ui/Button";
import { Label } from "./ui/Input";

export function SectionToolbar({
  onSave,
  onCancel,
  saving,
  canSave = false,
}: {
  onSave: () => Promise<void> | void;
  onCancel: () => void;
  saving?: boolean;
  canSave?: boolean;
}) {
  if (!canSave && !saving) return null;

  return (
    <div
      role="region"
      aria-label="Unsaved edits"
      className="sticky bottom-2 z-50 -mx-4 flex h-11 items-center justify-between gap-3 rounded-lg border border-border/70 bg-transparent px-3 backdrop-blur-xl"
    >
      <p className="text-[12px] font-medium text-muted">Unsaved edits</p>
      <div className="flex shrink-0 items-center gap-2">
        <Button variant="secondary" className="text-xs" size="sm" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button variant="primary" className="text-xs" size="sm" onClick={onSave} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </div>
    </div>
  );
}

function CirclePlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path
        d="M8 12h8M12 8v8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
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

const LIST_FIELD_LINE_HEIGHT = 24;
const LIST_FIELD_PADDING_Y = 20;
const LIST_FIELD_MAX_ROWS = 4;
const WIDE_LIST_MIN_WIDTH = 576;

function isWideList(element: HTMLTextAreaElement) {
  const root = element.closest("[data-list-editor]");
  const width = root?.clientWidth ?? window.innerWidth;
  return width >= WIDE_LIST_MIN_WIDTH;
}

function syncListFieldSize(element: HTMLTextAreaElement) {
  if (isWideList(element)) {
    element.style.height = "";
    return;
  }
  element.style.height = "auto";
  const maxHeight =
    LIST_FIELD_LINE_HEIGHT * LIST_FIELD_MAX_ROWS + LIST_FIELD_PADDING_Y;
  element.style.height = `${Math.min(element.scrollHeight, maxHeight)}px`;
}

export function ListEditor({
  items,
  onChange,
  placeholder,
  title,
  titleAs = "heading",
  headerClassName,
  letters,
  maxItems,
  correctIndex,
}: {
  items: string[];
  onChange: (items: string[], details?: { correctIndex?: number }) => void;
  placeholder?: string;
  title?: string;
  titleAs?: "heading" | "label";
  headerClassName?: string;
  letters?: boolean;
  maxItems?: number;
  correctIndex?: number;
}) {
  const inputRefs = useRef<Array<HTMLTextAreaElement | null>>([]);
  const pendingFocusIndex = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const index = pendingFocusIndex.current;
    if (index !== null) {
      inputRefs.current[index]?.focus();
      pendingFocusIndex.current = null;
    }

    function syncAll() {
      for (const element of inputRefs.current) {
        if (element) syncListFieldSize(element);
      }
    }

    syncAll();
    const root = rootRef.current;
    if (!root) return;
    const observer = new ResizeObserver(syncAll);
    observer.observe(root);
    return () => observer.disconnect();
  }, [items]);

  function handleAdd() {
    if (maxItems != null && items.length >= maxItems) return;
    const emptyIndex = items.findIndex((item) => item.trim() === "");
    if (emptyIndex !== -1) {
      inputRefs.current[emptyIndex]?.focus();
      return;
    }
    pendingFocusIndex.current = items.length;
    onChange([...items, placeholder ?? ""]);
  }

  function handleRemove(index: number) {
    const next = items.filter((_, i) => i !== index);
    const currentCorrect = correctIndex ?? 0;
    let nextCorrect = currentCorrect;
    if (currentCorrect === index) nextCorrect = 0;
    else if (currentCorrect > index) nextCorrect = currentCorrect - 1;
    onChange(next, letters ? { correctIndex: nextCorrect } : undefined);
  }

  const selectedIndex = correctIndex ?? 0;

  const addButton = (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-primary hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      onClick={handleAdd}
    >
      <CirclePlusIcon />
      Add
    </button>
  );

  return (
    <div ref={rootRef} data-list-editor className="@container">
      <div
        className={cn(
          "flex items-center gap-1.5",
          titleAs === "label" ? "mb-1.5" : "mb-3",
          headerClassName,
        )}
      >
        {title ? (
          titleAs === "label" ? (
            <Label className="mb-0 leading-none">{title}</Label>
          ) : (
            <h3 className="text-[17px] font-semibold">{title}</h3>
          )
        ) : null}
        {maxItems == null || items.length < maxItems ? (
          <div className="ml-auto">{addButton}</div>
        ) : null}
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 @xl:flex-row @xl:items-center"
          >
            <div className="flex min-w-0 flex-1 items-center gap-1.5">
              {letters ? (
                <Button
                  variant={selectedIndex === index ? "primary" : "secondary"}
                  className="shrink-0"
                  aria-pressed={selectedIndex === index}
                  aria-label={`Mark option ${String.fromCharCode(65 + index)} as correct`}
                  onClick={() => onChange(items, { correctIndex: index })}
                >
                  {String.fromCharCode(65 + index)}
                </Button>
              ) : null}
              <textarea
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                rows={1}
                aria-label={
                  letters
                    ? `Option ${String.fromCharCode(65 + index)}`
                    : undefined
                }
                value={item}
                onChange={(event) => {
                  syncListFieldSize(event.currentTarget);
                  const next = [...items];
                  next[index] = event.target.value;
                  onChange(next);
                }}
                className="min-w-0 w-full flex-1 resize-none overflow-y-auto rounded-md border border-border bg-input px-3 py-2.5 text-[15px] leading-6 text-foreground focus:border-primary focus:outline-none @xl:h-10 @xl:min-h-10 @xl:max-h-10 @xl:overflow-x-auto @xl:overflow-y-hidden @xl:whitespace-nowrap @xl:py-0 @xl:leading-10"
              />
            </div>
            <Button
              variant="secondary"
              className="w-full @xl:w-auto @xl:shrink-0"
              onClick={() => handleRemove(index)}
            >
              <BinIcon />
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
