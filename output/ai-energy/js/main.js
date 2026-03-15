/* ════════════════════════════════════════════════════
   main.js — The Hidden Grid
   Data + Scrollama 4-scene orchestration + fade transitions
   ════════════════════════════════════════════════════ */

import {
  initGlobe, startRender, stopRender,
  updateSceneProgress, setScenario,
} from './globe.js';

import {
  initSankey, playEntrance,
  show as showSankey, hide as hideSankey,
} from './sankey.js';

/* ══════════════════ Inline Data ══════════════════ */
const DATA = {
  meta: {
    title: "The Hidden Grid — AI가 삼키는 전력",
    subtitle: "Global Data Center Energy Flow 2024",
    year: 2024, total_twh: 415, projection_2030_twh: 945,
  },
  regions: [
    { id:"us",    name_en:"United States",  lat:39.8, lng:-98.5,  twh:183, dc_count:5427, top_hub:"Virginia" },
    { id:"cn",    name_en:"China",          lat:35.0, lng:105.0,  twh:104, dc_count:449,  top_hub:"Beijing-Hebei" },
    { id:"eu",    name_en:"Europe",         lat:50.1, lng:9.0,    twh:62,  dc_count:3300, top_hub:"Frankfurt" },
    { id:"ie",    name_en:"Ireland",        lat:53.4, lng:-7.7,   twh:5.3, dc_count:82,   top_hub:"Dublin" },
    { id:"jp_kr", name_en:"Japan & Korea",  lat:36.0, lng:135.0,  twh:21,  dc_count:350,  top_hub:"Tokyo/Seoul" },
    { id:"sea",   name_en:"Southeast Asia", lat:5.0,  lng:108.0,  twh:17,  dc_count:290,  top_hub:"Singapore" },
    { id:"other", name_en:"Rest of World",  lat:0,    lng:25.0,   twh:23,  dc_count:null, top_hub:null },
  ],
  energy_sources: [
    { id:"coal",       name_en:"Coal",         twh:125, pct:30.1, color:"#d62828" },
    { id:"gas",        name_en:"Natural Gas",  twh:108, pct:26.0, color:"#f77f00" },
    { id:"solar_wind", name_en:"Solar & Wind", twh:78,  pct:18.8, color:"#53bf9d" },
    { id:"hydro",      name_en:"Hydro",        twh:34,  pct:8.2,  color:"#457b9d" },
    { id:"nuclear",    name_en:"Nuclear",      twh:62,  pct:14.9, color:"#e9c46a" },
    { id:"oil_other",  name_en:"Oil & Other",  twh:8,   pct:1.9,  color:"#6c5ce7" },
  ],
  dc_usage: [
    { id:"ai_training",  name_en:"AI Training",          twh:8,   pct:1.9  },
    { id:"ai_inference", name_en:"AI Inference",          twh:44,  pct:10.6 },
    { id:"cloud_saas",   name_en:"Cloud & SaaS",         twh:138, pct:33.3 },
    { id:"enterprise",   name_en:"Enterprise IT",        twh:76,  pct:18.3 },
    { id:"cooling",      name_en:"Cooling",              twh:100, pct:24.1 },
    { id:"infra_loss",   name_en:"Infrastructure & Loss",twh:49,  pct:11.8 },
  ],
  sankey_links: [
    { source:"coal", target:"cn", value:72.8 },
    { source:"coal", target:"us", value:27.5 },
    { source:"coal", target:"sea", value:10.2 },
    { source:"coal", target:"jp_kr", value:6.3 },
    { source:"coal", target:"other", value:8.2 },
    { source:"gas", target:"us", value:73.2 },
    { source:"gas", target:"eu", value:18.6 },
    { source:"gas", target:"jp_kr", value:8.4 },
    { source:"gas", target:"cn", value:4.2 },
    { source:"gas", target:"other", value:3.6 },
    { source:"solar_wind", target:"us", value:38.4 },
    { source:"solar_wind", target:"eu", value:22.3 },
    { source:"solar_wind", target:"cn", value:10.4 },
    { source:"solar_wind", target:"other", value:6.9 },
    { source:"hydro", target:"eu", value:12.4 },
    { source:"hydro", target:"cn", value:10.4 },
    { source:"hydro", target:"sea", value:3.4 },
    { source:"hydro", target:"other", value:4.2 },
    { source:"hydro", target:"us", value:3.6 },
    { source:"nuclear", target:"us", value:36.6 },
    { source:"nuclear", target:"cn", value:6.2 },
    { source:"nuclear", target:"eu", value:8.7 },
    { source:"nuclear", target:"jp_kr", value:6.3 },
    { source:"nuclear", target:"other", value:4.2 },
    { source:"oil_other", target:"sea", value:3.4 },
    { source:"oil_other", target:"ie", value:1.6 },
    { source:"oil_other", target:"other", value:3.0 },
    { source:"us", target:"ai_training", value:4.0 },
    { source:"us", target:"ai_inference", value:22.0 },
    { source:"us", target:"cloud_saas", value:66.0 },
    { source:"us", target:"enterprise", value:28.0 },
    { source:"us", target:"cooling", value:42.0 },
    { source:"us", target:"infra_loss", value:21.0 },
    { source:"cn", target:"ai_training", value:2.0 },
    { source:"cn", target:"ai_inference", value:10.0 },
    { source:"cn", target:"cloud_saas", value:36.0 },
    { source:"cn", target:"enterprise", value:20.0 },
    { source:"cn", target:"cooling", value:25.0 },
    { source:"cn", target:"infra_loss", value:11.0 },
    { source:"eu", target:"ai_training", value:1.0 },
    { source:"eu", target:"ai_inference", value:6.0 },
    { source:"eu", target:"cloud_saas", value:22.0 },
    { source:"eu", target:"enterprise", value:13.0 },
    { source:"eu", target:"cooling", value:14.0 },
    { source:"eu", target:"infra_loss", value:6.0 },
    { source:"ie", target:"cloud_saas", value:2.8 },
    { source:"ie", target:"ai_inference", value:1.0 },
    { source:"ie", target:"cooling", value:1.0 },
    { source:"ie", target:"infra_loss", value:0.5 },
    { source:"jp_kr", target:"ai_inference", value:3.0 },
    { source:"jp_kr", target:"cloud_saas", value:7.0 },
    { source:"jp_kr", target:"enterprise", value:5.0 },
    { source:"jp_kr", target:"cooling", value:4.0 },
    { source:"jp_kr", target:"infra_loss", value:2.0 },
    { source:"sea", target:"ai_inference", value:1.5 },
    { source:"sea", target:"cloud_saas", value:4.0 },
    { source:"sea", target:"enterprise", value:4.0 },
    { source:"sea", target:"cooling", value:6.0 },
    { source:"sea", target:"infra_loss", value:1.5 },
    { source:"other", target:"cloud_saas", value:0.2 },
    { source:"other", target:"ai_inference", value:0.5 },
    { source:"other", target:"enterprise", value:6.0 },
    { source:"other", target:"cooling", value:8.0 },
    { source:"other", target:"infra_loss", value:6.3 },
    { source:"other", target:"ai_training", value:1.0 },
    { source:"other", target:"cloud_saas", value:1.0 },
  ],
  kpi: {
    chatgpt_vs_google: { ai_wh:2.9, google_wh:0.3 },
    ai_share_of_dc: { current_pct:"10-15%", projected_2030_pct:"35-50%" },
  },
  projection_2030: {
    total_twh:945, us_twh:423, cn_twh:279, eu_twh:100,
    renewable_share_pct:45, fossil_share_pct:40, nuclear_share_pct:15,
  },
};

