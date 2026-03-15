# COMBO-10: Globe → Sankey 전환 서사형

## 콘셉트
3D 글로브에서 데이터센터 위치를 보여주고, 글로브가 반으로 갈라지며 내부 에너지 흐름이 Sankey 다이어그램으로 펼쳐진다. 스크롤 기반 5개 씬으로 구성된 데이터 스토리텔링. 마지막에 글로브가 다시 합쳐지며 2030년 미래 시나리오를 보여준다.


## 라이브러리 스택
- Three.js r160: `<script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>`
- Three.js addons: importmap (OrbitControls, EffectComposer, RenderPass, UnrealBloomPass, AfterimagePass)
- D3.js v7: `<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>`
- d3-sankey: `<script src="https://cdn.jsdelivr.net/npm/d3-sankey@0.12"></script>`
- GSAP 3.12: `<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>`
- GSAP ScrollTrigger: `<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>`
- Scrollama: `<script src="https://cdn.jsdelivr.net/npm/scrollama@3"></script>`
- 커스텀 GLSL 셰이더 (인라인)


## 적용 Nadieh 기법

Three.js 구간 (Scene 1~3, 5):
- G2(Radial Gradient) → 포인트 스프라이트 입체감 (NADIEH-THREEJS.md)
- G5(Animated Flow) → 아크 펄스 (NADIEH-THREEJS.md)
- F1(Glow) → UnrealBloomPass (NADIEH-THREEJS.md)
- F2(Motion Blur) → AfterimagePass, 분할 이동 시만 (NADIEH-THREEJS.md)
- F4(Color Blending) → AdditiveBlending, 아크 교차 (NADIEH-THREEJS.md)
- F5(Draw-in) → GLSL discard + uDrawProgress (NADIEH-THREEJS.md)

D3 SVG 구간 (Scene 4):
- G3(Orientation Gradient) → 링크 source→target 색상 (NADIEH.md)
- G5(Animated Flow) → SVG animate offset (NADIEH.md)
- F1(Glow) → SVG feGaussianBlur filter (NADIEH.md)
- F5(Dash-offset Draw-in) → 링크 순차 입장 (NADIEH.md)

확장 기법:
- EX-2(Arc Swoosh) → 글로브 아크 생성 (NADIEH-EXTENDED.md)
- EX-3(Contour Shader) → 글로브 표면 등고선 (NADIEH-EXTENDED.md)
- EX-6(Scrollama) → 스크롤 씬 전환 (NADIEH-EXTENDED.md)
- EX-8(Progressive Disclosure) → Sankey 단계적 공개 (NADIEH-EXTENDED.md)

Scene 5 추가:
- G4(Abrupt Gradient) → 재생/화석 비율 경계 바 (NADIEH-THREEJS.md)


## 데이터 스키마

단일 JSON 파일 (data/[project]/[name].json):

