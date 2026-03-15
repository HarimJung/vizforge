# Sankey 스펙 — The Hidden Grid

js/sankey.js를 이 문서 기준으로 생성한다.

## 레이아웃
```js
d3.sankey()
  .nodeWidth(20).nodePadding(14)
  .nodeAlign(d3.sankeyJustify)
  .extent([[80,60],[width-240,height-60]])
  .iterations(32)
3단 구조
좌: energy_sources(6) — 석탄,가스,태양광/풍력,수력,원자력,석유/기타
중: regions(7) — 미국,중국,유럽,아일랜드,일본/한국,동남아,기타
우: dc_usage(6) — AI학습,AI추론,클라우드,기업IT,냉각,인프라/손실
노드 색상
energy_sources: 데이터 내장 color
regions: us=#00ffd5 cn=#ff4466 eu=#457b9d ie=#53bf9d jp_kr=#e9c46a sea=#f4a261 other=#6c5ce7
dc_usage: ai_training=#bf5af2 ai_inference=#a29bfe cloud=#4ecdc4 enterprise=#457b9d cooling=#ff6b6b infra=#556677
링크 스타일
d3.sankeyLinkHorizontal()
orientation gradient: source.color → target.color (gradientUnits=userSpaceOnUse)
opacity: 0.35
hover opacity: 0.75
mix-blend-mode 금지
배경: #050510 단색 (그라디언트/틸 금지)
로딩 시퀀스 (Scene 2 진입 시, 총 ~5.5s)
시점	대상	동작	ease
0s	배경 미세그리드	opacity 0→0.02, 1s	power1.in
0.3s	카테고리라벨 3개	fade+y, stagger 0.15	power2.out
1.0s	좌측 노드 6개	scale 0→1 + motion blur(8,0→0,0), stagger 0.08	back.out(1.7)
1.5s	중간 노드 7개	동일	동일
2.0s	우측 노드 6개	동일	동일
2.3s	링크 45개	dashoffset 100%→0%, stagger 0.05, 좌→우	power2.inOut
3.0s	링크 gradient	opacity 0→0.35	power2.out
3.3s	노드 라벨	fade-in, stagger 0.04	power2.out
3.5s	수치 라벨	fade-in, stagger 0.04	power2.out
3.8s	KPI 패널	fade+y, stagger 0.1	power2.out
4.0s	KPI 숫자	count-up 0→목표, 1.2s	power2.out
5.0s	파티클 플로우	opacity 0→1	linear
5.2s	노드 glow pulse	시작	sine.inOut
5.5s	animated flow gradient	시작	linear
상시 애니메이션
파티클: 링크 path 따라 발광 원(r=2, #fff, opacity=0.6) 2~4개, value비례 속도, dur 3~7s, ∞
노드 glow: feGaussianBlur stdDeviation 2↔3.5, 2s, yoyo, ∞
flow gradient: linearGradient x1 animate, 7s, ∞
호버
노드 hover: 연결 링크 0.75, 비연결 0.05, glow 강화, 툴팁
링크 hover: opacity 0.85, 두께+2px, 툴팁 "A→B: X TWh"
노드 click: detail panel slide-up, breakdown 바차트
외부 click: panel slide-down
export
sankey.js는 아래를 export:

initSankey(container, data) → svg
playEntrance() — 로딩 시퀀스 실행
show() / hide() — opacity 전환
dispose()


## 체크리스트 (sankey.js 완료 전 반드시 통과)
□ 배경 #050510 단색
□ mix-blend-mode 없음
□ 링크 opacity 0.35
□ 우측 라벨 안 잘림
□ 노드 stagger 등장 작동
□ 링크 draw-in 작동
□ 파티클 플로우 작동
□ 호버 작동
