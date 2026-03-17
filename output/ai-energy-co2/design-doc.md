# Design Document — The Hidden Grid
## AI가 삼키는 전력: Split Voronoi Treemap

---

## 1. 컨셉

"The Hidden Grid"는 AI 시대의 보이지 않는 전력 소비를 두 개의 유기적 원으로 드러낸다.
2024년의 작은 원(415 TWh)과 2030년의 큰 원(945 TWh)이 나란히 놓이면,
같은 데이터 구조가 6년 만에 2.3배로 팽창하는 현실이 면적으로 직감된다.
셀 내부의 보석 같은 색감은 화석(따뜻한 톤)과 청정(차가운 톤)을 즉시 분리하고,
지역 셀을 클릭하면 "같은 AI, 다른 대가"라는 질문에 답하는 비교 패널이 열린다.
하단의 KPI 바는 비율은 줄어드는데 절대량은 느는 역설을 수치로 보여준다.
neo-terminal 무드 — 어두운 배경 위의 발광하는 셀이 데이터센터 서버 랙의 LED를 연상시킨다.


---

## 2. 데이터 스키마

```
data/ai-energy-co2/ai-energy-co2.json
```

| 최상위 키 | 구조 | 용도 |
|-----------|------|------|
| `meta` | title, subtitle, sources[], unit | 헤더, 출처 |
| `voronoi_2024` | { total_twh, fossil_pct, clean_pct, co2_mt, children[] } | 2024 Voronoi 데이터 |
| `voronoi_2030` | 동일 구조 | 2030 Voronoi 데이터 |
| `kpi` | 13개 수치 필드 | KPI 바, 인사이트 카드 |
| `story_hooks` | hook1~6 | 텍스트 인사이트 |

**계층 구조 (각 voronoi_YYYY):**
```
depth 0: root (total_twh)
  depth 1: 지역 (US, CN, EU, JP/KR, Rest) — 5개
    depth 2: 에너지원 (Gas, Coal, Renewables, Nuclear, ...) — 총 15개/연도
```

각 leaf 노드 필드: `id`, `name`, `twh`, `type`("fossil"|"clean"), `derived`, `formula`, `source`


---

## 3. CSS 디자인 시스템

Template A (`template-A-interactive.html`)의 `:root` CSS 변수를 그대로 사용한다.

- **테마**: `data-theme="dark"` 기본값 (neo-terminal 무드)
- **폰트**: Noto Sans KR (템플릿 기본) — 변경 없음
- **레이아웃**: `.page` → `.title-block` → `.kpi-strip` → `.chart-area` → `.source-bar`
- **타이포 클래스**: `.t-hero`, `.t-sub`, `.t-kpi-num`, `.t-kpi-unit`, `.t-kpi-desc`, `.t-label`, `.t-source`, `.t-node`, `.t-value`

neo-terminal 무드의 톤은 다크 테마의 기존 변수로 충분히 구현된다:
- `--bg: #0B0B1A` (깊은 남색 배경)
- `--bg-elevated: rgba(255,255,255,.04)` (패널 배경)
- `--text-h1: #FFFFFF`, `--text-label: #88AACC`


---

## 4. 색 배정 테이블 (필수)

**원칙**: 셀 색상 = 에너지 유형(fossil/clean) 기반 의미 색상. 무드와 분리.

### 에너지원 → CSS 변수 매핑

| 데이터 항목 | type | CSS 변수 | HEX (참고) | 이유 |
|-------------|------|----------|------------|------|
| Coal | fossil | --c2 | #EC008C | 가장 탄소집약적, 경고색 |
| Natural Gas | fossil | --c3 | #FF9900 | 화석 주력, 따뜻한 주황 |
| Oil & Other | fossil | --c3-60 | #FFB866 | 화석 소량, 연한 주황 |
| Fossil Fuels (generic) | fossil | --c3 | #FF9900 | EU/JP/Rest 통합 화석 |
| Renewables | clean | --c4 | #81C800 | 초록 = 재생에너지 직관 |
| Nuclear | clean | --c1 | #009FDA | 파랑 = 원자력/기술 |
| Clean Energy (generic) | clean | --c4 | #81C800 | EU/JP/Rest 통합 청정 |