/* ══════════════════ DOM refs ══════════════════ */
const threeCanvas   = document.getElementById('three-canvas');
const svgContainer  = document.getElementById('svg-container');
const graphic       = document.querySelector('.scroll-graphic');
const stepContents  = document.querySelectorAll('.step-content');

/* ══════════════════ State ══════════════════ */
let currentScene  = -1;
let sankeyPlayed  = false;

/* ══════════════════ Init visualisations ══════════════════ */

// Globe — init + start rendering immediately (Scene 0/1 visible)
initGlobe(graphic, DATA);
startRender();

// Sankey — init (builds SVG), stays hidden (container opacity 0)
initSankey(svgContainer, DATA);

/* ══════════════════ Transitions ══════════════════ */
threeCanvas.style.transition  = 'opacity 0.8s ease';
svgContainer.style.transition = 'opacity 0.8s ease';

function fadeToGlobe() {
  threeCanvas.style.opacity  = '1';
  svgContainer.style.opacity = '0';
  startRender();
}

function fadeToSankey() {
  threeCanvas.style.opacity  = '0';
  svgContainer.style.opacity = '1';
  // stop Three.js render loop after fade completes
  setTimeout(stopRender, 850);
  if (!sankeyPlayed) {
    sankeyPlayed = true;
    playEntrance();
  }
}

/* ══════════════════ Scene enter ══════════════════ */
function enterScene(index) {
  if (index === currentScene) return;
  currentScene = index;

  // step-content activation
  stepContents.forEach((el, i) => {
    el.classList.toggle('is-active', i === index);
  });

  switch (index) {
    case 0: // Globe entry
    case 1: // Globe main
      fadeToGlobe();
      break;
    case 2: // Sankey
      fadeToSankey();
      break;
    case 3: // Future Globe
      fadeToGlobe();
      break;
  }
}

/* ══════════════════ Scrollama ══════════════════ */
const scroller = scrollama();

scroller
  .setup({
    step: '.step',
    offset: 0.5,
  })
  .onStepEnter(({ index }) => enterScene(index));

// resize handling
window.addEventListener('resize', scroller.resize);

/* ══════════════════ Performance ══════════════════ */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stopRender();
  } else if (currentScene !== 2) {
    startRender();
  }
});
