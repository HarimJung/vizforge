# COMBO-1: 3D Globe + 글로벌 데이터 흐름

## 라이브러리 스택
- Three.js r160: `<script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>`
- Three.js addons (OrbitControls, EffectComposer, RenderPass, UnrealBloomPass): importmap
- GSAP 3.12: `<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>`
- 커스텀 GLSL 셰이더 (인라인)

## 적용 Nadieh 기법
- glow → Three.js UnrealBloomPass로 대체
- animated flow → GLSL fragment shader fract(uTime) 기반
- stroke-dashoffset 개념 → GLSL smoothstep 펄스

## 레퍼런스 스펙: MigrationTrack + Stripe Globe

### 색상 시스템
- 배경: #050510
- 지구본 구체: 반투명 네이비 #0a1628, opacity 0.2
- 대기 Fresnel glow: #1a3a5c → #000000, 가장자리만
- 아크 출발(위기/출발국): #ff4466
- 아크 도착(수용/도착국): #00ffd5
- 아크 흐름 펄스: #ffffff alpha 0.8
- 도트 기본: #334455, 활성 국가: #00ffd5
- KPI 숫자: #ffffff
- 라벨: #88ccff
- 보조 텍스트: #556677
- 패널 배경: rgba(255,255,255,0.03)
- 패널 보더: rgba(255,255,255,0.06)

### 타이포그래피
- KPI: Bebas Neue 48px bold #ffffff, letter-spacing 0.02em
- 섹션 라벨: Space Mono 10px uppercase #88ccff, letter-spacing 0.15em
- 국가명: Inter 14px semibold #ffffff
- 수치 보조: Inter 12px regular #88ccff
- 본문: Inter 13px regular #aaaaaa, line-height 1.6

### 레이아웃
- 중앙: globe 컨테이너 55~65%
- 좌상단: KPI 패널 (세로 나열)
- 좌하단: 국가 리스트 (outflow/inflow 탭)
- 우측: 상세 패널 (클릭 시 slide-in)
- 하단: 크레딧
- 모든 패널: backdrop-filter blur(12px), border 1px solid var(--border-subtle), border-radius 8px

### Three.js 구성
- Scene 배경: #050510
- PerspectiveCamera: fov 45, near 0.1, far 1000
- 초기 카메라 z: 300
- OrbitControls: enableZoom true, minDistance 200, maxDistance 500, autoRotate true, autoRotateSpeed 0.3, enableDamping true, dampingFactor 0.05
- 구체: SphereGeometry(100, 64, 64), MeshBasicMaterial #0a1628 opacity 0.2 transparent
- 도트: ~20,000개 sunflower spiral, BufferGeometry + PointsMaterial size 0.8
- 아크: ShaderMaterial, uTime 기반 펄스
- 아크 높이: 데이터 비례, min 20, max 60 (지구 반지름 %)
- 아크 두께: 데이터 비례, 1~3px

### 포스트프로세싱
- RenderPass → UnrealBloomPass → Vignette → Film Grain
- UnrealBloomPass: strength 0.9, radius 0.4, threshold 0.15
- Vignette: offset 1.0, darkness 1.3
- Film Grain: intensity 0.03

### 애니메이션 시퀀스
로딩:
1. 배경 fade-in 0.3s power2.out
2. 지구본 scale 0.8→1.0, 0.8s back.out(1.4)
3. 도트 opacity stagger 1.2s (위→아래)
4. 아크 순차 등장 stagger 0.15s (총 2s)
5. 좌측 패널 slide-in x:-40→0, 0.5s power3.out stagger 0.1s
6. KPI 카운트업 1.5s power2.out

국가 클릭:
- 카메라 이동 1.2s power3.inOut
- 클릭 국가 아크 하이라이트, 나머지 opacity 0.08
- 우측 패널 slide-in 0.5s power3.out
- 바 차트 stagger 0.05s

Hover:
- bloom strength 0.9→1.4, 0.3s
- 리스트 항목 scale 1.02, 나머지 opacity 0.5, 0.2s

전역:
- 자동회전 speed 0.3, 조작 시 정지, 5초 후 재개

### 성능 최적화 (Stripe Globe에서 배운 것)
- 도트 배치: sunflower spiral (극점 뭉침 방지)
- 국가 구분: PNG 마스크 + getImageData → countryId 태깅
- 육지만 렌더링: 6만→2만 도트 절감
- antialias: false (고해상도 성능 대폭 향상)
- 모바일: 스크롤 시 애니메이션 pause + debounce
- 레이어: 해양 구체 + 도트 구체 + 아크 = 3층