### 지역 경계(depth 1) 시각 구분

지역 셀은 에너지원 색상으로 채워지므로, 지역 구분은 **경계선(stroke)과 라벨**로 처리한다.
depth-1 부모 polygon: stroke `var(--text-h1)` opacity 0.5, stroke-width 2.

### UI 요소

| 요소 | CSS 변수 | 용도 |
|------|----------|------|
| KPI 숫자 — 총량 | --c1 | 파랑, 중립적 전체량 |
| KPI 숫자 — 성장 | --c3 | 주황, 경고성 증가 |
| KPI 숫자 — 화석비율 | --c2 | 마젠타, 화석 비중 |
| KPI 숫자 — 청정비율 | --c4 | 초록, 청정 비중 |
| 2024 라벨 | --text-label | 연한 파랑 회색 |
| 2030 라벨 | --text-h1 | 흰색, 강조 |
| 상세패널 바차트 fossil | --c3 | 주황 |
| 상세패널 바차트 clean | --c4 | 초록 |
| 연결선(같은 지역 하이라이트) | --c5 | 노랑, 주의 집중 |


---

## 5. HTML 레이아웃

Template A 기본 구조를 확장한다. `:root` CSS와 타이포 클래스는 수정 금지.

```
<main class="page">
  ┌─ .title-block ─────────────────────────────────┐
  │  h1.t-hero  "The Hidden Grid"                  │
  │  p.t-sub    "AI가 삼키는 전력 — 2024 vs 2030"  │
  └────────────────────────────────────────────────┘

  ┌─ .chart-area #chartWrap ───────────────────────┐
  │                                                │
  │  ┌──────────┐          ┌────────────────┐      │
  │  │  2024    │          │     2030       │      │
  │  │  415 TWh │          │     945 TWh    │      │
  │  │  (작은원) │          │    (큰 원)     │      │
  │  │  r≈0.66R │          │     r=R        │      │
  │  └──────────┘          └────────────────┘      │
  │                                                │
  │  연도 라벨 (각 원 위)                            │
  │  .vf-tip (툴팁, absolute)                       │
  └────────────────────────────────────────────────┘

  ┌─ .kpi-strip (하단 KPI 바) ─────────────────────┐
  │  [총 전력량]  [성장률]  [화석%]  [청정%]  [CO₂]  │
  │  morph 시 실시간 interpolation                  │
  └────────────────────────────────────────────────┘

  ┌─ .detail-panel (우측 슬라이드, 셀 클릭 시) ─────┐
  │  지역명 + 연도 비교                              │
  │  fossil/clean 수평 바 (2024 vs 2030)            │
  │  delta 수치 + Story B 인사이트 텍스트            │
  └────────────────────────────────────────────────┘

  ┌─ .insights-section ────────────────────────────┐
  │  Key Insight 카드 3개 (grid)                    │
  └────────────────────────────────────────────────┘

  ┌─ .bottom-line ─────────────────────────────────┐
  │  요약 메시지 1문단                               │
  └────────────────────────────────────────────────┘

  ┌─ .source-bar ──────────────────────────────────┐
  │  출처 목록 │ vizforge                           │
  └────────────────────────────────────────────────┘
</main>
```

### SVG 내부 구조

하나의 `<svg>` 안에 두 개의 `<g>` 그룹:

