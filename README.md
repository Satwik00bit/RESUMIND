# RESUMIND

An AI-powered resume analyzer. Upload a PDF resume together with a job title and job description, and get an overall score, an ATS-friendliness score, and specific tips on tone and style, content, structure, and skills.

**Live demo:** https://resumind-pi.vercel.app

> Scores are AI-generated estimates meant as guidance. They can vary between runs and are not a guarantee of how any real Applicant Tracking System will treat your resume.

---

## Features

- **Sign in with Puter**: no passwords or OAuth setup of your own; authentication is handled by a Puter popup.
- **Upload a PDF resume** (drag and drop or click, PDF only, one file, up to 20 MB) along with the company name, job title, and job description.
- **AI analysis**: the PDF is sent to Claude Sonnet 4 through Puter's AI API, which reads the file directly and returns a structured JSON report.
- **Detailed feedback** in five areas: ATS compatibility, tone and style, content, structure, and skills. Each has a score and "good" / "improve" tips.
- **Dashboard** listing every past analysis with a score ring and a thumbnail of the resume's first page.
- **Results page** with a score gauge, an ATS card, and expandable per-category details next to the resume preview.
- **Wipe app data** page to delete all stored files and records.

## How it works

1. You sign in and submit the upload form.
2. The PDF is uploaded to your Puter cloud storage.
3. The first page is rendered to a PNG in the browser with pdf.js, used only for previews and thumbnails, then uploaded too.
4. A record `resume:<uuid>` is saved in Puter's key-value store.
5. The PDF and a prompt (role, scoring rubric, job title and description, required JSON shape) are sent to Claude Sonnet 4 via `puter.ai.chat`.
6. The JSON reply is parsed, saved into the same record, and you are redirected to `/resume/:id`.

The app does **not** extract text from the PDF locally and does **not** run its own keyword-matching algorithm. The model reads the PDF and does the evaluation, guided by the prompt in `constants/index.ts`.

## Tech stack

| Area | Technology |
|---|---|
| UI | React 19, TypeScript |
| Routing and SSR | React Router 7 (framework mode) |
| Styling | Tailwind CSS 4 |
| State | Zustand (a typed wrapper around `window.puter`) |
| Backend services | [Puter.js](https://developer.puter.com) for auth, file storage, key-value store, and AI |
| PDF preview | pdf.js (`pdfjs-dist`) |
| File input | react-dropzone |
| Build tooling | Vite |
| Hosting | Vercel (`@vercel/react-router`) |

There is no custom backend, database, or API key. Puter's user-pays model means each user's storage and AI usage is covered by their own Puter account.

## Project structure

```text
app/
  root.tsx            HTML document, Puter script tag, init() call, ErrorBoundary
  routes.ts           Route table
  routes/
    home.tsx          Dashboard of saved analyses
    auth.tsx          Sign in / sign out
    upload.tsx        Upload form and the analysis pipeline
    resume.tsx        Results page for one analysis
    wipe.tsx          Delete all app data
  components/         Navbar, ResumeCard, FileUploader, Summary, ATS, Details,
                      Accordion, ScoreGauge, ScoreBadge, ScoreCircle
  lib/
    puter.ts          Zustand store wrapping window.puter
    pdf2img.ts        PDF page 1 to PNG using pdf.js
    utils.ts          cn(), formatSize(), generateUUID()
constants/index.ts    AI prompt builder and sample data
types/                Global TypeScript interfaces (Resume, Feedback, Puter types)
```

## Getting started

Requirements: an LTS version of [Node.js](https://nodejs.org/).

```bash
git clone https://github.com/Satwik00bit/RESUMIND.git
cd RESUMIND
npm install
npm run dev
```

Then open http://localhost:5173. No environment variables are needed.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run typecheck` | Generate route types and run the TypeScript compiler |
| `npm run build` | Create a production build in `build/` |
| `npm start` | Serve the production build locally |

## Deployment

The project deploys to Vercel with no configuration. `react-router.config.ts` uses `vercelPreset()`, and there are no secrets to set.

## Known limitations

- Scores are model estimates and can differ between runs.
- Only the first page is previewed; the model still analyzes the whole PDF.
- No automated tests or lint configuration yet.
- A failed analysis can leave the upload screen waiting until the page is reloaded.

## Tech notes

Built with React, TypeScript, React Router, Puter.js, Zustand, Tailwind CSS, and pdf.js.
