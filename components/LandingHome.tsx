import { CreateKitForm } from "@/components/CreateKitForm";
import { HashLink } from "@/components/HashLink";
import { LandingArt } from "@/components/LandingArt";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

const heroPills = [
  "Company research",
  "Role-specific questions",
  "Flashcards & quiz",
  "Day-by-day plan",
];

const steps = [
  {
    title: "Paste the brief",
    body: "Drop in the job description, the company site, and how many days you have. That’s the whole setup.",
    src: "/illustrations/undraw-job-hunt.svg",
    alt: "Person reviewing job listings on a laptop",
  },
  {
    title: "We research the role",
    body: "Prepto crawls the company site and public interview discussion, then writes a kit for this company — not a generic prompt.",
    src: "/illustrations/undraw-researching.svg",
    alt: "Person researching at a desk with notes and a laptop",
  },
  {
    title: "Practise the kit",
    body: "Read the brief, drill questions, flip flashcards, take the quiz, and follow a schedule that fits the days you have.",
    src: "/illustrations/undraw-studying.svg",
    alt: "Person studying with a book in front of a board",
  },
];

const kitParts = [
  {
    title: "Company brief",
    body: "What they do, culture, products, and hiring signals pulled from the site and public write-ups.",
    src: "/illustrations/undraw-task-brief.svg",
    alt: "Person presenting a written brief",
  },
  {
    title: "Role breakdown",
    body: "Must-haves, nice-to-haves, the likely interview loop, and what “good” looks like in this seat.",
    src: "/illustrations/undraw-interview.svg",
    alt: "Two people in an interview at a desk",
  },
  {
    title: "Question bank",
    body: "Behavioral, technical, company, and curveball questions — each with why it’s asked and talking points.",
    src: "/illustrations/undraw-notes.svg",
    alt: "Open notebook with notes",
  },
  {
    title: "Flashcards",
    body: "Short prompts you can mark known or unknown, so the facts actually stick.",
    src: "/illustrations/undraw-notebook.svg",
    alt: "Person reading from a notebook",
  },
  {
    title: "Quiz",
    body: "Multiple-choice checks with explanations, so you know what you still need to cover.",
    src: "/illustrations/undraw-quiz.svg",
    alt: "Person completing a quiz on a large phone",
  },
  {
    title: "Schedule",
    body: "A day-by-day plan sized to your interview date: fundamentals first, company and mock answers later.",
    src: "/illustrations/undraw-schedule.svg",
    alt: "Person planning tasks on a calendar",
  },
];

const comparisons = [
  {
    title: "Ask a chatbot",
    body: "You get a long answer. You still have to turn it into flashcards, a quiz, and a plan — and it only knows what you pasted.",
  },
  {
    title: "Tab-hop and jot notes",
    body: "Company blog, Glassdoor threads, a Notion doc. Easy to miss the interview loop, and nothing is set up to practise.",
  },
  {
    title: "Generate a Prepto kit",
    body: "Research, questions, practice, and a schedule live in one kit you can reshape — built for this company and role.",
    highlight: true,
  },
];

const faqs = [
  {
    q: "What do I need to start?",
    a: "The job description, the company website, and how many days you have until the interview (1–30). Company name is optional — we infer it from the URL if you skip it.",
  },
  {
    q: "What happens after I hit generate?",
    a: "Prepto crawls the company site, looks up public interview discussion, then writes the kit: brief, role breakdown, questions, flashcards, quiz, and a schedule. You can open it as soon as it’s ready and edit any section.",
  },
  {
    q: "Is this a live interview assistant?",
    a: "No. Prepto is for preparing before the call — reading the company, practising answers, and following a plan. It does not listen in, overlay answers, or hide from screen share.",
  },
  {
    q: "Can I change the kit once it’s built?",
    a: "Yes. Every section is editable, and you can practise with flashcards and the quiz from the same kit. You can also generate more kits for other roles without losing the ones you already have.",
  },
];

const sectionFrame =
  "flex min-h-[65svh] scroll-mt-20 flex-col justify-center py-10";

