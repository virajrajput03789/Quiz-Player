# Quiz Player — React.js Practical Assignment

A responsive, animated Quiz Player built with React, Vite, TypeScript, Tailwind CSS, Framer Motion, and Firebase Firestore.

## Features
- Dynamic quiz rendering from `src/data/quiz.json` (no hardcoded quiz/question data anywhere in components)
- Timed questions with auto-advance on timeout, single-selection enforcement, and a disabled "Next" until an option is picked
- No backward navigation between questions
- Firebase Firestore leaderboard — Top 10 per quiz, sorted by score then completion time
- Framer Motion animations across page transitions, question transitions, option selection, progress bar, and result reveal
- Light/Dark mode toggle
- Confetti celebration on high scores
- Fully responsive (mobile, tablet, desktop)

## Tech Stack
React 18 + Vite + TypeScript, Tailwind CSS, React Router, Framer Motion, Firebase Firestore

## Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment variables**
   Copy `.env.example` to `.env` and fill in your Firebase project's config values:
   ```bash
   cp .env.example .env
   ```
   Required keys: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`.

3. **Firebase setup (required for the leaderboard to work)**
   - Create a Firestore database in your Firebase project (Native mode).
   - Set Firestore rules to allow reads/writes to the `leaderboard` collection (test-mode rules are fine for this assignment).
   - The leaderboard query needs a composite index on `leaderboard` (`quizId` Ascending, `score` Descending, `completedAt` Descending). Firestore will show a console error with a direct link to auto-create this index the first time the query runs if it doesn't exist yet.

4. **Run the dev server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## AI Tools Used
Copilot CLI AI were used as the primary coding agents to scaffold and implement the app, based on a detailed spec prompt. Claude was used throughout as a planning, debugging, and code-review partner — I fed it error logs, screenshots, and Firebase console output at each step and used it to write precise fix instructions back to the coding agent, rather than trusting the coding agent's own bug diagnoses at face value.

## Where AI Helped
- Scaffolding the initial project structure, TypeScript types, and component breakdown from a detailed spec prompt.
- Implementing the quiz player state machine, timer logic, and Firebase read/write code.
- Generating Tailwind styling and Framer Motion animation code, including two full visual restyles (an initial "Dala"-inspired dark/violet theme, later replaced with a Discord-inspired blurple/cosmic theme) applied without touching underlying logic.
- Debugging several real bugs during the build, including:
  - A Firebase config file that initialized Analytics instead of Firestore, and used hardcoded keys instead of environment variables — traced by manually inspecting the file rather than trusting the agent's initial claim that it was "already correct."
  - A missing Firestore composite index causing the leaderboard query to fail silently.
  - A runaway `onSnapshot` listener re-subscription loop (caused by an unstable object in a `useEffect` dependency array) that spammed the console with thousands of repeated log lines and froze the browser — root-caused via console log inspection, then fixed by switching to a one-time `getDocs` fetch instead of a real-time listener.
  - A leaderboard "Enter name" modal that wasn't closing after a successful save, due to a missing state update in the submit handler.
  - A broken light/dark theme toggle caused by a missing `darkMode: 'class'` Tailwind config setting.
  - A transient Vite CSS 500 error during a mid-save hot-reload, which resolved once the file finished saving (confirmed via a clean `npm run build`).

## What I Implemented/Verified Myself
- Wrote and refined every fix prompt sent to the coding agent based on direct evidence (browser console errors, Firebase Console screenshots, terminal build output) rather than accepting the agent's self-reported "fixed it" claims — several early claims turned out to be inaccurate on inspection (e.g. a claim that `firebase.ts` was "already correct" when it was still using Analytics and hardcoded config).
- Manually verified every fix end-to-end: confirmed real documents in the Firestore console, confirmed console logs stopped looping, confirmed the modal actually closed, confirmed the theme toggle actually switched the UI, and confirmed `npm run build` passed with zero errors after every significant change.
- Ran the full functional test cycle repeatedly after each fix: quiz completion → timer behavior → answer locking → leaderboard save → leaderboard display → Play Again reset.
- Made the design decisions for the two visual theme passes and directed the coding agent on which design tokens to apply and which files were allowed to change, explicitly scoping each restyle to be UI-only with no logic modifications.
- Diagnosed root causes independently in several cases (e.g. identifying that a PowerShell terminal doesn't support `grep`, and translating checks to `Select-String`; recognizing the CSS 500 error as a transient HMR issue rather than a real bug after seeing the build succeed).

## Known Limitations / Not Implemented
- Sound effects (bonus) were not implemented due to time constraints.
- Keyboard navigation (bonus) — [update this line honestly based on your final build: implemented / not implemented].
- The production bundle currently exceeds Vite's 500kB chunk-size warning threshold; code-splitting was not pursued given the assignment's 2-day time limit.
