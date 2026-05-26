# ⚡ TDI-Craze // CyberDefense

A high-performance, procedural, and production-level **Idle Tower Defense game** running entirely on HTML5 Canvas. Designed with a sleek, premium CRT vector neon aesthetic, the game is built for extreme efficiency and features real-time synthesized audio pipelines, active offline progress simulation, modular tower systems, and endless procedural wave progression.

---

## 🚀 Key Features

### 🛡️ Tactical Core & Operational Modules
*   **Pulse Laser (Universal)**: High-speed single-target energy pulse. Highly reliable basic defense layer.
*   **Plasma Cannon (Anti-Ground)**: Delivers heavy kinetic orbital payloads dealing splash damage in a designated radius.
*   **Stasis Relay (Anti-Ground)**: Fires a continuous coolant stasis beam that decreases enemy movement vectors.
*   **Tesla Matrix (Anti-Air)**: Chains high-voltage electrical arcs to multiple soaring targets.
*   **Specialized Targeting Fallbacks**: Specialized towers (Plasma, Stasis, Tesla) employ **30% efficiency fallback attacks** against invalid target classes (e.g., Tesla Matrix targeting a single ground threat) when their primary target class is absent.

### 🔬 Multi-Dimensional Progression
*   **11 Permanent Tech Sinks**: Scale global multipliers (Damage, Fire Rate, Crit Chance, Range, Max Shield, Shield Regeneration, Tax Scraper, Wave Bank Interest, Operator Clock Speed) up to high level caps (**Lvl 99 / 80 / 50**).
*   **Difficulty Tiers (T1–T5)**: Unlocked sequentially for each sector, scaling enemy health and speeds up to **40x** while multiplying Credit and Crystal completion earnings up to **16x**.
*   **Quantum Overload Prestige**: Infuse the core with subatomic dark energy to reset progress in exchange for **Quantum Crystals**, yielding permanent **+3% Credits** per crystal.
*   **Endless Simulation Mode**: Transition standard sector completions into infinite survival ticks where wave progression increases enemy health by **+25% per endless wave**.

### 💻 Ergonomics & Advanced Operator UI
*   **Global Selected Tower Inspector**: Docked beautifully at the bottom of the sidebar, allowing players to upgrade, dismantle, and toggle targeting priorities (`FIRST`, `LAST`, `STRONG`, `WEAK`) from **any** active sidebar menu tab.
*   **Keyboard Shortcuts**: Tap `1`, `2`, `3`, or `4` to instantly select shop modules.
*   **Multi-Placement Shift-Hold**: Hold `Shift` while clicking to quickly construct multiple towers without releasing placement mode.
*   **Live Grid Performance Console**: Real-time stacked horizontal bar graph monitoring live active DPS percentages across all operational towers.
*   **Synthesized Real-Time Audio Engine**: No media assets needed! Sound FX are synthesized directly on-the-fly using the Web Audio API, visualized through a live CRT Oscilloscope monitor in the systems tab.
*   **Background Simulation (Focus Recovery)**: Built-in visibility listener catches up physics loops (clamped at 180s) when the tab runs in the background.

---

## ⌨️ Operator Controls & Shortcuts

| Key Bind | Tactical Action |
| :--- | :--- |
| **`1`** | Select **Pulse Laser** shop module |
| **`2`** | Select **Plasma Cannon** shop module |
| **`3`** | Select **Stasis Relay** shop module |
| **`4`** | Select **Tesla Matrix** shop module |
| **`Shift` + Click** | Deploy multiple modules continuously without resetting placement mode |
| **`Esc`** | Cancel active tower placement mode |

---

## 📂 File Architecture

*   **`index.html`**: Core DOM viewport structure, hosting the HUD indicators, interactive Canvas grid, grid powers, operational dashboard tabs, and live oscilloscope waveform components.
*   **`style.css`**: Premium dark-mode glassmorphic styling system containing CRT scanning keyframe animations, glowing vector shadows, responsive layouts, and floating contextual inspector cards.
*   **`game.js`**: Core game logic. Contains the procedural audio synthesis pipelines, physics equations, projectile tracking vectors, difficulty/tier algorithms, visibility catch-up loops, and interactive saving state interfaces.

---

## 🛠️ Local Development & Execution

The game is designed with zero external build requirements or compilation scripts. 

1. Clone or download the files.
2. Open `index.html` directly in any modern browser to boot up the grid simulation.
3. (Optional) Run a lightweight local development server to test state parameters locally:
    ```bash
    # Python 3
    python -m http.server 8000

    # Node.js
    npx serve .
    ```