# Visualization Combos — 매칭 인덱스

## 사용법
Stage 2에서 이 파일을 먼저 읽고 조합을 결정한다.
조합이 결정되면 knowledge/combos/COMBO-[N]-[NAME].md 하나만 read_file한다.
파일이 아직 없는 콤보는 사용자에게 알리고 가장 가까운 콤보로 대체한다.

## 매칭 의사결정 트리

데이터 태그 → 조합 파일:

0. has-flow + geo-point + global + has-hierarchy(3-layer) → combos/COMBO-10-GLOBE-SANKEY.md
1. has-flow + is-bidirectional + categorical → combos/COMBO-12-CHORD.md
2. has-flow + geo-point + 글로벌 규모 → combos/COMBO-1-GLOBE.md
3. has-flow + geo 없음 → combos/COMBO-4-SANKEY.md
4. has-time + is-cyclic + numeric → combos/COMBO-11-RADIAL.md
5. has-time + 5개 이상 스토리 국면 → combos/COMBO-3-SCROLL.md
6. has-geo-region + numeric → combos/COMBO-5-MAP.md
7. has-network → combos/COMBO-6-NETWORK.md
8. is-large + geo-point → combos/COMBO-7-DECKGL.md
9. has-time + numeric → combos/COMBO-8-TIMELINE.md
10. has-hierarchy + categorical + numeric → combos/COMBO-9-VORONOI.md
11. categorical + numeric + distribution → combos/COMBO-13-BEESWARM.md
12. 그 외 → combos/COMBO-2-DASHBOARD.md

## 복수 매칭 시 우선순위
위 순서가 곧 우선순위다. 조건이 여러 개 충족되면 번호가 작은 것을 선택한다.
단, 사용자가 명시적으로 다른 조합을 요청하면 그것을 따른다.

## 조합 요약 (참고용, 상세는 각 파일)

- COMBO-10 GLOBE-SANKEY: Three.js + D3-sankey + Scrollama + GSAP — Globe 분할→Sankey 전환 서사형
- COMBO-1 GLOBE: Three.js + GSAP + GLSL — 3D 지구본 위의 아크/흐름
- COMBO-2 DASHBOARD: D3.js + GSAP — 다중 차트 인터랙티브 대시보드
- COMBO-3 SCROLL: Scrollama + D3.js + GSAP — 스크롤 데이터 스토리텔링
- COMBO-4 SANKEY: D3.js + d3-sankey + GSAP — 흐름/배분 다이어그램
- COMBO-5 MAP: Leaflet + D3.js + topojson + chroma — 2D 코로플레스 맵
- COMBO-6 NETWORK: D3-force 또는 Cytoscape.js — 네트워크 관계도
- COMBO-7 DECKGL: deck.gl + MapLibre — 대규모 지리공간 (100만+ 포인트)
- COMBO-8 TIMELINE: D3.js + GSAP — 시간축 애니메이션 (레이스 바, 버블)
- COMBO-9 VORONOI: d3-voronoi-treemap + D3.js + GSAP — 유기적 셀 기반 계층 시각화
- COMBO-11 RADIAL: D3.js + GSAP — 극좌표 원형 차트 (24시간, 월별 주기)
- COMBO-12 CHORD: D3.js + d3-chord + GSAP — 양방향 N:N 흐름 다이어그램
- COMBO-13 BEESWARM: D3.js + d3-force + GSAP — 개별 점 분포 비교

## 콤보 파일 상태

존재: 1, 2, 3, 4, 5, 6, 7, 8
생성 예정: 9, 10
미생성 (인덱스만): 11, 12, 13
