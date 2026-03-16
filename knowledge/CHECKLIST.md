# VizForge — Stage 5 Polish Checklist

Stage 5에서 순서대로 적용한다. 완료 시 각 항목에 [x] 체크.


---
## 1. 사전 확인
---

- [ ] Stage 2 결과에서 nadieh_effects 기법 ID 목록 확인
- [ ] Stage 2 결과에서 매칭된 COMBO 번호 확인
- [ ] Stage 2 결과에서 선택된 템플릿 번호 (A/B/C/D) 확인
- [ ] design-doc.md의 애니메이션 시퀀스 확인
- [ ] design-doc.md의 적용 이펙트 명세 확인
- [ ] design-doc.md의 색 배정 테이블 확인


---
## 2. 로딩 시퀀스
---

- [ ] GSAP master timeline 구성 (design-doc.md 타이밍 기준)
- [ ] 요소별 입장 순서: 배경 → 주요 시각화 → UI 패널 → 라벨/KPI
- [ ] ease 함수 통일 (기본 power2.out, 강조 elastic.out)
- [ ] stagger 적용 (동류 요소 0.03~0.08s 간격)


---
## 3. Nadieh 이펙트 적용
---

SVG 콤보 (2, 3, 4, 5, 6, 7, 8, 9):
- [ ] NADIEH.md에서 해당 기법 ID의 SVG 코드 적용
- [ ] defs 블록에 gradient/filter 정의
- [ ] 요소에 fill="url(#...)" 또는 style="filter:url(#...)" 연결

Three.js 콤보 (1, 10):
- [ ] NADIEH-THREEJS.md에서 해당 기법 ID의 GLSL/PostProcess 코드 적용
- [ ] EffectComposer 구성 (RenderPass → 기법별 Pass 순서)
- [ ] uniform 값을 선택된 템플릿의 :root CSS 변수와 일치시킴 (Three.js 3D 환경색은 콤보 파일 값 예외 허용)

확장 기법 필요 시:
- [ ] NADIEH-EXTENDED.md에서 해당 EX-N만 참조
- [ ] 나머지 EX는 읽지 않음

공통:
- [ ] F1(Glow) 적용 확인 (모든 콤보 기본)
- [ ] hover 시 이펙트 강화 (glow stdDev 3.5→6 / bloom strength 0.8→1.5)
- [ ] 기록에 없는 기법은 적용하지 않음


---
## 4. 마이크로인터랙션
---

- [ ] hover: 대상 요소 강조 + 비대상 dim (opacity 0.1~0.2)
- [ ] hover: 툴팁 표시 (지연 0ms, 페이드 150ms)
- [ ] click: 상세 패널 또는 필터 토글
- [ ] transition: 상태 변경 시 GSAP 300~500ms, ease power2.inOut
- [ ] cursor 변경: 인터랙티브 요소에 pointer


---
## 5. 포스트프로세싱 (Three.js 콤보만)
---

- [ ] UnrealBloomPass 파라미터 확인 (strength, radius, threshold)
- [ ] AfterimagePass 필요 시 추가 (기본 damp 0.0, 이동 시만 활성화)
- [ ] pass 순서: RenderPass → BloomPass → 기타 → 최종 출력
- [ ] 렌더 루프에서 composer.render() 사용


---
## 6. 반응형
---

- [ ] 1280px 이상: 풀 레이아웃
- [ ] 768px~1279px: 2컬럼 또는 축소 레이아웃
- [ ] 768px 미만: 1컬럼 스택, 터치 대응
- [ ] Three.js: resize 이벤트에서 camera.aspect + renderer.setSize 갱신
- [ ] SVG: viewBox 기반 스케일링
- [ ] 폰트 사이즈: clamp() 또는 미디어쿼리


---
## 7. 성능
---

- [ ] Three.js: 포인트 ≤15,000 / 아크 ≤20 / 텍스처 ≤2048px
- [ ] D3: DOM 노드 ≤500 / 불필요한 리렌더 방지
- [ ] GSAP: will-change 남용 금지 (애니메이션 완료 후 제거)
- [ ] 이미지/데이터: 인라인 base64 또는 JS 객체 (외부 요청 0)
- [ ] CDN: async/defer 로드
- [ ] requestAnimationFrame 루프 최적화 (비활성 탭 시 정지)


---
## 8. 코드 정리
---

- [ ] 콘솔 로그 제거
- [ ] 미사용 변수/함수 제거
- [ ] CSS 변수가 선택된 템플릿의 :root 정의와 일치하는지 확인
- [ ] 차트 색상이 design-doc.md 색 배정 테이블의 CSS 변수만 사용하는지 확인
- [ ] 템플릿의 :root 변수를 임의로 추가/삭제/변경하지 않았는지 확인
- [ ] 주석: 섹션 구분만 (과도한 주석 금지)
- [ ] 단일 index.html 파일로 통합 확인
- [ ] CDN만 사용 확인 (npm/빌드 도구 없음)


---
## 9. 최종 검증
---

- [ ] 브라우저에서 열어 전체 플로우 확인 (Chrome 최신)
- [ ] 로딩 시퀀스 → 메인 시각화 → 인터랙션 → 전환 순서 정상
- [ ] 데이터 값이 원본과 일치 (KPI 숫자, 범례, 툴팁)
- [ ] 에러 콘솔 0건
- [ ] memory.md에 이 프로젝트에서 배운 점 기록