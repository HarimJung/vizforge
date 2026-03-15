# 한국 에너지의 대이동 — 설계 문서

## 1. 컨셉

대한민국의 에너지는 거대한 강과 같다. 다섯 개의 수원(석유, 가스, 석탄, 원자력, 재생에너지)에서 시작된 148.9 Mtoe의 에너지가 발전소와 정유소라는 댐을 거쳐 산업, 수송, 가정, 상업이라는 바다로 흘러간다. 그 과정에서 18%가 증발한다. 이 시각화는 깊은 숲속 배경 위에서 빛나는 에너지 강줄기를 표현한다. 노드는 빛나는 허브이고, 링크는 살아있는 흐름이다. 파티클이 링크를 따라 이동하며 에너지가 실제로 흐르는 느낌을 준다.

---

## 2. 데이터 스키마

```json
{
  "title": string,        // "한국 에너지 흐름 2023"
  "unit": string,         // "Mtoe"
  "source": string,       // 출처 표기
  "nodes": [
    {
      "id": string,       // 고유 키 ("oil", "power" 등)
      "name": string,     // 한글 라벨 ("석유", "발전" 등)
      "category": string, // "source" | "transform" | "consume"
      "color": string     // hex 색상
    }
  ],
  "links": [
    {
      "source": string,   // 노드 id
      "target": string,   // 노드 id
      "value": number     // Mtoe 단위 에너지량
    }
  ]
}
```

노드 13개 (source 5 / transform 3 / consume 5), 링크 22개.

---

## 3. CSS 디자인 시스템

### 프리셋: organic

```css
:root {
  /* 배경 */
  --bg-deep: #0a1a0a;
  --bg-card: rgba(255, 255, 255, 0.03);
  --bg-card-hover: rgba(255, 255, 255, 0.06);
  --bg-grid: rgba(255, 255, 255, 0.02);

  /* 테두리 */
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-hover: rgba(255, 255, 255, 0.12);

  /* 액센트 */
  --accent-1: #53bf9d;
  --accent-2: #f4a261;
  --accent-3: #e76f51;

  /* 텍스트 */
  --text-1: #e8e8e0;
  --text-2: #a8c4a0;
  --text-3: #5a7a52;
  --text-muted: #3a4a32;

  /* 폰트 */
  --font-display: 'Space Grotesk', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --font-body: 'Inter', sans-serif;
  --font-label: 'JetBrains Mono', monospace;
}
```

### 노드 색상 (데이터 원본)

| 노드 | 색상 | 카테고리 |
|------|------|----------|
| 석유 | #e76f51 | source |
| 천연가스 | #2a9d8f | source |
| 석탄 | #264653 | source |
| 원자력 | #e9c46a | source |
| 재생에너지 | #53bf9d | source |
| 발전 | #7209b7 | transform |
| 정유 | #f77f00 | transform |
| 열공급 | #d62828 | transform |
| 산업 | #4ecdc4 | consume |
| 수송 | #ff6b6b | consume |
| 가정 | #ffd93d | consume |
| 상업/공공 | #6c5ce7 | consume |
| 손실 | #555555 | consume |

### 타이포그래피 위계

| 용도 | 폰트 | 사이즈 | 두께 | 색상 |
|------|------|--------|------|------|
| KPI 숫자 | Space Grotesk | 48px | bold | --text-1 |
| 메인 타이틀 | Space Grotesk | 28px | bold | --text-1 |
| 서브 타이틀 | Inter | 14px | 400 | --text-2 |
| 노드 라벨 | JetBrains Mono | 11px | 500 | #ccccdd |
| 노드 수치 | Inter | 12px | bold | #ffffff |
| 카테고리 라벨 | JetBrains Mono | 10px | 500 | --text-2, uppercase, letter-spacing 0.15em |
| KPI 단위 | Inter | 14px | 400 | --text-3 |
| 툴팁 | Inter | 12px | 400 | --text-1 |
| 크레딧 | Inter | 11px | 400 | --text-muted |

---

## 4. HTML 레이아웃

