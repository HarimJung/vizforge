# COMBO-8: Timeline / Time-Series Animation

## 라이브러리 스택
- D3.js v7: `<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>`
- GSAP 3.12: `<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>`

## 유형
- 버블 레이스 (Gapminder 스타일): x=metric1, y=metric2, size=metric3, color=category
- 바 레이스: 시간별 상위 N개 바 차트 자동 전환
- 라인 레이스: 시간 경과에 따라 라인이 그려짐

## 적용 Nadieh 기법
- radial gradient (버블)
- glow filter (hover)
- stroke-dashoffset (라인 드로잉)

## 레퍼런스 스펙

### 색상
- 배경: #0f0f14
- 카테고리 팔레트: #4ecdc4 #ff6b6b #ffd93d #6c5ce7 #a8e6cf #fd79a8
- 축: rgba(255,255,255,0.08)
- 연도 표시 (워터마크): #ffffff opacity 0.05, 200px 폰트

### 컨트롤 UI
- 재생/일시정지 버튼: 하단 중앙
- 슬라이더: 연도 선택, 드래그 가능
- 속도 조절: 0.5x, 1x, 2x

### 버블 레이스 설정
- x: scaleLog 또는 scaleLinear
- y: scaleLinear
- size: scaleSqrt (면적 비례)
- 전환: d3.transition 600ms easeCubicInOut
- 연도 간 보간: d3.interpolateNumber

### 바 레이스 설정
- 상위 N: 10~15개
- 바 높이: 30px, padding 4px
- 전환: 800ms, 바 위치 + 길이 동시 전환
- 라벨: 바 끝에 카테고리명 + 수치

### 애니메이션
- 자동 재생: setInterval 또는 GSAP timeline
- 연도당: 800ms~1200ms (속도 조절 가능)
- 연도 워터마크: 숫자 전환 0.3s
