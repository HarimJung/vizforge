/* ════════════════════════════════════════════════════
   sankey.js — The Hidden Grid
   D3 Sankey: 3-layer energy → region → usage
   ════════════════════════════════════════════════════ */

/* global d3, gsap */

const REGION_CLR = {
  us: '#00ffd5', cn: '#ff4466', eu: '#457b9d',
  ie: '#53bf9d', jp_kr: '#e9c46a', sea: '#f4a261', other: '#6c5ce7',
};
const USAGE_CLR = {
  ai_training: '#bf5af2', ai_inference: '#a29bfe', cloud_saas: '#4ecdc4',
  enterprise: '#457b9d', cooling: '#ff6b6b', infra_loss: '#556677',
};

/* ── State ── */
let _svg, _container;
let _graph;
let _linkSel, _nodeSel, _labelSel, _valSel, _catSel, _gridRect;
let _glowBlur;
let _particleG;
let _particleRAF = null;
let _particles = [];
let _hoverReady = false;
let _tl;

const NS = 'http://www.w3.org/2000/svg';
const fmt = v => (v >= 10 ? Math.round(v) : v.toFixed(1));

/* ── Tooltip ── */
function tipShow(html, evt) {
  const t = document.getElementById('tooltip');
  if (!t) return;
  t.innerHTML = html;
  t.style.left  = (evt.pageX + 14) + 'px';
  t.style.top   = (evt.pageY - 14) + 'px';
  t.style.opacity = '1';
}
function tipHide() {
  const t = document.getElementById('tooltip');
  if (t) t.style.opacity = '0';
}

/* ── Hover ── */
function bindHover() {
  /* node hover */
  _nodeSel
    .style('cursor', 'pointer')
    .on('mouseenter', (evt, d) => {
      if (!_hoverReady) return;
      const conn = new Set();
      _graph.links.forEach(l => {
        if (l.source === d || l.target === d) conn.add(l);
      });
      _linkSel.transition().duration(200)
        .attr('opacity', l => conn.has(l) ? 0.75 : 0.05);
      tipShow(`<strong>${d.name}</strong><br>${fmt(d.twh)} TWh`, evt);
    })
    .on('mousemove', (evt) => {
      const t = document.getElementById('tooltip');
      if (t) { t.style.left = (evt.pageX + 14) + 'px'; t.style.top = (evt.pageY - 14) + 'px'; }
    })
    .on('mouseleave', () => {
      if (!_hoverReady) return;
      _linkSel.transition().duration(300).attr('opacity', 0.35);
      tipHide();
    });

  /* link hover */
  _linkSel
    .style('pointer-events', 'stroke')
    .style('cursor', 'pointer')
    .on('mouseenter', function (evt, d) {
      if (!_hoverReady) return;
      d3.select(this).transition().duration(200)
        .attr('opacity', 0.85)
        .attr('stroke-width', d.width + 2);
      tipShow(`${d.source.name} → ${d.target.name}: ${fmt(d.value)} TWh`, evt);
    })
    .on('mousemove', (evt) => {
      const t = document.getElementById('tooltip');
      if (t) { t.style.left = (evt.pageX + 14) + 'px'; t.style.top = (evt.pageY - 14) + 'px'; }
    })
    .on('mouseleave', function (evt, d) {
      if (!_hoverReady) return;
      d3.select(this).transition().duration(300)
        .attr('opacity', 0.35)
        .attr('stroke-width', Math.max(1, d.width));
      tipHide();
    });
}

/* ── Particles ── */
function spawnParticles() {
  const maxVal = d3.max(_graph.links, l => l.value) || 1;
  const els = _linkSel.nodes();

  _graph.links.forEach((lk, i) => {
    if (lk.value < 3 || !els[i]) return;
    const pathEl = els[i];
    const len = pathEl.getTotalLength();
    const count = Math.max(2, Math.min(4, Math.ceil(lk.value / 25)));
    const dur = 7 - (lk.value / maxVal) * 4;
    const speed = 1 / Math.max(dur, 0.5);

    for (let j = 0; j < count; j++) {
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('r', '2');
      c.setAttribute('fill', '#ffffff');
      c.setAttribute('opacity', '0.6');
      _particleG.node().appendChild(c);
      _particles.push({ el: c, pathEl, len, speed, offset: j / count });
    }
  });

  function tick(now) {
    const sec = now / 1000;
    for (const p of _particles) {
      const t = (sec * p.speed + p.offset) % 1;
      const pt = p.pathEl.getPointAtLength(t * p.len);
      p.el.setAttribute('cx', pt.x);
      p.el.setAttribute('cy', pt.y);
    }
    _particleRAF = requestAnimationFrame(tick);
  }
  _particleRAF = requestAnimationFrame(tick);
}

function killParticles() {
  if (_particleRAF) { cancelAnimationFrame(_particleRAF); _particleRAF = null; }
  _particles.forEach(p => p.el.remove());
  _particles = [];
}