```
┌─────────────────────────────────────────────────┐
│  HEADER (height: 80px)                          │
│  ┌─────────────────────────────────────────────┐ │
│  │ 타이틀: "한국 에너지의 대이동"              │ │
│  │ 서브: "2023년 1차 에너지 흐름 148.9 Mtoe"  │ │
│  └─────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────┤
│  KPI PANEL (height: 80px, flex row, gap 16px)   │
│  ┌─────┐ ┌──────┐ ┌──────┐ ┌──────┐           │
│  │총공급│ │최대원│ │최대소비│ │손실률│           │
│  │148.9│ │석유  │ │산업   │ │18.0%│           │
│  └─────┘ └──────┘ └──────┘ └──────┘           │
├─────────────────────────────────────────────────┤
│  CATEGORY LABELS (flex row)                     │
│  "공급원"          "변환"         "최종 소비"    │
├─────────────────────────────────────────────────┤
│                                                 │
│  SANKEY CHART (flex: 1, min-height: 500px)      │
│  ┌─────────────────────────────────────────────┐ │
│  │                                             │ │
│  │  [source nodes] ──links──> [transform]      │ │
│  │                  ──links──> [consume]        │ │
│  │                                             │ │
│  └─────────────────────────────────────────────┘ │
│                                                 │
├─────────────────────────────────────────────────┤
│  DETAIL PANEL (slide-up, max-height: 200px)     │
│  노드 클릭 시 등장: 유입/유출 상세 breakdown    │
├─────────────────────────────────────────────────┤
│  FOOTER (height: 40px)                          │
│  크레딧 + 출처                                  │
└─────────────────────────────────────────────────┘
```

- 전체: `100vw × 100vh`, overflow hidden
- CSS Grid: `grid-template-rows: auto auto auto 1fr auto auto`
- 배경: `--bg-deep` + CSS 미세 그리드 오버레이 (repeating-linear-gradient)
- 반응형: 1280px 기준, 768px 이하에서 KPI 2×2 그리드

---

## 5. 인터랙션 흐름

### 5-1. 노드 Hover
1. 마우스 진입 → 해당 노드에 연결된 링크 opacity 0.8로 전환 (duration 0.3s)
2. 연결되지 않은 링크 opacity 0.05로 fade (duration 0.3s)
3. 연결되지 않은 노드 opacity 0.15로 fade
4. 해당 노드 glow stdDeviation 3.5 → 6 (GSAP, 0.3s)
5. 노드 펄스 효과 시작 (scale 1.0 → 1.05, repeat -1, yoyo)
6. 연결된 링크들이 소스에서 타겟 방향으로 순차 강조 (stagger 0.05s) — 리플 효과
7. 마우스 이탈 → 모든 요소 원래 상태 복귀 (0.5s)

### 5-2. 링크 Hover
1. 해당 링크 opacity 0.9, strokeWidth +2px (0.2s)
2. 해당 링크 두께 펄스 시작 (±1px, duration 1s, repeat -1, yoyo)
3. 툴팁 표시: "석유 → 정유: 44.2 Mtoe"
4. 마우스 이탈 → 원래 상태, 툴팁 제거

### 5-3. 노드 클릭
1. 하단 상세 패널 slide-up (GSAP, 0.4s, ease: power2.out)
2. 패널 내용: 해당 노드의 유입 링크 목록 + 유출 링크 목록
3. 각 항목에 비율 바 + 수치 표시
4. 다른 노드 클릭 → 내용 교체 (crossfade 0.3s)
5. 빈 영역 클릭 → 패널 slide-down

### 5-4. 노드 드래그
1. d3.drag()로 y축 드래그 가능
2. 드래그 중 → 연결 링크 실시간 재계산
3. 드래그 시작 시 motion blur 적용 (stdDeviation "0 4")
4. 드래그 종료 시 motion blur 해제 (0.3s)

---

## 6. 애니메이션 시퀀스

### 6-1. 로딩 시퀀스 (GSAP Master Timeline)

```
t=0.0s  배경 그리드 fade-in (opacity 0→0.02, dur 1s, ease: power1.in)
t=0.3s  타이틀 + 서브타이틀 fade-in + y: 20→0 (dur 0.6s, ease: power2.out)

t=0.8s  카테고리 라벨 3개 순차 등장 (stagger 0.15s, fade + y: 10→0)

t=1.0s  Source 노드 등장 (stagger 0.08s, scale: 0→1, ease: back.out(1.7))
        각 노드에 motion blur (stdDeviation "8 0" → "0 0") dur 0.4s
t=1.5s  Transform 노드 등장 (같은 방식)
t=2.0s  Consume 노드 등장 (같은 방식)

t=2.3s  링크 드로잉 (stroke-dashoffset 100%→0%, stagger 0.05s, dur 0.8s, ease: power2.inOut)
        좌→우 순서로 드로잉

t=3.0s  링크 orientation gradient 활성화 (opacity 0→0.4, dur 0.5s)

t=3.3s  노드 라벨 fade-in (stagger 0.04s, dur 0.3s)
t=3.5s  노드 수치 fade-in (stagger 0.04s, dur 0.3s)

t=3.8s  KPI 패널 등장 (y: 30→0, opacity 0→1, stagger 0.1s)
t=4.0s  KPI 숫자 카운트업 (0→목표값, dur 1.2s, ease: power2.out)
        "148.9" "석유" "산업" "18.0%"

t=5.0s  파티클 플로우 시작 (opacity 0→1, dur 0.5s)
t=5.2s  노드 상시 glow pulse 시작 (stdDeviation 2→3.5, repeat -1, yoyo, dur 2s)
t=5.5s  animated flow gradient 시작

t=5.5s  전체 로딩 완료
```

