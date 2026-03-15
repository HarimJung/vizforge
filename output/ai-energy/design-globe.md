# Globe 스펙 — The Hidden Grid

js/globe.js를 이 문서 기준으로 생성한다.

## 카메라
PerspectiveCamera fov:45 near:0.1 far:1000 z:300

## OrbitControls
enableZoom:false enablePan:false autoRotate:true speed:0.3 damping:true factor:0.05

## 구체
- SphereGeometry(100, 64, 64)
- 텍스처: https://unpkg.com/three-globe/example/img/earth-dark.jpg
- 밝기 매우 낮게 (대륙 윤곽만 보임, 바다=#050510 수준)
- 와이어프레임 금지, 격자 금지

## 대기
- SphereGeometry(101, 32, 32)
- Fresnel ShaderMaterial, 색 #1a3a5c→transparent, alpha 0.3
- AdditiveBlending, side:BackSide
- 두꺼운 안개 금지

## 포인트 (7개)
- latLngToVec3(lat, lng, radius=100)
- 색상: 전부 #aaddff (원색 금지)
- 크기: 1 + (twh/183)*3 → 범위 1~4px
- ShaderMaterial: 중심 밝고 가장자리 투명 (radial gradient)
- 등장: GSAP scale 0→1, stagger 0.1, 1.2s, elastic.out

## 아크 (15개)
- sankey_links value 상위 15개
- QuadraticBezierCurve3(start, mid, end), TubeGeometry(curve, 64, 0.4, 8)
- arcHeight: max(20, value*0.3)
- fossil(coal,gas,oil): #ff4466 / clean(solar,hydro,nuclear): #00ffd5
- opacity 0.6, AdditiveBlending, depthWrite:false
- 펄스: uTime 기반 smoothstep 흰색 펄스, speed 0.5, width 0.05
- draw-in: uDrawProgress 0→1, GSAP stagger 0.15, 2s, power2.out

## 포스트프로세싱
EffectComposer → RenderPass → UnrealBloomPass(strength:0.8 radius:0.4 threshold:0.85)

## 호버
- Raycaster → 포인트 hover: scale 1.5x, 툴팁(지역명+TWh+DC수)
- 아크 hover: opacity 1.0, 툴팁(source→target: X TWh)

## 스크롤 (Scene 1, progress 0~1)
- 0~0.2: 글로브 등장 + 포인트 + 아크 draw-in
- 0.2~0.4: 자동회전
- 0.4~0.6: 회전 정지, 카메라 정면 slerp
- 0.6~0.8: 해설 텍스트 fade-in
- 0.8~1.0: 아크/KPI fade-out

## Scene 3 (Future Globe)
- 글로브 재등장: scale 0→1, 1.5s
- 시나리오 함수:
  - setScenario('base'): 945TWh, clean 45%
  - setScenario('liftoff'): 1300TWh, clean 35%
  - setScenario('efficiency'): 750TWh, clean 60%
- 토글 시: 포인트 size 0.8s elastic.out, 아크 두께 변경
- 비율바: clean% 경계에서 #00ffd5→#ff4466 abrupt gradient

## export
globe.js는 아래를 export:
- initGlobe(container, data) → {scene, camera, renderer, composer}
- startRender() / stopRender()
- updateSceneProgress(progress)
- setScenario(name)
- dispose()

## 체크리스트 (globe.js 완료 전 반드시 통과)
□ earth 텍스처 적용 (와이어프레임 아님)
□ 7개 포인트 전부 보임
□ 포인트 #aaddff (원색 공 아님)
□ 포인트 최대 4px (거대한 공 아님)
□ 아크 15개 전부 보임
□ 대기 얇음
□ 자동회전 작동
