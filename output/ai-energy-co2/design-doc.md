# Design Document — The Invisible Exhaust

## 1. 프로젝트 컨셉

"보이지 않는 배기가스" — 전 세계 데이터센터가 소비하는 415TWh의 전기가 어떤 에너지원에서 시작해, 어느 지역을 거치고, 어떤 용도로 쓰이며, 최종적으로 어떤 환경 비용(CO₂·물·폐열)으로 변환되는지를 4단 Sankey로 추적한다. organic 무드의 어두운 녹색 톤 위에서 에너지 흐름이 좌에서 우로 흘러가며, 화석연료의 따뜻한 오렌지빛이 환경 영향의 경고색으로 이어지는 시각적 서사를 만든다. 순수 SVG Sankey로 전체 흐름에 집중하되, 프리셋 필터와 노드 클릭 하이라이트로 관심 경로를 즉시 탐색할 수 있다.


## 2. 데이터 스키마

```
data/ai-energy-co2/ai-energy-co2.json
├── meta: { title, subtitle, source, year, total_twh }
├── nodes[18]:
│   ├── Layer 0 — 에너지원 (6): coal, gas, nuclear, solar_wind, hydro, other_re
│   │   category: "fossil" | "clean"
│   ├── Layer 1 — 지역 (5): us, china, europe, japan, row
│   ├── Layer 2 — DC 용도 (4): ai_train, ai_infer, traditional, cooling
│   │   category: "ai" | "it" | "infra"
│   └── Layer 3 — 환경 영향 (3): co2, water, heat
│       category: "impact"
├── links[57]: { source, target, value(TWh) }
│   ├── L0→L1: 25개
│   ├── L1→L2: 20개
│   └── L2→L3: 12개
└── kpi: { total_twh:415, fossil_pct:63, ai_pct:25, co2_mt:232, water_billion_liters:111, yoy_growth_pct:12 }
```

모든 레이어 합계: 415 TWh (보존 검증 완료)


## 3. CSS 디자인 시스템

선택된 템플릿 A (Interactive)의 `:root` CSS 변수를 그대로 사용한다.
기본 테마: `data-theme="dark"` (organic 무드에 부합).

```
:root colors: --c1:#009FDA  --c2:#EC008C  --c3:#FF9900
              --c4:#81C800  --c5:#FED100  --c6:#1F145D  --gray:#9C9C9C
60% variants: --c1-60:#66C5E8  --c2-60:#F466B8  --c3-60:#FFB866
              --c4-60:#ADD966  --c5-60:#FEDF66  --c6-60:#7F7A9E
30% variants: --c1-30:#B3E2F4  --c2-30:#F9B8DA  --c3-30:#FFDCB3
              --c4-30:#D6ECB3  --c5-30:#FFF0B3  --c6-30:#BFBBCE

dark theme bg: --bg:#0B0B1A  --bg-elevated:rgba(255,255,255,.04)
text: --text-h1:#FFFFFF  --text-body:#CCCCDD  --text-label:#88AACC  --text-muted:#556677
```


## 4. 색 배정 테이블 (필수)

### Layer 0 — 에너지원

| 노드 | Category | CSS Variable | HEX 참조 | 이유 |
|------|----------|-------------|----------|------|
| Coal | fossil | --c3 | #FF9900 | 화석=따뜻한 오렌지 |
| Natural Gas | fossil | --c3-60 | #FFB866 | 화석 변형 (밝은 오렌지) |
| Nuclear | clean | --c6 | #1F145D | 전통 청정에너지, 구별되는 딥퍼플 |
| Solar & Wind | clean | --c4 | #81C800 | 재생에너지=그린 |
| Hydro | clean | --c1 | #009FDA | 수력=블루 |
| Other RE | clean | --c4-60 | #ADD966 | 재생에너지 변형 |

### Layer 1 — 지역 (중간 구조, 뮤트 톤)

