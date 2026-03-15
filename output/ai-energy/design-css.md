# CSS — The Hidden Grid

## 변수
```css
:root {
  --bg-deep: #050510;
  --bg-card: rgba(255,255,255,0.03);
  --border-subtle: rgba(255,255,255,0.06);
  --accent-1: #00ffd5;
  --accent-2: #ff4466;
  --accent-3: #ffd93d;
  --text-1: #ffffff;
  --text-2: #88ccff;
  --text-3: #556677;
  --text-muted: #334455;
  --font-display: 'Bebas Neue', sans-serif;
  --font-title: 'Space Grotesk', sans-serif;
  --font-mono: 'Space Mono', monospace;
  --font-body: 'Inter', sans-serif;
  --font-label: 'JetBrains Mono', monospace;
}
타이포
씬 타이틀: --font-title 36px bold --text-1
KPI 숫자: --font-display 48px bold --text-1
KPI 단위: --font-mono 10px uppercase --text-2
노드 라벨: --font-label 11px #ccccdd
스크롤 텍스트: --font-body 16px #ccccdd, max-w 340px
본문: --font-body 14px #aaaaaa
크레딧: --font-body 11px --text-muted
컴포넌트
Copy.panel { background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:8px; backdrop-filter:blur(12px); padding:16px 20px; }
.tooltip { background:rgba(0,0,0,0.85); backdrop-filter:blur(8px); border:1px solid rgba(255,255,255,0.1); border-radius:6px; padding:8px 12px; font:12px var(--font-body); color:var(--text-1); pointer-events:none; }
.btn { background:transparent; border:1px solid var(--border-subtle); border-radius:4px; padding:6px 14px; font:11px var(--font-label); text-transform:uppercase; letter-spacing:0.1em; color:var(--text-2); cursor:pointer; transition:all 0.2s; }
.btn:hover { border-color:var(--accent-1); color:var(--accent-1); }
.btn.active { background:var(--accent-1); color:var(--bg-deep); }
레이아웃
.scroll-container
  .scroll-graphic (sticky, 100vh)
    #three-canvas (z:1)
    #svg-container (z:2, 기본 opacity:0)
    #ui-overlay (z:3)
      .kpi-panel(좌상단) .scene-title(중앙상단)
      .detail-panel(우측) .scenario-toggle(우하단, Scene3만)
      .credit(하단중앙)
  .scroll-steps
    step[0] 100vh 인트로
    step[1] 150vh Globe
    step[2] 150vh Sankey
    step[3] 100vh Future Globe
반응형
≥1280px: 풀
768~1279px: KPI 축소
<768px: Three.js 비활성, Scene 0+2+3만
CDN
Copy<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Mono&family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet">
<script async src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>
<script async src="https://cdn.jsdelivr.net/npm/d3@7"></script>
<script async src="https://cdn.jsdelivr.net/npm/d3-sankey@0.12"></script>
<script async src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script async src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
<script async src="https://cdn.jsdelivr.net/npm/scrollama@3"></script>