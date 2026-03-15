/* ════════════════════════════════════════════════════
   globe.js — The Hidden Grid
   Three.js globe: earth + atmosphere + points + arcs
   ════════════════════════════════════════════════════ */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

/* ── Constants ── */
const R = 100;
const FOSSIL = new Set(['coal', 'gas', 'oil_other']);

// Representative geographic positions for energy source arc origins
const SRC_GEO = {
  coal:       { lat: -28, lng: 135 },   // Australia coal belt
  gas:        { lat: 62,  lng: 60  },   // Russia/Central Asia
  solar_wind: { lat: 28,  lng: -8  },   // North Africa solar belt
  hydro:      { lat: -5,  lng: -58 },   // Brazil/Amazon
  nuclear:    { lat: 47,  lng: 2   },   // France
  oil_other:  { lat: 24,  lng: 50  },   // Persian Gulf
};

/* ── Module state ── */
let scene, camera, renderer, composer, controls, clock;
let globeGroup, pointsMesh;
let arcMeshes = [], arcMats = [];
let animId = null;
let _onResize;

/* ── Helpers ── */
function latLngToVec3(lat, lng, r = R) {
  const phi   = (90 - lat) * Math.PI / 180;
  const theta = (lng + 180) * Math.PI / 180;
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta)
  );
}

/* ── Earth sphere ── */
function buildEarth() {
  const geo = new THREE.SphereGeometry(R, 64, 64);
  const mat = new THREE.MeshBasicMaterial({ color: 0x111118 });
  const mesh = new THREE.Mesh(geo, mat);
  globeGroup.add(mesh);

  new THREE.TextureLoader().load(
    'https://unpkg.com/three-globe/example/img/earth-dark.jpg',
    tex => {
      mat.map = tex;
      mat.color.setRGB(0.22, 0.22, 0.28);
      mat.needsUpdate = true;
    }
  );
}

