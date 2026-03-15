# Nadieh Bremer SVG 이펙트 — 10가지 기법

출처: Visual Cinnamon "SVGs Beyond Mere Shapes" 시리즈
https://www.visualcinnamon.com/2016/04/svg-beyond-mere-shapes/

## 사용법
Stage 2에서 매칭된 기법만 Stage 5 폴리싱에서 적용한다.
Three.js 프로젝트에서는 SVG 대신 GLSL/포스트프로세싱 대응 기법을 사용한다.
→ Three.js 대응 코드는 `NADIEH-THREEJS.md` 참조.


---
## GRADIENT 기법 (5개)
---

### G1. Linear Gradient — 부드러운 색상 범례
출처: https://www.visualcinnamon.com/2016/05/smooth-color-legend-d3-svg-gradient/

용도: 연속형 데이터의 색상 범례, 라인 차트 스트로크, area 차트 fill fade
적용 조건: 수치형 데이터의 색상 매핑이 있을 때

SVG 코드:
  <defs>
    <linearGradient id="legendGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1a1a3e" />
      <stop offset="100%" stop-color="#4ecdc4" />
    </linearGradient>
  </defs>
  <rect fill="url(#legendGrad)" width="200" height="12" rx="6" />

area fade 변형 (위에서 아래로 투명해지는):
  <linearGradient id="areaFade" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#4ecdc4" stop-opacity="0.6" />
    <stop offset="100%" stop-color="#4ecdc4" stop-opacity="0" />
  </linearGradient>


### G2. Radial Gradient — 3D 구체 느낌 버블
출처: https://www.visualcinnamon.com/2016/05/data-based-svg-gradient-d3/

용도: 버블 차트, 산점도에서 원에 입체감 부여
적용 조건: 원형 요소가 있을 때

D3 코드:
  const grad = defs.append("radialGradient")
    .attr("id", "grad-" + d.id)
    .attr("cx", "35%").attr("cy", "35%").attr("r", "60%");
  grad.append("stop").attr("offset", "0%")
    .attr("stop-color", d3.rgb(color).brighter(0.5));
  grad.append("stop").attr("offset", "50%")
    .attr("stop-color", color);
  grad.append("stop").attr("offset", "100%")
    .attr("stop-color", d3.rgb(color).darker(0.7));

cx/cy 35%로 광원을 좌상단에 배치. r 60%로 그래디언트 범위 확장.


### G3. Orientation Gradient — 코드/산키 링크 방향 색상
출처: https://www.visualcinnamon.com/2016/06/orientation-gradient-d3-chord-diagram/

용도: 산키 링크, 코드 다이어그램에서 출발-도착 색상 구분
적용 조건: source-target 링크 시각화

D3 코드 (산키용):
  const grad = defs.append("linearGradient")
    .attr("id", "link-" + i)
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", link.source.x1)
    .attr("y1", (link.source.y0 + link.source.y1) / 2)
    .attr("x2", link.target.x0)
    .attr("y2", (link.target.y0 + link.target.y1) / 2);
  grad.append("stop").attr("offset", "0%").attr("stop-color", sourceColor);
  grad.append("stop").attr("offset", "100%").attr("stop-color", targetColor);

핵심: gradientUnits="userSpaceOnUse" 필수.
코드 다이어그램은 각도에서 좌표 변환에 삼각함수 사용.


### G4. Abrupt Gradient — 임계값/구간 강조
출처: https://www.visualcinnamon.com/2016/06/abrupt-color-gradients/

용도: BMI 구간, 온도 임계값, brush 선택 영역 강조
적용 조건: 연속 데이터에 명확한 경계가 있을 때

SVG 코드:
  <linearGradient id="abrupt">
    <stop offset="0%" stop-color="#cccccc" />
    <stop offset="40%" stop-color="#cccccc" />
    <stop offset="40%" stop-color="#ff4466" />
    <stop offset="60%" stop-color="#ff4466" />
    <stop offset="60%" stop-color="#cccccc" />
    <stop offset="100%" stop-color="#cccccc" />
  </linearGradient>

