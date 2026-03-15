# COMBO-2: Interactive Dashboard

## 라이브러리 스택
- D3.js v7: `<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>`
- GSAP 3.12: `<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>`

## 적용 Nadieh 기법
- glow filter (hover)
- linear gradient (범례, area chart fade)
- radial gradient (버블 차트 시)
- mix-blend-mode (겹치는 영역)

## 레퍼런스 스펙

### 색상 시스템
- 배경: #0f0f14
- 카드 배경: rgba(255,255,255,0.04)
- 카드 보더: rgba(255,255,255,0.08)
- 데이터 팔레트 (6색): #4ecdc4, #ff6b6b, #ffd93d, #6c5ce7, #a8e6cf, #fd79a8
- 축/그리드: rgba(255,255,255,0.08)
- 축 텍스트: #666688
- 데이터 라벨: #aaaacc

### 타이포그래피
- KPI: Bebas Neue 42px #ffffff
- 차트 타이틀: Inter 16px semibold #ffffff
- 축 라벨: Inter 11px #666688
- 툴팁: Inter 12px #ffffff, 배경 rgba(0,0,0,0.85) blur(8px) padding 8px 12px radius 6px

### D3 공통 설정
- margin: { top: 30, right: 20, bottom: 40, left: 50 }
- transition: 800ms d3.easeCubicInOut
- bar padding: 0.3 (scaleBand)
- line curve: d3.curveMonotoneX
- axis: tickSize(-chartHeight) tickPadding(10)

### 애니메이션
로딩 GSAP timeline:
1. 배경 fade 0.3s
2. 카드 stagger from bottom y:20 opacity:0 stagger:0.08 0.5s power3.out
3. 바 height:0→실제 stagger:0.04 0.6s power3.out / 라인 dashoffset 1.2s power3.out
4. KPI 카운트업 1.5s

필터 변경: exit 0.3s power2.in → update 0.5s → enter 0.5s stagger 0.04
Hover: scale 1.05, 나머지 opacity 0.15, 툴팁 fade 0.15s

### SVG 필터
- glow: feGaussianBlur stdDeviation 2.5, hover 4.5
- area gradient: linearGradient 위→아래, 데이터 색 opacity 0.6→0