| 노드 | CSS Variable | HEX 참조 | 이유 |
|------|-------------|----------|------|
| United States | --c5-30 | #FFF0B3 | 뮤트 중립 |
| China | --c5-60 | #FEDF66 | 뮤트 중립 변형 |
| Europe | --c1-30 | #B3E2F4 | 뮤트 쿨톤 |
| Japan | --c6-30 | #BFBBCE | 뮤트 퍼플 |
| Rest of World | --gray | #9C9C9C | 완전 중립 |

### Layer 2 — DC 용도

| 노드 | Category | CSS Variable | HEX 참조 | 이유 |
|------|----------|-------------|----------|------|
| AI Training | ai | --c2 | #EC008C | AI=마젠타 강조 |
| AI Inference | ai | --c2-60 | #F466B8 | AI 변형 |
| Traditional IT | it | --c5 | #FED100 | 전통=옐로우 |
| Cooling & Infra | infra | --c6-60 | #7F7A9E | 인프라=뮤트 퍼플 |

### Layer 3 — 환경 영향

| 노드 | Category | CSS Variable | HEX 참조 | 이유 |
|------|----------|-------------|----------|------|
| CO₂ Emissions | impact | --c3 | #FF9900 | 탄소=오렌지 경고 (화석 색과 연결) |
| Water Use | impact | --c1 | #009FDA | 물=블루 |
| Waste Heat | impact | --c2 | #EC008C | 열=마젠타 경고 |

### 인접 레이어 색상 충돌 검증

- L0 ↔ L1: 충돌 없음 (L1은 뮤트/30% 톤으로 분리)
- L1 ↔ L2: 충돌 없음 (L1 뮤트 vs L2 풀컬러)
- L2 ↔ L3: 충돌 없음 (L2: c2/c2-60/c5/c6-60 vs L3: c3/c1/c2)
  - c2(AI Training) ↔ c2(Waste Heat): 동일 변수이나, AI→Heat 링크의 gradient가 자연스러운 색 유지 효과

### 링크 색상

- 기본: G3 Orientation Gradient (source 노드색 → target 노드색)
- 기본 opacity: 0.35
- hover opacity: 0.8
- dim opacity: 0.04


## 5. HTML 레이아웃

Template A 구조를 기반으로 필터 바를 추가:

```
<body data-theme="dark">
  <div class="vf-load">...</div>

  <main class="page">
    ┌─ .title-block ─────────────────────────────┐
    │  h1.t-hero: "보이지 않는 배기가스"            │
    │  p.t-sub: "415TWh — 에너지원에서 환경 비용까지" │
    └───────────────────────────────────────────────┘

    ┌─ .kpi-strip ──────────────────────────────────┐
    │  KPI-1: 415 TWh (--c1)    총 전력 소비         │
    │  KPI-2: 63% (--c3)        화석연료 비중         │
    │  KPI-3: 232 Mt (--c2)     CO₂ 배출량            │
    └───────────────────────────────────────────────┘

    ┌─ .chart-area ──────────────────────────────────┐
    │  ┌─ .filter-bar ────────────────────────────┐  │
    │  │  [전체] [화석연료] [청정에너지] [AI 워크로드] │  │
    │  └──────────────────────────────────────────┘  │
    │  ┌─ .legend-row ────────────────────────────┐  │
    │  │  ● Coal  ● Gas  ● Nuclear ...             │  │
    │  └──────────────────────────────────────────┘  │
    │  ┌─ svg#sankey ─────────────────────────────┐  │
    │  │  <defs> gradients, filters </defs>         │  │
    │  │  <g.links> 57 link paths                  │  │
    │  │  <g.nodes> 18 node rects                  │  │
    │  │  <g.labels> node labels + values          │  │
    │  │  <g.flow-overlay> animated flow paths     │  │
    │  └──────────────────────────────────────────┘  │
    │  <div.vf-tip> tooltip </div>                   │
    └───────────────────────────────────────────────┘

    ┌─ .source-bar ─────────────────────────────────┐
    │  "IEA, Carbon Brief, Big Tech Reports"  vizforge│
    └───────────────────────────────────────────────┘
  </main>

  <button.theme-btn> (light/dark toggle)
</body>
```

### 필터 바 CSS

