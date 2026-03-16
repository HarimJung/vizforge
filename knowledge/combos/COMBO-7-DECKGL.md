> ⚠️ 이 파일의 HEX 색상·폰트·배경색은 참고용이다. 실제 출력은 선택된 템플릿의 :root CSS 변수를 사용한다. Three.js scene.background 등 3D 환경색만 예외.
# COMBO-7: deck.gl Large Geospatial

## 라이브러리 스택
- deck.gl: `<script src="https://unpkg.com/deck.gl@latest/dist.min.js"></script>`
- MapLibre GL JS: `<script src="https://unpkg.com/maplibre-gl/dist/maplibre-gl.js"></script>` + CSS
- GSAP 3.12

## 용도
10만+ 포인트의 지리공간 데이터. GPS 궤적, 택시 경로, IoT 센서, 대규모 산점도.

## 핵심 레이어
- ScatterplotLayer: 점 (radiusScale, getColor, getRadius)
- ArcLayer: 아크 (getSourcePosition, getTargetPosition, getSourceColor, getTargetColor)
- HexagonLayer: 3D 육각 히트맵 (elevationScale, radius, extruded)
- TripsLayer: 시간 기반 궤적 (getTimestamps, currentTime, trailLength)

## 레퍼런스 스펙

### 색상
- MapLibre 스타일: dark-matter 또는 커스텀 다크 JSON
- 포인트: 카테고리별 RGBA
- 히트맵: colorRange 6단계 [[0,25,0,25], ... [255,255,178,255]]
- 아크: 출발 [255,68,102], 도착 [0,255,213]

### 설정
- initialViewState: latitude, longitude, zoom, pitch 45, bearing 0
- controller: true
- getRadius: 데이터 비례 또는 고정
- opacity: 0.8

### 애니메이션
- TripsLayer: requestAnimationFrame으로 currentTime 증가
- 전환: FlyToInterpolator duration 1500ms
