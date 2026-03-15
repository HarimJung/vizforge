# VizForge

데이터를 넣으면 수상작급 단일 HTML 시각화를 만들어주는 Claude Code 프로젝트.

## 사용법

1. 이 폴더 루트에서 claude 실행
2. new [프로젝트명] 입력 후 데이터 파일 첨부
3. 5단계 프로세스를 따라 진행 (각 단계 후 확인)
4. 결과물: output/[프로젝트명]/index.html

## 트리거
- new [이름] — 새 프로젝트 시작
- next — 다음 단계
- status — 진행 상태 확인
- polish — Stage 5 직접 진입
- memory — 학습 기록 확인

## 파일 구조
- CLAUDE.md — 시스템 규칙 (Claude가 매번 읽음)
- knowledge/ — 상세 지식 (필요할 때만 읽음)
- output/ — 생성된 시각화