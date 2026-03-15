# Polish 스펙 — The Hidden Grid (Stage 5)

## 참조 파일
- knowledge/NADIEH.md — SVG 기법 원본 (G1~G5, F1~F4)
- knowledge/NADIEH-THREEJS.md — GLSL 셰이더 코드 (G1~G5, F1~F5)
- knowledge/NADIEH-EXTENDED.md — 확장 기법 (EX-1~EX-8)
- knowledge/CHECKLIST.md — 최종 점검

## 1. Scene 0 로딩 choreography (GSAP)
| 시점 | 대상 | 동작 | ease |
|------|------|------|------|
| 0s | 배경 | #050510 즉시 | - |
| 0s | 타이틀 | opacity+y 0→1, 30→0, 1s | power2.out |
| 0.5s | 부제 | opacity 0→1, 0.6s | power2.out |
| 1.0s | KPI (2.9 vs 0.3) | opacity 0→1, 0.8s | power2.out |
| 1.5s | 통계카드 3개 | opacity+y, stagger 0.2 | power2.out |
| ∞ | 스크롤힌트 | bounce 1.5s | infinite |

## 2. Globe 이펙트 (NADIEH-THREEJS.md 참조)

### 지구 텍스처 (최우선)
- earth-night.jpg: https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg
- earth-water.png (specular): https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-water.png
- MeshPhongMaterial, color #ffffff (tint 없음)
- AmbientLight(#bbbbbb, 0.3) + DirectionalLight(#ffffff, 0.8)
- 대기: alpha 0.15, Fresnel 지수 5

### F1 Glow
- UnrealBloomPass strength 0.8, radius 0.4, threshold 0.85
- hover 시 strength→1.5 (0.2s)

### G5 아크 펄스
- uPulseSpeed 0.5, uPulseWidth 0.05, uPulseColor #fff
- value 비례 속도

### G2 포인트
- 색상 #aaddff, radial gradient, hover brightness +0.3

### F5 Draw-in
- uDrawProgress 0→1, stagger 0.15, dur 2s

## 3. Sankey 이펙트 (NADIEH.md 참조)

### G3 Orientation Gradient
- source.color → target.color, opacity 0.35

### 로딩 시퀀스 (5.5s)
- 1.0s: 좌측 노드 stagger + motion blur
- 1.5s: 중간 노드
- 2.0s: 우측 노드
- 2.3s: 링크 draw-in (dashoffset)
- 3.0s: gradient opacity 0→0.35
- 3.3s: 라벨
- 4.0s: KPI count-up
- 5.0s: 파티클 시작
- 5.2s: glow pulse 시작

### 상시 애니메이션
- 파티클: 링크 path 위 발광 원 2~4개, dur 3~7s, ∞
- 노드 glow: stdDeviation 2↔3.5, 2s, yoyo, ∞
- flow gradient: x1 animate, 7s, ∞

### 호버
- 노드: 연결 0.75 / 비연결 0.05, glow 강화, 툴팁
- 링크: opacity 0.85, 두께+2px, 툴팁

## 4. 전환
- fade 0.8s, power2.inOut
- UI overlay 동시 fade

## 5. 마이크로인터랙션
- 글로브 포인트 hover: scale 1.5x, 0.2s
- Sankey 노드/링크 hover: 0.2~0.3s
- 버튼 hover: border accent-1
- 툴팁: 0ms delay, 150ms fade

## 6. Scene 3 시나리오
- Base: 945TWh, clean 45%, #00ffd5
- Lift-off: 1300TWh, clean 35%, #ff4466
- Efficiency: 750TWh, clean 60%, #ffd93d
- 토글: size 0.8s elastic, KPI count-up 1s

## 7. 성능
- Scene 2 동안 Three.js 렌더루프 정지
- visibilitychange 시 정지/재개
- resize debounce 200ms

## 8. 반응형
- ≥1280px 풀 / 768~1279 축소 / <768 Three.js 비활성

## 9. 코드 정리
- console.log 제거, 미사용 코드 제거, CSS 변수 일치 확인

## 버그 수정 (필수)
- 아크 start/end를 regions lat/lng 기준으로 (글로브 밖 튀어나감 해결)
- 7개 포인트 최소 2px
- 자동회전 controls.update() 확인
- 배경 renderer.setClearColor(0x050510)

## 체크리스트 (Stage 5 완료 전 반드시 통과)

### 이펙트
□ Scene 0 순차 등장 작동
□ 지구 earth-night.jpg 텍스처 (도시 불빛 보임)
□ 글로브 bloom 작동
□ 아크 펄스 작동
□ 아크 draw-in 작동
□ Sankey 로딩 시퀀스 5단계 작동
□ 파티클 플로우 작동
□ 노드 glow pulse 작동

### 인터랙션
□ 글로브 포인트 hover 툴팁
□ Sankey 노드 hover 강조/dim
□ Sankey 링크 hover 툴팁
□ Scene 3 시나리오 토글 3개
□ KPI count-up 작동

### 품질
□ 60fps
□ fade 전환 부드러움
□ 콘솔 에러 0개
□ 768px 레이아웃 안 깨짐
□ 데이터 수치 JSON 일치