총 로딩 시간: **~5.5초**

### 6-2. 상시 애니메이션 (로딩 후 계속)
- **파티클 플로우**: 각 링크 경로를 따라 2~4개 발광 점이 이동. 속도 = value에 비례 (큰 흐름 = 빠름). dur 3~7s, repeat -1.
- **노드 glow pulse**: stdDeviation 2↔3.5, dur 2s, yoyo, repeat -1
- **animated flow gradient**: linearGradient x1/x2 animate, dur 7s, repeat -1
- **배경 그리드 미세 움직임**: translateY 0→-10px, dur 20s, repeat -1, yoyo

---

## 7. 적용 이펙트

### G1. Linear Gradient
- 용도: KPI 패널 하단 바, 배경 vignette
- 파라미터: KPI 바 — 각 노드 color → transparent, height 3px
- 배경 vignette — radialGradient center transparent → edge #0a1a0a

### G3. Orientation Gradient
- 용도: 모든 산키 링크
- 파라미터:
  - `gradientUnits="userSpaceOnUse"`
  - `x1=link.source.x1`, `x2=link.target.x0`
  - `stop 0%: sourceNode.color`, `stop 100%: targetNode.color`
  - 기본 opacity: 0.4

### G5. Animated Flow Gradient
- 용도: 모든 산키 링크 (orientation gradient 위에 overlay)
- 파라미터:
  - `spreadMethod="reflect"`
  - 3-stop: nodeColor → white(opacity 0.3) → nodeColor
  - `animate x1 values="0%;100%" dur="7s" repeatCount="indefinite"`
  - `animate x2 values="100%;200%" dur="7s" repeatCount="indefinite"`

### F1. Glow Filter
- 용도: 노드 (상시 + hover 강화), 파티클
- 상시: `stdDeviation: 2` (subtle)
- hover: `stdDeviation: 6` (neon)
- 파티클: `stdDeviation: 4`
- filter 크기: `width="300%" height="300%" x="-100%" y="-100%"`

### F2. Motion Blur
- 용도: 로딩 시 노드 등장, 드래그 중
- 로딩: `stdDeviation="8 0"` → `"0.1 0"` (dur 0.4s)
- 드래그: `stdDeviation="0 4"` (수직 이동)
- `color-interpolation-filters="sRGB"` 필수

### F4. Color Blending
- 용도: 링크 교차 영역
- CSS: `.link-group { isolation: isolate; }` + `.link { mix-blend-mode: screen; }`
- 다크 테마이므로 `screen` 모드 (겹치면 밝아짐)

### 추가: 파티클 플로우
- 각 링크에 2~4개 원형 파티클 (r: 2px)
- 색상: 해당 링크의 source 노드 색상, opacity 0.8
- glow filter 적용 (stdDeviation 4)
- GSAP motionPath로 링크 path를 따라 이동
- duration: 3s (value > 20) ~ 7s (value < 5), value에 반비례
- stagger: 링크당 파티클 간 1s 간격
- repeat: -1 (무한)

---

## 8. 레퍼런스 스펙 (COMBO-4에서)

### Sankey 설정
- `nodeWidth`: 20
- `nodePadding`: 16
- `nodeAlign`: d3.sankeyJustify
- 링크 경로: `d3.sankeyLinkHorizontal()`
- 링크 gradient: `gradientUnits "userSpaceOnUse"`, `x1=source.x1`, `x2=target.x0`

### 색상
- 배경: #0a1a0a (organic 프리셋, COMBO-4 기본 #08090c 대신)
- 노드: 데이터 원본 색상
- 링크: orientation gradient, opacity 0.4 기본 / hover 0.8
- 라벨: #ccccdd
- 수치: #ffffff

### 타이포그래피
- 노드 라벨: JetBrains Mono 11px #ccccdd
- 수치: Inter 12px bold #ffffff
- 타이틀: Space Grotesk 28px bold #ffffff
- KPI: Space Grotesk 48px bold #ffffff

### 레이아웃
- 상단: KPI 패널 (가로 나열, 4개)
- 중앙: Sankey 차트 (화면 80%)
- 하단: 상세 패널 (노드 클릭 시 slide-up)

### 인터랙션 기본값
- Hover 노드: 연결 링크 opacity 0.8, 나머지 0.05, 노드 glow 6, 하단 패널 상세
- Hover 링크: opacity 0.9, 두께 +2px, 툴팁 "A→B: X Mtoe"
- 노드 드래그: d3.drag() y 재조정, 링크 자동 재계산
