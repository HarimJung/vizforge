# VizForge — Award-Level Data Visualization Engine

## 이 프로젝트는 무엇인가
사용자가 데이터를 주면 5단계를 거쳐 수상작급 단일 HTML 시각화를 생성하는 Claude Code 프로젝트.
모든 시각화는 프레임워크 없이 CDN 라이브러리만 사용하는 단일 index.html로 출력한다.


## ⛔ 절대 규칙

- 템플릿 없이 HTML을 처음부터 작성하지 않는다. 발견 시 삭제하고 템플릿에서 다시 시작한다.
- 콤보 파일의 HEX 색상을 코드에 직접 쓰지 않는다. 발견 시 CSS 변수로 교체한다.
- design-doc.md에 색 배정 테이블이 없으면 Stage 4로 넘어가지 않는다.
- DESIGN.md에서 CSS 변수를 가져오지 않는다. 무드 키워드 참조만 허용한다.


## 핵심 규칙
1. 코드를 쓰기 전에 반드시 설계 문서를 먼저 작성하고 사용자 승인을 받는다.
2. 한 세션에 한 Stage만 실행한다. Stage 완료 후 사용자 확인을 받아야 다음으로 넘어간다.
3. 대용량 데이터(100행 이상)는 직접 읽지 않는다. 분석 스크립트를 작성하고 실행 결과만 사용한다.
4. 시각적 결정(타이밍, 여백, 애니메이션)은 knowledge/COMBOS-INDEX.md 및 해당 COMBO 스펙의 레퍼런스 수치를 따른다. 색상·폰트·레이아웃은 선택된 템플릿의 :root CSS 변수가 최종 권한이다.
5. 작업 중 발견한 패턴, 해결책, 실패는 반드시 memory.md에 기록한다.
6. 진행 상태는 todo.md에 업데이트한다.

## 5단계 프로세스 (요약)
각 단계의 상세 로직은 knowledge/PROCESS.md 참조.

### Stage 1 — Data Intake & Story Discovery
- 사용자가 데이터를 제공하면 구조를 분석한다.
- 컬럼 타입을 분류한다: 수치형, 범주형, 시간형, 지리형(위경도/국가명), 관계형(소스-타겟).
- 데이터 특성에서 스토리 후보 2~3개를 도출하고, 각각에 핵심 질문을 붙여 사용자에게 제시한다.
- 사용자가 스토리를 선택하면, 데이터를 JSON으로 정제하고 요약 통계를 출력한다.
- ⏸️ 사용자 확인: "이 스토리와 데이터 구조가 맞나요?"

### Stage 2 — Visualization Matching
- 선택된 스토리 + 데이터 특성을 기반으로 knowledge/COMBOS-INDEX.md의 매칭 로직을 실행한다.
- 매칭된 COMBO 파일(knowledge/combos/COMBO-[N]-[NAME].md)만 읽는다.
- 적용할 Nadieh 기법을 knowledge/NADIEH.md의 선택 매트릭스로 결정한다.
- knowledge/COMBOS-INDEX.md 하단의 "콤보 → 템플릿 매핑"에 따라 템플릿(A~D)을 선택한다.
- 디자인 무드를 knowledge/DESIGN.md에서 참고한다 (무드 키워드만 — CSS 변수는 사용하지 않음).
- 결과를 사용자에게 제시한다: "이 데이터에는 [조합] + [Nadieh 기법들] + [템플릿] + [무드]를 추천합니다."
- 결과에 `nadieh_effects: [G3, G5, F1, ...]` 형태로 기법 ID 목록을 기록한다.
- ⏸️ 사용자 확인: "이 조합으로 갈까요? 변경하고 싶은 부분이 있나요?"

### Stage 3 — Architecture Design (코드 없음)
- 설계 문서를 output/[project-name]/design-doc.md로 생성한다.
- 포함 항목: 프로젝트 컨셉(한 문단), 데이터 스키마, CSS 디자인 시스템("선택된 템플릿의 :root를 그대로 사용한다"고 명시), 색 배정 테이블(데이터 항목 → CSS 변수 매핑, 필수), HTML 레이아웃(템플릿 구조 기술), 인터랙션 흐름(단계별), 애니메이션 시퀀스(타이밍 + ease), 적용 이펙트 명세.
- 애니메이션·인터랙션 수치는 매칭된 COMBO 스펙의 레퍼런스에서 가져온다.
- ⏸️ 사용자 확인: "이 설계 문서를 리뷰해주세요. 수정할 부분이 있나요?"