```
<svg viewBox="0 0 1200 700">
  <defs>
    <!-- Radial Gradients (G2): 에너지원별 -->
    <!-- Glow Filter (F1) -->
    <!-- Gooey Filter (F3): morph 전환용 -->
  </defs>

  <g class="voronoi-2024" transform="translate(280, 350)">
    <!-- 64각형 클리핑, r = R×0.663 -->
    <g class="cells-2024">...</g>
    <g class="borders-2024">...</g>
    <g class="labels-2024">...</g>
  </g>

  <g class="voronoi-2030" transform="translate(780, 350)">
    <!-- 64각형 클리핑, r = R -->
    <g class="cells-2030">...</g>
    <g class="borders-2030">...</g>
    <g class="labels-2030">...</g>
  </g>

  <!-- 연도 라벨 -->
  <text class="year-label-2024">2024 · 415 TWh</text>
  <text class="year-label-2030">2030 · 945 TWh</text>

  <!-- cross-highlight 연결선 (셀 호버 시) -->
  <g class="cross-links" opacity="0">...</g>
</svg>
```

### 원 크기 계산

- SVG viewBox: 1200 x 700
- 2030 원 반지름 R: `min(1200*0.5, 700) * 0.38 = 266`
- 2024 원 반지름: `R * sqrt(415/945) = R * 0.663 = 176`
- 면적비: 176^2 / 266^2 = 0.438 = 415/945 (정확)


---

## 6. 인터랙션 흐름

### 6-1. Hover — 셀 강조 + 크로스 하이라이트

```
1. mouseover 셀 (어느 원이든)
2. -> 해당 셀: F1 glow (stdDev 4), fill brighter(0.3)
3. -> 같은 에너지원 유형(fossil/clean) 셀: opacity 유지
4. -> 다른 유형 셀: opacity 0.15
5. -> 반대편 원의 같은 지역+같은 에너지원 셀도 하이라이트 (cross-highlight)
6. -> 두 셀 사이 점선 연결 (--c5, stroke-dasharray 4 2)
7. -> 툴팁: "US Natural Gas: 73.2 TWh (2024) -> 203.2 TWh (2030) +177%"
8. mouseout -> 전체 reset (0.2s ease)
```

### 6-2. Click — 지역 상세 패널

```
1. 셀 클릭 (depth 2)
2. -> 해당 지역의 모든 셀 하이라이트 (depth 1 경계 강조, stroke-width 3)
3. -> .detail-panel 슬라이드 인 (right -> 0, 0.4s power3.out)
4. 패널 내용:
   +-----------------------------+
   | [United States]             |
   | ---------------------------  |
   | 2024: 183 TWh -> 2030: 423 TWh (+131%)  |
   |                             |
   | [====  ] Gas   73->203 TWh  |
   | [==    ] Coal  28->28 TWh   |
   | [=====  ] Renew 44->154 TWh |
   | [==    ] Nuc   37->37 TWh   |
   |                             |
   | Fossil: 56% -> 55%          |
   | Clean:  44% -> 45%          |
   |                             |
   | Insight: 미국은 천연가스가  |
   | 성장의 주력이지만, 재생에너지도 |
   | 110 TWh 추가로 추격 중      |
   +-----------------------------+
5. 같은 셀 재클릭 또는 패널 밖 클릭 -> 패널 닫기
6. 다른 지역 셀 클릭 -> 패널 내용 crossfade (0.3s)
```

### 6-3. KPI 바 — 실시간 반응

```
1. 기본 상태: 전체 수치 표시
   [415/945 TWh] [+128%] [60->51%] [40->49%] [180->320 Mt]

2. 지역 클릭 시: 해당 지역 수치로 morph
   예: US 클릭 -> [183/423 TWh] [+131%] [56->55%] [44->45%] [-]
   GSAP countup transition 0.6s

3. 클릭 해제 시: 전체 수치로 복귀 (0.6s)
```


---

## 7. 애니메이션 시퀀스

COMBO-9 스펙 + EX-8 Progressive Disclosure 기반.
GSAP 3.12 master timeline.

### 로딩 시퀀스 (~4.5s)

