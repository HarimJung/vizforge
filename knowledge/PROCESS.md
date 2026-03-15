# VizForge Process — 5단계 상세 정의

## Stage 1: Data Intake & Story Discovery

### 1-1. 데이터 수신
사용자가 데이터를 제공하면(CSV, JSON, URL, 또는 텍스트 설명) 다음을 수행한다.

대용량(100행 이상) 데이터는 직접 Context에 로드하지 않는다.
대신 Python 또는 Node.js 분석 스크립트를 작성하여 실행하고, 결과 요약만 사용한다.

분석 스크립트 출력 형식:
- 총 행 수, 컬럼 수
- 각 컬럼: 이름, 타입(numeric/categorical/temporal/geo/relational), 유니크 값 수, 결측률, 상위 5개 값
- 수치형 컬럼: min, max, mean, median
- 시간형 컬럼: 시작일, 종료일, 간격
- 지리형 컬럼: 국가/도시 수, 위경도 범위
- 관계형 컬럼: 소스-타겟 쌍 수, 상위 5개 흐름

### 1-2. 데이터 특성 분류
각 컬럼을 다음 태그로 분류한다:
- `numeric`: 연속 수치 (금액, 인구, 비율 등)
- `categorical`: 범주 (국가명, 산업, 유형 등)
- `temporal`: 시간 (연도, 월, 날짜 등)
- `geo-point`: 위경도 좌표
- `geo-region`: 국가명, 시도명 등 지역 식별자
- `source-target`: 출발-도착 쌍 (이민국-입국국, 수출-수입 등)
- `node-edge`: 네트워크 노드-엣지 구조
- `text`: 자유 텍스트

데이터셋 전체에 대해서도 태그를 부여한다:
- `has-flow`: source-target 컬럼 존재
- `has-geo`: geo-point 또는 geo-region 존재
- `has-time`: temporal 컬럼 존재
- `has-hierarchy`: 부모-자식 구조 존재
- `has-network`: node-edge 구조 존재
- `is-large`: 행 수 10만 이상

### 1-3. 스토리 후보 생성
데이터 태그 조합에 따라 스토리 유형을 도출한다:

- `has-flow` + `has-geo` → "어디에서 어디로: 글로벌 흐름 스토리"
- `has-time` + `numeric` → "시간에 따른 변화 스토리"
- `has-geo` + `numeric` → "지역 간 비교 스토리"
- `has-flow` (geo 없음) → "흐름/배분 스토리" (산키)
- `has-hierarchy` → "구조/구성 스토리" (트리맵)
- `has-network` → "관계/연결 스토리" (네트워크 그래프)
- `has-time` + `categorical` + `numeric` → "시간 경쟁 스토리" (레이스 바/버블)
- `numeric` 다수 + `categorical` → "다차원 비교 스토리" (대시보드)

각 스토리 후보에 대해:
- 핵심 질문 1개 (예: "한국 에너지는 어디서 와서 어디로 가는가?")
- 보조 질문 2개
- 추천 시각화 형태 힌트

를 사용자에게 제시하고 선택을 요청한다.

### 1-4. 데이터 정제
스토리가 선택되면:
- 필요한 컬럼만 추출
- 결측값 처리 (제거 또는 보간, 사용자에게 방식 확인)
- JSON 형태로 변환
- output/[project-name]/data.json으로 저장 (또는 index.html에 인라인할 크기면 변수로 준비)


## Stage 2: Visualization Matching

### 2-1. 조합 매칭
knowledge/COMBOS-INDEX.md를 read_file로 읽는다.
스토리 유형 + 데이터 태그를 기반으로 의사결정 트리에 따라 최적 조합을 결정한다.
매칭된 COMBO 파일(knowledge/combos/COMBO-[N]-[NAME].md)만 추가로 읽는다.

### 2-2. Nadieh 기법 매칭
knowledge/NADIEH.md의 기법 선택 매트릭스를 참조한다.
매칭된 콤보 번호 + 데이터 태그로 적용할 기법 ID를 추출한다.
결과를 `nadieh_effects: [G3, G5, F1, ...]` 형태로 기록한다.

기법 매칭 기본 규칙:
- 아크/라인 시각화 → F1(Glow) + F5(Draw-in) + G1(Linear)
- 링크/흐름 시각화 → G3(Orientation) + G5(Animated Flow)
- 버블/클러스터 → F3(Gooey) + G2(Radial)
- 겹치는 영역 → F4(Color Blending)
- 임계값 강조 → G4(Abrupt)
- 모든 조합 공통 → F1(Glow)

