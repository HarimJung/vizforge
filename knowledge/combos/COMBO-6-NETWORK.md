> ⚠️ 이 파일의 HEX 색상·폰트·배경색은 참고용이다. 실제 출력은 선택된 템플릿의 :root CSS 변수를 사용한다. Three.js scene.background 등 3D 환경색만 예외.
# COMBO-6: Network Graph

## 라이브러리 (노드 수 분기)
- 수백 이하: D3.js v7 + d3-force
- 수천: Cytoscape.js `<script src="https://cdn.jsdelivr.net/npm/cytoscape"></script>`
- 수만+: Sigma.js v2

## 적용 Nadieh 기법
- glow filter (선택 노드)
- radial gradient (노드 3D 느낌)
- mix-blend-mode (엣지 겹침)

## 레퍼런스 스펙

### D3-Force 설정
- alpha: 1, alphaDecay: 0.02, velocityDecay: 0.3
- forceManyBody strength: -120
- forceLink distance: 80, strength: 0.7
- forceCollide: 노드 크기 + 5

### 색상
- 배경: #08090c
- 노드: 카테고리별, radialGradient (brighter→base→darker)
- 엣지: #333344 opacity 0.3, 선택 시 노드색 opacity 0.8
- 선택 노드: glow stdDeviation 4

### 타이포그래피
- 노드 라벨: Inter 10px #aaaaaa (줌 레벨에 따라 표시/숨김)
- 선택 노드: Inter 13px bold #ffffff
- 패널: Inter 14px #cccccc

### 인터랙션
- 노드 클릭: 이웃 노드 + 연결 엣지 하이라이트, 나머지 opacity 0.05
- 더블 클릭: 해당 노드 중심으로 줌
- 검색: 노드 이름 필터, 매칭 노드 하이라이트
- 드래그: 노드 위치 고정/해제

### 애니메이션
- 로딩: 시뮬레이션 alpha 1→0 (자연 안정화 ~3s)
- 노드 등장: scale 0→1 stagger 0.02s
- 선택 전환: 하이라이트/디밍 0.3s power2.out