| Phase | 시작 | 요소 | 속성 | Duration | Ease |
|-------|------|------|------|----------|------|
| 0 | 0.0s | 로더 fade-out | opacity 1->0 | 0.4s | power2.out |
| 1 | 0.4s | 2024 원형 외곽 | F5 stroke-dashoffset -> 0 | 0.8s | power2.out |
| 1 | 0.5s | 2030 원형 외곽 | F5 stroke-dashoffset -> 0 | 1.0s | power2.out |
| 2 | 1.2s | depth-1 경계 (2024) | opacity 0->0.5, stagger 0.08 | 0.5s | power2.out |
| 2 | 1.3s | depth-1 경계 (2030) | opacity 0->0.5, stagger 0.08 | 0.5s | power2.out |
| 3 | 1.8s | depth-2 셀 (2024) | F3 gooey ON, opacity 0->1, stagger 0.03 from center | 0.7s | power2.out |
| 3 | 1.9s | depth-2 셀 (2030) | F3 gooey ON, opacity 0->1, stagger 0.03 from center | 0.8s | power2.out |
| 3+ | 2.8s | F3 gooey OFF | filter 제거 (GPU 절약) | 0.3s | - |
| 4 | 3.0s | 라벨 (대분류 + 소분류) | opacity 0->1, y +5->0, stagger 0.04 | 0.5s | power2.out |
| 4 | 3.0s | 연도 라벨 | opacity 0->1 | 0.5s | power2.out |
| 5 | 3.5s | KPI 바 | countup 0->값, 각 0.8s power2.out | 1.0s | power2.out |
| 5 | 3.5s | title-block | opacity 0->1, y -10->0 | 0.5s | power2.out |

### Hover 전환

```
셀 in:  0.2s ease-out — fill brighter, glow on, dim others
셀 out: 0.2s ease-in — reset all
```

### 패널 전환

```
열기: translateX(100%) -> translateX(0), 0.4s power3.out
닫기: translateX(0) -> translateX(100%), 0.3s power2.in
내용 교체: opacity crossfade 0.3s
```

### KPI morph

```
값 전환: gsap.to(proxy, { value: newVal, duration: 0.6, ease: 'power2.out',
  onUpdate: () => el.textContent = fmt(proxy.value) })
```


---

## 8. 적용 이펙트 명세

### G2 — Radial Gradient (셀 입체감)

에너지원별 생성. cx 35%, cy 35%, r 60%.
```
stop 0%:  color.brighter(0.5)   // 하이라이트
stop 50%: color                  // 기본
stop 100%: color.darker(0.7)    // 그림자
```
색상은 CSS 변수에서 getComputedStyle로 가져와 d3.rgb()로 변환.

### F1 — Glow Filter

```xml
<filter id="cell-glow" x="-50%" y="-50%" width="200%" height="200%">
  <feGaussianBlur stdDeviation="4" result="blur" />
  <feMerge>
    <feMergeNode in="blur" />
    <feMergeNode in="SourceGraphic" />
  </feMerge>
</filter>
```
- 기본: 미적용
- hover: stdDeviation 4
- selected: stdDeviation 6

### F3 — Gooey Effect (로딩 전환)

```xml
<filter id="gooey">
  <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
  <feColorMatrix in="blur" mode="matrix"
    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="gooey" />
  <feBlend in="SourceGraphic" in2="gooey" />
</filter>
```
- 로딩 Phase 3: 셀 그룹에 적용, 셀이 유기적으로 솟아오름
- Phase 3 완료: filter 제거 (정적 상태에서 GPU 낭비 방지)

### F5 — Dash-offset Draw-in (원형 외곽)

```javascript
const circumference = circle.getTotalLength();
circle.setAttribute('stroke-dasharray', circumference);
circle.setAttribute('stroke-dashoffset', circumference);
gsap.to(circle, { strokeDashoffset: 0, duration: 1.0, ease: 'power2.out' });
```
- 2024 원: 0.8s
- 2030 원: 1.0s (더 크므로 약간 느리게)
- 완료 후 dasharray null 정리 (hover 깜빡임 방지)

### EX-1 — Voronoi Treemap

