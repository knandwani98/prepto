"use client";

import { Link } from "@/components/UnsavedChanges";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import { QuizMode, ShortAnswerMode } from "@/components/QuizMode";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Tabs } from "@/components/ui/Tabs";
import { api } from "@/lib/api";
import type { Kit, KitPractice } from "@/lib/types";

type Mode = "mcq" | "short";

function emptyPractice(): KitPractice {
  return { flashcards: {}, quizResults: [], shortAnswerRatings: [] };
}

export default function QuizPage() {
  const { id } = useParams<{ id: string }>();
  const { getToken } = useAuth();
  const [kit, setKit] = useState<Kit | null>(null);
  const [mode, setMode] = useState<Mode>("mcq");

  const persist = useCallback(
    async (practice: KitPractice) => {
      if (!kit) return;
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
        <Skeleton className="h-80" />
      </div>
    );
  }

  const practice = kit.practice ?? emptyPractice();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold tracking-[0.12em] text-muted uppercase">
            Practice
          </p>
          <h1 className="mt-2 text-[27px] font-bold">Quiz</h1>
        </div>
        <Link href={`/kits/${id}`}>
          <Button variant="ghost" size="sm">
            Back to kit
          </Button>
        </Link>
      </div>

      <Tabs
        className="mb-6"
        value={mode}
        onChange={setMode}
        items={[
          { id: "mcq", label: "Multiple choice" },
          { id: "short", label: "Short answer" },
        ]}
      />

      {mode === "mcq" ? (
        <QuizMode
          items={kit.kit.quiz}
          results={practice.quizResults}
          onResult={(quizResults) =>
            void persist({ ...practice, quizResults })
          }
        />
      ) : (
        <ShortAnswerMode
          questions={kit.kit.questions}
          ratings={practice.shortAnswerRatings}
          onRate={(shortAnswerRatings) =>
            void persist({ ...practice, shortAnswerRatings })
          }
        />
      )}
    </div>
  );
}
