> ⚠️ 이 파일의 HEX 색상·폰트·배경색은 참고용이다. 실제 출력은 선택된 템플릿의 :root CSS 변수를 사용한다. Three.js scene.background 등 3D 환경색만 예외.
# COMBO-3: Scroll Storytelling

## 라이브러리 스택
- Scrollama: `<script src="https://cdn.jsdelivr.net/npm/scrollama"></script>`
- D3.js v7: `<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>`
- GSAP 3.12: `<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>`

## 적용 Nadieh 기법
- glow filter
- linear gradient (area fade)
- stroke-dashoffset (라인 드로잉)
- abrupt gradient (임계값)
- mix-blend-mode (라이트 테마 시)

## 레퍼런스: The Pudding 스타일

### HTML 구조
```html
<section id="scrolly">
  <article class="steps">     <!-- 좌측 40%, 스크롤 텍스트 -->
    <div class="step">         <!-- 각 스텝, min-height: 80vh -->
  </article>
  <figure class="sticky">      <!-- 우측 55%, position: sticky, top: 0 -->
    <svg>
  </figure>
</section>
색상 (다크)
배경: #0f0f14
텍스트 영역: rgba(15,15,20,0.95)
본문: #cccccc
강조: #ffffff font-weight 600
주인공 데이터: #ff6b6b
비교 대상: #4ecdc4
배경 데이터: #333344
스텝 인디케이터: #ffffff opacity 0.3, 현재 1.0
Scrollama 설정
offset: 0.5
progress: true
threshold: 4
전환 패턴
바→라인: 바 상단을 점으로 변환, 점을 라인으로 연결 (1000ms)
라인→에리어: dashoffset 드로잉 후 area fade-in
단일→다중: 하나의 라인에서 split (1200ms stagger 0.1s)
차트→지도: fade-out 300ms → fade-in 500ms
절대값→비율: 축 re-scale (800ms)
애니메이션
스텝 진입: 텍스트 y:20→0 0.4s power2.out
진행 바: 상단 얇은 바, 전체 진행률
인트로: 타이틀 + "스크롤하세요" bounce
