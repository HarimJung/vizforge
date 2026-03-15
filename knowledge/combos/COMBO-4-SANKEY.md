# COMBO-4: Sankey Diagram

## 라이브러리 스택
- D3.js v7: `<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>`
- d3-sankey: `<script src="https://cdn.jsdelivr.net/npm/d3-sankey@0.12"></script>`
- GSAP 3.12: `<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>`

## 적용 Nadieh 기법
- orientation gradient (링크: 출발→도착 색상)
- animated flow gradient (흐름 방향)
- glow filter (hover)

## 레퍼런스 스펙

### 색상
- 배경: #08090c
- 노드: 카테고리별 고유색 (데이터에 따라 Stage 3에서 배정)
- 링크: 출발 노드색 → 도착 노드색 linearGradient, opacity 0.4 기본, hover 0.8
- 라벨: #ccccdd
- 수치: #ffffff

### Sankey 설정
- nodeWidth: 20
- nodePadding: 16
- nodeAlign: d3.sankeyJustify
- 링크 경로: d3.sankeyLinkHorizontal()
- 링크 gradient: gradientUnits "userSpaceOnUse", x1=source.x1, x2=target.x0

### 타이포그래피
- 노드 라벨: JetBrains Mono 11px #ccccdd
- 수치: Inter 12px bold #ffffff
- 타이틀: Space Grotesk 28px bold #ffffff
- KPI: Bebas Neue 42px #ffffff

### 레이아웃
- 상단: KPI 패널 (가로 나열)
- 중앙: Sankey 차트 (화면 80%)
- 하단: 상세 패널 (노드 클릭 시 slide-up)

### 애니메이션
로딩:
1. 노드 좌→우 순차 등장 stagger 0.08 scale from 0
2. 링크 stroke-dashoffset stagger 0.05 좌→우
3. 라벨 fade-in 0.3s
4. KPI 카운트업

Hover 노드: 연결 링크 opacity 0.8, 나머지 0.05, 노드 glow, 하단 패널 상세
Hover 링크: opacity 0.9, 두께 +2px, 툴팁 "A→B: X단위"
노드 드래그: d3.drag() y 재조정, 링크 자동 재계산