import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CreateKitForm } from "@/components/CreateKitForm";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

const steps = [
  {
    title: "Paste the brief",
    body: "Job description, company site, and how many days you have.",
  },
  {
    title: "We research",
    body: "Prepto crawls the company site and public interview discussion.",
  },
  {
    title: "Practise the kit",
    body: "Brief, questions, flashcards, quiz, and a day-by-day schedule.",
  },
];

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) {
    redirect("/new");
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pt-28 pb-12 sm:pt-32 sm:pb-16">
      <section className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="pt-2">
          <Badge tone="info">Interview prep, researched for you</Badge>
          <h1 className="mt-5 max-w-xl text-4xl font-extrabold tracking-tight text-foreground sm:text-[36px] sm:leading-[1.1]">
            Turn a job description into a personalised prep kit.
          </h1>
          <p className="mt-4 max-w-lg text-[15px] leading-6 text-muted">
            Prepto reads the company, the role, and public interview signal —
            then builds a brief, question bank, flashcards, and a study
            schedule you can reshape and practise against.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {steps.map((step, index) => (
              <Card key={step.title} elevated className="p-4">
                <p className="text-[11px] font-bold tracking-[0.12em] text-primary uppercase">
                  0{index + 1}
                </p>
                <h2 className="mt-2 text-[15px] font-semibold">{step.title}</h2>
                <p className="mt-1 text-[13px] leading-5 text-muted">{step.body}</p>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-3 text-[11px] font-bold tracking-[0.12em] text-muted uppercase">
            Start a kit
          </p>
          <CreateKitForm compact />
        </div>
      </section>
    </div>
  );
}