```css
.filter-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.filter-btn {
  /* 템플릿 .t-label 스타일 기반 */
  font-size: 11px;
  font-weight: 500;
  padding: 6px 14px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: transparent;
  color: var(--text-label);
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.filter-btn:hover {
  border-color: var(--text-body);
  color: var(--text-h1);
}
.filter-btn.active {
  background: var(--text-h1);
  color: var(--bg);
  border-color: var(--text-h1);
}
```


## 6. 인터랙션 흐름

### 6-1. 노드 Hover

1. 마우스 진입 → 연결된 링크 opacity 0.8 (GSAP 0.3s)
2. 비연결 링크 opacity 0.04
3. 해당 노드 glow filter stdDeviation 4→6
4. 툴팁 표시: "노드명 — X TWh (Y%)"
5. 마우스 이탈 → 전체 복원 0.3s

### 6-2. 링크 Hover

1. 링크 opacity → 0.9, stroke-width +2px
2. 툴팁: "Source → Target: X TWh"
3. 이탈 → 복원

### 6-3. 노드 Click — 경로 하이라이트

1. 클릭된 노드에서 **양방향** 경로 추적 (upstream + downstream)
2. 연결 경로의 모든 링크: opacity 0.8, glow
3. 연결 경로의 모든 노드: 원래 색상 유지
4. 비연결 링크: opacity 0.04
5. 비연결 노드: opacity 0.3
6. GSAP 전환: duration 0.4s, ease power2.inOut
7. 같은 노드 재클릭 또는 빈 영역 클릭 → 전체 복원

경로 추적 알고리즘:
```
function traceConnected(nodeId):
  upstream = 재귀적으로 source 방향 탐색
  downstream = 재귀적으로 target 방향 탐색
  return { nodes: upstream.nodes ∪ downstream.nodes ∪ {nodeId},
           links: upstream.links ∪ downstream.links }
```

### 6-4. 프리셋 필터

| 버튼 | 활성 노드 (source) | 설명 |
|------|-------------------|------|
| 전체 | 모든 노드 | 기본 상태 |
| 화석연료 | coal, gas | category=fossil 소스 경로 |
| 청정에너지 | nuclear, solar_wind, hydro, other_re | category=clean 소스 경로 |
| AI 워크로드 | ai_train, ai_infer | category=ai 타겟 경로 (역추적 포함) |

필터 동작:
1. 버튼 클릭 → active 클래스 토글 (한 번에 하나만)
2. 필터 소스 노드에서 downstream 경로 추적 (AI는 upstream도)
3. 연결 링크/노드: 하이라이트
4. 비연결: dim
5. GSAP 전환: duration 0.6s, ease power2.inOut
6. KPI 숫자 → 필터된 부분합으로 카운트 애니메이션 (GSAP 0.8s)
7. "전체" 클릭 → 전체 복원


## 7. 애니메이션 시퀀스

### 7-1. 로딩 시퀀스 (EX-8 Progressive Disclosure)

| Phase | 시작 | 요소 | 애니메이션 | duration | stagger | ease |
|-------|------|------|-----------|----------|---------|------|
| 0 | 0.0s | loader | fade-out | 0.4s | — | power1.out |
| 1 | 0.5s | title, subtitle | fade-in + y:-20→0 | 0.6s | 0.15s | power2.out |
| 2 | 1.0s | KPI 숫자 | countUp 0→값 | 1.0s | 0.1s | power2.out |
| 3 | 1.5s | 필터 버튼 | fade-in + y:10→0 | 0.4s | 0.05s | power2.out |
| 4 | 2.0s | 노드 (L0→L3) | scale 0→1 | 0.5s | 0.08s | back.out(1.2) |
| 5 | 3.0s | 링크 | F5 dash-offset draw-in | 1.5s | 0.03s | power2.out |
| 6 | 4.8s | 라벨 + 수치 | fade-in | 0.3s | 0.04s | power1.out |
| 7 | 5.5s | flow overlay | G5 animated flow 시작 | ∞ | — | linear |

### 7-2. 필터 전환 애니메이션

