# Nadieh 확장 기법 — 포트폴리오 30개 분석 기반

Stage 5에서 필요한 EX-N만 참조. 전부 읽지 말 것.
기본 기법 → NADIEH.md (SVG), NADIEH-THREEJS.md (GLSL)


---
## EX-1. Voronoi Treemap (COMBO-9)
---

라이브러리: d3-voronoi-treemap v1.1.1

```javascript
const root = d3.hierarchy(data).sum(d => d.value);

// 원형 클리핑 (64각형)
const clip = d3.range(64).map(i => [
  cx + r * Math.cos((i/64)*2*Math.PI),
  cy + r * Math.sin((i/64)*2*Math.PI)
]);

d3VoronoiTreemap.voronoiTreemap()
  .clip(clip).convergenceRatio(0.001).maxIterationCount(100)(root);

// 셀
svg.selectAll('.cell').data(root.leaves()).enter().append('path')
  .attr('d', d => 'M'+d.polygon.join('L')+'Z')
  .attr('fill', d => `url(#rg-${d.data.id})`) // G2 적용
  .attr('stroke','#fff').attr('stroke-width',0.5).attr('opacity',0);

gsap.to(cells.nodes(), { opacity:1, duration:0.8,
  stagger:{each:0.03,from:'center'}, ease:'power2.out' });
부모 경계: depth===1 필터, stroke-width 2 라벨: polygonArea > 800px²만 표시 팔레트: ['#4ecdc4','#ff6b6b','#45b7d1','#fed766','#2ab7ca','#fe4a49','#a29bfe','#fd79a8']

EX-2. Arc Swoosh (COMBO-1, 10)
Copyfunction latLngToVec3(lat, lng, r) {
  const phi=(90-lat)*Math.PI/180, theta=(lng+180)*Math.PI/180;
  return new THREE.Vector3(
    -r*Math.sin(phi)*Math.cos(theta), r*Math.cos(phi), r*Math.sin(phi)*Math.sin(theta)
  );
}

function createGlobeArc(start, end, height, seg=64) {
  const mid = new THREE.Vector3().addVectors(start,end).multiplyScalar(0.5);
  mid.normalize().multiplyScalar(start.length()+height);
  const geo = new THREE.BufferGeometry().setFromPoints(
    new THREE.QuadraticBezierCurve3(start,mid,end).getPoints(seg)
  );
  addProgressAttribute(geo);
  return geo;
}
Material: G5 shader + AdditiveBlending(F4) arcHeight: Math.max(20, d.value*0.3). 최대 20개.

EX-3. Contour Shader (COMBO-1, 10)
Globe 표면 등고선:

Copyuniform float uContourCount;   // 20
uniform float uContourOpacity; // 0.08
uniform float uContourWidth;   // 0.003
uniform sampler2D uElevationMap;
varying vec2 vUv;
void main() {
  float e = texture2D(uElevationMap, vUv).r;
  float line = smoothstep(uContourWidth, 0.0,
    abs(fract(e*uContourCount)-0.5)-0.5+uContourWidth);
  vec3 col = mix(vec3(0.02,0.02,0.06), vec3(0.0,1.0,0.84), line*uContourOpacity);
  gl_FragColor = vec4(col, 1.0);
}
Count: 10~30. Opacity: 0.05~0.15. Width: 0.002~0.005.

EX-4. Streamgraph + Bump (COMBO-8)
Copyconst stack = d3.stack().keys(categories)
  .offset(d3.stackOffsetWiggle).order(d3.stackOrderInsideOut);
const area = d3.area()
  .x(d=>xScale(d.data.year)).y0(d=>yScale(d[0])).y1(d=>yScale(d[1]))
  .curve(d3.curveBasis);
// Bump 오버레이
const line = d3.line().x(d=>xScale(d.year)).y(d=>rankScale(d.rank))
  .curve(d3.curveBumpX);
EX-5. Polar/Radial (COMBO-8, 10)
Copyconst angle = d3.scaleLinear().domain([0,24]).range([0,2*Math.PI]);
const radius = d3.scaleLinear().domain([0,max]).range([innerR,outerR]);
const radialArea = d3.areaRadial()
  .angle(d=>angle(d.hour)).innerRadius(innerR)
  .outerRadius(d=>radius(d.value))
  .curve(d3.curveCardinalClosed.tension(0.7));
// 평균선: circle r=radius(avg), stroke=#ffd93d, dasharray 4 4
EX-6. Scrollama (COMBO-3, 10)
Copyscrollama().setup({ step:'.scroll-step', offset:0.5, progress:true })
  .onStepEnter(({index,direction}) => updateScene(index,direction))
  .onStepProgress(({index,progress}) => interpolateScene(index,progress));
CSS: .scroll-graphic { position:sticky; top:0; height:100vh; } .scroll-step { min-height:80vh; padding:2rem; }

EX-7. Network Community (COMBO-6)
Copy// 커뮤니티 원형 배치
const centers = communities.map((c,i) => ({
  x: cx+R*Math.cos((i/communities.length)*2*Math.PI),
  y: cy+R*Math.sin((i/communities.length)*2*Math.PI)
}));
const sim = d3.forceSimulation(nodes)
  .force('link', d3.forceLink(links).id(d=>d.id).distance(30))
  .force('charge', d3.forceManyBody().strength(-50))
  .force('cx', d3.forceX(d=>centers[d.community].x).strength(0.3))
  .force('cy', d3.forceY(d=>centers[d.community].y).strength(0.3))
  .force('collide', d3.forceCollide(d=>d.radius+2));
Hover: connected set → opacity 1/0.1, links 0.8/0.05

EX-8. Progressive Disclosure (COMBO-4, 10)
Copy// Phase 1: 노드/아크 (0s)
gsap.from(arcs.nodes(), { attr:{d:emptyArc}, duration:1, stagger:0.05 });
// Phase 2: 링크/리본 (1.5s)
gsap.from(ribbons.nodes(), { opacity:0, duration:1.2, stagger:0.03, delay:1.5 });
// Phase 3: 라벨+값 (3.0s)
gsap.from(labels.nodes(), { opacity:0, y:10, duration:0.6, stagger:0.04, delay:3.0 });
원칙: 한 번에 한 레이어만. 이전 레이어 이해 후 다음 공개.


---

## 기존 `NADIEH.md` 수정

맨 끝에 **2줄만 추가**:

```markdown
→ Three.js GLSL 대응: NADIEH-THREEJS.md 참조
→ 확장 기법 (EX-1~8): NADIEH-EXTENDED.md 참조