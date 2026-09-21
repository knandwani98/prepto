"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Link, useUnsavedChanges } from "./UnsavedChanges";
import type {
  GeneratedKit,
  Kit,
  KitQuestion,
  RegenerableSection,
} from "@/lib/types";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Input, Label } from "./ui/Input";
import { Tabs } from "./ui/Tabs";
import { Textarea } from "./ui/Textarea";
import { cn } from "@/lib/cn";
import { ListEditor, SectionToolbar } from "./SectionToolbar";

function trimStrings<T>(value: T): T {
  if (typeof value === "string") return value.trim() as T;
  if (Array.isArray(value)) return value.map((item) => trimStrings(item)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, trimStrings(item)]),
    ) as T;
  }
  return value;
}

const TAB_PARAM = "tab";
const DEFAULT_TAB: RegenerableSection = "companyBrief";

const tabs: { id: RegenerableSection; label: string; query: string }[] = [
  { id: "companyBrief", label: "Brief", query: "brief" },
  { id: "roleBreakdown", label: "Role", query: "role" },
  { id: "questions", label: "Questions", query: "questions" },
  { id: "flashcards", label: "Flashcards", query: "flashcards" },
  { id: "quiz", label: "Quiz", query: "quiz" },
  { id: "schedule", label: "Schedule", query: "schedule" },
];

function parseTabParam(value: string | null): RegenerableSection {
  return tabs.find((tab) => tab.query === value)?.id ?? DEFAULT_TAB;
}

function tabQueryValue(id: RegenerableSection) {
  return tabs.find((tab) => tab.id === id)?.query ?? tabs[0].query;
}

const categoryTone: Record<KitQuestion["category"], "info" | "success" | "gold" | "default" | "danger"> = {
  behavioral: "info",
  technical: "success",
  role: "gold",
  company: "default",
  curveball: "danger",
};

