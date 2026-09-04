# 📡 Saturday Syndicate — AI Communications & Handoff Brief (AI_COMMS.md)
*Architecture, Ingestion Protocols, Roadmap & System Topology for Collaborating Agents*

---

## 1. PROJECT OVERVIEW & VALUE PROPOSITION

Saturday Syndicate is a mobile-first web application designed specifically to replace CBS Sports Pick'em for NCAA College Football fans.

### Core Problems Solved:
1. **CBS Game Exclusions:** CBS Sports omits marquee non-conference matchups, FCS buy-games, and smaller conference rivalries. *Saturday Syndicate lets the commissioner add and slate ANY college game.*
2. **Unplayable Spreads:** Massive FBS-vs-FCS buy-games often have -52.5 spreads or no line at all. *Saturday Syndicate gives the commissioner 1-click inline spread overrides (e.g. tuning Ohio State from -50.5 to -35.0).*
3. **The Gameday "Black Box":** CBS provides static tables. *Saturday Syndicate provides a live War Room Matrix on Saturdays with ball position (`🏈`), down & distance, play-by-play text, real-time ATS sweat meters, and two-column "Who Picked Who" breakdowns.*
4. **The "Forgot to Pick" Death Spiral:** In standard pools, missing Week 2 puts a player in a 0-15 deficit, causing them to quit. *Saturday Syndicate introduces independent per-game locks (missed noon games don't forfeit night games), proxy auto-picks (consensus underdog with a penalty), and drop-worst-week settings.*

---

## 2. SYSTEM TOPOLOGY & TECH STACK

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide React icons, `canvas-confetti`.
- **Database & Auth (Slice 2 Target):** Supabase (PostgreSQL 15+), Row Level Security (RLS), Google OAuth.
- **State Management:** Optimistic local state with localStorage persistence (`pickem_ncaa_opening_v3`), prepared for Supabase Realtime synchronization.
- **Component Hierarchy:**
  - `src/App.tsx`: Navigation header, active tab state, persistent user pick dispatcher.
  - `src/components/PickSheet.tsx`: Touch-optimized weekly pick sheet with countdown locks, weather pills, venue cards, and injury intel drawers.
  - `src/components/LiveMatrix.tsx`: Dual-view Gameday War Room (interactive game cards + classic spreadsheet matrix + live projected standings).
  - `src/components/CommissionerDashboard.tsx`: God-Mode controls: inline spread adjustments, custom matchup injection, live score simulation.
  - `src/components/Standings.tsx`: Cumulative season standings, ATS win percentage, medals.
  - `src/components/GamedaySimulator.tsx`: Interactive timeline scrubber (Pre-Game -> Noon Kicks -> Weather Halftime -> Primetime -> Final).
  - `src/data/mockData.ts`: 2026 Opening Saturday Slate (Top 25 matchups).
  - `src/data/historical2025.ts`: Real 2025 Opening Saturday Slate with actual historical scores & situations for simulation.

---

## 3. SPORTS DATA INGESTION PROTOCOLS

### 3.1 ESPN Undocumented Scoreboard API
- **Endpoint:** `https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard`
- **Critical Ingestion Rules:**
  1. **Competitor Inversion Guard:** Never assume `competitors[0]` is home. Always match on `c.homeAway === 'home'`.
  2. **Akamai Bot Defense Bypass:** Requests must route through a backend proxy or Edge Worker with valid browser headers (`User-Agent`, `Accept: application/json`, `Origin: https://www.espn.com`).
  3. **Stale-While-Revalidate (SWR):** If ESPN returns HTTP 403, 429, 5xx, or empty arrays during peak 3:30 PM ET load, serve the cached payload and never overwrite the database with empty arrays.

### 3.2 The Odds API Quota-Miser Strategy (500 Calls/Month Free Tier)
- Never poll The Odds API during live gameplay. Spreads are locked pre-game!
- Budget consumption to **4 scheduled batch calls per week**:
  - Tuesday 9:00 AM ET: Opening lines.
  - Friday 5:00 PM ET: Line check & injury updates.
  - Saturday 10:00 AM ET: Morning calibration.
  - Saturday 11:30 AM ET: Final line freeze.
- **Monthly Usage:** $\sim 16 \text{ calls/month}$ ($3.2\%$ of quota), leaving 480 calls for commissioner ad-hoc refreshes.

### 3.3 Canonical Team Disambiguation
Always resolve college teams by their numeric ESPN ID to avoid collisions:
- **`2390`**: Miami Hurricanes (FL, ACC, Orange/Green) vs. **`193`**: Miami RedHawks (OH, MAC, Red/White).
- **`145`**: Ole Miss Rebels vs. **`344`**: Mississippi State Bulldogs.
- **`309`**: Louisiana Ragin' Cajuns vs. Louisiana Tech.

---

## 4. MILESTONES & IMPLEMENTATION ROADMAP

### Completed Milestones:
- [x] **Slice 1 (Core Touch-Friendly UI):** Fully functional pick sheet, tiebreaker input, lock states, and confetti submit.
- [x] **Game-Day War Room:** Ball position indicator (`🏈`), down & distance badge, play-by-play text, ATS sweat bar, dual-view toggle (Cards vs Matrix), and live projected standings ("If Games Ended Now").
- [x] **Commissioner God-Mode:** Spread overrides, game inclusion toggles, custom game creation, live score simulation.
- [x] **Adversarial Red-Team Stress Test:** 5 specialized subagents audited and resolved API ingestion, anti-cheat security, CFB scoring anomalies, mobile chaos, and league retention.

### Current Milestone (In Progress):
- [ ] **2025 Historical Simulation & Alignment:**
  - Real 2025 Week 1 results loaded with actual scores, spreads, weather delays, and injury notes.
  - Gameday Timeline Simulator scrubber (Phase 0 to Phase 5).
  - Front-end patches for Final Score Drop bug, Push win % formula, and 16px mobile input zoom.

### Upcoming Milestones:
- [ ] **Slice 2 (Supabase & Google Auth):** PostgreSQL schema with RLS security policies, Google OAuth login, server-side kickoff lock trigger.
- [ ] **Slice 3 (Central Background Ingestion Worker):** Serverless cron running the 4-window Odds API budget + ESPN live scoreboard sync.
- [ ] **Slice 4 (League Retention Engines):** Proxy auto-picks and "Bad Beat of the Week" social export card.
