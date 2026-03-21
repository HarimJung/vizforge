전부 드립니다. 순서대로 저장해두세요.

---

**프롬프트 1 — CLAUDE.md 업데이트:**

```
## Task: Update CLAUDE.md output rules + file structure

Open CLAUDE.md and replace the 출력 규칙 section with:

---

## 출력 규칙
- 개발 중에는 파일을 분리한다:
  - output/[project-name]/index.html — Template E 프레임만
  - output/[project-name]/css/chart.css — 차트 전용 CSS
  - output/[project-name]/js/chart.js — 차트 전용 JS
  - index.html에서 <link href="css/chart.css">와 <script src="js/chart.js">로 연결한다.
- 배포 시에는 단일 파일로 합친다:
  - output/[project-name]/dist/index.html — CSS와 JS가 인라인된 최종본
- 외부 라이브러리는 CDN으로만 로드한다 (npm/빌드 도구 사용 금지).
- 데이터는 js/chart.js 내 인라인 또는 별도 JSON fetch로 포함한다.

---

Also update the 참조 파일 section, add:
- 빌드 스크립트: scripts/build.js (개발용 분리 파일을 단일 HTML로 합침)

Do NOT modify any other content in CLAUDE.md.
```

---

**프롬프트 2 — 파일 분리:**

```
## Task: Split index.html into 3 files

Current: output/ai-energy-co2/index.html (single file, ~1100 lines)

Split into:

1. output/ai-energy-co2/index.html
   - Template E frame only (header, KPI, #chart-slot, insights, footer)
   - <link rel="stylesheet" href="css/chart.css"> in <head>
   - <script src="js/chart.js"></script> before </body>
   - CDN libraries (d3, gsap) stay in <head>
   - Keep all Template E CSS inline in <style>
   - Remove all chart-specific CSS and JS from this file

2. output/ai-energy-co2/css/chart.css
   - All chart-scoped CSS (cells, labels, legend, tooltip, detail-panel,
     loading overlay, annotations, cross-links)
   - Chart color tokens (--c1 through --c6, --c-clean-agg, --c-fossil-agg)
   - Scope chart styles under .chart-area where possible

3. output/ai-energy-co2/js/chart.js
   - The entire (function(){ ... })() block
   - Includes: DATA object, color system, SVG setup, Voronoi computation,
     render functions, KPI logic, tooltip, hover/click interactions,
     detail panel, loading sequence, visibility change handler

Verify:
- Open index.html in browser
- Chart renders correctly
- All interactions work
- No 404 errors in console for css/js files

Do NOT change any logic, colors, sizes, or behavior. Just split files.
Backup current index.html as index-single.html first.
```

---

**프롬프트 3 — 색/폰트/사이즈/배경 수정:**

```
## Fix: Colors + Fonts + Chart Size + Background

Edit css/chart.css and js/chart.js only. Do NOT touch index.html frame.

### 1. Color palette — soft pastels (in css/chart.css)
Replace chart tokens:
--c1: #7EC8D9;   /* soft teal — Nuclear */
--c2: #E8A0A0;   /* soft pink — Coal */
--c3: #F2C478;   /* soft amber — Natural Gas */
--c4: #A8D8A0;   /* soft mint green — Renewables */
--c5: #E8D4A0;   /* soft beige — Oil & Other */
--c6: #B8B0D0;   /* soft lavender */
--c-clean-agg: #90C8B8;
--c-fossil-agg: #E8B890;

Cell fill: flat color, NO radial gradient, fill-opacity 0.85
Cell strokes: rgba(0,0,0,0.06), stroke-width 0.5px
Region boundary strokes: rgba(0,0,0,0.12), stroke-width 1px

### 2. Chart-area background — match frame (in css/chart.css)
.chart-area background: var(--bg-color) (#F5F0EB)
All SVG text fills: dark (#222, #444, #666) not white
Remove .chart-area::before entirely
Legend text: color #555
Tooltip + detail panel: keep dark overlay style (they float above)

### 3. Font sizes inside chart (in js/chart.js)
Region labels (depth-1): font-size 16px, font-weight 700, fill #222
Energy labels (depth-2): font-size 12px, font-weight 500, fill #444
TWh values: font-size 11px, fill #666
Year labels: font-size 22px, font-weight 900, fill #111
Year TWh: font-size 14px, fill #444
Hide labels only if cell area < 400px²

### 4. Chart size (in js/chart.js)
R24 = 333 (was 222), R30 = 504 (was 336) — both x1.5
Adjust compCX, compCY if needed to keep chart centered
Chart must fill 90%+ of chart-area
ViewBox may need to increase: try 0 0 1400 900

### 5. KPI styling (in css/chart.css)
Remove any chart-color overrides on KPI text
All .kpi-value: use var(--accent-color) only
.context-bar: height 100%
.context-item: flex 1, justify-content center

### 6. Region click — dim others (in js/chart.js)
Click a region:
  - Selected cells: fill-opacity 0.85
  - Other cells: fill-opacity 0.08, stroke-opacity 0.05
  - Selected labels: opacity 1, Other labels: opacity 0.1
  - Transition: 0.4s ease
Click empty: all return to normal

### 7. Do NOT change:
- index.html (Template E frame)
- Data values, animation logic, detail panel logic
```

---

**프롬프트 4 — 빌드 스크립트 생성:**

```
## Task: Create build script

Create scripts/build.js that:

1. Reads output/ai-energy-co2/index.html
2. Finds <link rel="stylesheet" href="css/chart.css">
   → replaces with <style> + contents of css/chart.css + </style>
3. Finds <script src="js/chart.js"></script>
   → replaces with <script> + contents of js/chart.js + </script>
4. Writes result to output/ai-energy-co2/dist/index.html

Usage: node scripts/build.js ai-energy-co2

Keep it simple. Pure Node.js, no dependencies.
Under 30 lines of code.
```

---

4개 순서대로 보내면 됩니다. 돌아오면 1번부터 시작하세요.