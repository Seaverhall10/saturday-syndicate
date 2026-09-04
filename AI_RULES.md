# 📜 Saturday Syndicate — Core AI & System Rules (AI_RULES.md)
*The Definitive Law & Invariants for Any AI Agent or Human Developer Contributing to Saturday Syndicate*

---

## 1. MISSION & DOMAIN BOUNDARIES (NON-NEGOTIABLE)

1. **100% NCAA College Football Exclusive:**
   - This application is built **strictly and solely for College Football (NCAA Division I FBS & FCS)**.
   - **Zero NFL references:** Never introduce NFL terminology, Sunday ticket references, Monday Night Football, or NFL team abbreviations.
   - The brand is **Saturday Syndicate**.
2. **Zero Payment Processing Law:**
   - **Never introduce payment gateways, credit card forms, Stripe, PayPal, or Venmo SDKs.**
   - All leagues are strictly "bragging rights / friendly pools". Payments and payouts are handled off-platform by league members directly to prevent account freezes and gambling regulatory issues.
3. **CBS Sports Pick'em Replacement Mandate:**
   - The primary purpose is overcoming CBS Sports' limitations:
     - Allow picking **any** college football game (including FCS and unranked buy-games).
     - Allow the commissioner to set **custom, playable spreads** (e.g. replacing a -50.5 buy-game spread with -35.0).
     - Provide a live, real-time **War Room Sweat Matrix** during games (down & distance, field position, live ATS cover status, who-picked-who).

---

## 2. ANTI-CHEAT & CONFIDENTIALITY LAWS (ZERO TRUST)

1. **Server Monotonic Authority (Anti-Sniping):**
   - Game lock determination **MUST NEVER** rely on client device clocks (`Date.now()`). Clients can roll back system time in browser DevTools.
   - All locks are strictly evaluated against PostgreSQL server monotonic time (`clock_timestamp()`).
   - Picks lock **60 seconds prior to official scheduled kickoff** to eliminate in-stadium / low-latency broadcast front-running.
2. **Monotonic Lock Irreversibility:**
   - Once a game is locked, it **can NEVER be unlocked**.
   - If severe weather or lightning halts a game in Q2 and the upstream data feed pushes the kickoff time forward or sets status to `pre`, the system **MUST NOT re-open picks** ("Ghost Unlock").
   - Rule: $\text{isLocked} = \text{hasEverStarted} \lor (\text{now} \ge \text{kickoffTime}) \lor (\text{status} \in \{\text{'in'}, \text{'post'}, \text{'suspended'}\})$.
3. **Row-Level Confidentiality (The Privacy Law):**
   - Before a game kicks off, an opponent's pick is **100% confidential**.
   - **Never leak picks in client memory:** Picks cannot be delivered to the client and hidden with CSS `<div>Hidden</div>`.
   - In Supabase / PostgreSQL, Row Level Security (RLS) must redact opponents' picks at the database layer until `clock_timestamp() >= game.kickoff_time`.
4. **Authoritative Spread Assignment (Anti-Tampering):**
   - The pick submission payload MUST ONLY accept `{ gameId, selectedTeamId }`.
   - **Never accept `spreadAtPick` from the client request.** The server independently fetches and snapshots the authoritative spread from the `games` table.
5. **Immutable Line Freeze:**
   - A weekly slate declares an immutable `lineFreezeTime` (e.g. Wednesday 11:59 PM ET).
   - After this timestamp, market line movement from sportsbooks is discarded so all league members pick against the exact same frozen line.

---

## 3. NCAA SCORING & MATHEMATICAL STANDARDS

1. **The 6-Tier Hierarchical Tiebreaker Specification:**
   When league members finish tied on weekly ATS wins, ties are resolved deterministically using this exact hierarchy:
   - **Tier 1:** Absolute distance to the Primetime Game total combined points: $|\text{predictedTotal} - \text{actualTotal}|$. Lowest delta wins.
   - **Tier 2 (Price-is-Right Directional Preference):** If two players have identical deltas (e.g. predicted 54 and 62 for a 58-point game), the **under prediction wins** (closest without going over).
   - **Tier 3 (Tiebreaker Game Straight Cover):** Did the player correctly pick the ATS winner of the tiebreaker game itself?
   - **Tier 4 (Marquee Matchup Cover):** Did the player correctly pick the marquee game of the week (Game 1 / Game of the Week)?
   - **Tier 5 (Cumulative Margin of Victory):** Sum of ATS cover margins across all winning picks.
   - **Tier 6 (Earliest Submission Timestamp):** First player to submit their weekly slate wins.
2. **Push Settlement Model (Half-Point Standard):**
   - In College Football ATS pools, an exact push (where margin == spread) is treated as a **half-win (0.5 wins)**:
     $$\text{Win \%} = \frac{\text{Wins} + (0.5 \times \text{Pushes})}{\text{Wins} + \text{Losses} + \text{Pushes}} \times 100$$
   - **Invariance Rule:** The sorting order in `Standings.tsx` and the displayed `Win %` must use the **exact same formula** to prevent Rank 1 from having a lower displayed percentage than Rank 2.
3. **Overtime Rule (NCAA Rule 3-1-3):**
   - College Football games cannot end in ties (except rare terminated weather cancellations).
   - In 3OT and beyond, teams alternate mandatory 2-point conversions, leading to frequent 2-point margins (e.g. 54-52 in 3OT).
   - Full game scores including overtime count toward the Against-The-Spread result.
4. **Canceled / Shortened Games (The 55-Minute Rule):**
   - In accordance with standard sports betting regulations, a college football game must complete at least **55 minutes of play** to be official for ATS grading.
   - If canceled before 55 minutes, the game is marked `'void'`, removed from the scoring denominator, and does not penalize players.

---

## 4. MOBILE, OFFLINE & PERFORMANCE STANDARDS

1. **The 16px Font Rule (iOS WebKit Auto-Zoom Prevention):**
   - **Every `<input>`, `<select>`, and `<textarea>` must have a font-size of at least `16px` (`text-base`) on mobile.**
   - Inputs with font sizes below 16px (e.g., `text-xs`, `text-sm`) trigger an uncontrollable 150% page zoom on iOS Safari that breaks responsive layouts.
2. **Touch-Scroll Disambiguation:**
   - Button selections on mobile pick sheets must not trigger on scroll-flings. Ensure gestures with travel $> 8\text{px}$ are treated as scrolls rather than team pick toggles.
3. **Virtual Keyboard Occlusion:**
   - Sticky top headers must collapse or yield when the virtual keyboard is active (`window.visualViewport`) so tiebreaker inputs at the bottom of the sheet remain visible.
4. **Safari 7-Day Storage Eviction Guard:**
   - Never treat `localStorage` as the single source of truth. Always re-hydrate user sessions from the backend on boot to survive Safari's 7-day Intelligent Tracking Prevention (ITP) cache wipe.
