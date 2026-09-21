"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useLayoutEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  clearKitDraft,
  emptyDraft,
  readKitDraft,
  saveKitDraft,
} from "@/lib/draft";
import type { CreateKitPayload } from "@/lib/types";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Input, Label } from "./ui/Input";
import { Textarea } from "./ui/Textarea";
import { useToast } from "./ui/Toast";

export function CreateKitForm({
  initial,
  compact = false,
}: {
  initial?: Partial<CreateKitPayload>;
  compact?: boolean;
}) {
  const router = useRouter();
  const { isSignedIn, getToken } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState<CreateKitPayload>({
    ...emptyDraft(),
    ...initial,
  });
  const [submitting, setSubmitting] = useState(false);
  const [hasExistingKit, setHasExistingKit] = useState(false);

  useLayoutEffect(() => {
    const saved = readKitDraft();
    if (!saved) return;
    setForm({ ...emptyDraft(), ...saved, ...initial });
  }, []);

  useEffect(() => {
    if (!isSignedIn) {
      setHasExistingKit(false);
      return;
    }

    let cancelled = false;

    async function checkExisting() {
      try {
        const token = await getToken();
        const kits = await api.listKits(token);
        if (!cancelled) setHasExistingKit(kits.length > 0);
      } catch {
        if (!cancelled) setHasExistingKit(false);
      }
    }

    void checkExisting();
    return () => {
      cancelled = true;
    };
  }, [getToken, isSignedIn]);

  function updateForm(patch: Partial<CreateKitPayload>) {
    setForm((current) => {
      const next = { ...current, ...patch };
      saveKitDraft(next);
      return next;
    });
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const payload: CreateKitPayload = {
      jobDescription: form.jobDescription.trim(),
      companyUrl: form.companyUrl.trim(),
      daysUntilInterview: Number(form.daysUntilInterview),
      companyName: form.companyName?.trim() || undefined,
    };

    saveKitDraft({
      ...payload,
      companyName: payload.companyName ?? "",
    });

    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    setSubmitting(true);
    try {
      const token = await getToken();
      const kit = await api.createKit(token, payload);
      clearKitDraft();
      toast("Research started", "success");
      router.push(`/kits/${kit.id}`);
    } catch (error) {
      toast(error instanceof Error ? error.message : "Could not create kit", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className={compact ? "p-5" : "p-6 sm:p-8"}>
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div>
          <Label htmlFor="jobDescription">Job description</Label>
          <Textarea
            id="jobDescription"
            required
            minLength={50}
            rows={compact ? 7 : 10}
            placeholder="Paste the full job description..."
            value={form.jobDescription}
            onChange={(event) =>
              updateForm({ jobDescription: event.target.value })
            }
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="companyUrl">Company website</Label>
            <Input
              id="companyUrl"
              type="url"
              required
              placeholder="https://company.com"
              value={form.companyUrl}
              onChange={(event) =>
                updateForm({ companyUrl: event.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="days">Days until interview</Label>
            <Input
              id="days"
              type="number"
              required
              min={1}
              max={30}
              value={form.daysUntilInterview}
              onChange={(event) =>
                updateForm({
                  daysUntilInterview: Number(event.target.value),
                })
              }
            />
          </div>
        </div>
        <div>
          <Label htmlFor="companyName">Company name (optional)</Label>
          <Input
            id="companyName"
            placeholder="Inferred from the URL if you skip this"
            value={form.companyName ?? ""}
            onChange={(event) =>
              updateForm({ companyName: event.target.value })
            }
          />
        </div>
        {hasExistingKit ? (
          <p className="text-[13px] leading-5 text-muted">
            Generating a new kit replaces your current one.
          </p>
        ) : null}
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting
            ? "Starting research…"
            : hasExistingKit
              ? "Replace prep kit"
              : "Generate prep kit"}
        </Button>
      </form>
    </Card>
  );
}
