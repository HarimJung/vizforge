# The Hidden Grid — AI가 삼키는 전력

## 컨셉
415TWh 데이터센터 전력 흐름을 글로브 → Sankey로 보여주는 스크롤 스토리텔링.

## 씬 흐름
Scene 0(인트로) → Scene 1(글로브) → fade 0.8s → Scene 2(Sankey) → fade 0.8s → Scene 3(미래 글로브)

## 씬 요약

### Scene 0: 인트로 (HTML only)
타이틀 + KPI(2.9 vs 0.3 Wh) + 통계카드 3개(415TWh, 60% fossil, 945TWh) + 스크롤힌트

### Scene 1: Globe (Three.js)
earth 텍스처 글로브 + 7개 포인트(#aaddff, 1~4px) + 아크 15개(fossil=#ff4466, clean=#00ffd5)
스펙: design-globe.md

### Scene 1→2 전환
Three.js canvas opacity 1→0, SVG opacity 0→1, 0.8s. 렌더루프 정지.

### Scene 2: Sankey (D3)
3단 Sankey(에너지원→지역→용도) + 로딩시퀀스 + 파티클 + glow + 호버
스펙: design-sankey.md

### Scene 2→3 전환
SVG opacity 1→0, Three.js opacity 0→1, 0.8s. 렌더루프 재시작.

### Scene 3: Future Globe (Three.js)
2030 데이터 + 시나리오 토글(Base/Lift-off/Efficiency)

## 파일 구조
index.html — HTML + CSS (design-css.md 기준)
js/globe.js — Three.js (design-globe.md 기준)
js/sankey.js — D3 (design-sankey.md 기준)
js/main.js — Scrollama + 데이터 + fade 전환

## 체크리스트 (모든 항목 통과 전 완료보고 금지)

### 글로브
□ earth 텍스처 (와이어프레임 아님)
□ 7개 포인트 전부 보임
□ 포인트 #aaddff (원색 공 아님)
□ 포인트 최대 4px (거대한 공 아님)
□ 아크 15개 전부 보임
□ 대기 얇음

### Sankey
□ 배경 #050510 단색
□ mix-blend-mode 없음
□ 링크 opacity 0.35
□ 우측 라벨 안 잘림
□ 파티클 플로우 작동
□ 호버 작동

### 전환
□ 글로브→Sankey fade 작동
□ Sankey→글로브 fade 작동
□ Scrollama 4씬 작동

### 데이터
□ 포인트 lat/lng 정확
□ Sankey 합계 415TWh
□ KPI 숫자 JSON 일치

### CSS/HTML
□ 배경 #050510
□ 폰트 5개 로드
□ sticky layout 작동
□ Scene 0 인트로 콘텐츠 보임