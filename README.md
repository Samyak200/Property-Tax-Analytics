# Property Tax Analytics Dashboard (UPYOG – NUDM Intern Assessment)

React dashboard for the UPYOG multi-tenant platform. Loads the provided `properties.json` dataset and lets users:
- Filter all KPIs by city (tenant)
- View KPI cards + charts (Tasks 1 & 2)
- Ask a question to an AI assistant about the dataset (Task 3)

## Tech Stack

- React + Vite
- Recharts (charts)
- `@google/generative-ai` (Gemini AI)
- `lucide-react` (icons)

## Features (What matches the assessment)

### Task 1 — KPI Dashboard (Tenant-filtered)
Displays 4 KPI cards that update when selecting a city from the dropdown:
- Total Properties Registered
- Total Properties Approved
- Total Properties Rejected
- Total Collection (sum of `collection_inr`)

### Task 2 — Comparison Chart
- Bar chart showing **total collection per city** across all 10 cities side-by-side.
- City bars have distinct colors.

### Task 3 — AI Chat Assistant (Gemini)
- Click the **AI** button on the bottom-right to open the chat drawer (right side, ~40% width).
- The assistant answers using a compact dataset summary computed from `properties.json`.

## Folder / Data

- Dataset: `src/properties.json` (imported directly into the React app)

## Setup & Run

1. Install dependencies:
   ```bash
   npm install
   ```

3. Start dev server:
   ```bash
   npm run dev
   ```

4. Open the URL shown in the terminal (usually `http://localhost:5173/`).

## How to Use

1. Select a city from the tenant dropdown (or choose **All Cities**).
2. Look at the KPIs and charts update live.
3. Click the **AI** button (bottom-right) to ask questions like:
   - “Which city has the highest total collection?”
   - “How many properties are rejected in Mumbai?”
   - “What percentage of Delhi properties are approved?”
   - “Compare total registrations between Pune and Jaipur.”



## Notes

- If the AI drawer shows an API key error, restart the dev server after creating/updating `.env`.

# React + Vite