```javascript
const root = d3.hierarchy({ name: 'root', children: regionData })
  .sum(d => d.twh);

const clip = d3.range(64).map(i => [
  cx + r * Math.cos((i/64) * 2 * Math.PI),
  cy + r * Math.sin((i/64) * 2 * Math.PI)
]);

d3VoronoiTreemap.voronoiTreemap()
  .clip(clip)
  .convergenceRatio(0.001)
  .maxIterationCount(100)(root);
```
- 각 연도별 독립 계산 (2회)
- leaves <= 15개/원 -> 성능 문제 없음

### EX-8 — Progressive Disclosure

5단계 로딩 시퀀스 (섹션 7 참조).
원칙: 한 번에 한 레이어만. 이전 레이어 이해 후 다음 공개.


---

## 9. 레퍼런스 스펙 (COMBO-9에서 발췌)

| 파라미터 | 값 |
|---------|-----|
| convergenceRatio | 0.001 |
| maxIterationCount | 100 |
| 클리핑 다각형 | 64각형 (원 근사) |
| 셀 stroke | var(--text-h1) opacity 0.3, width 0.5 |
| 부모 경계 stroke | var(--text-h1) opacity 0.5, width 2 |
| hover glow stdDev | 4 (기본), 6 (selected) |
| 라벨 최소 면적 | 800 px^2 |
| KPI countup | 1.0s power2.out |
| 상세패널 slide-in | 0.4s power3.out |
| 반지름 | min(containerWidth, containerHeight) * 0.38 |


---

## 10. 데이터 단위 검증

**전체 단위: TWh (통일)**

| 검증 항목 | 2024 | 2030 | 상태 |
|-----------|------|------|------|
| root total | 415 | 945 | - |
| sum(depth-1) | 183+104+62+21+45 = 415 | 423+279+107+36+100 = 945 | OK |
| US sum(depth-2) | 73.2+43.9+36.6+27.5+1.8 = 183.0 | 203.2+153.9+36.6+27.5+1.8 = 423.0 | OK |
| CN sum(depth-2) | 72.8+20.8+10.4 = 104.0 | 162.8+110.8+5.4 = 279.0 | OK |
| EU sum(depth-2) | 37.2+24.8 = 62.0 | 90.95+16.05 = 107.0 | OK |
| JP/KR sum(depth-2) | 7.4+13.6 = 21.0 | 21.6+14.4 = 36.0 | OK |
| Rest sum(depth-2) | 31.5+13.5 = 45.0 | 55.0+45.0 = 100.0 | OK |

CO2(Mt), 물(billion gallons) 등 다른 단위 데이터는 Voronoi 셀이 아닌 **KPI 바와 인사이트 카드**에서만 표시. Voronoi 셀 면적은 오직 TWh만 반영.


---

## 11. 데이터 출처 투명성

| 데이터 항목 | 출처 유형 | 상세 |
|-------------|-----------|------|
| 전체 415 TWh (2024) | 직접 인용 | IEA Energy and AI (Apr 2025) |
| 전체 945 TWh (2030) | 직접 인용 | IEA Energy and AI (Apr 2025) |
| US 183 TWh | 직접 인용 | Pew Research (Oct 2025) |
| US 에너지원 비율 (40/24/20/15%) | 추정 | IEA 비율 x 183 TWh. "Derived: formula in JSON" |
| CN 104 TWh | 추정 | IEA "China 25%" x 415. 근사치 |
| CN coal 70% | 직접 인용 | IEA: "China coal ~70%" |
| EU 62 TWh | 추정 | IEA "Europe 15%" x 415 |
| EU clean 60% | 추정 (medium confidence) | EU 그리드 평균을 DC에 적용 |
| JP/KR 21 TWh | 추정 | IEA "JP/KR ~5%" |
| Rest 45 TWh | 산술 | 415 - 183 - 104 - 62 - 21 = 45 |
| 2030 성장률 | 직접 인용 | IEA 각 지역별 증가량 명시 |
| CO2 180/320 Mt | 직접 인용 | IEA/Carbon Brief |
| AI query 2.9 Wh | 직접 인용 | IEA/Pew |
| PUE 1.56 | 직접 인용 | LBNL (2024) |