같은 offset에 두 stop을 넣으면 급격한 색상 전환.
동적 업데이트: D3로 stop의 offset 속성을 변경하면 구간이 이동함.


### G5. Animated Flow Gradient — 흐름 방향 표시
출처: https://www.visualcinnamon.com/2016/05/animate-gradient-imitate-flow-d3/

용도: 산키/코드 링크에서 데이터 흐름 방향 시각화
적용 조건: 흐름 시각화에서 방향성을 강조할 때

SVG 코드:
  <linearGradient id="flow" spreadMethod="reflect" gradientUnits="userSpaceOnUse">
    <stop offset="0%" stop-color="#4ecdc4" />
    <stop offset="50%" stop-color="#ffffff" />
    <stop offset="100%" stop-color="#4ecdc4" />
    <animate attributeName="x1" values="0%;100%" dur="7s" repeatCount="indefinite" />
    <animate attributeName="x2" values="100%;200%" dur="7s" repeatCount="indefinite" />
  </linearGradient>

대칭 팔레트: 첫=끝, 둘째=끝에서둘째 (seamless loop)
Safari 대응: spreadMethod="reflect" 대신 색상을 수동으로 미러링해서 넣어야 함.
속도 조절: dur 값 변경 (7s 느림, 3s 보통, 1s 빠름)


---
## FILTER 기법 (4개)
---

### F1. Glow Filter — 빛나는 효과
출처: https://www.visualcinnamon.com/2016/06/glow-filter-d3-visualization/

용도: 라인, 원, 패스에 발광 효과. hover 시 강화.
적용 조건: 거의 모든 시각화에 사용 가능 (공통 기법)

SVG 코드:
  <defs>
    <filter id="glow" width="300%" height="300%" x="-100%" y="-100%">
      <feGaussianBlur class="glow-blur" in="SourceGraphic"
        stdDeviation="3.5" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

D3 적용:
  d3.selectAll(".data-line").style("filter", "url(#glow)");

hover 강화:
  기본 stdDeviation 3.5, hover 시 6으로 변경
  D3 transition 또는 GSAP으로 전환

파라미터 범위: subtle 2~4, neon 5~8
주의: SVG line 요소에는 안 먹음. path로 변환 필요.
Three.js 대응: UnrealBloomPass (strength로 강도 조절)


### F2. Motion Blur — 이동 잔상
출처: https://www.visualcinnamon.com/2016/05/real-life-motion-effects-d3-visualization/

용도: 요소 이동 시 속도감 부여
적용 조건: 요소가 물리적으로 이동하는 애니메이션

SVG 코드:
  <filter id="motionBlur" width="300%" height="300%" x="-100%" y="-100%"
          color-interpolation-filters="sRGB">
    <feGaussianBlur class="blur-values" in="SourceGraphic" stdDeviation="0.1 0" />
  </filter>

방향 설정:
  수평 이동: stdDeviation="8 0"
  수직 이동: stdDeviation="0 8"
  양방향: stdDeviation="8 8"

D3 애니메이션:
  이동 시작 시 attrTween으로 "0.1 0" -> "8 0"
  정지 시 attrTween으로 "8 0" -> "0.1 0"

Safari: color-interpolation-filters="sRGB" 반드시 포함해야 함


### F3. Gooey Effect — 물방울 합쳐짐
출처: https://www.visualcinnamon.com/2016/06/fun-data-visualizations-svg-gooey-effect/

용도: 버블 클러스터가 합쳐지고 분리되는 유기적 효과
적용 조건: 버블/원형 클러스터 시각화

SVG 코드:
  <filter id="gooey">
    <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
    <feColorMatrix in="blur" mode="matrix"
      values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
      result="gooey" />
    <feBlend in="SourceGraphic" in2="gooey" />
  </filter>

