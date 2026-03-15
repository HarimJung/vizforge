# COMBO-5: 2D Map (Choropleth)

## 라이브러리 스택
- Leaflet v1: CSS + JS CDN
- D3.js v7 (색상 스케일, GeoJSON)
- topojson-client v3: `<script src="https://cdn.jsdelivr.net/npm/topojson-client@3"></script>`
- chroma.js: `<script src="https://cdn.jsdelivr.net/npm/chroma-js"></script>`
- GSAP 3.12

## 적용 Nadieh 기법
- linear gradient (범례)
- glow filter (hover)
- abrupt gradient (임계값 맵)

## 레퍼런스 스펙

### 색상
- 배경 (맵 외부): #0a0a12
- 타일: CartoDB Dark Matter `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`
- Choropleth 스케일: chroma.scale(['#1a1a3e','#4ecdc4']).mode('lch').classes(7)
- 선택 보더: #ffffff 2px
- 호버: 밝기 +20%, 보더 #ffffff 1px
- 범례: linearGradient 바 200px × 12px

### Leaflet 설정
- 초기 뷰: fitBounds (데이터 범위)
- GeoJSON 스타일: fillOpacity 0.7, weight 0.5, color #222233
- hover: fillOpacity 0.9, weight 1.5, color #ffffff

### 애니메이션
- 로딩: 지역 opacity 0→0.7 stagger
- 필터 변경: 색상 전환 GSAP 0.6s
- 클릭: flyTo 1s, 사이드 패널 상세