| 요소 | 속성 | from | to | duration | ease |
|------|------|------|-----|----------|------|
| 활성 링크 | opacity | current | 0.8 | 0.6s | power2.inOut |
| 비활성 링크 | opacity | current | 0.04 | 0.6s | power2.inOut |
| 활성 노드 | opacity | current | 1.0 | 0.4s | power2.inOut |
| 비활성 노드 | opacity | current | 0.3 | 0.4s | power2.inOut |
| KPI 숫자 | textContent | 이전값 | 필터합 | 0.8s | power2.out |

### 7-3. Hover 전환

| 요소 | 속성 | duration | ease |
|------|------|----------|------|
| 연결 링크 opacity | 0.35→0.8 | 0.3s | power2.out |
| 비연결 링크 opacity | 0.35→0.04 | 0.3s | power2.out |
| glow stdDeviation | 4→6 | 0.3s | power1.out |
| stroke-width (링크) | base→+2 | 0.2s | power2.out |


## 8. 적용 이펙트 명세

### G1 — Linear Gradient (범례)
- 링크 두께가 값(TWh)을 이미 표현하므로, G1은 레이어 헤더 장식용 gradient bar로 적용
- Layer 0~3 각 열 상단에 얇은 gradient bar: 해당 레이어 노드들의 대표색 blend

### G3 — Orientation Gradient (링크)
- 모든 57개 링크에 linearGradient 적용
- gradientUnits="userSpaceOnUse"
- x1=source.x1, x2=target.x0
- stop[0]=sourceColor, stop[1]=targetColor
- 링크 fill: `url(#link-grad-{i})`

### G5 — Animated Flow (흐름 오버레이)
- 각 링크 위에 flow overlay path 복제
- stroke-dasharray: "4 12"
- CSS animation: stroke-dashoffset 0→-48, duration 3s, linear, infinite
- opacity: 0.3 (기본 링크 위에 살짝 보이는 수준)
- 필터 비활성 링크는 flow overlay도 dim

### F1 — Glow Filter
- `<filter id="glow">`: feGaussianBlur stdDeviation=4 + feMerge
- 기본: 노드에 적용 안 함 (깔끔한 기본 상태)
- hover 시: 해당 노드에 filter="url(#glow)", stdDeviation=6
- click 하이라이트: 경로 노드에 glow 적용

### F5 — Dash-offset Draw-in (입장)
- 로딩 Phase 5에서 적용
- 각 링크 path의 getTotalLength()로 dasharray/dashoffset 설정
- GSAP: strokeDashoffset 0, duration 1.5s, stagger 0.03s
- 완료 후: dasharray/dashoffset null로 정리 (hover 깜빡임 방지)

### EX-8 — Progressive Disclosure
- 7-1 로딩 시퀀스 참조
- 4단계: 노드 → 링크(dash-offset) → 라벨 → 수치+flow
- GSAP master timeline으로 통합 관리


## 9. Sankey 설정 (COMBO-4 레퍼런스)

```
nodeWidth: 20
nodePadding: 16
nodeAlign: d3.sankeyJustify
iterations: 6 (4-layer, 기본 충분)
linkPath: d3.sankeyLinkHorizontal()
```

### SVG 구조

```
svg viewBox="0 0 {width} {height}"
├── defs
│   ├── filter#glow
│   ├── linearGradient#link-grad-0 ~ #link-grad-56 (G3)
│   └── linearGradient#layer-bar-0 ~ #layer-bar-3 (G1)
├── g.layer-headers (레이어 라벨: "에너지원", "지역", "DC 용도", "환경 영향")
├── g.links (57 path, fill=url(#link-grad-*), opacity=0.35)
├── g.flow-overlay (57 path, stroke-dasharray, animation)
├── g.nodes (18 rect, fill=var(--c*), rx=3)
└── g.labels (18 text 노드명 + 18 text 수치)
```

### 반응형

- 1280px+: width=1200, height=700, padding 40px
- 768~1279px: width=100%, height 자동, padding 20px
- 768px-: width=100%, 세로 스크롤 가능, 최소 높이 500px
- SVG viewBox 기반 스케일링, preserveAspectRatio="xMidYMid meet"