/* ═══════════════ Public API ═══════════════ */

export function initSankey(containerEl, data) {
  _container = containerEl;
  const w = containerEl.clientWidth;
  const h = containerEl.clientHeight;

  /* ── Nodes ── */
  const nodes = [
    ...data.energy_sources.map(s => ({
      id: s.id, name: s.name_en, twh: s.twh, color: s.color,
    })),
    ...data.regions.map(r => ({
      id: r.id, name: r.name_en, twh: r.twh, color: REGION_CLR[r.id] || '#666',
    })),
    ...data.dc_usage.map(u => ({
      id: u.id, name: u.name_en, twh: u.twh, color: USAGE_CLR[u.id] || '#666',
    })),
  ];
  const links = data.sankey_links.map(l => ({
    source: l.source, target: l.target, value: l.value,
  }));

  /* ── Layout ── */
  _graph = d3.sankey()
    .nodeId(d => d.id)
    .nodeWidth(20)
    .nodePadding(14)
    .nodeAlign(d3.sankeyJustify)
    .nodeSort(null)
    .extent([[80, 60], [w - 240, h - 60]])
    .iterations(32)({ nodes, links });

  /* ── SVG ── */
  _svg = d3.select(containerEl)
    .append('svg')
    .attr('width', w)
    .attr('height', h)
    .style('background', '#050510');

  const defs = _svg.append('defs');

  /* glow filter */
  const gf = defs.append('filter')
    .attr('id', 'node-glow')
    .attr('x', '-50%').attr('y', '-50%')
    .attr('width', '200%').attr('height', '200%');
  _glowBlur = gf.append('feGaussianBlur')
    .attr('in', 'SourceGraphic')
    .attr('stdDeviation', 2)
    .attr('result', 'blur');
  const fm = gf.append('feMerge');
  fm.append('feMergeNode').attr('in', 'blur');
  fm.append('feMergeNode').attr('in', 'SourceGraphic');

  /* microgrid pattern */
  const pat = defs.append('pattern')
    .attr('id', 'microgrid')
    .attr('width', 40).attr('height', 40)
    .attr('patternUnits', 'userSpaceOnUse');
  pat.append('path')
    .attr('d', 'M 40 0 L 0 0 0 40')
    .attr('fill', 'none')
    .attr('stroke', 'rgba(255,255,255,0.04)')
    .attr('stroke-width', 0.5);

  _gridRect = _svg.append('rect')
    .attr('width', w).attr('height', h)
    .attr('fill', 'url(#microgrid)')
    .attr('opacity', 0);

  /* link gradients */
  _graph.links.forEach((lk, i) => {
    const g = defs.append('linearGradient')
      .attr('id', `slg-${i}`)
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', lk.source.x1).attr('y1', 0)
      .attr('x2', lk.target.x0).attr('y2', 0);
    g.append('stop').attr('offset', '0%').attr('stop-color', lk.source.color);
    g.append('stop').attr('offset', '100%').attr('stop-color', lk.target.color);
  });

  /* ── Category labels ── */
  const depthX = [0, 1, 2].map(depth => {
    const n = _graph.nodes.find(nd => nd.depth === depth);
    return n ? n.x0 : 0;
  });
  _catSel = _svg.append('g').selectAll('text')
    .data([
      { t: 'ENERGY SOURCE', x: depthX[0] },
      { t: 'REGION',        x: depthX[1] },
      { t: 'DC USAGE',      x: depthX[2] },
    ])
    .join('text')
    .attr('x', d => d.x).attr('y', 40)
    .attr('fill', '#556677')
    .attr('font-family', "'JetBrains Mono', monospace")
    .attr('font-size', '10px')
    .attr('letter-spacing', '0.15em')
    .attr('opacity', 0)
    .text(d => d.t);

  /* ── Links ── */
  _linkSel = _svg.append('g').selectAll('path')
    .data(_graph.links)
    .join('path')
    .attr('d', d3.sankeyLinkHorizontal())
    .attr('fill', 'none')
    .attr('stroke', (_, i) => `url(#slg-${i})`)
    .attr('stroke-width', d => Math.max(1, d.width))
    .attr('opacity', 0)
    .each(function () {
      const len = this.getTotalLength();
      this.setAttribute('stroke-dasharray', len);
      this.setAttribute('stroke-dashoffset', len);
    });

  /* ── Nodes ── */
  _nodeSel = _svg.append('g').selectAll('rect')
    .data(_graph.nodes)
    .join('rect')
    .attr('x', d => d.x0).attr('y', d => d.y0)
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => Math.max(1, d.y1 - d.y0))
    .attr('fill', d => d.color)
    .attr('filter', 'url(#node-glow)')
    .attr('opacity', 0);

  /* ── Node labels ── */
  _labelSel = _svg.append('g').selectAll('text')
    .data(_graph.nodes)
    .join('text')
    .attr('x', d => d.depth === 0 ? d.x0 - 8 : d.x1 + 8)
    .attr('y', d => (d.y0 + d.y1) / 2)
    .attr('dy', '0.35em')
    .attr('text-anchor', d => d.depth === 0 ? 'end' : 'start')
    .attr('fill', '#ccccdd')
    .attr('font-family', "'JetBrains Mono', monospace")
    .attr('font-size', '11px')
    .attr('opacity', 0)
    .text(d => d.name);

  /* ── Value labels ── */
  _valSel = _svg.append('g').selectAll('text')
    .data(_graph.nodes)
    .join('text')
    .attr('x', d => d.depth === 0 ? d.x0 - 8 : d.x1 + 8)
    .attr('y', d => (d.y0 + d.y1) / 2 + 14)
    .attr('dy', '0.35em')
    .attr('text-anchor', d => d.depth === 0 ? 'end' : 'start')
    .attr('fill', '#556677')
    .attr('font-family', "'JetBrains Mono', monospace")
    .attr('font-size', '10px')
    .attr('opacity', 0)
    .text(d => `${fmt(d.twh)} TWh`);

  /* ── Particle layer ── */
  _particleG = _svg.append('g');

  /* ── Hover ── */
  bindHover();

  return _svg;
}

