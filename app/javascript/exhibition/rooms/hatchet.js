(function(){
  var root = document.getElementById('hatchet');
  if (!root) return;
  var E = window.Exhibit || {reduce:true, visible:function(el,cb){cb(true);}, loop:function(){}, fit:function(){}};
  var NS = 'http://www.w3.org/2000/svg';
  function $(s, r){ return (r || root).querySelector(s); }
  function $$(s, r){ return [].slice.call((r || root).querySelectorAll(s)); }
  function svg(tag, attrs, parent){
    var el = document.createElementNS(NS, tag);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(el);
    return el;
  }

  /* ---------------- circuit board: traces ported from the site's CircuitField ---------------- */
  var W = {s:1.4, m:2.1, p:3.2};
  var TRACES = [
    ['M 0 544 H 90','p'],['M 360 900 V 830 l 36 -36 H 500 l 24 -24 V 672','p'],['M 1344 120 H 1400 l 40 40','p'],
    ['M 1440 584 H 1360 l -36 36 V 744 l -28 28 H 1200','p'],
    ['M 178 544 H 316 l 48 48 V 700 l 32 32 H 452','m'],['M 178 560 H 300 l 48 48 V 716 l 32 32 H 428','s'],
    ['M 178 576 H 284 l 48 48 V 732 l 32 32 H 404','s'],['M 0 356 H 84 l 28 28 V 672','s'],
    ['M 134 440 V 692 l 28 28 H 240 l 36 36 V 830','s'],['M 60 212 H 120 l 36 36 V 656 l 36 36 H 260','m'],
    ['M 90 592 H 36 l -24 24 V 648','s'],['M 150 0 V 200 l 36 36 H 300 l 24 24 V 360','s'],
    ['M 250 60 H 420 l 28 28 V 220','s'],['M 0 664 H 24 l 16 16 V 900','s'],['M 70 900 V 772 l 40 -40 H 148','s'],
    ['M 560 900 V 812 l 36 -36 H 700','s'],['M 640 900 V 840 l 28 -28 H 780 l 36 -36 V 700','m'],
    ['M 1080 260 V 140 l 40 -40 H 1276 l 16 -16 V 36 l -24 -24 V 0','s'],
    ['M 1244 116 H 1136 l -40 40 V 276 l -28 28 H 1040','s'],
    ['M 1000 352 H 1080 l 32 -32 V 172 l 40 -40 H 1268 l 48 -48 V 0','m'],
    ['M 1064 0 V 180 l -32 32 V 280','s'],['M 1440 40 H 1400 l -24 24 V 84','s'],
    ['M 1440 470 H 1300 l -40 -40 V 330','m'],['M 1440 520 H 1332 l -32 32 V 640','s'],
    ['M 956 520 V 564 l 28 28 H 1096 l 36 36 V 776 l 8 8 V 840 l 24 24 H 1252','s'],
    ['M 972 484 V 548 l 28 28 H 1120 l 36 36 V 776 l 8 8 V 820 l 28 28 H 1324 l 24 24 V 900','m'],
    ['M 988 448 V 532 l 28 28 H 1144 l 36 36 V 752 l 20 20','m'],
    ['M 1116 724 H 1000 l -40 40 H 900','s'],['M 1116 748 H 1016 l -40 40 V 900','s'],['M 1440 812 H 1392 l -24 -24 V 720','s'],
    /* extra runs through the centre so the specimen has traces everywhere */
    ['M 524 672 V 560 l 40 -40 H 700 l 36 -36 V 380','s'],['M 448 220 V 300 l 40 40 H 640 l 32 32 H 760','s'],
    ['M 760 372 H 880 l 40 40 V 448','m'],['M 600 0 V 120 l 36 36 H 800 l 40 40 V 260','s'],
    ['M 840 260 H 940 l 32 32 V 352','s'],['M 816 700 V 620 l 28 -28 H 900 l 28 -28 V 520','s']
  ];
  var VIAS = [[12,648],[134,440],[60,212],[112,672],[276,830],[260,692],[324,360],[448,220],[148,732],[452,732],[428,748],[404,764],[524,672],[700,776],[816,700],[1080,260],[1040,304],[1000,352],[1032,280],[1376,84],[1260,330],[1300,640],[956,520],[972,484],[988,448],[900,764],[1252,864],[1368,720],[90,544],[90,592],[178,544],[178,560],[178,576],[1244,116],[1344,120],[1116,724],[1116,748],[1200,772],[250,60],[736,380],[760,372],[920,448],[840,260],[928,520]];
  var PADS = [[240,544,0,'R4'],[444,794,0,'C9'],[240,236,0,'R7'],[1198,132,0,'R12'],[1324,676,1,'C7'],[724,812,0,'C3'],[1372,470,0,'R21'],[134,560,1,'C4'],[1176,100,0,'C11'],[1060,592,0,'R9'],[600,520,0,'R15'],[700,156,0,'C14']];
  var TPS = [[222,800,'TP1'],[1408,240,'TP2'],[660,640,'TP3']];
  var PULSE_PICK = [9, 19, 25, 4, 17, 16, 24, 8, 22, 11];

  function buildBoard(el){
    var n = parseInt(el.getAttribute('data-board'), 10) || 0, live = el.hasAttribute('data-live');
    el.setAttribute('viewBox', '0 0 1440 900');
    el.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    var gT = svg('g', {}, el), paths = [];
    TRACES.forEach(function(t, i){
      if (!live && i >= 30) return;                       /* centre runs only on the specimen: scenes keep a clear copy corridor */
      paths.push(svg('path', {d:t[0], 'class':'tr ' + t[1], 'stroke-width':W[t[1]]}, gT));
    });
    PADS.forEach(function(p){
      if (!live && p[0] > 500 && p[0] < 960 && p[1] < 700) return;
      var v = p[2];
      svg('rect', {x:p[0] - (v ? 4 : 11), y:p[1] - (v ? 11 : 4), width:v ? 8 : 7, height:v ? 7 : 8, 'class':'pad'}, el);
      svg('rect', {x:p[0] + (v ? -4 : 4), y:p[1] + (v ? 4 : -4), width:v ? 8 : 7, height:v ? 7 : 8, 'class':'pad'}, el);
      svg('text', {x:p[0] + 16, y:p[1] - 8}, el).textContent = p[3];
    });
    TPS.forEach(function(p){
      if (!live && p[0] > 500 && p[0] < 960 && p[1] < 700) return;
      svg('circle', {cx:p[0], cy:p[1], r:6, 'class':'fid'}, el);
      svg('circle', {cx:p[0], cy:p[1], r:2, 'class':'pad'}, el);
      svg('text', {x:p[0] + 12, y:p[1] + 3}, el).textContent = p[2];
    });
    var gP = svg('g', {}, el), glows = [];
    for (var k = 0; k < n; k++){
      var ti = PULSE_PICK[k % PULSE_PICK.length];
      var pl = svg('path', {d:TRACES[ti][0], pathLength:1000, 'class':'pl'}, gP);
      pl.style.setProperty('--pd', (4.2 + (k * 1.3) % 3.1).toFixed(2) + 's');
      pl.style.setProperty('--dl', (-(k * 1.7) % 5).toFixed(2) + 's');
      pl.style.strokeDashoffset = -(180 + (k * 211) % 620);
    }
    VIAS.forEach(function(v){
      if (!live && v[0] > 500 && v[0] < 950 && v[1] < 600) return;
      glows.push({el:svg('circle', {cx:v[0], cy:v[1], r:8.5, 'class':'vg'}, el), x:v[0], y:v[1], o:0, cur:0});
      svg('circle', {cx:v[0], cy:v[1], r:5, 'class':'via'}, el);
    });
    return {paths:paths, glows:glows, layer:gP};
  }
  var liveBoard = null;
  $$('svg[data-board]').forEach(function(el){ var b = buildBoard(el); if (el.hasAttribute('data-live')) liveBoard = {el:el, b:b}; });

  /* ---------------- interactive circuit specimen ---------------- */
  (function(){
    if (!liveBoard) return;
    var el = liveBoard.el, b = liveBoard.b, host = el.closest('.spec-live');
    var countEl = $('[data-cf-count]', host), fired = 0;
    var info = b.paths.map(function(p, i){
      var total = 0, pts = [];
      try { total = p.getTotalLength(); } catch (e) {}
      for (var s = 0; s <= total; s += 22){ var q = p.getPointAtLength(s); pts.push([q.x, q.y, s]); }
      var hits = [];
      b.glows.forEach(function(g, gi){
        var best = 1e9, at = 0;
        pts.forEach(function(q){ var d = (q[0] - g.x) * (q[0] - g.x) + (q[1] - g.y) * (q[1] - g.y); if (d < best){ best = d; at = q[2]; } });
        if (best < 26 * 26) hits.push([gi, at]);
      });
      return {d:TRACES[i][0], tier:TRACES[i][1], total:total, pts:pts, hits:hits, busy:false};
    });
    var pool = [];
    for (var i = 0; i < 12; i++) pool.push({trail:svg('path', {'class':'trail'}, b.layer), dot:svg('circle', {'class':'dot', r:3.4}, b.layer), on:false});
    function fire(ti, surge, rev){
      var t = info[ti]; if (!t || t.busy || !t.total) return false;
      var slot = null; for (var k = 0; k < pool.length; k++) if (!pool[k].on){ slot = pool[k]; break; }
      if (!slot) return false;
      surge = surge || t.tier === 'p';
      t.busy = true; slot.on = true; slot.ti = ti; slot.t = 0; slot.surge = surge; slot.rev = !!rev;
      slot.seg = Math.min(surge ? 210 : 150, t.total * .5);
      slot.dur = 900 + (t.total + slot.seg) / (surge ? .62 : .46);
      slot.trail.setAttribute('d', t.d);
      slot.trail.style.strokeWidth = surge ? 3.6 : 2.5;
      slot.trail.style.stroke = surge ? '#ff5a60' : '#e23c42';
      slot.dot.setAttribute('r', surge ? 4.4 : 3.2);
      slot.trail.style.strokeDasharray = slot.seg + ' ' + (t.total + slot.seg + 10);
      fired++; if (countEl) countEl.textContent = fired;
      return true;
    }
    function place(s, p){
      var t = info[s.ti], e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      var head = e * (t.total + s.seg), a = Math.min(1, p / .12, (1 - p) / .14);
      var pos = Math.min(head, t.total);
      if (s.rev){ s.trail.style.strokeDashoffset = -(t.total - head); pos = t.total - pos; }
      else s.trail.style.strokeDashoffset = s.seg - head;
      s.trail.style.opacity = a * (s.surge ? 1 : .9);
      var q = b.paths[s.ti].getPointAtLength(pos);
      s.dot.setAttribute('cx', q.x); s.dot.setAttribute('cy', q.y);
      s.dot.style.opacity = head > t.total ? 0 : a;
      for (var h = 0; h < t.hits.length; h++){
        var g = b.glows[t.hits[h][0]], dist = Math.abs(pos - t.hits[h][1]);
        var o = Math.max(0, 1 - dist / 110) * a; if (o > g.o) g.o = o;
      }
    }
    var ambient = 0;
    function frame(t, dt){
      var k, g;
      for (k = 0; k < b.glows.length; k++) b.glows[k].o = 0;
      for (k = 0; k < pool.length; k++){
        var s = pool[k]; if (!s.on) continue;
        s.t += dt;
        var p = s.t / s.dur;
        if (p >= 1){ s.on = false; info[s.ti].busy = false; s.trail.style.opacity = 0; s.dot.style.opacity = 0; continue; }
        place(s, p);
      }
      for (k = 0; k < b.glows.length; k++){ g = b.glows[k]; if (Math.abs(g.o - g.cur) > .01){ g.cur = g.o; g.el.style.opacity = g.o.toFixed(2); } }
      if (E.reduce) return;
      ambient -= dt;
      if (ambient <= 0){ ambient = 700 + Math.random() * 900; fire(Math.floor(Math.random() * info.length), Math.random() < .18, Math.random() < .3); }
    }
    /* seed a few pulses mid-flight so the board is never blank (also the reduced-motion frame) */
    [[4, .45], [19, .5], [25, .4], [30, .55], [9, .5]].forEach(function(sd){
      if (fire(sd[0], sd[0] === 25)) { var s = pool.filter(function(x){ return x.on && x.ti === sd[0]; })[0]; s.t = s.dur * sd[1]; }
    });
    fired = 0; if (countEl) countEl.textContent = '0';
    E.loop(el, frame);

    function nearest(ev, max){
      var m = el.getScreenCTM(); if (!m) return [];
      var pt = el.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY; pt = pt.matrixTransform(m.inverse());
      var out = [];
      info.forEach(function(t, i){
        var best = 1e9;
        for (var k = 0; k < t.pts.length; k++){ var dx = t.pts[k][0] - pt.x, dy = t.pts[k][1] - pt.y, d = dx * dx + dy * dy; if (d < best) best = d; }
        if (best < max * max) out.push([best, i]);
      });
      return out.sort(function(a, c){ return a[0] - c[0]; }).map(function(x){ return x[1]; });
    }
    if (!E.reduce){
      var last = 0;
      host.addEventListener('pointermove', function(ev){
        var now = performance.now(); if (now - last < 90) return; last = now;
        var near = nearest(ev, 150);
        for (var k = 0; k < near.length; k++) if (fire(near[k], false, Math.random() < .5)) break;
      });
      host.addEventListener('pointerdown', function(ev){
        if (ev.target.closest('button')) return;
        nearest(ev, 260).slice(0, 4).forEach(function(i, k){ setTimeout(function(){ fire(i, true, k % 2 === 1); }, k * 70); });
      });
    }
    var btn = $('[data-cf-fire]', host);
    if (btn) btn.addEventListener('click', function(){
      var order = info.map(function(_, i){ return i; }).sort(function(){ return Math.random() - .5; }).slice(0, 7);
      order.forEach(function(i, k){
        if (E.reduce){ if (fire(i, true)) { var s = pool.filter(function(x){ return x.on && x.ti === i; })[0]; s.t = s.dur * .5; } }
        else setTimeout(function(){ fire(i, true, k % 2 === 1); }, k * 90);
      });
      if (E.reduce) requestAnimationFrame(function(t){
        pool.forEach(function(s){ if (s.on) place(s, .5); });
        b.glows.forEach(function(g){ g.el.style.opacity = g.o.toFixed(2); });
      });
    });
  })();

  /* ---------------- hero stat charts (bars / rising line / dot field) ---------------- */
  function chart(host){
    var kind = host.getAttribute('data-chart'), FW = 240, FH = 52;
    var s = svg('svg', {viewBox:'0 0 ' + FW + ' ' + FH, preserveAspectRatio:'xMidYMax meet'}, host), i;
    if (kind === 'bars'){
      var hs = [.34,.58,.44,.72,.52,.88,.64,1,.7,.82,.48,.66,.38], slot = FW / hs.length, bw = slot * .5;
      hs.forEach(function(h, k){
        var bh = Math.max(bw, h * (FH - 4));
        svg('rect', {x:k * slot + (slot - bw) / 2, y:FH - bh, width:bw, height:bh, rx:bw / 2, fill:'url(#hatchet-gv)', 'class':'a-bar'}, s).style.setProperty('--d', (k * .045) + 's');
      });
    } else if (kind === 'line'){
      var data = [2,3,3.4,4.5,5.2,6.4,7.1,8.6,9.2,10], padX = 4, padT = 8, padB = 6, step = (FW - padX * 2) / (data.length - 1);
      var pts = data.map(function(v, k){ return [padX + k * step, FH - padB - ((v - 2) / 8) * (FH - padT - padB)]; });
      var d = pts.map(function(p, k){ return (k ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
      var lastP = pts[pts.length - 1];
      svg('line', {x1:padX, x2:FW - padX, y1:FH - padB, y2:FH - padB, stroke:'rgba(21,31,44,.14)', 'stroke-width':1, 'stroke-linecap':'round'}, s);
      svg('path', {d:d + ' L' + lastP[0] + ' ' + (FH - padB) + ' L' + padX + ' ' + (FH - padB) + ' Z', fill:'url(#hatchet-gv)', 'fill-opacity':.16, 'class':'a-area'}, s);
      svg('path', {d:d, pathLength:1, fill:'none', stroke:'url(#hatchet-gh)', 'stroke-width':2.5, 'stroke-linecap':'round', 'stroke-linejoin':'round', 'class':'a-line'}, s);
      svg('circle', {cx:lastP[0], cy:lastP[1], r:3.5, fill:'#e23c42', 'class':'a-ping'}, s);
      svg('circle', {cx:lastP[0], cy:lastP[1], r:3.5, fill:'#e23c42', stroke:'#fff', 'stroke-width':1.5}, s);
    } else {
      var cols = 26, rows = 5, total = cols * rows, gx = (FW - 6) / (cols - 1), gy = (FH - 8) / (rows - 1);
      for (i = 0; i < total; i++){
        var c = svg('circle', {cx:3 + (i % cols) * gx, cy:4 + Math.floor(i / cols) * gy, r:2.1, fill:'#c4262c', 'fill-opacity':i % 3 === 0 ? .4 : .92, 'class':'a-dot'}, s);
        c.style.setProperty('--d', (((i * 11) % total) / total * .9).toFixed(2) + 's');
      }
    }
  }
  $$('[data-chart]').forEach(chart);

  function fmt(n, sep){ n = Math.round(n); return sep ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : String(n); }
  function countUp(el, dur){
    var to = parseFloat(el.getAttribute('data-to')), sep = el.hasAttribute('data-sep');
    if (E.reduce || !isFinite(to)) { el.textContent = fmt(to, sep); return; }
    var t0 = 0; el._run = (el._run || 0) + 1; var id = el._run;
    function tick(t){
      if (id !== el._run) return;
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / (dur || 1000)), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(to * e, sep);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* dashboard bars + monitor clone */
  $$('[data-bars]').forEach(function(host){
    var n = parseInt(host.getAttribute('data-bars'), 10), seed = 7;
    for (var i = 0; i < n; i++){
      seed = (seed * 9301 + 49297) % 233280;
      var h = 28 + (seed / 233280) * 40 + (i / n) * 32, b = document.createElement('i');
      b.style.height = Math.min(100, h).toFixed(0) + '%';
      b.style.setProperty('--d', (.6 + i * .025).toFixed(2) + 's');
      if (i % 4 === 1) b.className = 'dim';
      host.appendChild(b);
    }
  });
  $$('[data-tiles]').forEach(function(host){
    var n = parseInt(host.getAttribute('data-tiles'), 10);
    for (var i = 0; i < n; i++){ var t = document.createElement('i'); if ((i * 7) % 23 === 3) t.className = 'r'; t.style.setProperty('--d', (1 + i * .012).toFixed(2) + 's'); host.appendChild(t); }
  });
  var dash = $('[data-dash]');
  $$('[data-clone="dash"]').forEach(function(slot){ if (dash) { var c = dash.cloneNode(true); c.removeAttribute('data-dash'); slot.appendChild(c); } });

  /* ---------------- lifecycle orbital (scene + specimen) ---------------- */
  var orbs = $$('[data-orb]').map(function(orb){
    var st = $$('.st', orb), lv = $$('.lv', orb), dp = $$('.dp', orb), pips = $$('.pip', orb);
    var o = {el:orb, active:0, seen:false, scene:orb.closest('.scene'), isSpec:orb.getAttribute('data-orb') === 'spec', touched:false};
    o.set = function(i){
      o.active = i;
      [st, lv, dp].forEach(function(list){ list.forEach(function(x, k){ x.classList.toggle('on', k === i); }); });
      pips.forEach(function(x, k){ x.classList.remove('on'); if (k === i) { void x.offsetWidth; x.classList.add('on'); } });
      st.forEach(function(x, k){ x.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
    };
    st.forEach(function(btn, i){
      function take(){ o.touched = true; orb.classList.remove('auto'); o.set(i); }
      btn.addEventListener('click', take);
      if (o.isSpec) btn.addEventListener('mouseenter', take);
      btn.addEventListener('focus', function(){ if (btn.matches(':focus-visible')) take(); });
    });
    E.visible(orb.closest('.film,.spec') || orb, function(v){
      o.seen = v;
      if (o.isSpec && v && !o.touched) { orb.classList.add('go'); o.set(o.active); }
    }, .3);
    return o;
  });
  if (!E.reduce) setInterval(function(){
    orbs.forEach(function(o){
      if (o.touched || !o.seen) return;
      if (o.scene && !o.scene.classList.contains('on')) return;
      var film = o.el.closest('.film'); if (film && !film.classList.contains('run')) return;
      o.set((o.active + 1) % 4);
    });
  }, 4200);

  /* ---------------- film hooks: replay count-ups, reset the orbital ---------------- */
  var film = $('[data-film]');
  function onScene(sc){
    if (!sc) return;
    $$('[data-to]', sc).forEach(function(el, i){ countUp(el, 1100 + i * 120); });
    orbs.forEach(function(o){ if (o.scene === sc) { o.touched = false; o.el.classList.add('auto'); o.set(0); } });
  }
  if (film){
    film.addEventListener('scenechange', function(ev){ onScene(ev.detail.scene); });
    onScene($('.scene.on', film));
  }

  /* ---------------- stat-card specimen: replay on hover / click ---------------- */
  $$('.sp-stats .sc').forEach(function(card){
    var num = $('[data-to]', card), lock = 0;
    function replay(){
      var now = Date.now(); if (now - lock < 500) return; lock = now;
      card.classList.remove('play'); void card.offsetWidth; card.classList.add('play');
      if (num) countUp(num, 1000);
    }
    card.addEventListener('mouseenter', replay);
    card.addEventListener('click', function(){ lock = 0; replay(); });
  });
  (function(){
    var host = $('.sp-stats'), done = false;
    if (host) E.visible(host, function(v){ if (v && !done) { done = true; $$('.sc', host).forEach(function(c, i){ setTimeout(function(){ c.dispatchEvent(new Event('mouseenter')); }, i * 140); }); } }, .4);
  })();

  /* ---------------- smart search + fake-audience specimen (all data invented) ---------------- */
  (function(){
    var host = $('[data-search]'); if (!host) return;
    var PC = {'Twitch':'#9146ff', 'YouTube Gaming':'#ff4e45', 'Kick':'#3fcf2e'};
    var C = [
      {n:'Novastrike',  p:'Twitch',         l:'ES', g:'FPS',    e:6.8, s:96, h:2400, f:1800},
      {n:'Pixelhollow', p:'Twitch',         l:'EN', g:'RPG',    e:4.9, s:98, h:1900, f:1100},
      {n:'Kaijukendra', p:'YouTube Gaming', l:'EN', g:'VTuber', e:7.4, s:91, h:1600, f:940},
      {n:'Forgeplays',  p:'Kick',           l:'EN', g:'FPS',    e:5.6, s:88, h:1200, f:712},
      {n:'Vexholt',     p:'Twitch',         l:'ES', g:'FPS',    e:9.1, s:34, h:1100, f:2300},
      {n:'Lumenquill',  p:'YouTube Gaming', l:'EN', g:'VTuber', e:6.1, s:94, h:980,  f:620},
      {n:'Tejoarcade',  p:'YouTube Gaming', l:'ES', g:'FPS',    e:5.9, s:93, h:870,  f:540},
      {n:'Brackenmoor', p:'Kick',           l:'EN', g:'RPG',    e:3.2, s:41, h:760,  f:1400},
      {n:'Mirakoto',    p:'YouTube Gaming', l:'EN', g:'VTuber', e:8.8, s:29, h:700,  f:1900},
      {n:'Rivetdash',   p:'Twitch',         l:'ES', g:'FPS',    e:6.3, s:97, h:590,  f:310},
      {n:'Thistlebyte', p:'Kick',           l:'EN', g:'RPG',    e:4.4, s:92, h:430,  f:280},
      {n:'Orbitalkoi',  p:'Twitch',         l:'EN', g:'RPG',    e:5.2, s:89, h:640,  f:505}
    ];
    var P = [
      {ask:'Spanish-speaking FPS streamers with high chat engagement',
       groups:[['who streams on…', ['Twitch', 'YouTube Gaming']], ['by creator language', ['Spanish']], ['by engagement rate', ['Over 5%']]],
       test:function(c){ return c.l === 'ES' && c.g === 'FPS' && c.e > 5 && c.p !== 'Kick'; }},
      {ask:'VTubers on YouTube with more than 500K followers',
       groups:[['who streams on…', ['YouTube Gaming']], ['by tag', ['VTuber']], ['by followers', ['Over 500K']]],
       test:function(c){ return c.g === 'VTuber' && c.p === 'YouTube Gaming' && c.f > 500; }},
      {ask:'English-speaking RPG creators on Twitch or Kick',
       groups:[['who streams on…', ['Twitch', 'Kick']], ['by creator language', ['English']], ['by game genre', ['RPG']]],
       test:function(c){ return c.l === 'EN' && c.g === 'RPG' && c.p !== 'YouTube Gaming'; }}
    ];
    var ask = $('[data-ss-ask]', host), groups = $('[data-ss-groups]', host), res = $('[data-ss-res]', host),
        note = $('[data-ss-note]', host), cnt = $('[data-ss-cnt]', host), meta = $('[data-ss-meta]', host),
        pre = $$('[data-ss-presets] button', host), tg = $$('[data-ss-toggle] button', host);
    var cur = 0, exclude = true, typing = 0;
    function h(n){ return n >= 1000 ? (n / 1000).toFixed(1) + 'M' : n + 'K'; }
    function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;'}[c]; }); }
    function drawGroups(){
      groups.innerHTML = P[cur].groups.map(function(g, i){
        return '<div style="--d:' + (i * .12) + 's"><em>' + esc(g[0]) + '</em><span>' + g[1].map(function(v){ return '<i>' + esc(v) + '<u>×</u></i>'; }).join('') + '</span></div>';
      }).join('');
      cnt.textContent = P[cur].groups.length + ' filters active';
    }
    function drawRes(){
      var list = C.filter(P[cur].test).sort(function(a, b){ return b.s - a.s; });
      var bad = list.filter(function(c){ return c.s < 50; }).length;
      res.innerHTML = list.map(function(c, i){
        var flagged = c.s < 50;
        return '<div class="rw' + (flagged ? ' bad' + (exclude ? ' out' : '') : '') + '" style="--d:' + (i * .08) + 's">' +
          '<div class="nm"><b>' + esc(c.n) + (flagged ? '<i>' + (exclude ? 'Excluded' : 'Flagged') + '</i>' : '') + '</b>' +
          '<span><u style="--pc:' + PC[c.p] + '"></u>' + esc(c.p) + ' · ' + c.l + ' · ' + h(c.h) + ' hrs</span></div>' +
          '<div class="bar"><s style="--w:' + c.s + '%;--d:' + (i * .08 + .1) + 's"></s></div><span class="sco">' + c.s + '</span></div>';
      }).join('');
      var kept = list.filter(function(c){ return !(exclude && c.s < 50); });
      var hrs = kept.reduce(function(a, c){ return a + c.h; }, 0), avg = kept.reduce(function(a, c){ return a + c.s; }, 0) / (kept.length || 1);
      var sum = $('[data-ss-sum]', host);
      if (sum) sum.innerHTML = '<div><span>Shortlisted</span><b>' + kept.length + '</b></div><div><span>Hours watched</span><b>' + h(hrs) + '</b></div><div><span>Avg. score</span><b>' + Math.round(avg) + '</b></div>';
      meta.textContent = (list.length - (exclude ? bad : 0)) + ' of ' + list.length + ' matches';
      note.textContent = exclude
        ? (bad ? bad + ' channel scored under 50 for audience authenticity and is left off the shortlist.' : 'Flagged channels never reach your shortlist.')
        : (bad ? 'Showing everything. ' + bad + ' channel has a large audience and a low authenticity score.' : 'No flagged channels in this search.');
    }
    function type(text){
      typing++; var id = typing, i = 0;
      if (E.reduce) { ask.textContent = text; return; }
      ask.textContent = '';
      (function step(){ if (id !== typing) return; i += 2; ask.textContent = text.slice(0, i); if (i < text.length) setTimeout(step, 18); })();
    }
    function pick(i, animate){
      cur = i;
      pre.forEach(function(b, k){ b.classList.toggle('on', k === i); b.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
      if (animate) type(P[i].ask); else ask.textContent = P[i].ask;
      drawGroups(); drawRes();
    }
    pre.forEach(function(b, i){ b.addEventListener('click', function(){ pick(i, true); }); });
    tg.forEach(function(b){ b.addEventListener('click', function(){
      exclude = b.getAttribute('data-v') === '1';
      tg.forEach(function(x){ x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      drawRes();
    }); });
    pick(0, false);
  })();
})();