### 2-3. 디자인 무드 매칭
knowledge/DESIGN.md를 read_file로 읽는다.
데이터 도메인에 따라 프리셋을 매칭한다:

- 지정학/글로벌/위기 → "command-center" (다크 네이비 + 시안/마젠타)
- 사회/문화/인문 → "documentary" (오프화이트 + 모노톤 + 한 색 악센트)
- 금융/비즈니스 → "clean-dark" (차콜 + 블루/그린)
- 환경/자연/과학 → "organic" (딥그린 + 앰버)
- 기술/데이터/AI → "neo-terminal" (블랙 + 네온 그린/퍼플)

사용자에게 조합 + 기법 + 무드를 한 번에 제시하고 확인받는다.


## Stage 3: Architecture Design

### 3-1. 설계 문서 생성
output/[project-name]/design-doc.md에 다음 섹션을 작성한다.
이 단계에서는 코드를 한 줄도 쓰지 않는다.

#### 섹션 구성:
1. **컨셉** — 프로젝트 세계관을 한 문단으로. 무드, 톤, 비유.
2. **데이터 스키마** — JSON 구조 정의. 각 필드의 역할과 타입.
3. **CSS 디자인 시스템** — DESIGN.md 프리셋에서 가져온 변수 전체 (색상 8개+, 폰트 3종, 사이즈 위계).
4. **HTML 레이아웃** — CSS Grid 구조를 텍스트로 기술. 각 영역의 역할과 대략적 비율.
5. **인터랙션 흐름** — 사용자 행동 → 시스템 반응을 단계별로 기술.
6. **애니메이션 시퀀스** — 로딩 choreography, 전환 타이밍. GSAP ease와 duration 값 명시.
7. **적용 이펙트** — NADIEH.md에서 매칭된 기법들의 구체적 파라미터 값.
8. **레퍼런스 스펙** — 매칭된 COMBO 스펙에서 가져온 해당 조합의 수치 스펙 전체.

### 3-2. 사용자 리뷰
설계 문서를 사용자에게 제시하고, 수정 요청이 있으면 반영한다.
"패널 위치를 바꿔줘", "색을 더 따뜻하게", "차트 종류를 바꿔줘" 등.
설계가 확정되면 다음 Stage로.


## Stage 4: Code Generation

### 4-A: HTML + CSS 뼈대
- design-doc.md의 CSS 디자인 시스템과 HTML 레이아웃을 코드로 변환한다.
- JS는 한 줄도 없다. 순수 HTML + CSS만.
- Google Fonts CDN 로드, CSS 변수 정의, Grid 레이아웃, 패널 구조, 타이포그래피.
- 더미 텍스트/숫자로 각 패널을 채워서 레이아웃을 시각적으로 확인 가능하게.
- output/[project-name]/index.html로 저장.
- 사용자에게 "브라우저에서 열어서 레이아웃과 색감을 확인해주세요" 요청.

### 4-B: 코어 시각화 로직
- 선택된 라이브러리를 CDN으로 로드한다.
- 매칭된 COMBO 스펙에 명시된 파라미터를 정확히 따른다.
- 테스트용 하드코딩 데이터 3~5개로 렌더링이 정상 동작하는지 확인한다.
- 포스트프로세싱(Three.js인 경우)은 이 단계에서 포함한다.
- 사용자에게 "시각화가 정상 렌더링되나요?" 확인.

### 4-C: 데이터 연결 + 인터랙션
- Stage 1에서 정제한 실제 데이터를 연결한다.
- design-doc.md의 인터랙션 흐름에 따라 클릭/호버/전환 로직을 구현한다.
- 사용자에게 "인터랙션이 의도대로 동작하나요?" 확인.


## Stage 5: Polish

knowledge/CHECKLIST.md를 read_file로 읽고 순서대로 적용한다.

Nadieh 기법 적용 절차:
1. Stage 2에서 기록한 nadieh_effects 기법 ID 목록을 확인한다.
2. SVG 콤보(2, 3, 4, 5, 6, 7, 8, 9) → knowledge/NADIEH.md의 SVG 코드 사용.
3. Three.js 콤보(1, 10) → knowledge/NADIEH-THREEJS.md의 GLSL/PostProcess 코드 사용.
4. 확장 기법(EX-1~8) 필요 시 → knowledge/NADIEH-EXTENDED.md에서 해당 EX-N만 참조.
5. 기록된 ID에 해당하는 기법만 구현한다. 기록에 없는 기법은 적용하지 않는다.

모든 항목을 적용한 후 사용자에게 최종 확인을 요청한다.
완료되면 memory.md에 이 프로젝트에서 배운 점을 기록한다.