/* ═══ Entrance sequence (~5.5 s) ═══ */
export function playEntrance() {
  const nodeEls = _nodeSel.nodes();
  const left  = nodeEls.filter((_, i) => _graph.nodes[i].depth === 0);
  const mid   = nodeEls.filter((_, i) => _graph.nodes[i].depth === 1);
  const right = nodeEls.filter((_, i) => _graph.nodes[i].depth === 2);

  /* initial states */
  gsap.set([...left, ...mid, ...right], { scaleY: 0, transformOrigin: '50% 50%' });
  gsap.set(_catSel.nodes(), { y: -20 });

  _tl = gsap.timeline();

  /* 0 s — microgrid fade */
  _tl.to(_gridRect.node(), { opacity: 0.02, duration: 1, ease: 'power1.in' }, 0);

  /* 0.3 s — category labels */
  _tl.to(_catSel.nodes(), {
    opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out',
  }, 0.3);

  /* 1.0 / 1.5 / 2.0 s — nodes stagger per column */
  [left, mid, right].forEach((grp, gi) => {
    _tl.to(grp, {
      scaleY: 1, opacity: 1,
      duration: 0.6, stagger: 0.08, ease: 'back.out(1.7)',
    }, 1.0 + gi * 0.5);
  });

  /* 2.3 s — link draw-in (dashoffset → 0) */
  _tl.to(_linkSel.nodes(), {
    strokeDashoffset: 0, opacity: 0.15,
    duration: 1.5, stagger: 0.05, ease: 'power2.inOut',
  }, 2.3);

  /* 3.0 s — link gradient full opacity */
  _tl.to(_linkSel.nodes(), {
    opacity: 0.35, duration: 0.8, ease: 'power2.out',
  }, 3.0);

  /* clean dasharray to prevent hover flicker */
  _tl.call(() => {
    _linkSel.nodes().forEach(el => {
      el.removeAttribute('stroke-dasharray');
      el.removeAttribute('stroke-dashoffset');
    });
  }, null, 3.9);

  /* 3.3 s — node labels */
  _tl.to(_labelSel.nodes(), {
    opacity: 1, duration: 0.6, stagger: 0.04, ease: 'power2.out',
  }, 3.3);

  /* 3.5 s — value labels */
  _tl.to(_valSel.nodes(), {
    opacity: 1, duration: 0.6, stagger: 0.04, ease: 'power2.out',
  }, 3.5);

  /* 5.0 s — particles */
  _tl.call(spawnParticles, null, 5.0);

  /* 5.2 s — glow pulse */
  _tl.call(() => {
    gsap.to(_glowBlur.node(), {
      attr: { stdDeviation: 3.5 },
      duration: 2, yoyo: true, repeat: -1, ease: 'sine.inOut',
    });
  }, null, 5.2);

  /* 5.5 s — enable hover */
  _tl.call(() => { _hoverReady = true; }, null, 5.5);

  return _tl;
}

/* ═══ Visibility ═══ */
export function show() {
  if (_container) gsap.to(_container, { opacity: 1, duration: 0.8, ease: 'power2.inOut' });
}
export function hide() {
  if (_container) gsap.to(_container, { opacity: 0, duration: 0.8, ease: 'power2.inOut' });
}

/* ═══ Cleanup ═══ */
export function dispose() {
  _hoverReady = false;
  if (_tl) _tl.kill();
  killParticles();
  gsap.killTweensOf(_glowBlur?.node());
  _svg?.remove();
  _svg = null;
}
