# Nadieh 기법 — Three.js / GLSL 대응

Stage 5에서 Three.js 콤보(1, 10)일 때만 읽는다.
SVG 원본 → NADIEH.md / 확장 기법 → NADIEH-EXTENDED.md


---
## 공통 셋업
---

Post-Processing 기본:
```javascript
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { AfterimagePass } from 'three/addons/postprocessing/AfterimagePass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
Progress Attribute (아크/링크 vertex에 0~1 부여):

Copyfunction addProgressAttribute(geometry) {
  const count = geometry.attributes.position.count;
  const progress = new Float32Array(count);
  for (let i = 0; i < count; i++) progress[i] = i / (count - 1);
  geometry.setAttribute('aProgress', new THREE.BufferAttribute(progress, 1));
}
공통 Vertex Shader (G1, G3, G5, F5 공유):

Copyattribute float aProgress;
varying float vProgress;
void main() {
  vProgress = aProgress;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
G1. Linear Gradient
Copyuniform vec3 uColor1; // #00ffd5
uniform vec3 uColor2; // #ff4466
varying float vProgress;
void main() {
  gl_FragColor = vec4(mix(uColor1, uColor2, vProgress), 1.0);
}
파라미터: uColor1/2 → DESIGN.md 토큰. 3색이면 step() 2개로 구간 분리.

G2. Radial Gradient
Point Sprite용 fragment:

Copyvarying vec3 vColor;
void main() {
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;
  float lightDist = length(gl_PointCoord - vec2(0.35));
  float brightness = 1.0 + 0.5 * (1.0 - smoothstep(0.0, 0.6, lightDist));
  float alpha = smoothstep(0.5, 0.15, dist);
  gl_FragColor = vec4(vColor * brightness, alpha);
}
광원 vec2(0.35) = SVG cx/cy 35%. brightness 0.5 = brighter(0.5).

G3. Orientation Gradient
Copyuniform vec3 uSourceColor;
uniform vec3 uTargetColor;
uniform float uOpacity; // 0.55
varying float vProgress;
void main() {
  gl_FragColor = vec4(mix(uSourceColor, uTargetColor, vProgress), uOpacity);
}
Copyfunction createLinkMaterial(srcColor, tgtColor) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uSourceColor: { value: new THREE.Color(srcColor) },
      uTargetColor: { value: new THREE.Color(tgtColor) },
      uOpacity: { value: 0.55 }
    },
    vertexShader: COMMON_VERT,
    fragmentShader: fragG3,
    transparent: true, depthWrite: false
  });
}
G4. Abrupt Gradient
Copyuniform float uThreshold; // 예: 0.4
uniform vec3 uColorA;     // clean
uniform vec3 uColorB;     // fossil
varying float vProgress;
void main() {
  vec3 col = mix(uColorB, uColorA, step(uThreshold, vProgress));
  gl_FragColor = vec4(col, 1.0);
}
부드럽게: step() → smoothstep(uThreshold-0.02, uThreshold+0.02, vProgress)

G5. Animated Flow
Copyuniform float uTime;
uniform vec3 uBaseColor;
uniform vec3 uPulseColor;
uniform float uPulseWidth; // 0.05
uniform float uPulseSpeed; // 0.5
varying float vProgress;
void main() {
  float pulse = smoothstep(uPulseWidth, 0.0, abs(vProgress - fract(uTime * uPulseSpeed)));
  vec3 col = mix(uBaseColor, uPulseColor, pulse);
  gl_FragColor = vec4(col, 0.6 + pulse * 0.3);
}
JS: mat.uniforms.uTime.value = clock.getElapsedTime(); Speed: 0.3(느림)~1.0(빠름). Width: 0.03(날카로움)~0.1(넓음).

F1. Glow → UnrealBloomPass
Copyconst bloom = new UnrealBloomPass(
  new THREE.Vector2(innerWidth, innerHeight),
  0.8,  // strength (SVG stdDev 3.5 ≈ 0.8)
  0.4,  // radius
  0.85  // threshold
);
composer.addPass(bloom);
변환: stdDev 2~4→str 0.3~0.6 / 3.5→0.8 / 58→1.01.5 Hover: gsap.to(bloom, { strength: 1.5, duration: 0.3 })

F2. Motion Blur → AfterimagePass
Copyconst after = new AfterimagePass();
after.uniforms['damp'].value = 0.0; // 기본 OFF
composer.addPass(after);
이동 시: gsap.to(after.uniforms['damp'], { value: 0.92, duration: 0.3 }) 정지 시: gsap.to(after.uniforms['damp'], { value: 0.0, duration: 0.8 }) 변환: stdDev 4→damp 0.75 / 8→0.9 / 12+→0.95. 절대 1.0 금지.

F3. Gooey → Metaball Post-Process
Copyconst GooeyShader = {
  uniforms: {
    tDiffuse: { value: null },
    uBlurSize: { value: 10.0 },
    uAlphaContrast: { value: 19.0 },
    uAlphaOffset: { value: -9.0 }
  },
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uBlurSize, uAlphaContrast, uAlphaOffset;
    varying vec2 vUv;
    void main() {
      vec4 sum = vec4(0.0); float total = 0.0;
      for (float x=-2.0; x<=2.0; x+=1.0)
        for (float y=-2.0; y<=2.0; y+=1.0) {
          float w = exp(-(x*x+y*y)/(2.0*uBlurSize));
          sum += texture2D(tDiffuse, vUv+vec2(x,y)/resolution)*w;
          total += w;
        }
      vec4 b = sum/total;
      float a = clamp(b.a*uAlphaContrast+uAlphaOffset, 0.0, 1.0);
      gl_FragColor = vec4(texture2D(tDiffuse,vUv).rgb, a);
    }
  `
};
composer.addPass(new ShaderPass(GooeyShader));
약함: 6,-3 / 기본: 19,-9 / 강함: 25,-12

F4. Color Blending
Copy// dark theme: screen → AdditiveBlending
material.blending = THREE.AdditiveBlending;
material.transparent = true;
material.opacity = 0.7;
material.depthWrite = false;

// light theme: multiply → MultiplyBlending
// overlay → CustomBlending:
mat.blendSrc = THREE.DstColorFactor;
mat.blendDst = THREE.SrcColorFactor;
핵심: depthWrite: false 필수.

F5. Draw-in → GLSL discard
Copyuniform float uDrawProgress; // 0→1
uniform vec3 uColor;
varying float vProgress;
void main() {
  if (vProgress > uDrawProgress) discard;
  float tip = smoothstep(uDrawProgress, uDrawProgress - 0.05, vProgress);
  gl_FragColor = vec4(uColor, tip);
}
Copygsap.to(mat.uniforms.uDrawProgress, { value: 1, duration: 1.5, ease: "power2.out" });
// stagger: arcs.forEach((a,i) => gsap.to(a.mat..., { delay: i*0.05 }));
tipFade: 0.05(날카로움)~0.15(부드러움)