export function KitViewer({
  kit,
  onSave,
  saving,
}: {
  kit: Kit;
  onSave: (next: GeneratedKit) => Promise<void>;
  saving?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = parseTabParam(searchParams.get(TAB_PARAM));
  const [draft, setDraft] = useState<GeneratedKit>(kit.kit!);
  const { setBlocked } = useUnsavedChanges();
  const saved = kit.kit!;

  function setTab(next: RegenerableSection) {
    if (next === tab) return;
    const params = new URLSearchParams(searchParams.toString());
    if (next === DEFAULT_TAB) {
      params.delete(TAB_PARAM);
    } else {
      params.set(TAB_PARAM, tabQueryValue(next));
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }
  const trimmedDraft = useMemo(() => trimStrings(draft), [draft]);
  const canSave =
    JSON.stringify(trimmedDraft) !== JSON.stringify(trimStrings(saved));

  const content = useMemo(() => draft, [draft]);

  useEffect(() => {
    setBlocked(canSave);
    return () => setBlocked(false);
  }, [canSave, setBlocked]);

  return (
    <div className={cn("space-y-6", (canSave || saving) && "pb-16")}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold tracking-[0.12em] text-muted uppercase">
            {saved.companyBrief.name}
          </p>
          <h1 className="mt-2 text-[36px] leading-tight font-extrabold tracking-tight">
            {saved.roleBreakdown.title}
          </h1>
          <p className="mt-2 text-[15px] text-muted">
            {kit.input.daysUntilInterview} days until interview
            {kit.research?.interviewProcessInferred
              ? " · interview process inferred"
              : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/kits/${kit.id}/practice`}>
            <Button variant="secondary">Flashcards</Button>
          </Link>
          <Link href={`/kits/${kit.id}/quiz`}>
            <Button>Quiz</Button>
          </Link>
        </div>
      </div>

      <Tabs value={tab} onChange={setTab} items={tabs} />

      {tab === "companyBrief" ? (
        <BriefEditor
          value={content.companyBrief}
          onChange={(companyBrief) => setDraft({ ...draft, companyBrief })}
        />
      ) : null}
      {tab === "roleBreakdown" ? (
        <RoleEditor
          value={content.roleBreakdown}
          onChange={(roleBreakdown) => setDraft({ ...draft, roleBreakdown })}
        />
      ) : null}
      {tab === "questions" ? (
        <QuestionsEditor
          value={content.questions}
          onChange={(questions) => setDraft({ ...draft, questions })}
        />
      ) : null}
      {tab === "flashcards" ? (
        <FlashcardsEditor
          value={content.flashcards}
          onChange={(flashcards) => setDraft({ ...draft, flashcards })}
        />
      ) : null}
      {tab === "quiz" ? (
        <QuizEditor
          value={content.quiz}
          onChange={(quiz) => setDraft({ ...draft, quiz })}
        />
      ) : null}
      {tab === "schedule" ? (
        <ScheduleEditor
          value={content.schedule}
          onChange={(schedule) => setDraft({ ...draft, schedule })}
        />
      ) : null}

      <SectionToolbar
        saving={saving}
        canSave={canSave}
        onSave={() => onSave(trimmedDraft)}
        onCancel={() => setDraft(structuredClone(saved))}
      />
    </div>
  );
}

function BriefEditor({
  value,
  onChange,
}: {
  value: GeneratedKit["companyBrief"];
  onChange: (value: GeneratedKit["companyBrief"]) => void;
}) {
  return (
    <div className="grid gap-4">
      <Card className="p-5">
        <Label>Company</Label>
        <Input
          value={value.name}
          onChange={(event) => onChange({ ...value, name: event.target.value })}
        />
        <Label className="mt-4">What they do</Label>
        <Textarea
          rows={5}
          value={value.whatTheyDo}
          onChange={(event) =>
            onChange({ ...value, whatTheyDo: event.target.value })
          }
        />
        <Label className="mt-4">Culture</Label>
        <Textarea
          rows={4}
          value={value.culture}
          onChange={(event) =>
            onChange({ ...value, culture: event.target.value })
          }
        />
      </Card>
      <Card elevated className="p-5">
        <ListEditor
          title="Products"
          items={value.products}
          onChange={(products) => onChange({ ...value, products })}
        />
      </Card>
      <Card elevated className="p-5">
        <ListEditor
          title="Hiring signals"
          items={value.hiringSignals}
          onChange={(hiringSignals) => onChange({ ...value, hiringSignals })}
        />
      </Card>
    </div>
  );
}

function RoleEditor({
  value,
  onChange,
}: {
  value: GeneratedKit["roleBreakdown"];
  onChange: (value: GeneratedKit["roleBreakdown"]) => void;
}) {
  return (
    <div className="grid gap-4">
      <Card className="p-5">
        <Label>Title</Label>
        <Input
          value={value.title}
          onChange={(event) => onChange({ ...value, title: event.target.value })}
        />
        <Label className="mt-4">Summary</Label>
        <Textarea
          rows={5}
          value={value.summary}
          onChange={(event) =>
            onChange({ ...value, summary: event.target.value })
          }
        />
        <Label className="mt-4">What success looks like</Label>
        <Textarea
          rows={4}
          value={value.successLooksLike}
          onChange={(event) =>
            onChange({ ...value, successLooksLike: event.target.value })
          }
        />
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card elevated className="p-5">
          <ListEditor
            title="Must-haves"
            items={value.mustHaves}
            onChange={(mustHaves) => onChange({ ...value, mustHaves })}
          />
        </Card>
        <Card elevated className="p-5">
          <ListEditor
            title="Nice-to-haves"
            items={value.niceToHaves}
            onChange={(niceToHaves) => onChange({ ...value, niceToHaves })}
          />
        </Card>
      </div>
      <Card elevated className="p-5">
        <ListEditor
          title="Likely interview loop"
          items={value.interviewLoop}
          onChange={(interviewLoop) => onChange({ ...value, interviewLoop })}
        />
      </Card>
    </div>
  );
}

function QuestionsEditor({
  value,
  onChange,
}: {
  value: KitQuestion[];
  onChange: (value: KitQuestion[]) => void;
}) {
  return (
    <div className="space-y-4">
      {value.map((question, index) => (
        <Card key={question.id} className="p-5">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge tone={categoryTone[question.category]}>{question.category}</Badge>
            <Badge>{question.difficulty}</Badge>
          </div>
          <Label>Question</Label>
          <Textarea
            rows={2}
            value={question.question}
            onChange={(event) => {
              const next = [...value];
              next[index] = { ...question, question: event.target.value };
              onChange(next);
            }}
          />
          <Label className="mt-4">Why they ask it</Label>
          <Textarea
            rows={2}
            value={question.whyAsked}
            onChange={(event) => {
              const next = [...value];
              next[index] = { ...question, whyAsked: event.target.value };
              onChange(next);
            }}
          />
          <ListEditor
            title="Talking points"
            titleAs="label"
            headerClassName="mt-4"
            items={question.talkingPoints}
            onChange={(talkingPoints) => {
              const next = [...value];
              next[index] = { ...question, talkingPoints };
              onChange(next);
            }}
          />
        </Card>
      ))}
    </div>
  );
}

function FlashcardsEditor({
  value,
  onChange,
}: {
  value: GeneratedKit["flashcards"];
  onChange: (value: GeneratedKit["flashcards"]) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {value.map((card, index) => (
        <Card key={card.id} elevated className="p-5">
          <Label>Front</Label>
          <Textarea
            rows={2}
            value={card.front}
            onChange={(event) => {
              const next = [...value];
              next[index] = { ...card, front: event.target.value };
              onChange(next);
            }}
          />
          <Label className="mt-4">Back</Label>
          <Textarea
            rows={3}
            value={card.back}
            onChange={(event) => {
              const next = [...value];
              next[index] = { ...card, back: event.target.value };
              onChange(next);
            }}
          />
          <p className="mt-3 text-[13px] text-subtle">
            {card.tags.join(" · ") || "No tags"}
          </p>
        </Card>
      ))}
    </div>
  );
}

function QuizEditor({
  value,
  onChange,
}: {
  value: GeneratedKit["quiz"];
  onChange: (value: GeneratedKit["quiz"]) => void;
}) {
  return (
    <div className="space-y-4">
      {value.map((item, index) => (
        <Card key={item.id} className="p-5">
          <Label>Prompt</Label>
          <Textarea
            rows={2}
            value={item.prompt}
            onChange={(event) => {
              const next = [...value];
              next[index] = { ...item, prompt: event.target.value };
              onChange(next);
            }}
          />
          <ListEditor
            title="Options"
            titleAs="label"
            headerClassName="mt-4"
            letters
            maxItems={4}
            items={item.options}
            correctIndex={item.correctIndex ?? 0}
            onChange={(options, details) => {
              const next = [...value];
              const nextOptions = options.slice(0, 4);
              next[index] = {
                ...item,
                options: nextOptions,
                correctIndex:
                  details?.correctIndex ??
                  Math.min(
                    item.correctIndex ?? 0,
                    Math.max(nextOptions.length - 1, 0),
                  ),
              };
              onChange(next);
            }}
          />
          <Label className="mt-4">Explanation</Label>
          <Textarea
            rows={2}
            value={item.explanation}
            onChange={(event) => {
              const next = [...value];
              next[index] = { ...item, explanation: event.target.value };
              onChange(next);
            }}
          />
        </Card>
      ))}
    </div>
  );
}

function ScheduleEditor({
  value,
  onChange,
}: {
  value: GeneratedKit["schedule"];
  onChange: (value: GeneratedKit["schedule"]) => void;
}) {
  return (
    <div className="space-y-4">
      {value.map((day, index) => (
        <Card key={day.day} className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <Badge tone="gold">Day {day.day}</Badge>
          </div>
          <Label>Focus</Label>
          <Input
            value={day.focus}
            onChange={(event) => {
              const next = [...value];
              next[index] = { ...day, focus: event.target.value };
              onChange(next);
            }}
          />
          <ListEditor
            title="Tasks"
            titleAs="label"
            headerClassName="mt-4"
            items={day.tasks.map((task) => task.label)}
            onChange={(labels) => {
              const next = [...value];
              next[index] = {
                ...day,
                tasks: labels.map((label, taskIndex) => ({
                  id: day.tasks[taskIndex]?.id ?? `task-${day.day}-${taskIndex}`,
                  label,
                  relatedIds: day.tasks[taskIndex]?.relatedIds ?? [],
                })),
              };
              onChange(next);
            }}
          />
        </Card>
      ))}
    </div>
  );
}
