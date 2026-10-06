# NEXUS — Personal Developer Command Center

> **Personal developer command center with an interactive developer universe.**

**NEXUS** is a fast, calm, and polished personal developer command center designed around **Akarsit Dubey**'s work, active projects, GitHub repositories, and engineering goals.

Instead of an overwhelming, chaotic wall of dozens of simultaneous graph nodes, NEXUS provides a clean, information-dense developer dashboard as the primary experience, coupled with a curated, clustered, and interactive digital universe graph for deep-dive visual exploration.

---

## 🧭 Core Architectural Pillars

1. **Clarity & Restraint**: A modern developer aesthetic inspired by tools like Linear, Raycast, and Vercel. Dark obsidian theme, subtle borders, high contrast, crisp typography, and zero distracting neon clutter.
2. **Dashboard as the Core**: The **Overview (`/`)** dashboard greets the user, displays core statistics, visualizes the 52-week GitHub contribution heatmap, features active projects, and embeds an interactive universe snapshot.
3. **Curated & Clustered Universe (`/universe`)**:
   - Initial graph loads only **5–12 essential nodes** (Developer Core, Featured Projects, and Smart Clusters).
   - **Collapsible Cluster Nodes** (e.g. `Frontend Stack · 4`, `Languages & Systems · 3`, `Active Targets · 2`) keep the canvas uncluttered. Clicking a cluster expands its child nodes smoothly without layout lag.
   - **Project Focus Mode**: Selecting any project illuminates only that project, its direct dependencies (stack, repository, milestone), and dims or hides unrelated nodes. Includes prominent `[Focus Mode: Project]` and `[Exit Focus]` controls.
4. **First-Class Authenticated GitHub Personalization**:
   - Automatically connected to **@Akarsit-Dubey** with real repositories (`Forge-UI`, `E-Commerce-Website`, `C-Basic-Projects`, `Akarsit-Dubey`), avatars, follower metrics, and language breakdowns.
   - Secondary "Switch Account" dialog available for external audits without dominating the main UI.
   - Secure server-side `/api/github` route with zero token leakage.
5. **Streamlined 6-Item Navigation**:
   - **Overview** (`/`): Personalized greeting, metrics, contribution heatmap, recent projects, universe snapshot.
   - **Universe** (`/universe`): 2D interactive clustered flow graph with Focus Mode, filters, and node inspector.
   - **Projects** (`/projects`): Clean project catalog with status filters and detail drawer featuring a contextual micro-graph.
   - **GitHub** (`/github`): Full GitHub dashboard with language distribution, verified contribution matrix, and repositories.
   - **Goals** (`/goals`): Active engineering targets with progress sliders, deadlines, and linked technology tags.
   - **Settings** (`/settings`): Theme (Dark/Light/System), accent colors, reduced motion, and account management.
6. **Global Command Palette (`⌘K` / `Ctrl+K`)**:
   - Instant search across projects, repositories, goals, and system navigation actions.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js (App Router, Turbopack) |
| **UI Library** | React 19, TypeScript (strict mode) |
| **Styling** | Tailwind CSS v4, custom CSS variables |
| **Graph Engine** | `@xyflow/react` (React Flow) with memoized node types |
| **State Management** | Zustand (modular domain stores) |
| **Icons & Motion** | Lucide React, Framer Motion |
| **Backend Integration**| Secure Next.js Route Handlers (`/api/github`) |

---

## ⌨️ Command Center Shortcuts

| Key | Action |
| :--- | :--- |
| `⌘ + K` / `Ctrl + K` | Global Command Palette & search |
| `Esc` | Deselect active node / Exit Focus Mode / Close drawer |
| `0` | Fit universe graph to viewport |

---

## 🚀 Getting Started

### Installation
```bash
# Clone or navigate to directory
cd Nexus

# Install dependencies
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```
*Production build compiles in ~1.9s with 0 TypeScript or lint errors.*

---

## 📄 License
MIT © Akarsit Dubey / NEXUS Team.
