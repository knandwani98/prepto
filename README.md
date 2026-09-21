# ✨ Prepto frontend

**Turn a job post into a study kit you can practise with.**

```
📄 job post  →  🔎 research  →  🎒 kit  →  🙋 you
```

Paste a job description, the company website, and how many days you have. Prepto looks up the company and builds a **prep kit** for you:

- 🏢 company brief
- 💼 role breakdown
- ❓ interview questions
- 🃏 flashcards
- 📝 quiz
- 📅 day-by-day plan

You can edit the kit, practise with it, and walk into the interview ready.

> 🚫 This is **not** a live helper during the call. It helps you prep **before**.

---

## 🎁 What you get

| You give | Prepto makes |
| --- | --- |
| 📄 Job description | Company brief + hiring signals |
| 🌐 Company website | Role breakdown + interview loop |
| ⏰ Days until the interview | Questions, flashcards, quiz, schedule |

Then practise in the same place: flip cards, take the quiz, and pin the kits you care about.

---

## 🧰 Built with

- ⚛️ **Next.js 16** + **React 19** + **TypeScript**
- 🎨 **Tailwind CSS 4** (dark navy + mint)
- 🔐 **Clerk** for sign in / sign up
- 🥟 **Bun** to install and run

The [backend](../backend) does the research. This app just shows it.

Kit status goes: `queued` → `researching` → `generating` → `ready` ✅

---

## 🗺️ Pages

| Path | What it is |
| --- | --- |
| `/` | Home — start a kit |
| `/sign-in` / `/sign-up` | Log in / create account |
| `/new` | Make a new kit |
| `/kits/[id]` | Read and edit your kit |
| `/kits/[id]/practice` | Flashcards |
| `/kits/[id]/quiz` | Quiz |

Your kits live in the **sidebar** (pinned ones on top). `/kits` just sends you to `/new`.

**Useful folders**

- `app/` — pages
- `components/` — UI pieces
- `lib/api.ts` — talks to the backend
- `lib/types.ts` — kit data types

---

## 🚀 Run it locally

1. Start the [backend](../backend) (usually on port `4000`).
2. Add Clerk keys (see below).
3. Run:

```bash
cp .env.example .env.local
# add your Clerk keys

bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

Sign in → paste a job → wait for the kit → practise.

| Command | What it does |
| --- | --- |
| `bun dev` | Start the app |
| `bun run build` | Build for production |
| `bun start` | Run the production build |
| `bun lint` | Check the code |

### 🔑 Env vars

Copy `.env.example` into `.env.local`:

| Variable | What it’s for |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk (browser) |
| `CLERK_SECRET_KEY` | Clerk (server) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |
| `NEXT_PUBLIC_API_URL` | Backend URL (`http://localhost:4000`) |

Auth is set up in `proxy.ts`. Logged-in pages live under `app/(app)`. API calls in `lib/api.ts` send your Clerk token.

---

## 📌 Tips

- Keep kit types in `lib/types.ts` in sync with the backend.
- Reuse buttons and inputs from `components/ui/` instead of making new ones.
- If a kit has unsaved edits, use the `Link` from `UnsavedChanges` so we can warn before leaving.
- While a kit is generating, keep fetching it until it is `ready` or `failed`.

That’s it. Prep first, then walk in with a plan. 💪
