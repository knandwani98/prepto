"use client";

import { Link } from "@/components/UnsavedChanges";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import { GeneratingState } from "@/components/GeneratingState";
import { KitViewer } from "@/components/KitViewer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { api } from "@/lib/api";
import type { GeneratedKit, Kit } from "@/lib/types";

export default function KitDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getToken } = useAuth();
  const { toast } = useToast();
  const [kit, setKit] = useState<Kit | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const notFound = error === "Kit not found";

  const load = useCallback(async () => {
    const token = await getToken();
    return api.getKit(token, id);
  }, [getToken, id]);

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    async function tick() {
      try {
        const data = await load();
        if (cancelled) return;
        setKit(data);
        setError(null);
        if (data.status === "queued" || data.status === "researching" || data.status === "generating") {
          timer = window.setTimeout(tick, 2000);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load kit");
        }
      }
    }

    void tick();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [load]);

  useEffect(() => {
    if (notFound) {
      router.replace("/");
    }
  }, [notFound, router]);

  async function handleSave(next: GeneratedKit) {
    setSaving(true);
    try {
      const token = await getToken();
      const updated = await api.patchKit(token, id, { kit: next });
      setKit(updated);
      toast("Saved", "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Save failed", "error");
    } finally {
      setSaving(false);
    }
  }

  if (error && !notFound) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <Card className="p-6">
          <p className="text-danger">{error}</p>
          <Link href="/" className="mt-4 inline-block">
            <Button variant="secondary">New Kit</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (!kit) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-10">
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (kit.status === "failed") {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <Card className="p-6">
          <h1 className="text-[27px] font-bold">Generation failed</h1>
          <p className="mt-2 text-[15px] text-muted">
            {kit.error ?? "Something went wrong while researching this company."}
          </p>
          <Link href="/new" className="mt-6 inline-block">
            <Button>Try another kit</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (kit.status !== "ready" || !kit.kit) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <GeneratingState
          status={kit.status}
          companyName={kit.input.companyName}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <KitViewer
        key={`${kit.id}-${kit.updatedAt}`}
        kit={kit}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
}
