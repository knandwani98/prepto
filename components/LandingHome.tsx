"use client";

import { useState } from "react";
import { CreateKitForm } from "@/components/CreateKitForm";
import { HashLink } from "@/components/HashLink";
import { LandingArt } from "@/components/LandingArt";
import { WalkthroughVideo } from "@/components/WalkthroughVideo";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

const heroPills = [
  "Company research",
  "Role-specific questions",
  "Flashcards & quiz",
  "Day-by-day plan",
  "Practise before the interview",
  "No live overlay, no extra tools.",
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

function MailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M4 7l8 6 8-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9s1.3-6.4 3.8-9z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.71.12 2.51.35 1.9-1.32 2.74-1.05 2.74-1.05.56 1.42.21 2.47.1 2.73.65.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.58 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12M7.11 20.45H3.56V9h3.55z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M18.24 2H21l-6.51 7.44L22 22h-6.17l-4.82-6.3L5.4 22H2.63l6.97-7.97L2 2h6.32l4.36 5.77zm-1.08 18.02h1.7L6.92 3.88H5.1z" />
    </svg>
  );
}

const contactLinks = [
  {
    href: "https://kushalnandwani.vercel.app/",
    label: "Site",
    icon: GlobeIcon,
  },
  {
    href: "https://github.com/knandwani98",
    label: "GitHub",
    icon: GitHubIcon,
  },
  {
    href: "https://www.linkedin.com/in/kushal-nandwani-303003153/",
    label: "LinkedIn",
    icon: LinkedInIcon,
  },
  {
    href: "https://x.com/knandwani98",
    label: "X.com",
    icon: XIcon,
  },
];

const sectionFrame =
  "flex min-h-[65svh] scroll-mt-20 flex-col justify-center py-10";

function FaqAccordion({ items }: { items: typeof faqs }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mt-8 overflow-hidden rounded-xl border border-border bg-surface">
      {items.map((item, index) => {
        const open = openIndex === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;

        return (
          <div
            key={item.q}
            className="border-b border-border p-5 last:border-b-0"
          >
            <button
              type="button"
              id={buttonId}
              aria-expanded={open}
              aria-controls={panelId}
              className="flex w-full cursor-pointer items-center justify-between gap-4 text-left text-[15px] font-semibold"
              onClick={() =>
                setOpenIndex((current) => (current === index ? null : index))
              }
            >
              {item.q}
              <span
                aria-hidden="true"
                className={cn(
                  "text-muted transition-transform duration-300",
                  open && "rotate-45",
                )}
              >
                +
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!open}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="mt-3 max-w-2xl text-[14px] leading-6 text-muted">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function LandingHome() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-16 sm:gap-10 sm:pb-24">
      <section id="start" className="flex min-h-[65svh] scroll-mt-20 flex-col justify-start py-10 pt-24">
        <div className="grid items-stretch gap-10 md:grid-cols-[2fr_3fr]">
          <div className="flex h-full flex-col justify-between gap-4">
            <div className="flex flex-col gap-6">
              <Badge tone="info" className="w-fit">Interview prep, researched for you</Badge>
              <h1 className="max-w-xl text-4xl font-extrabold tracking-tight text-foreground sm:text-[40px] sm:leading-[1.1]">
                Turn a job description into a personalised prep kit.
              </h1>
              <p className="max-w-lg text-[15px] leading-6 text-muted">
                Prepto reads the company, the role, and public interview signal —
                then builds a brief, question bank, flashcards, and a study
                schedule you can reshape and practise against.
              </p>
            </div>
            <ul className="flex flex-wrap gap-2">
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
              className="inline-flex text-[13px] font-medium text-secondary hover:text-foreground"
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

      <section id="demo" className="scroll-mt-20 py-10">
        <div className="rounded-2xl border border-border bg-surface px-6 py-10 sm:px-10">
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-[11px] font-bold tracking-[0.12em] text-muted uppercase">
                See it in action
              </p>
              <h2 className="mt-2 whitespace-nowrap text-[28px] leading-tight font-extrabold tracking-tight sm:text-[32px]">
                Watch a kit get built from a job post.
              </h2>
            </div>
            <WalkthroughVideo />
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
            <div
              key={step.title}
              className="flex flex-col rounded-xl border border-border bg-glass p-4 backdrop-blur-xl"
            >
              <div className="mx-auto flex aspect-square w-full max-w-[200px] items-center justify-center px-5 md:max-w-none">
                <LandingArt
                  src={step.src}
                  alt={step.alt}
                  className="max-h-[85%] max-w-[85%]"
                />
              </div>
              <p className="mt-5 text-[11px] font-bold tracking-[0.12em] text-primary uppercase">
                0{index + 1}
              </p>
              <h3 className="mt-2 text-[16px] font-semibold">{step.title}</h3>
              <p className="mt-1.5 text-[13px] leading-5 text-muted">{step.body}</p>
            </div>
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
              <div className="mx-auto flex aspect-square w-full max-w-[200px] items-center justify-center px-4 md:max-w-none">
                <LandingArt
                  src={part.src}
                  alt={part.alt}
                  className="max-h-[85%] max-w-[85%]"
                />
              </div>
              <h3 className="mt-3 text-[15px] font-semibold">{part.title}</h3>
              <p className="mt-1.5 text-[13px] leading-5 text-muted">{part.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className={sectionFrame}>
        <div className="grid items-stretch gap-10 md:grid-cols-2">
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
          <div className="flex h-full items-center justify-center rounded-xl border border-border bg-surface p-6 sm:p-8">
            <LandingArt
              src="/illustrations/undraw-interview.svg"
              alt="Candidate and interviewer talking across a desk"
              className="max-h-full max-w-md"
            />
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
          <FaqAccordion items={faqs} />
        </section>

        <section id="contact" className="scroll-mt-20 pt-10">
          <div className="rounded-2xl border border-border bg-surface px-6 py-10 sm:px-10">
            <p className="text-[11px] font-bold tracking-[0.12em] text-muted uppercase">
              Contact
            </p>
            <h2 className="mt-2 max-w-2xl text-[28px] leading-tight font-extrabold tracking-tight sm:text-[32px]">
              A question the FAQ didn&apos;t cover?
            </h2>
            <p className="mt-3 max-w-lg text-[15px] leading-6 text-muted">
              Email is the fastest way to reach me about Prepto — bugs, ideas, or
              a kit that missed the mark.
            </p>
            <a
              href="mailto:knandwani27@gmail.com"
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-md bg-primary px-5 text-[15px] font-medium text-background hover:opacity-90"
            >
              <MailIcon className="h-4 w-4" />
              Email me
            </a>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-medium text-muted">
              {contactLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-foreground"
                  >
                    <link.icon className="h-3.5 w-3.5" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