export function LandingHome() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-16 sm:gap-10 sm:pb-24">
      <section id="start" className={`${sectionFrame} pt-24`}>
        <div className="grid items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Badge tone="info">Interview prep, researched for you</Badge>
            <h1 className="mt-5 max-w-xl text-4xl font-extrabold tracking-tight text-foreground sm:text-[40px] sm:leading-[1.1]">
              Turn a job description into a personalised prep kit.
            </h1>
            <p className="mt-4 max-w-lg text-[15px] leading-6 text-muted">
              Prepto reads the company, the role, and public interview signal —
              then builds a brief, question bank, flashcards, and a study
              schedule you can reshape and practise against.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {heroPills.map((pill) => (
                <li
                  key={pill}
                  className="rounded-full border border-border-subtle bg-elevated/80 px-3 py-1.5 text-[12px] font-medium text-foreground-secondary"
                >
                  {pill}
                </li>
              ))}
            </ul>
            <HashLink
              href="#how-it-works"
              className="mt-6 inline-flex text-[13px] font-medium text-secondary hover:text-foreground"
            >
              See how it works →
            </HashLink>
          </div>
          <div>
            <p className="mb-3 text-[11px] font-bold tracking-[0.12em] text-muted uppercase">
              Start a kit
            </p>
            <CreateKitForm compact />
          </div>
        </div>
      </section>

      <section id="how-it-works" className={sectionFrame}>
        <p className="text-[11px] font-bold tracking-[0.12em] text-muted uppercase">
          How it works
        </p>
        <h2 className="mt-2 max-w-2xl text-[28px] leading-tight font-extrabold tracking-tight sm:text-[32px]">
          Three steps from a job post to a kit you can drill.
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-6 text-muted">
          No live overlay, no extra tools. Paste what you already have, wait
          for research, then practise in one place.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={step.title} elevated className="flex flex-col p-4">
              <div className="flex h-32 items-center justify-center rounded-lg bg-input/80 px-4">
                <LandingArt
                  src={step.src}
                  alt={step.alt}
                  className="max-h-28 max-w-[200px]"
                />
              </div>
              <p className="mt-5 text-[11px] font-bold tracking-[0.12em] text-primary uppercase">
                0{index + 1}
              </p>
              <h3 className="mt-2 text-[16px] font-semibold">{step.title}</h3>
              <p className="mt-1.5 text-[13px] leading-5 text-muted">{step.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="inside" className={sectionFrame}>
        <p className="text-[11px] font-bold tracking-[0.12em] text-muted uppercase">
          What&apos;s inside
        </p>
        <h2 className="mt-2 max-w-2xl text-[28px] leading-tight font-extrabold tracking-tight sm:text-[32px]">
          One kit. Everything you&apos;d otherwise assemble by hand.
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-6 text-muted">
          Each kit is specific to the company and role you pasted — then you
          can edit any section before you practise.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {kitParts.map((part) => (
            <Card key={part.title} className="flex flex-col p-4">
              <div className="flex h-24 items-center justify-center rounded-lg bg-elevated px-3">
                <LandingArt
                  src={part.src}
                  alt={part.alt}
                  className="max-h-20 max-w-[160px]"
                />
              </div>
              <h3 className="mt-3 text-[15px] font-semibold">{part.title}</h3>
              <p className="mt-1.5 text-[13px] leading-5 text-muted">{part.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className={sectionFrame}>
        <div className="grid items-center gap-10 md:grid-cols-[0.9fr_1.1fr]">
          <div className="flex justify-center rounded-xl border border-border bg-surface p-6 sm:p-8">
            <LandingArt
              src="/illustrations/undraw-interview.svg"
              alt="Candidate and interviewer talking across a desk"
              className="max-w-sm"
            />
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-[0.12em] text-muted uppercase">
              Why this exists
            </p>
            <h2 className="mt-2 text-[28px] leading-tight font-extrabold tracking-tight sm:text-[32px]">
              Prep for the interview. Don&apos;t wing it from a dozen tabs.
            </h2>
            <div className="mt-6 grid gap-3">
              {comparisons.map((item) => (
                <Card
                  key={item.title}
                  elevated={item.highlight}
                  className={item.highlight ? "border-primary/25 p-4" : "p-4"}
                >
                  <h3
                    className={
                      item.highlight
                        ? "text-[15px] font-semibold text-primary"
                        : "text-[15px] font-semibold"
                    }
                  >
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[13px] leading-5 text-muted">{item.body}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-6 pb-4">
      <section id="faq" className="scroll-mt-20 pt-10">
        <p className="text-[11px] font-bold tracking-[0.12em] text-muted uppercase">
          FAQ
        </p>
        <h2 className="mt-2 max-w-2xl text-[28px] leading-tight font-extrabold tracking-tight sm:text-[32px]">
          Straight answers before you generate.
        </h2>
        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-surface">
          {faqs.map((item) => (
            <details key={item.q} className="group border-b border-border p-5 last:border-b-0">
              <summary className="cursor-pointer list-none">
                <span className="flex items-center justify-between gap-4 text-[15px] font-semibold">
                  {item.q}
                  <span
                    aria-hidden="true"
                    className="text-muted transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 max-w-2xl text-[14px] leading-6 text-muted">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section>
        <div className="rounded-2xl border border-border bg-surface px-6 py-10 sm:px-10">
          <div className="grid items-center gap-8 md:grid-cols-[1fr_0.7fr]">
            <div>
              <p className="text-[11px] font-bold tracking-[0.12em] text-muted uppercase">
                Ready when you are
              </p>
              <h2 className="mt-2 text-[28px] leading-tight font-extrabold tracking-tight sm:text-[32px]">
                Paste a job description. Walk in with a plan.
              </h2>
              <p className="mt-3 max-w-lg text-[15px] leading-6 text-muted">
                Sign in, generate a kit, and practise against the brief — not
                against a blank page the night before.
              </p>
              <HashLink
                href="#start"
                className="mt-6 inline-flex h-12 items-center rounded-md bg-primary px-5 text-[15px] font-medium text-background hover:opacity-90"
              >
                Start a kit
              </HashLink>
            </div>
            <LandingArt
              src="/illustrations/undraw-schedule.svg"
              alt="Person standing next to a calendar plan"
              className="mx-auto max-h-56 max-w-xs"
            />
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
