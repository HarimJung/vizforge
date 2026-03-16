> ⚠️ DEPRECATED — Stage 4에서 이 파일의 CSS 변수를 직접 사용하지 않는다.
> 색상·폰트·여백의 최종 권한은 knowledge/templates/template-{A~D}.html의 :root이다.
> 이 파일은 Stage 2에서 무드 키워드 참고용으로만 읽는다.

# Design Presets — 무드별 CSS 변수 시스템

## 사용법
Stage 2에서 데이터 도메인에 따라 무드 키워드가 매칭된다.
무드 키워드는 Stage 3 design-doc.md의 컨셉 문단 톤 설정에만 참고한다.
이 파일의 CSS 변수, 폰트, 색상은 Stage 3~5에서 출력에 사용하지 않는다.
실제 출력의 색상·폰트·여백은 선택된 템플릿(knowledge/templates/)의 :root가 최종 권한이다.


---

## PRESET: command-center
매칭: 지정학, 글로벌, 위기, 군사, 이주, 난민

  :root {
    --bg-deep: #050510;
    --bg-card: rgba(255, 255, 255, 0.03);
    --bg-card-hover: rgba(255, 255, 255, 0.06);
    --border-subtle: rgba(255, 255, 255, 0.06);
    --border-hover: rgba(255, 255, 255, 0.12);
    --accent-1: #00ffd5;
    --accent-2: #ff4466;
    --accent-3: #ffd93d;
    --text-1: #ffffff;
    --text-2: #88ccff;
    --text-3: #556677;
    --text-muted: #334455;
    --font-display: 'Bebas Neue', sans-serif;
    --font-mono: 'Space Mono', monospace;
    --font-body: 'Inter', sans-serif;
    --font-label: 'JetBrains Mono', monospace;
  }


---

## PRESET: documentary
매칭: 사회, 문화, 인문, 교육, 인물

  :root {
    --bg-deep: #fafaf8;
    --bg-card: rgba(0, 0, 0, 0.02);
    --bg-card-hover: rgba(0, 0, 0, 0.04);
    --border-subtle: rgba(0, 0, 0, 0.08);
    --border-hover: rgba(0, 0, 0, 0.15);
    --accent-1: #e63946;
    --accent-2: #457b9d;
    --accent-3: #2a9d8f;
    --text-1: #1d1d1f;
    --text-2: #444444;
    --text-3: #888888;
    --text-muted: #bbbbbb;
    --font-display: 'Space Grotesk', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
    --font-body: 'Inter', sans-serif;
    --font-label: 'JetBrains Mono', monospace;
  }


---

## PRESET: clean-dark
매칭: 금융, 비즈니스, SaaS, 경제

  :root {
    --bg-deep: #0f0f14;
    --bg-card: rgba(255, 255, 255, 0.04);
    --bg-card-hover: rgba(255, 255, 255, 0.07);
    --border-subtle: rgba(255, 255, 255, 0.08);
    --border-hover: rgba(255, 255, 255, 0.15);
    --accent-1: #4ecdc4;
    --accent-2: #ff6b6b;
    --accent-3: #ffd93d;
    --text-1: #ffffff;
    --text-2: #aaaacc;
    --text-3: #666688;
    --text-muted: #444455;
    --font-display: 'Bebas Neue', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
    --font-body: 'Inter', sans-serif;
    --font-label: 'JetBrains Mono', monospace;
  }


---

## PRESET: organic
매칭: 환경, 자연, 기후, 에너지, 농업

  :root {
    --bg-deep: #0a1a0a;
    --bg-card: rgba(255, 255, 255, 0.03);
    --bg-card-hover: rgba(255, 255, 255, 0.06);
    --border-subtle: rgba(255, 255, 255, 0.06);
    --border-hover: rgba(255, 255, 255, 0.12);
    --accent-1: #53bf9d;
    --accent-2: #f4a261;
    --accent-3: #e76f51;
    --text-1: #e8e8e0;
    --text-2: #a8c4a0;
    --text-3: #5a7a52;
    --text-muted: #3a4a32;
    --font-display: 'Space Grotesk', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
    --font-body: 'Inter', sans-serif;
    --font-label: 'JetBrains Mono', monospace;
  }


---

## PRESET: neo-terminal
매칭: 기술, AI, 데이터 과학, 사이버보안

  :root {
    --bg-deep: #0a0a0a;
    --bg-card: rgba(255, 255, 255, 0.02);
    --bg-card-hover: rgba(255, 255, 255, 0.05);
    --border-subtle: rgba(0, 255, 100, 0.08);
    --border-hover: rgba(0, 255, 100, 0.2);
    --accent-1: #00ff64;
    --accent-2: #bf5af2;
    --accent-3: #ff453a;
    --text-1: #e0e0e0;
    --text-2: #00ff64;
    --text-3: #555555;
    --text-muted: #333333;
    --font-display: 'Space Mono', monospace;
    --font-mono: 'JetBrains Mono', monospace;
    --font-body: 'Inter', sans-serif;
    --font-label: 'JetBrains Mono', monospace;
  }


---

## 타이포그래피 위계 (모든 프리셋 공통)

용도            | 폰트                  | 사이즈  | 두께 | 색상변수   | 비고
KPI 숫자        | var(--font-display)   | 48px   | bold | --text-1  |
섹션 타이틀      | var(--font-display)   | 28px   | bold | --text-1  |
차트 타이틀      | var(--font-body)      | 16px   | 600  | --text-1  |
섹션 라벨       | var(--font-label)     | 10px   | 500  | --text-2  | uppercase, letter-spacing 0.15em
데이터 라벨      | var(--font-body)      | 12px   | 500  | --text-2  |
축 텍스트       | var(--font-body)      | 11px   | 400  | --text-3  |
본문            | var(--font-body)      | 14px   | 400  | --text-2  | line-height 1.6
캡션/크레딧      | var(--font-body)      | 11px   | 400  | --text-muted |


---

## 공통 UI 컴포넌트 스타일

### 패널/카드

  .panel {
    background: var(--bg-card);
    border: 1px solid var(--border-subtle);
    border-radius: 8px;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    padding: 16px 20px;
  }
  .panel:hover {
    border-color: var(--border-hover);
  }

### 툴팁

  .tooltip {
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    padding: 8px 12px;
    font: 12px var(--font-body);
    color: var(--text-1);
    pointer-events: none;
  }

### 버튼

  .btn {
    background: transparent;
    border: 1px solid var(--border-subtle);
    border-radius: 4px;
    padding: 6px 14px;
    font: 11px var(--font-label);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-2);
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .btn:hover {
    border-color: var(--accent-1);
    color: var(--accent-1);
  }
  .btn.active {
    background: var(--accent-1);
    color: var(--bg-deep);
    border-color: var(--accent-1);
  }
