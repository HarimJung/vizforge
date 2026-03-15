# COMBO-9: Voronoi Treemap — 유기적 셀 기반 계층 시각화

## 콘셉트
계층적 데이터를 직사각형 트리맵 대신 유기적 Voronoi 셀로 분할하여 면적 = 비중으로 표현한다. Nadieh Bremer의 Pesticides 프로젝트 스타일. 원형 외곽 안에 셀이 자연스럽게 배치되며, Radial Gradient로 입체감을 부여한다.


## 라이브러리 스택
- D3.js v7: `<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>`
- d3-voronoi-treemap: `<script src="https://cdn.jsdelivr.net/npm/d3-voronoi-treemap@1"></script>`
- GSAP 3.12: `<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>`
- 커스텀 SVG defs (인라인)


## 적용 Nadieh 기법
- G2(Radial Gradient) → 셀 내부 입체감 (NADIEH.md)
- F1(Glow Filter) → hover 시 셀 강조 (NADIEH.md)
- F3(Gooey Effect) → 셀 전환 애니메이션 시 유기적 병합 (NADIEH.md)
- F4(Color Blending) → 겹치는 라벨/셀 영역 (NADIEH.md)
- F5(Dash-offset Draw-in) → 셀 경계선 입장 (NADIEH.md)

확장 기법:
- EX-1(Voronoi Treemap) → 핵심 구현 (NADIEH-EXTENDED.md)
- EX-8(Progressive Disclosure) → 단계적 셀 공개 (NADIEH-EXTENDED.md)


## 데이터 스키마

단일 JSON 파일 (data/[project]/[name].json):