```json
{
  "meta": {
    "title": "string",
    "subtitle": "string",
    "source": "string",
    "year": 2024,
    "total_twh": 415
  },
  "regions": [
    {
      "id": "us",
      "name": "United States",
      "lat": 39.8,
      "lng": -98.5,
      "twh": 183,
      "pct_national": 4.4,
      "color": "#00ffd5"
    }
  ],
  "energy_sources": [
    {
      "id": "coal",
      "name": "Coal",
      "twh": 125,
      "type": "fossil",
      "color": "#ff4466"
    }
  ],
  "dc_usage": [
    {
      "id": "ai_training",
      "name": "AI Training",
      "twh": 8,
      "color": "#a29bfe"
    }
  ],
  "sankey_links": [
    { "source": "coal", "target": "us", "value": 55 },
    { "source": "us", "target": "ai_training", "value": 15 }
  ],
  "kpi": {
    "total_twh": 415,
    "pct_global": 1.5,
    "growth_pct": 128,
    "water_billion_gal": 17,
    "chatgpt_query_ml": 500
  },
  "projection_2030": {
    "base": { "total_twh": 945, "clean_pct": 45 },
    "liftoff": { "total_twh": 1100, "clean_pct": 35 },
    "efficiency": { "total_twh": 650, "clean_pct": 60 }
  }
}
Copy
레퍼런스 스펙
색상 시스템
배경: #050510
글로브 구체: #0a1628 opacity 0.15
대기 Fresnel: #1a3a5c → #000000
포인트 기본: #334455
포인트 활성: region.color (데이터에서)
아크 fossil: #ff4466
아크 clean: #00ffd5
아크 펄스: #ffffff alpha 0.8
Sankey 노드: 카테고리 color (데이터에서)
Sankey 링크: source.color → target.color orientation gradient, opacity 0.4 기본 / hover 0.75
KPI 숫자: #ffffff
라벨 주요: #88ccff
라벨 보조: #556677
패널 배경: rgba(255,255,255,0.03)
패널 보더: rgba(255,255,255,0.06)
시나리오 Base: #00ffd5
시나리오 Lift-off: #ff4466
시나리오 Efficiency: #ffd93d
타이포그래피
씬 타이틀: Space Grotesk 36px bold #ffffff, letter-spacing -0.02em
KPI 숫자: Bebas Neue 48px bold #ffffff, letter-spacing 0.02em
KPI 단위: Space Mono 10px uppercase #88ccff, letter-spacing 0.15em
노드 라벨: JetBrains Mono 11px #ccccdd
링크 수치: Inter 12px bold #ffffff
본문/해설: Inter 14px regular #aaaaaa, line-height 1.7
스크롤 텍스트: Inter 18px regular #ccccdd, line-height 1.8, max-width 480px
레이아웃
전체 구조:

.scroll-container (position: relative)
  .scroll-graphic (position: sticky, top:0, width:100%, height:100vh)
    #three-canvas (position:absolute, inset:0, z-index:1)
    #svg-container (position:absolute, inset:0, z-index:2, pointer-events:none → Scene 4에서 활성화)
    #ui-overlay (position:absolute, inset:0, z-index:3, pointer-events:none)
      .kpi-panel (좌상단)
      .scene-title (중앙 상단)
      .detail-panel (우측, slide-in)
      .scenario-toggle (우하단, Scene 5에서만)
      .credit (하단 중앙)
  .scroll-steps
    .step[data-scene="0"] (min-height: 100vh)
    .step[data-scene="1"] (min-height: 150vh)
    .step[data-scene="2"] (min-height: 200vh)
    .step[data-scene="3"] (min-height: 150vh)
    .step[data-scene="4"] (min-height: 100vh)
패널 공통: backdrop-filter blur(12px), border 1px solid var(--border-subtle), border-radius 8px, padding 20px

5개 씬 상세
Scene 0: 인트로 (scroll step 0)
내용: 타이틀 + 핵심 통계 한 줄 + "scroll to explore" 힌트 카메라: 없음 (Three.js 아직 비활성)

애니메이션:

배경 #050510 즉시
타이틀 텍스트 opacity 0→1, y 30→0, 1.0s power2.out
부제 텍스트 opacity 0→1, 0.6s power2.out, delay 0.5s
"1 query = 500ml" 비교 인포그래픽 fade-in, delay 1.0s
스크롤 힌트 화살표 bounce infinite 1.5s
스크롤 진행 (progress 0→1):

progress 0.8 이상: Three.js canvas opacity 0→1 (다음 씬 준비)
Scene 1: Globe (scroll step 1)
내용: 3D 글로브에 데이터센터 위치 포인트 + 지역 간 에너지 아크 카메라: fov 45, z 300, autoRotate speed 0.3

Three.js 구성:

Scene 배경: #050510
PerspectiveCamera: fov 45, near 0.1, far 1000
OrbitControls: enableZoom false (스크롤 충돌 방지), autoRotate true, autoRotateSpeed 0.3, enableDamping true, dampingFactor 0.05
구체: SphereGeometry(100, 64, 64), ShaderMaterial (EX-3 Contour + base color)
대기: SphereGeometry(102, 32, 32), ShaderMaterial Fresnel, AdditiveBlending
포인트: regions 데이터 → latLngToVec3 → BufferGeometry + ShaderMaterial (G2 Radial), size 데이터 비례 (2~8px)
아크: sankey_links 상위 15개 → createGlobeArc (EX-2), ShaderMaterial (G5 Animated Flow + F4 AdditiveBlending), arcHeight Math.max(20, value*0.3)
포스트프로세싱:

RenderPass → UnrealBloomPass(strength 0.8, radius 0.4, threshold 0.85) → AfterimagePass(damp 0.0)
애니메이션 (스크롤 진입 시):

글로브 scale 0.8→1.0, 0.8s back.out(1.4)
등고선 opacity 0→0.08, 1.0s
포인트 stagger 등장 1.2s (큰 것부터)
아크 순차 draw-in (F5), stagger 0.15s, 총 2s
지역 라벨 fade-in stagger 0.1s
KPI 패널 slide-in x:-40→0, 0.5s power3.out
스크롤 진행 (progress 0→1):

0~0.3: autoRotate 유지
0.3~0.5: autoRotate speed 0.3→0, 카메라 정면으로 slerp
0.5~0.8: 정면 고정, 해설 텍스트 fade-in
0.8~1.0: 다음 씬 준비 (아크 fade-out)
Scene 2: Split (scroll step 2)
내용: 글로브가 적도 기준으로 반으로 갈라지며 좌우로 이동. 내부 구조가 드러남. 카메라: 정면 고정, fov 45→55 (와이드)

글로브 분할 구현:

방법: THREE.Plane clipping
clipPlane 상단: new THREE.Plane(new THREE.Vector3(0, -1, 0), 0)
clipPlane 하단: new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
renderer.clipping = true
상반구 mesh: material.clippingPlanes = [clipPlane하단]
하반구 mesh: material.clippingPlanes = [clipPlane상단]
포인트/아크도 동일하게 clip 적용
이동:

상반구 그룹: position.x → -120 (왼쪽), position.y → +20
하반구 그룹: position.x → +120 (오른쪽), position.y → -20
사이 공간에 에너지 흐름 실루엣 fade-in (Sankey 미리보기)
포스트프로세싱 변경:

AfterimagePass damp 0→0.92 (분할 시작), 0.92→0 (분할 완료)
애니메이션 (스크롤 연동):

progress는 scrollama onStepProgress에서 받음
스크롤 진행 (progress 0→1):

0~0.1: fov 45→55, 0.5s
0.1~0.5: 반구 좌우 이동 (progress * maxSplit), AfterimagePass 활성
leftHalf.position.x = -progress * 240
rightHalf.position.x = progress * 240
leftHalf.position.y = progress * 40
rightHalf.position.y = -progress * 40
0.5: AfterimagePass damp → 0
0.5~0.7: 반구 opacity 1.0→0.3, 내부 연결선 fade-in
0.7~0.9: 포인트들이 구면 좌표 → 2D Sankey 노드 좌표로 lerp
각 포인트의 3D 위치를 2D 스크린 좌표로 프로젝션
left column (에너지원) / center column (지역) / right column (용도)
0.9~1.0: Three.js canvas opacity 1→0, SVG container opacity 0→1
Scene 3: Sankey (scroll step 3)
내용: 풀 D3 Sankey 다이어그램. 에너지원 → 지역 → AI 용도 3단 흐름. 렌더러: D3.js SVG (Three.js 비활성)

전환:

Three.js canvas: display none (렌더 루프 정지, GPU 해제)
SVG container: pointer-events auto
Sankey 설정:

d3.sankey()
nodeWidth: 20
nodePadding: 14
nodeAlign: d3.sankeyJustify
extent: [[60, 60], [width-60, height-60]]
iterations: 32
3단 구조: 좌(energy_sources) → 중(regions) → 우(dc_usage)
Sankey 노드:

rect width: nodeWidth(20)
fill: node.color (데이터에서)
stroke: none
rx: 2
Sankey 링크:

path: d3.sankeyLinkHorizontal()
fill: orientation gradient (G3) — gradientUnits="userSpaceOnUse", x1=source.x1, x2=target.x0
opacity: 0.4 기본
stroke: none
Animated Flow (G5):

각 링크에 animated flow gradient 중첩
spreadMethod="reflect", dur="5s"
pulse 색: rgba(255,255,255,0.15)
SVG Glow Filter (F1):

Copy<filter id="sankey-glow" x="-50%" y="-50%" width="200%" height="200%">
  <feGaussianBlur stdDeviation="3" result="blur"/>
  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
hover 시 노드에 적용, stdDeviation 3→5

Progressive Disclosure (EX-8):

Phase 1 (0s): 노드 rect stagger 등장, 좌→우 delay 0.08
Phase 2 (1.2s): 링크 draw-in (F5 stroke-dashoffset), stagger 0.05
Phase 3 (2.5s): 노드 라벨 fade-in stagger 0.04
Phase 4 (3.5s): 수치 라벨 fade-in + KPI 카운트업
인터랙션:

hover 노드: 연결 링크 opacity 0.75, 비연결 0.05, 노드 glow, 툴팁
hover 링크: opacity 0.85, 두께 +2px, 툴팁 "A → B: X TWh"
click 노드: 하단 상세패널 slide-up (해당 노드 breakdown 바차트)
스크롤 진행 (progress 0→1):

0~0.3: Progressive Disclosure Phase 1~4 순차
0.3~0.7: 정적 (사용자 인터랙션 시간)
0.7~0.9: 해설 텍스트 "But what about 2030?" fade-in
0.9~1.0: Sankey fade-out, Three.js canvas 재활성화
Scene 4: Future Globe (scroll step 4)
내용: 글로브가 다시 합쳐지며 2030년 시나리오 전환. 시나리오 토글 UI. 렌더러: Three.js 재활성화

전환:

SVG container: opacity 1→0, display none
Three.js canvas: display block, opacity 0→1
렌더 루프 재시작
글로브 재조립:

반구 좌우 위치 → 중앙으로 복귀 (Scene 2 역재생)
fov 55→45
포인트 2D 좌표 → 구면 좌표 복귀
자동 회전 재개 speed 0.2
시나리오 토글:

우하단에 3개 버튼: Base / Lift-off / Efficiency
각 버튼: 배경색 해당 시나리오 색, border-radius 20px, padding 8px 16px
활성: opacity 1 + glow, 비활성: opacity 0.4
시나리오 전환 시:

포인트 size 비례 변경 (twh 2030 값 기준), GSAP 0.8s elastic.out
아크 두께/높이 비례 변경
KPI 숫자 카운트 전환 (2024→2030 값)
글로브 색조 변화: Base(시안), Lift-off(마젠타), Efficiency(골드)
비율 바: Abrupt Gradient (G4) — clean_pct 기준 경계
비율 바 (글로브 하단):

width 300px, height 12px, border-radius 6px
left: clean 색 (#00ffd5), right: fossil 색 (#ff4466)
경계: abrupt gradient at clean_pct
위에 라벨: "Clean 45%" / "Fossil 55%"
시나리오 전환 시 경계 이동 0.6s power2.inOut
최종 KPI 패널:

total_twh (카운트업)
"≈ Japan's total electricity" 비교 텍스트
growth_pct (2024 대비)
clean_pct
애니메이션:

반구 복귀 1.5s power3.inOut
포인트 구면 복귀 lerp 1.0s
새 아크 draw-in (2030 데이터) 1.5s stagger 0.15
시나리오 토글 버튼 fade-in 0.5s
비율 바 slide-in 0.4s
KPI 카운트업 1.5s
렌더러 전환 프로토콜
Three.js → D3 (Scene 2→3):

Three.js 포인트를 2D로 프로젝션하여 최종 좌표 저장
Three.js canvas opacity 1→0 (0.5s)
D3 SVG 노드를 저장된 2D 좌표에 배치
D3 SVG opacity 0→1 (0.5s)
Three.js 렌더 루프 정지, canvas display:none
OrbitControls dispose
D3 → Three.js (Scene 3→4):

D3 SVG opacity 1→0 (0.5s)
Three.js canvas display:block, 렌더 루프 재시작
Three.js canvas opacity 0→1 (0.5s)
SVG container display:none
OrbitControls 재생성
GSAP Master Timeline 요약
Scene 0: 0-2s    타이틀 + 통계 입장
Scene 1: 스크롤  글로브 입장 → 포인트 → 아크 → KPI
Scene 2: 스크롤  회전 정지 → 분할 → 이동 → 평탄화 → 크로스페이드
Scene 3: 스크롤  Sankey progressive disclosure → 인터랙션 → 페이드아웃
Scene 4: 스크롤  글로브 재조립 → 시나리오 토글 → 최종 KPI
각 씬 내부의 세부 타이밍은 위 씬 상세의 애니메이션 항목을 따른다. 스크롤 기반이므로 절대 초(s) 대신 progress 비율로 제어한다.

성능 최적화
Three.js 구간:

포인트: regions 데이터 수만큼만 (≤20개, 도트 맵 아님)
아크: ≤15개 (sankey_links 상위)
등고선: 셰이더 기반 (geometry 추가 없음)
antialias: false
Scene 3(Sankey)에서 Three.js 완전 비활성 (GPU 해제)
D3 구간:

DOM 노드: 노드(≤30) + 링크(≤50) + 라벨(≤60) = ≤140개
gradient defs: 링크당 1개, ≤50개
animated flow: CSS animation 대신 SVG animate (GPU 부담 적음)
공통:

CDN: async 로드
폰트: Google Fonts display=swap
데이터: JSON 인라인 (외부 요청 0)
모바일 fallback: Three.js 대신 정적 이미지 + D3 Sankey만 표시
resize: debounce 200ms, camera/renderer/SVG viewBox 갱신
모바일 대응 (768px 미만)
Three.js 비활성, 대신 globe 정적 이미지 (base64) 표시
Scene 0, 3, 4만 표시 (Scene 1~2 글로브 분할 생략)
Sankey: nodeWidth 14, nodePadding 10, 폰트 -2px
KPI: 가로 나열 → 세로 스택
스크롤 텍스트: max-width 100%, padding 16px
검증 체크리스트
 Scene 0: 타이틀/통계 표시, 스크롤 힌트 bounce
 Scene 1: 글로브 렌더링, 포인트 크기 비례, 아크 draw-in, KPI 정상
 Scene 2: 분할 애니메이션 스크롤 연동, AfterimagePass on/off, 크로스페이드
 Scene 3: Sankey 3단 흐름 정상, orientation gradient, progressive disclosure, hover/click
 Scene 4: 글로브 재조립, 시나리오 토글 3종, KPI 카운트 전환, 비율 바 이동
 렌더러 전환: Three.js↔D3 깜빡임 없음, GPU 해제 확인
 반응형: 1280+, 768~1279, 768- 세 구간 정상
 성능: 60fps 유지 (Three.js 구간), Sankey DOM ≤140개
 데이터: KPI 숫자가 JSON 원본과 일치
 에러 콘솔 0건