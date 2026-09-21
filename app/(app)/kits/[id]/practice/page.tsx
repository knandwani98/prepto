"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import { BackLink } from "@/components/BackLink";
import { FlashcardDeck } from "@/components/FlashcardDeck";
import { Skeleton } from "@/components/ui/Skeleton";
import { api } from "@/lib/api";
import type { FlashcardMark, Kit, KitPractice } from "@/lib/types";

function emptyPractice(): KitPractice {
  return { flashcards: {}, quizResults: [], shortAnswerRatings: [] };
}

export default function PracticePage() {
  const { id } = useParams<{ id: string }>();
  const { getToken } = useAuth();
  const [kit, setKit] = useState<Kit | null>(null);

  const persist = useCallback(
    async (flashcards: Record<string, FlashcardMark>) => {
      if (!kit) return;
      const practice = { ...(kit.practice ?? emptyPractice()), flashcards };
      setKit({ ...kit, practice });
      const token = await getToken();
      await api.patchKit(token, id, { practice });
    },
    [getToken, id, kit],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await getToken();
      const data = await api.getKit(token, id);
      if (!cancelled) setKit(data);
    })();
    return () => {
      cancelled = true;
    };
  }, [getToken, id]);

  if (!kit?.kit) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <div className="mb-6">
          <BackLink href={`/kits/${id}`}>Back</BackLink>
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="mb-6">
        <BackLink href={`/kits/${id}`}>Back</BackLink>
        <p className="mt-6 text-[11px] font-bold tracking-[0.12em] text-muted uppercase">
          Practice
        </p>
        <h1 className="mt-2 text-[27px] font-bold">Flashcards</h1>
      </div>
      <FlashcardDeck
        cards={kit.kit.flashcards}
        marks={kit.practice?.flashcards ?? {}}
        onMark={(flashcards) => void persist(flashcards)}
      />
    </div>
  );
}