### Stage 4 — Code Generation (3단계 분할)
- 4-A: 템플릿 복사. knowledge/templates/template-E-poster.html을
       output/[project-name]/index.html로 복사한 뒤 {{변수}}를 교체한다.
       템플릿의 :root CSS 변수·레이아웃·폰트는 절대 수정하지 않는다.
       프레임은 data-theme="light" 유지, #chart-slot만 dark background(#0B0B1A).
       차트 코드(SVG, script, chart CSS)는 #chart-slot 안에만 삽입한다.
       차트 CSS는 .chart-area 하위로 scope하여 프레임 CSS와 충돌 방지.
       data-layout은 기본 "portrait", 가로형 차트일 때만 "landscape".
  - ⏸️ 사용자 확인: "브라우저에서 열어서 레이아웃/색감을 확인해주세요."

- 4-B: 코어 시각화 로직. 테스트용 하드코딩 데이터 3~5개로 렌더링 확인.
       차트 코드의 색상은 COMBO 파일의 HEX가 아니라 design-doc.md의 색 배정 테이블을 따른다.
  - ⏸️ 사용자 확인: "시각화가 정상적으로 렌더링되나요?"
- 4-C: 실제 데이터 연결 + 인터랙션 로직(클릭/호버/전환).
  - ⏸️ 사용자 확인: "인터랙션이 의도대로 동작하나요?"

### Stage 5 — Polish
- knowledge/CHECKLIST.md를 순서대로 적용한다.
- Stage 2에서 기록한 nadieh_effects 기법 ID만 구현한다.
- SVG 콤보(2, 3, 4, 5, 6, 7, 8, 9): knowledge/NADIEH.md의 SVG 코드 사용.
- Three.js 콤보(1, 10): knowledge/NADIEH-THREEJS.md의 GLSL/PostProcess 코드 사용.
- 확장 기법(EX-1~8) 필요 시: knowledge/NADIEH-EXTENDED.md에서 해당 EX-N만 참조.
- 적용 항목: 로딩 시퀀스(GSAP timeline), Nadieh 이펙트, 마이크로인터랙션, 포스트프로세싱(해당 시), 반응형(1280px + 768px), 성능 최적화, 코드 정리.
- ⏸️ 사용자 확인: "최종 결과물을 확인해주세요."

## 참조 파일 (Lazy Loading)
상세 내용이 필요할 때만 read_file로 읽는다.
- 5단계 프로세스 상세: knowledge/PROCESS.md
- 조합 매칭 트리: knowledge/COMBOS-INDEX.md
- 조합별 상세 스펙: knowledge/combos/COMBO-[N]-[NAME].md (매칭된 것만 읽는다)
- Nadieh SVG 기법 + 선택 매트릭스: knowledge/NADIEH.md (Stage 2, 5)
- Nadieh Three.js GLSL 대응: knowledge/NADIEH-THREEJS.md (Stage 5, Three.js 콤보만)
- Nadieh 확장 기법: knowledge/NADIEH-EXTENDED.md (Stage 5, 필요한 EX-N만)
- 디자인 프리셋 (무드 참고용): knowledge/DESIGN.md
- 폴리싱 체크리스트: knowledge/CHECKLIST.md
- UI 템플릿: knowledge/templates/template-{A,B,C,D}.html (Stage 4-A에서 복사)

## 데이터 규칙
- 원본 데이터는 data/[project-name]/ 폴더에 저장한다.
- 출력물은 output/[project-name]/ 폴더에 저장한다.

## 출력 규칙
- 모든 출력물은 output/[project-name]/ 폴더에 저장한다.
- 최종 시각화는 반드시 단일 index.html 파일이다.
- 외부 라이브러리는 CDN으로만 로드한다 (npm/빌드 도구 사용 금지).
- 이미지/데이터는 인라인(base64 또는 JS 객체)으로 포함한다.

## 트리거 키워드
- `new [name]`: 프로젝트 시작
  1. data/[name]/ 확인 — 이미 존재하면 그 안의 데이터 사용, 없으면 폴더 생성
  2. output/[name]/ 생성 (없을 때만)
  3. Stage 1 시작
- `next` → 현재 Stage 완료 처리, 다음 Stage로 이동
- `status` → todo.md 읽고 현재 진행 상태 보고
- `polish` → Stage 5 직접 진입
- `memory` → memory.md 읽고 현재까지 학습 내용 보고