**투명성 표기**: 시각화 하단에 "Derived values calculated from published IEA ratios. See methodology in data source." 문구 포함.


---

## 12. Key Insights 콘텐츠

### Card 1: "규모의 충격"
> **415 TWh는 파키스탄 전체 연간 전력 소비보다 많다.**
> 2030년 945 TWh는 일본 전체 전력 수요와 맞먹는다.
> -- Pew Research, IEA

디자인: bg-elevated, shadow-md, 좌측 SVG bolt 아이콘, --c1

### Card 2: "같은 AI, 다른 대가"
> **중국 데이터센터의 70%는 석탄, 유럽의 60%는 청정에너지.**
> 2030년 유럽은 85% 청정으로 전환하지만, 중국은 여전히 석탄이 58%.
> -- IEA Energy and AI

디자인: bg-elevated, shadow-md, 좌측 SVG globe 아이콘, --c3

### Card 3: "비율의 역설"
> **화석 비율은 60%->51%로 줄지만, 화석 절대량은 249->484 TWh로 2배.**
> 청정에너지가 빠르게 늘어도, 수요 폭증 앞에선 비율만 줄어든다.
> CO2는 180->320 Mt로 증가한 뒤 ~2035년부터 감소 전환.
> -- IEA, Carbon Brief

디자인: bg-elevated, shadow-md, 좌측 SVG chart 아이콘, --c2

*(아이콘은 SVG inline으로 구현)*


---

## 13. Bottom Line 메시지

> **AI의 전력 수요는 숨길 수 없다.** 2024년 415 TWh에서 2030년 945 TWh로 -- 6년 만에 2.3배. 청정에너지 비율이 40%에서 49%로 올라가는 동안 화석 연료의 절대 소비량은 오히려 두 배가 된다. 전환은 시작됐지만 속도가 성장을 따라잡지 못하고 있다. 데이터센터의 보이지 않는 전력 소비를 직시하는 것이 첫 걸음이다.


---

## 14. 출처 전체 목록

1. **IEA, Energy and AI -- World Energy Outlook Special Report (Apr 2025)**
   https://www.iea.org/reports/energy-and-ai
2. **Carbon Brief, AI: Five charts that put data-centre energy use and emissions into context (Sep 2025)**
   https://www.carbonbrief.org/ai-five-charts-that-put-data-centre-energy-use-and-emissions-into-context/
3. **Pew Research Center, US data centers energy use amid the AI boom (Oct 2025)**
   https://www.pewresearch.org/short-reads/2025/10/24/what-we-know-about-energy-use-at-us-data-centers-amid-the-ai-boom/
4. **LBNL, 2024 US Data Center Energy Usage Report (Dec 2024)**
   https://eta-publications.lbl.gov/sites/default/files/2024-12/lbnl-2024-united-states-data-center-energy-usage-report.pdf
5. **IEA-4E, Data Centre Energy Use: Critical Review of Models and Results (Mar 2025)**
   https://www.iea-4e.org/wp-content/uploads/2025/05/Data-Centre-Energy-Use-Critical-Review-of-Models-and-Results.pdf


---

## 부록: 반응형 브레이크포인트

### 1280px 이상 (데스크톱)
- 두 원 가로 배치 (좌 2024, 우 2030)
- 상세패널: 우측 슬라이드 (width 360px)
- KPI 바: 가로 5항목

### 768px ~ 1279px (태블릿)
- 두 원 가로 배치, 반지름 축소 (x0.35)
- 상세패널: 하단 슬라이드업
- KPI 바: 가로 5항목 (축소)

### 768px 미만 (모바일)
- 두 원 세로 배치 (위 2024, 아래 2030)
- 반지름: width x 0.35
- 소분류 라벨 숨김 (MIN_LABEL_AREA 2000)
- 상세패널: 풀스크린 오버레이
- KPI 바: 2x3 그리드
- 폰트: 전체 -2px
