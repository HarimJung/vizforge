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

존재: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10

미생성 (인덱스만): 11, 12, 13


## 콤보 → 기본 템플릿 매핑

| 콤보 | 기본 템플릿 | 이유 |
|------|-------------|------|
| COMBO-1 GLOBE | A (Interactive) | 풀블리드 단일 시각화 |
| COMBO-2 DASHBOARD | D (Dashboard) | 다중 차트 그리드 |
| COMBO-3 SCROLL | B (Scroll) | 스크롤 스토리텔링 |
| COMBO-4 SANKEY | A (Interactive) | 풀블리드 단일 시각화 |
| COMBO-5 MAP | A (Interactive) | 풀블리드 단일 시각화 |
| COMBO-6 NETWORK | A (Interactive) | 풀블리드 단일 시각화 |
| COMBO-7 DECKGL | A (Interactive) | 풀블리드 단일 시각화 |
| COMBO-8 TIMELINE | A (Interactive) | 풀블리드 단일 시각화 |
| COMBO-9 VORONOI | A (Interactive) | 풀블리드 단일 시각화 |
| COMBO-10 GLOBE-SANKEY | B (Scroll) | 스크롤 기반 씬 전환 |
| COMBO-11 RADIAL | A (Interactive) | 풀블리드 단일 시각화 |
| COMBO-12 CHORD | A (Interactive) | 풀블리드 단일 시각화 |
| COMBO-13 BEESWARM | A (Interactive) | 풀블리드 단일 시각화 |

> Template C (Report/Poster)는 사용자가 "보고서", "포스터", "인포그래픽"을 명시할 때만 수동 선택한다.

## 색상 규칙

- 실제 출력 색상은 선택된 템플릿의 `:root` CSS 변수(`--c1`~`--c6`, `--c1-60`~`--c6-60`, `--c1-30`~`--c6-30`)를 사용한다.
- 콤보 파일의 HEX 값은 참고용이며, 코드에 직접 사용하지 않는다.
- 예외: Three.js `scene.background`, 3D 환경 material 등 CSS 변수가 적용 불가능한 경우에만 콤보 파일의 HEX 값을 사용할 수 있다.
- Stage 3 design-doc.md에서 색상 배정 테이블을 반드시 작성하고, 이 테이블의 CSS 변수만 코드에 사용한다.
