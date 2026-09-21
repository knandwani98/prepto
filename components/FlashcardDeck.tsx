"use client";

import { useMemo, useState } from "react";
import type { Flashcard, FlashcardMark, KitPractice } from "@/lib/types";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Progress } from "./ui/Progress";

export function FlashcardDeck({
  cards,
  marks,
  onMark,
}: {
  cards: Flashcard[];
  marks: Record<string, FlashcardMark>;
  onMark: (practice: KitPractice["flashcards"]) => void;
}) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [onlyUnknown, setOnlyUnknown] = useState(false);

  const deck = useMemo(() => {
    if (!onlyUnknown) return cards;
    const unknown = cards.filter((card) => marks[card.id] !== "known");
    return unknown.length > 0 ? unknown : cards;
  }, [cards, marks, onlyUnknown]);

  const card = deck[Math.min(index, Math.max(deck.length - 1, 0))];
  const knownCount = cards.filter((item) => marks[item.id] === "known").length;

  function go(delta: number) {
    setFlipped(false);
    setIndex((current) => {
      const next = current + delta;
      if (next < 0) return deck.length - 1;
      if (next >= deck.length) return 0;
      return next;
    });
  }

  function mark(value: FlashcardMark) {
    if (!card) return;
    onMark({ ...marks, [card.id]: value });
    go(1);
  }

  if (!card) {
    return <p className="text-muted">No flashcards in this kit.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {Math.min(index + 1, deck.length)} / {deck.length}
          <span className="text-subtle"> · {knownCount} marked known</span>
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setOnlyUnknown((value) => !value);
            setIndex(0);
            setFlipped(false);
          }}
        >
          {onlyUnknown ? "Show all" : "Unknown only"}
        </Button>
      </div>
      <Progress value={cards.length ? (knownCount / cards.length) * 100 : 0} />

      <button type="button" className="w-full text-left" onClick={() => setFlipped((v) => !v)}>
        <Card className="min-h-[240px] p-8">
          <div className="mb-4 flex items-center justify-between">
            <Badge tone="info">{flipped ? "Answer" : "Prompt"}</Badge>
            <span className="text-[13px] text-subtle">Click to flip</span>
          </div>
          <p className="text-[27px] leading-snug font-semibold">
            {flipped ? card.back : card.front}
          </p>
          {card.tags.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {card.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          ) : null}
        </Card>
      </button>

      <div className="flex flex-wrap justify-between gap-2">
        <Button variant="secondary" onClick={() => go(-1)}>
          Previous
        </Button>
        <div className="flex gap-2">
          <Button variant="destructive" onClick={() => mark("unknown")}>
            Unknown
          </Button>
          <Button onClick={() => mark("known")}>Known</Button>
        </div>
        <Button variant="secondary" onClick={() => go(1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