```json
{
  "meta": {
    "title": "string",
    "subtitle": "string",
    "source": "string",
    "unit": "string"
  },
  "tree": {
    "name": "root",
    "children": [
      {
        "name": "Category A",
        "children": [
          { "name": "Sub A-1", "value": 120, "detail": "string" },
          { "name": "Sub A-2", "value": 85, "detail": "string" }
        ]
      },
      {
        "name": "Category B",
        "children": [
          { "name": "Sub B-1", "value": 200, "detail": "string" }
        ]
      }
    ]
  },
  "kpi": {
    "total": 0,
    "category_count": 0,
    "top_item": ""
  }
}
Copy
계층 규칙:

depth 0: root (표시 안 함)
depth 1: 대분류 (부모 경계선 + 라벨)
depth 2: 소분류 (개별 셀 + Radial Gradient fill)
depth 3 이상: 지원하지 않음 (2단계까지만)
레퍼런스 스펙
색상 시스템
배경: #08090c
셀 fill: Radial Gradient (G2), 카테고리별 고유 기본색에서 파생
셀 stroke: #ffffff opacity 0.3, width 0.5
부모 경계: #ffffff opacity 0.7, width 2
hover 셀: glow filter stdDeviation 4, 원래 색 brighter(0.3)
선택 셀: stroke #ffffff width 2, glow stdDeviation 6
라벨 대분류: #ffffff opacity 0.9
라벨 소분류: #ffffff opacity 0.7
라벨 수치: #88ccff
배경 패널: rgba(255,255,255,0.03)
보더: rgba(255,255,255,0.06)
기본 팔레트 (depth 1 카테고리 순서):

Copyconst gemPalette = [
  '#4ecdc4', '#ff6b6b', '#45b7d1', '#fed766',
  '#2ab7ca', '#fe4a49', '#a29bfe', '#fd79a8',
  '#00b894', '#e17055', '#74b9ff', '#dfe6e9'
];
각 셀의 Radial Gradient:

cx 35%, cy 35%, r 60%
stop 0%: 카테고리색.brighter(0.5)
stop 50%: 카테고리색
stop 100%: 카테고리색.darker(0.7)
타이포그래피
타이틀: Space Grotesk 32px bold #ffffff, letter-spacing -0.02em
부제: Inter 16px regular #aaaaaa
KPI 숫자: Bebas Neue 42px bold #ffffff
KPI 단위: Space Mono 10px uppercase #88ccff, letter-spacing 0.15em
대분류 라벨: Inter 14px bold #ffffff
소분류 라벨: Inter 11px regular #ffffff opacity 0.7
수치 라벨: JetBrains Mono 10px #88ccff
상세 패널 본문: Inter 13px regular #aaaaaa, line-height 1.6
툴팁: Inter 12px regular #ffffff
레이아웃
전체: CSS Grid
  좌상단: 타이틀 + 부제
  좌측: KPI 패널 (세로 나열, 3~5개)
  중앙: Voronoi Treemap (원형, 화면 높이의 70~80%)
  우측: 상세 패널 (셀 클릭 시 slide-in)
  하단: 범례 (카테고리 색상 매핑) + 크레딧
Voronoi 원형 컨테이너:

중앙 배치: margin auto
반지름: min(width, height) * 0.38
SVG viewBox: 정사각형, 원형 중심 = viewBox 중심
Voronoi Treemap 구성
계산
Copyconst root = d3.hierarchy(data.tree).sum(d => d.value);

// 원형 클리핑 (64각형)
const clip = d3.range(64).map(i => [
  cx + radius * Math.cos((i / 64) * 2 * Math.PI),
  cy + radius * Math.sin((i / 64) * 2 * Math.PI)
]);

const voronoiTreemap = d3VoronoiTreemap.voronoiTreemap()
  .clip(clip)
  .convergenceRatio(0.001)
  .maxIterationCount(100);

voronoiTreemap(root);
셀 렌더링
Copy// depth 2 셀 (leaves)
svg.selectAll('.cell')
  .data(root.leaves())
  .enter().append('path')
  .attr('d', d => 'M' + d.polygon.join('L') + 'Z')
  .attr('fill', d => `url(#rg-${d.data.name})`)
  .attr('stroke', '#ffffff')
  .attr('stroke-opacity', 0.3)
  .attr('stroke-width', 0.5);

// depth 1 부모 경계
svg.selectAll('.parent-border')
  .data(root.descendants().filter(d => d.depth === 1))
  .enter().append('path')
  .attr('d', d => 'M' + d.polygon.join('L') + 'Z')
  .attr('fill', 'none')
  .attr('stroke', '#ffffff')
  .attr('stroke-opacity', 0.7)
  .attr('stroke-width', 2);
라벨 배치
Copyconst MIN_LABEL_AREA = 800; // px²

// 소분류 라벨 (면적 충분한 셀만)
svg.selectAll('.cell-label')
  .data(root.leaves().filter(d => Math.abs(d3.polygonArea(d.polygon)) > MIN_LABEL_AREA))
  .enter().append('text')
  .attr('x', d => d3.polygonCentroid(d.polygon)[0])
  .attr('y', d => d3.polygonCentroid(d.polygon)[1])
  .attr('text-anchor', 'middle')
  .attr('dominant-baseline', 'central');

// 대분류 라벨 (부모 폴리곤 centroid)
svg.selectAll('.parent-label')
  .data(root.descendants().filter(d => d.depth === 1))
  .enter().append('text')
  .attr('x', d => d3.polygonCentroid(d.polygon)[0])
  .attr('y', d => d3.polygonCentroid(d.polygon)[1] - 8)
  .attr('text-anchor', 'middle')
  .attr('font-weight', 'bold');
SVG Defs
Radial Gradient (카테고리별 생성):

Copy<radialGradient id="rg-[name]" cx="35%" cy="35%" r="60%">
  <stop offset="0%" stop-color="[color.brighter(0.5)]" />
  <stop offset="50%" stop-color="[color]" />
  <stop offset="100%" stop-color="[color.darker(0.7)]" />
</radialGradient>
Glow Filter:

Copy<filter id="cell-glow" x="-50%" y="-50%" width="200%" height="200%">
  <feGaussianBlur stdDeviation="4" result="blur" />
  <feMerge>
    <feMergeNode in="blur" />
    <feMergeNode in="SourceGraphic" />
  </feMerge>
</filter>
Gooey Filter (전환 애니메이션용):

Copy<filter id="gooey">
  <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
  <feColorMatrix in="blur" mode="matrix"
    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
    result="gooey" />
  <feBlend in="SourceGraphic" in2="gooey" />
</filter>
애니메이션 시퀀스
로딩 (Progressive Disclosure — EX-8)
Phase 1 (0s): 원형 외곽 draw-in

원형 클리핑 경계를 stroke-dashoffset으로 그리기
duration 1.0s, ease power2.out
Phase 2 (0.8s): 부모 경계 등장

depth 1 경계선 opacity 0→0.7, stagger 0.1s
duration 0.6s, ease power2.out
Phase 3 (1.5s): 셀 등장

leaves opacity 0→1, stagger each 0.03 from "center"
duration 0.8s, ease power2.out
Gooey filter 적용 (그룹에): 셀이 유기적으로 나타남
Gooey 해제: Phase 3 완료 후 filter 제거 (0.5s transition)
Phase 4 (2.5s): 라벨

대분류 라벨 opacity 0→1, y +5→0, stagger 0.05
소분류 라벨 opacity 0→0.7, stagger 0.03
duration 0.5s
Phase 5 (3.2s): KPI + 범례

KPI 카운트업 1.5s power2.out
범례 fade-in 0.4s
Hover
셀 hover:

대상 셀: filter url(#cell-glow), fill brighter(0.3), stroke-width 1.5
같은 카테고리 셀: opacity 유지
다른 카테고리 셀: opacity 0.2
부모 경계: 해당 카테고리만 stroke-width 3
전환: 0.2s ease
툴팁: 셀 이름 + 값 + 비율(%) 표시
Click
셀 클릭:

대상 셀: stroke #ffffff width 2, glow stdDeviation 6
우측 상세 패널 slide-in: x +40→0, 0.4s power3.out
패널 내용: 셀 이름, 값, 비율, detail 텍스트, 같은 카테고리 내 순위 바 차트
바 차트: 해당 카테고리 내 모든 항목, 선택 항목 하이라이트
데이터 전환 (선택적)
데이터셋이 여러 개(연도별 등)일 때:

기존 셀 polygon → 새 polygon으로 morph
d3.interpolate로 polygon 꼭짓점 보간
duration 0.8s, ease power2.inOut
Gooey filter 전환 중 적용, 완료 후 해제
KPI 카운트 전환
범례
위치: 하단 중앙, Voronoi 아래 형태: 가로 나열, 카테고리별 원형(8px) + 라벨

Copyconst legend = svg.selectAll('.legend')
  .data(root.descendants().filter(d => d.depth === 1))
  .enter().append('g')
  .attr('transform', (d, i) => `translate(${i * 120}, 0)`);

legend.append('circle').attr('r', 4).attr('fill', d => categoryColor(d.data.name));
legend.append('text').attr('x', 10).text(d => d.data.name);
인터랙션 상세
hover 경로:

mouseover 셀 → highlight 함수
highlight: 해당 셀 glow + 같은 카테고리 유지 + 나머지 dim
툴팁: 마우스 위치 + offset(10, -10), 배경 rgba(0,0,0,0.85) border-radius 6px padding 8px 12px
mouseout → reset: 모든 셀 opacity 1, glow 제거
click 경로:

click 셀 → 우측 패널 열기
같은 셀 재클릭 또는 패널 밖 클릭 → 패널 닫기
다른 셀 클릭 → 패널 내용 전환 (0.3s crossfade)
성능 최적화
Voronoi 계산: 초기 1회만 (convergenceRatio 0.001, maxIterationCount 100)
데이터 전환 시: 새 Voronoi 재계산 후 polygon morph
셀 수: leaves ≤100개 권장 (200개 이상이면 convergenceRatio 0.01로 완화)
라벨: MIN_LABEL_AREA 필터링으로 DOM 절약
Gooey filter: 전환 중에만 적용, 정적 상태에서 제거 (GPU 부담)
SVG: viewBox 기반 스케일링 (resize 시 재계산 불필요)
반응형
1280px 이상:

풀 레이아웃: 좌 KPI + 중앙 Voronoi + 우 상세패널
원형 반지름: min(width, height) * 0.38
768px~1279px:

KPI 상단 가로 나열
Voronoi 중앙 풀 width
상세패널 하단 slide-up
원형 반지름: min(width, height) * 0.35
768px 미만:

KPI 상단 2×2 그리드
Voronoi 풀 width
원형 반지름: width * 0.42
라벨: 대분류만 표시, 소분류 숨김 (MIN_LABEL_AREA 2000으로 증가)
상세패널: 풀스크린 오버레이
폰트: 전체 -2px
검증 체크리스트
 Voronoi 셀이 원형 내부에 정상 배치
 셀 면적이 value에 비례
 Radial Gradient 적용 (입체감)
 부모 경계선 표시 (depth 1)
 라벨: 큰 셀만 표시, 작은 셀 숨김
 Progressive Disclosure: Phase 1~5 순차 정상
 Gooey: 등장 시 적용, 정적 시 해제
 hover: glow + dim + 툴팁
 click: 상세패널 slide-in, 바차트 정상
 KPI 카운트업 정상
 범례 표시
 반응형: 1280+, 768~1279, 768- 정상
 데이터 값이 원본과 일치
 에러 콘솔 0건