핵심 규칙:
  - 반드시 그룹(g) 요소에 적용 (개별 circle에 적용하면 안 됨)
  - feColorMatrix의 19와 -9가 강도를 결정
    값이 클수록 더 강하게 합쳐짐 (예: 25 -12 = 매우 강함)
    값이 작을수록 약해짐 (예: 6 -3 = 약함)
  - feBlend 대신 feComposite(operator="atop")를 쓰면 원래 크기 유지

D3 애니메이션 (합쳐짐 ON/OFF):
  attrTween으로 matrix values 보간
  합쳐짐: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
  해제:   "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"


### F4. Color Blending — CSS 블렌딩
출처: https://www.visualcinnamon.com/2016/05/beautiful-color-blending-svg-d3/

용도: 겹치는 영역에서 색 혼합
적용 조건: 요소가 시각적으로 겹칠 때

CSS 코드:
  .blend-group {
    isolation: isolate;
  }
  .blend-group circle {
    mix-blend-mode: multiply;
  }

테마별 선택:
  라이트 테마: multiply (겹치면 어두워짐)
  다크 테마: screen (겹치면 밝아짐)

핵심: 부모 요소에 isolation: isolate 반드시 포함.
없으면 blend가 페이지 전체 배경과 섞여서 의도하지 않은 결과가 나옴.


---
## 추가 기법
---

### F5. Dash-offset Draw-in — 경로 그리기 애니메이션
출처: Nadieh 다수 프로젝트 공통 패턴

용도: 경로(path)가 그려지듯이 입장하는 애니메이션
적용 조건: 라인/링크/아크 입장 애니메이션이 있을 때

D3 + GSAP 코드:
  paths.each(function() {
    const len = this.getTotalLength();
    d3.select(this)
      .attr("stroke-dasharray", len)
      .attr("stroke-dashoffset", len);
  });

  gsap.to(paths.nodes(), {
    strokeDashoffset: 0,
    duration: 1.5,
    stagger: 0.05,
    ease: "power2.out"
  });

핵심 파라미터:
  duration: 1.5s (기본), stagger: 0.05s (순차 지연)
  ease: power2.out (감속)


---
## 기법 선택 매트릭스 (Stage 2에서 참조)
---

| ID | 기법명 | 트리거 조건 | 적용 콤보 | SVG/Three.js |
|----|--------|-------------|-----------|--------------|
| G1 | Linear Gradient | 수치형 색상 매핑 | 2, 4, 5, 8, 10 | 둘 다 |
| G2 | Radial Gradient | 원형 요소 | 2, 6, 9 | SVG only |
| G3 | Orientation Gradient | source→target 링크 | 4, 10 | 둘 다 |
| G4 | Abrupt Gradient | 이산 경계/임계값 | 2, 5, 8 | SVG only |
| G5 | Animated Flow | 흐름 방향 강조 | 1, 4, 10 | 둘 다 |
| F1 | Glow Filter | 항상 (accent 강조) | ALL | Three.js=Bloom |
| F2 | Motion Blur | 이동 애니메이션 | 1, 3, 10 | Three.js=Pass |
| F3 | Gooey Effect | 버블/클러스터 병합 | 6, 9 | SVG only |
| F4 | Color Blending | 요소 겹침 | 1, 5, 6, 10 | 둘 다 |
| F5 | Dash-offset Draw-in | 경로 입장 | 3, 4, 7, 8, 10 | SVG only |

### 선택 규칙
1. Stage 2에서 확정된 콤보 번호에 해당하는 행만 후보로 추출
2. 트리거 조건과 데이터 태그 대조 — 매칭되는 기법 ID 목록 기록
3. Stage 5에서 해당 ID만 구현
4. Three.js 콤보(1, 10)이면 `NADIEH-THREEJS.md`의 GLSL 대응 코드 참조
5. SVG 콤보(2, 3, 4, 5, 6, 7, 8, 9)이면 이 파일의 SVG 코드 사용
→ Three.js GLSL 대응: NADIEH-THREEJS.md 참조
→ 확장 기법 (EX-1~8): NADIEH-EXTENDED.md 참조