/* ── Atmosphere (Fresnel) ── */
function buildAtmosphere() {
  const geo = new THREE.SphereGeometry(R + 1, 32, 32);
  const mat = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vN;
      varying vec3 vP;
      void main(){
        vN = normalize(normalMatrix * normal);
        vP = (modelViewMatrix * vec4(position,1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }`,
    fragmentShader: `
      varying vec3 vN;
      varying vec3 vP;
      void main(){
        float f = pow(1.0 - dot(normalize(-vP), vN), 3.0);
        gl_FragColor = vec4(0.102, 0.227, 0.361, f * 0.3);
      }`,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false,
  });
  globeGroup.add(new THREE.Mesh(geo, mat));
}

/* ── 7 Region points ── */
function buildPoints(regions) {
  const pos = [], sizes = [];
  const pr = Math.min(window.devicePixelRatio, 2);

  regions.forEach(r => {
    const v = latLngToVec3(r.lat, r.lng, R + 0.5);
    pos.push(v.x, v.y, v.z);
    // spec: 1 + (twh/183)*3  →  range 1‑4
    // multiply by pr so gl_PointSize stays in device px
    sizes.push((1 + (r.twh / 183) * 3) * pr);
  });

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('aSize',    new THREE.Float32BufferAttribute(sizes, 1));

  const mat = new THREE.ShaderMaterial({
    vertexShader: `
      attribute float aSize;
      void main(){
        vec4 mv = modelViewMatrix * vec4(position,1.0);
        gl_PointSize = aSize * (300.0 / -mv.z);
        gl_Position  = projectionMatrix * mv;
      }`,
    fragmentShader: `
      void main(){
        float d = length(gl_PointCoord - 0.5) * 2.0;
        float a = 1.0 - smoothstep(0.0, 1.0, d);
        gl_FragColor = vec4(0.667, 0.867, 1.0, a * 0.8);
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  pointsMesh = new THREE.Points(geo, mat);
  globeGroup.add(pointsMesh);
}

/* ── 15 Arcs (top layer-1 sankey links) ── */
function buildArcs(data) {
  const srcIds = new Set(data.energy_sources.map(s => s.id));
  const rgnMap = {};
  data.regions.forEach(r => { rgnMap[r.id] = r; });

  const top15 = data.sankey_links
    .filter(l => srcIds.has(l.source))
    .sort((a, b) => b.value - a.value)
    .slice(0, 15);

  top15.forEach(link => {
    const sg = SRC_GEO[link.source];
    const rg = rgnMap[link.target];
    if (!sg || !rg) return;

    const start = latLngToVec3(sg.lat, sg.lng, R);
    const end   = latLngToVec3(rg.lat, rg.lng, R);
    const mid   = start.clone().add(end).multiplyScalar(0.5);
    mid.normalize().multiplyScalar(R + Math.max(20, link.value * 0.3));

    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const geo   = new THREE.TubeGeometry(curve, 64, 0.4, 8, false);
    const color = FOSSIL.has(link.source)
      ? new THREE.Color(0xff4466)
      : new THREE.Color(0x00ffd5);

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:         { value: 0 },
        uDrawProgress: { value: 1.0 },
        uColor:        { value: color },
      },
      vertexShader: `
        varying float vT;
        void main(){
          vT = uv.x;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }`,
      fragmentShader: `
        uniform float uTime;
        uniform float uDrawProgress;
        uniform vec3  uColor;
        varying float vT;
        void main(){
          if(vT > uDrawProgress) discard;
          vec3 c = uColor;
          float alpha = 0.6;
          /* pulse: white band travelling along arc */
          float p = fract(uTime * 0.5);
          float dist = min(abs(vT - p), 1.0 - abs(vT - p));
          float pulse = smoothstep(0.05, 0.0, dist);
          c = mix(c, vec3(1.0), pulse * 0.5);
          gl_FragColor = vec4(c, alpha);
        }`,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geo, mat);
    globeGroup.add(mesh);
    arcMeshes.push(mesh);
    arcMats.push(mat);
  });
}

/* ── Render loop ── */
function render() {
  animId = requestAnimationFrame(render);
  controls.update();
  const t = clock.getElapsedTime();
  arcMats.forEach(m => { m.uniforms.uTime.value = t; });
  composer.render();
}

/* ── Resize ── */
function onResize() {
  const el = renderer.domElement.parentElement;
  if (!el) return;
  const w = el.clientWidth, h = el.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  composer.setSize(w, h);
}

/* ════════════════ Public API ════════════════ */

export function initGlobe(container, data) {
  clock = new THREE.Clock();
  const canvas = container.querySelector('canvas') || container;
  const w = container.clientWidth;
  const h = container.clientHeight;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
  camera.position.set(0, 0, 300);

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x050510, 1);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom   = false;
  controls.enablePan    = false;
  controls.autoRotate   = true;
  controls.autoRotateSpeed = 0.3;
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(
    new UnrealBloomPass(new THREE.Vector2(w, h), 0.8, 0.4, 0.85)
  );

  globeGroup = new THREE.Group();
  scene.add(globeGroup);

  buildEarth();
  buildAtmosphere();
  buildPoints(data.regions);
  buildArcs(data);

  _onResize = onResize;
  window.addEventListener('resize', _onResize);

  return { scene, camera, renderer, composer };
}

export function startRender() {
  if (!animId) render();
}

export function stopRender() {
  if (animId) { cancelAnimationFrame(animId); animId = null; }
}

export function updateSceneProgress(p) {
  if (!globeGroup) return;

  if (p < 0.2) {
    /* entry + draw-in */
    const t = p / 0.2;
    globeGroup.scale.setScalar(0.5 + t * 0.5);
    arcMats.forEach((m, i) => {
      const delay = (i / arcMats.length) * 0.4;
      m.uniforms.uDrawProgress.value = Math.max(0, Math.min(1, (t - delay) / (1 - delay)));
    });
  } else if (p < 0.4) {
    globeGroup.scale.setScalar(1);
    controls.autoRotate = true;
    arcMats.forEach(m => { m.uniforms.uDrawProgress.value = 1; });
  } else if (p < 0.6) {
    controls.autoRotate = false;
  } else if (p >= 0.8) {
    const t = (p - 0.8) / 0.2;
    arcMeshes.forEach(m => { m.visible = t < 1; });
  }
}

export function setScenario(name) {
  const s = {
    base:       { twh: 945,  clean: 0.45 },
    liftoff:    { twh: 1300, clean: 0.35 },
    efficiency: { twh: 750,  clean: 0.60 },
  }[name];
  if (!s) return;
  /* TODO: animate point sizes + arc colours per scenario */
}

export function dispose() {
  stopRender();
  if (_onResize) window.removeEventListener('resize', _onResize);
  controls?.dispose();
  renderer?.dispose();
  composer?.passes.forEach(p => p.dispose?.());
  scene?.traverse(o => {
    o.geometry?.dispose();
    if (o.material) {
      o.material.map?.dispose();
      o.material.dispose();
    }
  });
}
