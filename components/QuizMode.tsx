"use client";

import { useMemo, useState } from "react";
import type { KitPractice, QuizItem, SelfRating } from "@/lib/types";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Progress } from "./ui/Progress";

export function QuizMode({
  items,
  results,
  onResult,
}: {
  items: QuizItem[];
  results: KitPractice["quizResults"];
  onResult: (results: KitPractice["quizResults"]) => void;
}) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  const item = items[index];
  const answered = results.filter((result) =>
    items.some((quiz) => quiz.id === result.questionId),
  );
  const correctCount = answered.filter((result) => result.correct).length;

  function choose(optionIndex: number) {
    if (!item || picked !== null) return;
    setPicked(optionIndex);
    const correct = optionIndex === item.correctIndex;
    const next = results.filter((result) => result.questionId !== item.id);
    onResult([
      ...next,
      {
        questionId: item.id,
        correct,
        answeredAt: new Date().toISOString(),
      },
    ]);
  }

  function nextQuestion() {
    setPicked(null);
    setIndex((current) => Math.min(current + 1, items.length - 1));
  }

  if (!item) {
    return <p className="text-muted">No quiz questions in this kit.</p>;
  }

  const finished = index === items.length - 1 && picked !== null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm text-muted">
        <span>
          {index + 1} / {items.length}
        </span>
        <span>
          {correctCount} correct
        </span>
      </div>
      <Progress value={((index + (picked !== null ? 1 : 0)) / items.length) * 100} />

      <Card className="p-6">
        <p className="text-[17px] font-semibold">{item.prompt}</p>
        <div className="mt-5 grid gap-2">
          {item.options.map((option, optionIndex) => {
            const isPicked = picked === optionIndex;
            const isCorrect = optionIndex === item.correctIndex;
            const reveal = picked !== null;
            return (
              <button
                key={option}
                type="button"
                onClick={() => choose(optionIndex)}
                className={`rounded-lg border px-4 py-3 text-left text-[15px] ${
                  reveal && isCorrect
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : reveal && isPicked
                      ? "border-danger/40 bg-danger/10 text-danger"
                      : "border-border bg-elevated text-foreground hover:border-border-strong"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
        {picked !== null ? (
          <p className="mt-4 text-[15px] text-muted">{item.explanation}</p>
        ) : null}
      </Card>

      {finished ? (
        <Card elevated className="p-5">
          <Badge tone="gold">Done</Badge>
          <p className="mt-2 text-[17px] font-semibold">
            {correctCount} / {items.length} correct
          </p>
          <Button
            className="mt-4"
            variant="secondary"
            onClick={() => {
              setIndex(0);
              setPicked(null);
            }}
          >
            Retry
          </Button>
        </Card>
      ) : (
        <Button onClick={nextQuestion} disabled={picked === null}>
          Next
        </Button>
      )}
    </div>
  );
}

export function ShortAnswerMode({
  questions,
  ratings,
  onRate,
}: {
  questions: { id: string; question: string; talkingPoints: string[]; whyAsked: string }[];
  ratings: KitPractice["shortAnswerRatings"];
  onRate: (ratings: KitPractice["shortAnswerRatings"]) => void;
}) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);

  const question = questions[index];
  const ratingMap = useMemo(
    () => Object.fromEntries(ratings.map((item) => [item.questionId, item.rating])),
    [ratings],
  );

  function rate(rating: SelfRating) {
    if (!question) return;
    const next = ratings.filter((item) => item.questionId !== question.id);
    onRate([...next, { questionId: question.id, rating }]);
    setAnswer("");
    setRevealed(false);
    setIndex((current) => Math.min(current + 1, questions.length - 1));
  }

  if (!question) {
    return <p className="text-muted">No interview questions in this kit.</p>;
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted">
        {index + 1} / {questions.length}
        {ratingMap[question.id] ? ` · last: ${ratingMap[question.id]}` : ""}
      </p>
      <Card className="p-6">
        <p className="text-[17px] font-semibold">{question.question}</p>
        <p className="mt-2 text-[13px] text-subtle">{question.whyAsked}</p>
        <textarea
          className="mt-5 min-h-32 w-full rounded-md border border-border bg-input px-3 py-2.5 text-[15px] text-foreground focus:border-primary focus:outline-none"
          placeholder="Type your answer..."
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
        />
        {revealed ? (
          <div className="mt-4 rounded-lg border border-border-subtle bg-elevated p-4">
            <p className="text-[11px] font-bold tracking-[0.12em] text-gold uppercase">
              Talking points
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] text-foreground-secondary">
              {question.talkingPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        ) : (
          <Button className="mt-4" variant="secondary" onClick={() => setRevealed(true)}>
            Reveal talking points
          </Button>
        )}
      </Card>
      {revealed ? (
        <div className="flex flex-wrap gap-2">
          <Button variant="destructive" onClick={() => rate("didnt")}>
            Didn’t know
          </Button>
          <Button variant="secondary" onClick={() => rate("kinda")}>
            Kind of
          </Button>
          <Button onClick={() => rate("knew")}>Knew it</Button>
        </div>
      ) : null}
    </div>
  );
}
