(function(){
  var root = document.getElementById('click'); if (!root) return;
  var E = window.Exhibit || {reduce:true, loop:function(el, fn){ fn(0, 16); }, fit:function(cv){ var c = cv.getContext('2d'); c.w = cv.width; c.h = cv.height; return c; }};
  function $(s, c){ return (c || root).querySelector(s); }
  function $$(s, c){ return [].slice.call((c || root).querySelectorAll(s)); }
  function rng(seed){ return function(){ seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function esc(s){ return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  /* ================= signal canvas (port of the site's particle field) ================= */
  function neb(alpha, lines){ return {x:.76, y:.5, pull:.012, spread:.3, alpha:alpha, lines:lines, drift:.6, accent:true, neb:true}; }
  var MODES = {
    dormant: {x:.5, y:.45, pull:.004, spread:.65, alpha:.55, lines:.5, drift:1.1},
    overlap: neb(1, .8), divide: neb(.75, .6), flow: neb(.4, .3),
    quiet:   {x:.5, y:.5, pull:.003, spread:.8, alpha:.16, lines:.15, drift:.5},
    settle:  {x:.5, y:.6, pull:.005, spread:.55, alpha:.4, lines:.4, drift:.55}
  };
  var STRETCH = 1.25, TILT = -.38;
  var glow = (function(){ var c = document.createElement('canvas'); c.width = c.height = 64; var g = c.getContext('2d'), gr = g.createRadialGradient(32,32,0,32,32,32); gr.addColorStop(0,'rgba(255,255,255,.3)'); gr.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0,0,64,64); return c; })();

  function signal(cv, getMode, opt){
    opt = opt || {};
    var rand = rng(opt.seed || 11), P = [], W = 0, H = 0, T = 0, core = 0, ctx = null, sc = 1;
    var mouse = {x:-9999, y:-9999, on:false};
    function seed(){
      var n = Math.max(46, Math.min(210, Math.round(W / (opt.per || 6))));
      P = []; for (var i = 0; i < n; i++) P.push({x:rand()*W, y:rand()*H, vx:0, vy:0, r:(1 + rand()*1.6), seed:rand()*1000, depth:Math.pow(rand(), 1.25), halo:rand() < .12});
    }
    function cfg(){ var m = MODES[getMode()] || MODES.dormant; return m; }
    function step(dt, t){
      var c = cfg(), k = Math.min(dt / 16.7, 2), m = Math.min(W, H), fx = (c.neb && opt.fx ? opt.fx : c.x) * W, fy = c.y * H, mr = 130 * Math.max(sc, .6);
      for (var i = 0; i < P.length; i++){
        var p = P[i], tx, ty;
        if (c.neb){
          var reach = p.halo ? .95 + p.depth*.4 : .14 + p.depth*.75, br = 1 + .05*Math.sin(t*.00035 + p.seed);
          var rad = c.spread * m * reach * br * (opt.grow || 1), an = p.seed + (t*.000045) / (.35 + reach);
          var ex = Math.cos(an)*rad*STRETCH, ey = Math.sin(an)*rad;
          tx = fx + ex*Math.cos(TILT) - ey*Math.sin(TILT); ty = fy + ex*Math.sin(TILT) + ey*Math.cos(TILT);
        } else {
          var a2 = p.seed + t*.00006*(1 + (p.seed % 1)), ring = c.spread * Math.max(m, W*.6) * (.35 + (p.seed % .65));
          tx = fx + Math.cos(a2)*ring; ty = fy + Math.sin(a2*.9)*ring*.8*(H/Math.max(m, W*.6));
        }
        p.vx += (tx - p.x)*c.pull*k; p.vy += (ty - p.y)*c.pull*k;
        p.vx += Math.sin(t*.001 + p.seed)*.01*c.drift*k; p.vy += Math.cos(t*.0012 + p.seed*2)*.01*c.drift*k;
        if (mouse.on){
          var dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx*dx + dy*dy;
          if (d2 < mr*mr && d2 > 1){ var d = Math.sqrt(d2), push = ((mr - d)/mr)*.5; p.vx += (dx/d)*push*k; p.vy += (dy/d)*push*k; }
        }
        p.vx *= .94; p.vy *= .94; p.x += p.vx*k; p.y += p.vy*k;
      }
    }
    function draw(){
      var c = cfg(), m = Math.min(W, H);
      ctx.clearRect(0, 0, W, H);
      core += ((c.neb ? c.alpha : 0) - core) * .04;
      if (E.reduce) core = c.neb ? c.alpha : 0;
      if (core > .01){
        var R = .3 * m * 1.15 * (opt.grow || 1);
        ctx.save(); ctx.translate((opt.fx || .76)*W, .5*H); ctx.rotate(TILT); ctx.scale(STRETCH, 1);
        var b = ctx.createRadialGradient(0,0,0,0,0,R); b.addColorStop(0,'rgba(255,255,255,'+(.09*core)+')'); b.addColorStop(.55,'rgba(255,255,255,'+(.05*core)+')'); b.addColorStop(1,'rgba(255,255,255,0)');
        ctx.fillStyle = b; ctx.fillRect(-R,-R,R*2,R*2); ctx.restore();
      }
      var ld = (W < 640 ? 70 : 90) * Math.max(sc, .5), ld2 = ld*ld, base = .3 * c.lines;
      ctx.lineWidth = Math.max(.5, sc);
      for (var i = 0; i < P.length; i++){ var a = P[i];
        for (var j = i + 1; j < P.length; j++){ var q = P[j], dx = a.x - q.x, dy = a.y - q.y, d2 = dx*dx + dy*dy;
          if (d2 < ld2){ ctx.strokeStyle = 'rgba(255,255,255,' + ((1 - d2/ld2)*base*c.alpha).toFixed(3) + ')'; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(q.x, q.y); ctx.stroke(); } } }
      for (var n = 0; n < P.length; n++){ var p = P[n], r = p.r * Math.max(sc, .55);
        if (c.accent && c.neb && !p.halo && p.depth < .18){
          var s = r*12; ctx.globalAlpha = c.alpha*.5; ctx.drawImage(glow, p.x - s/2, p.y - s/2, s, s); ctx.globalAlpha = 1;
          ctx.fillStyle = 'rgba(255,255,255,' + (.95*c.alpha*.85) + ')';
        } else ctx.fillStyle = 'rgba(255,255,255,' + (.8*c.alpha*(c.neb && p.halo ? .5 : 1)) + ')';
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 6.2832); ctx.fill(); }
    }
    function size(){
      ctx = E.fit(cv);
      if (Math.abs(ctx.w - W) > 2 || Math.abs(ctx.h - H) > 2){ W = ctx.w; H = ctx.h; sc = W / 1300; if (W > 4 && H > 4){ seed(); settle(260); } }
    }
    function settle(n){ for (var i = 0; i < n; i++){ T += 16.7; step(16.7, T); } }
    function frame(t, dt){ size(); if (W < 5 || H < 5) return; if (E.reduce) settle(200); else { T += dt; step(dt, T); } draw(); }
    E.loop(cv, frame);
    return {
      mouse: function(x, y, on){ mouse.x = x; mouse.y = y; mouse.on = on; },
      redraw: function(){ if (E.reduce) { size(); if (W > 4) { settle(260); draw(); } } }
    };
  }

  /* film canvases */
  $$('.scene canvas.sig').forEach(function(cv, i){
    var mode = cv.getAttribute('data-mode'), sim = signal(cv, function(){ return mode; }, {seed:11 + i*7});
    var sc = cv.closest('.scene');
    sc.addEventListener('pointermove', function(e){ if (e.pointerType === 'touch') return; var r = cv.getBoundingClientRect(); sim.mouse(e.clientX - r.left, e.clientY - r.top, true); });
    sc.addEventListener('pointerleave', function(){ sim.mouse(0, 0, false); });
  });

  /* specimen 1 */
  (function(){
    var live = $('.sp-sig'); if (!live) return;
    var cv = $('canvas.sig', live), mode = 'overlap';
    var DESC = {
      dormant: 'A calm, sparse ring. This is the field at first paint, before any section has claimed it.',
      overlap: 'The hero. Particles orbit a tilted ellipse and the inner ones glow where communities overlap.',
      divide: 'The two journey doors. The same nebula, stepped down so the panels read first.',
      flow: 'The intelligence section. Dimmer again, leaving room for the diagram that draws on top.',
      quiet: 'Case studies and the directory. Nearly invisible, so photography and cards carry the page.',
      settle: 'The footer. The field drops lower and steadies as the page ends.'
    };
    var sim = signal(cv, function(){ return mode; }, {seed:5, per:4.2, fx:.66, grow:1.1});
    function set(m){
      mode = m; var c = MODES[m];
      $$('.sg-btns button', live).forEach(function(b){ b.setAttribute('aria-pressed', b.getAttribute('data-mode') === m ? 'true' : 'false'); });
      $('[data-sg-name]', live).textContent = m;
      $('[data-sg-desc]', live).textContent = DESC[m];
      $('[data-sg-cfg]', live).textContent = 'alpha ' + c.alpha.toFixed(2) + '  ·  lines ' + c.lines.toFixed(2) + '  ·  drift ' + c.drift.toFixed(2) + '  ·  pull ' + c.pull.toFixed(3);
      sim.redraw();
    }
    $$('.sg-btns button', live).forEach(function(b){ b.addEventListener('click', function(){ set(b.getAttribute('data-mode')); }); });
    live.addEventListener('pointermove', function(e){ var r = cv.getBoundingClientRect(); sim.mouse(e.clientX - r.left, e.clientY - r.top, true); });
    live.addEventListener('pointerleave', function(){ sim.mouse(0, 0, false); });
    set('overlap');
  })();

  /* ================= hero community map dots ================= */
  (function(){
    var g = $('.om-dots'); if (!g) return;
    var r = rng(42), out = '', A = [112,158], B = [188,158], R = 80, n = 0, guard = 0;
    while (n < 150 && guard++ < 4000){
      var x = 30 + r()*240, y = 76 + r()*166;
      var da = Math.hypot(x - A[0], y - A[1]), db = Math.hypot(x - B[0], y - B[1]);
      if (da > R && db > R) continue;
      var both = da < R && db < R;
      out += '<circle' + (both ? ' class="x" style="animation-delay:' + (-r()*2.4).toFixed(2) + 's"' : '') + ' cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (both ? 2.3 : 1.3) + '" fill-opacity="' + (both ? 1 : .55) + '"/>';
      n++;
    }
    g.innerHTML = out;
  })();

  /* ================= intelligence loop diagram ================= */
  var CX = 330, CY = 469, R = 150, HUB = 66, SRC_Y = 84, JOIN_Y = 146, BILL_Y = 170, PILL_Y = 196, PILL_H = 22;
  var SOURCES = [[115, 'Creator + Audience', 'Social data'], [330, 'Livestream + Gaming', 'Streaming data'], [545, 'Long-form video', 'Video data']];
  var NODES = [
    ['01', 'Understand', 'Know the audience.', 'Map the people, interests, behaviors and communities that matter before making a marketing decision.', 0, 'top'],
    ['02', 'Discover', 'Find who moves them.', 'Identify the creators, communities and cultural signals with the strongest relevance to that audience.', 60, 'right'],
    ['03', 'Create', 'Turn intelligence into ideas.', 'Strategists, creatives and creators translate audience understanding into ideas designed to resonate.', 120, 'right'],
    ['04', 'Activate', 'Put the work into market.', 'Execute across creators, content, experiential and paid media, with intelligence informing where investment goes.', 180, 'bottom'],
    ['05', 'Measure', 'Understand what moved.', 'Measure the outcomes that matter, and leave aside the ones that are merely easy to report.', 240, 'left'],
    ['06', 'Optimize', 'Make the intelligence smarter.', 'Performance signals feed back into the intelligence layer and improve the next decision.', 300, 'left']
  ];
  function xy(a){ var r = a*Math.PI/180; return [CX + R*Math.sin(r), CY - R*Math.cos(r)]; }
  function f1(v){ return v.toFixed(1); }
  function diagram(host, film){
    var id = 'click-g-' + (film ? 'f' : 's'), s = '', D = film ? [.3, 3, 5.6, 8.2] : null;
    function d(t){ return film ? ' style="--d:' + t.toFixed(2) + 's"' : ''; }
    s += '<svg viewBox="' + (film ? '0 0 660 700' : '0 252 660 432') + '" role="img" aria-label="Three data sources converge into audience mapping, which feeds a six-step cycle: Understand, Discover, Create, Activate, Measure, Optimize.">';
    s += '<defs><radialGradient id="' + id + '"><stop offset="0" stop-color="#fff" stop-opacity=".34"/><stop offset=".6" stop-color="#fff" stop-opacity=".1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>';
    if (film){
      SOURCES.forEach(function(S, i){
        s += '<g class="df"' + d(D[0] + i*.15) + '><text class="t-eb" x="' + S[0] + '" y="40" text-anchor="middle">' + S[1] + '</text><text class="t-h" x="' + S[0] + '" y="66" text-anchor="middle">' + S[2] + '</text></g>';
      });
      s += '<path class="ln dr" pathLength="1"' + d(D[0] + .5) + ' d="M115 ' + SRC_Y + ' C115 ' + (SRC_Y + 58) + ', ' + CX + ' ' + (JOIN_Y - 40) + ', ' + CX + ' ' + JOIN_Y + '"/>';
      s += '<path class="ln dr" pathLength="1"' + d(D[0] + .6) + ' d="M' + CX + ' ' + SRC_Y + ' V' + JOIN_Y + '"/>';
      s += '<path class="ln dr" pathLength="1"' + d(D[0] + .7) + ' d="M545 ' + SRC_Y + ' C545 ' + (SRC_Y + 58) + ', ' + CX + ' ' + (JOIN_Y - 40) + ', ' + CX + ' ' + JOIN_Y + '"/>';
      s += '<path class="ln dr" pathLength="1"' + d(D[0] + 1.2) + ' d="M' + CX + ' ' + JOIN_Y + ' V' + (BILL_Y - 10) + '"/>';
      s += '<text class="t-eb df"' + d(D[0] + 1.3) + ' x="' + CX + '" y="' + (BILL_Y + 3) + '" text-anchor="middle">Audience data points ingested</text>';
      s += '<g class="df"' + d(D[0] + 1.6) + '><rect class="pillr" x="' + (CX - 78) + '" y="' + (PILL_Y - PILL_H/2 - 1) + '" width="156" height="' + (PILL_H + 2) + '" rx="12"/><text class="t-pill" x="' + CX + '" y="' + (PILL_Y + 3.5) + '" text-anchor="middle">Audience Mapping</text></g>';
      s += '<path class="ln dr" pathLength="1"' + d(D[0] + 1.9) + ' d="M' + CX + ' ' + (PILL_Y + PILL_H/2 + 1) + ' V' + (PILL_Y + PILL_H/2 + 16) + '"/>';
    }
    /* hub */
    s += '<g class="df"' + d(film ? D[1] : 0) + '><circle class="glow" cx="' + CX + '" cy="' + CY + '" r="112" fill="url(#' + id + ')"/><circle class="ring0" cx="' + CX + '" cy="' + CY + '" r="' + R + '"/><circle class="hub" cx="' + CX + '" cy="' + CY + '" r="' + HUB + '"/>';
    s += '<text class="t-hub" x="' + CX + '" y="' + (CY - 3) + '" text-anchor="middle">Audience</text><text class="t-hub" x="' + CX + '" y="' + (CY + 15) + '" text-anchor="middle">Intelligence</text></g>';
    /* arcs */
    var AT = film ? [D[1] + .7, D[2], D[2] + .7, D[3], D[3] + .7, D[3] + 1.4] : [];
    var NT = film ? [D[1] + .3, D[1] + 1.1, D[2] + .4, D[2] + 1.1, D[3] + .4, D[3] + 1.1] : [];
    NODES.forEach(function(N, i){
      var a = xy(N[4]), b = xy(NODES[(i + 1) % 6][4]);
      s += '<path class="ln arc dr" data-i="' + i + '" pathLength="1"' + d(AT[i] || 0) + ' d="M' + f1(a[0]) + ' ' + f1(a[1]) + ' A' + R + ' ' + R + ' 0 0 1 ' + f1(b[0]) + ' ' + f1(b[1]) + '"/>';
    });
    /* return */
    var fr = xy(240), dx = fr[0] - CX, dy = fr[1] - CY, len = Math.hypot(dx, dy), to = [CX + dx/len*HUB, CY + dy/len*HUB];
    s += '<g class="retg df"' + d(film ? D[3] + 1.8 : 0) + '><path class="ln ret" d="M' + f1(fr[0]) + ' ' + f1(fr[1]) + ' Q' + f1((fr[0] + to[0])/2 - 12) + ' ' + f1((fr[1] + to[1])/2 + 14) + ' ' + f1(to[0]) + ' ' + f1(to[1]) + '"/>';
    s += '<text class="t-eb" x="' + (CX - 20) + '" y="' + (CY + 112) + '" text-anchor="middle" font-size="8">↺ feeds back</text></g>';
    /* nodes + labels */
    NODES.forEach(function(N, i){
      var p = xy(N[4]), x = p[0], y = p[1], side = N[5], tx, ty, anc;
      if (side === 'top'){ tx = x; ty = y - 32; anc = 'middle'; }
      else if (side === 'bottom'){ tx = x; ty = y + 34; anc = 'middle'; }
      else if (side === 'right'){ tx = x + 24; ty = y - 1; anc = 'start'; }
      else { tx = x - 24; ty = y - 1; anc = 'end'; }
      s += '<g class="dnode df" data-i="' + i + '"' + d(NT[i] || 0) + '><circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="22" fill="transparent"/><circle class="nd1" cx="' + f1(x) + '" cy="' + f1(y) + '" r="10"/><circle class="nd0" cx="' + f1(x) + '" cy="' + f1(y) + '" r="5"/>';
      s += '<text class="t-h" x="' + f1(tx) + '" y="' + f1(ty) + '" text-anchor="' + anc + '"><tspan class="dn">' + N[0] + ' </tspan>' + N[1] + '</text>';
      s += '<text class="t-s" x="' + f1(tx) + '" y="' + f1(ty + 15) + '" text-anchor="' + anc + '">' + N[2] + '</text></g>';
    });
    s += '<g class="orb"><circle cx="' + CX + '" cy="' + (CY - R) + '" r="3.2"/><circle cx="' + CX + '" cy="' + (CY - R) + '" r="8" fill-opacity=".25"/></g>';
    s += '</svg>';
    host.innerHTML = s;
  }
  var filmDia = $('[data-dia="film"]'); if (filmDia) diagram(filmDia, true);

  /* specimen 3: step through the loop */
  (function(){
    var live = $('.sp-loop'); if (!live) return;
    var host = $('[data-dia="spec"]', live); diagram(host, false);
    var nums = $('.lp-nums', live), step = 0;
    NODES.forEach(function(N, i){ var b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = N[0]; b.setAttribute('aria-label', 'Step ' + N[0] + ': ' + N[1]); b.addEventListener('click', function(){ set(i); }); nums.appendChild(b); });
    function set(n){
      step = (n + 6) % 6;
      $$('.dnode', host).forEach(function(g){ var i = +g.getAttribute('data-i'); g.classList.toggle('lit', i <= step); g.classList.toggle('cur', i === step); });
      $$('.arc', host).forEach(function(a){ a.classList.toggle('lit', +a.getAttribute('data-i') < step); });
      $('.retg', host).classList.toggle('lit', step >= 4);
      $$('button', nums).forEach(function(b, i){ b.setAttribute('aria-pressed', i === step ? 'true' : 'false'); });
      var N = NODES[step];
      $('[data-lp-n]', live).textContent = N[0]; $('[data-lp-sub]', live).textContent = N[2];
      $('[data-lp-t]', live).textContent = N[1]; $('[data-lp-b]', live).textContent = N[3];
    }
    $$('.dnode', host).forEach(function(g){ g.addEventListener('click', function(){ set(+g.getAttribute('data-i')); }); });
    $('[data-lp="prev"]', live).addEventListener('click', function(){ set(step - 1); });
    $('[data-lp="next"]', live).addEventListener('click', function(){ set(step + 1); });
    set(1);
  })();

  /* ================= journeys specimen: tap fallback ================= */
  (function(){
    var jr = $('[data-jr]'); if (!jr) return;
    $$('.jp', jr).forEach(function(b){ b.addEventListener('click', function(){ var s = b.getAttribute('data-side'); jr.setAttribute('data-w', jr.getAttribute('data-w') === s ? '' : s); }); });
  })();

  /* ================= directory ================= */
  function card(t, i, film){
    var r = rng(t.h.length * 97 + t.a), st = '--x1:' + Math.round(15 + r()*70) + '%;--y1:' + Math.round(10 + r()*60) + '%;--x2:' + Math.round(10 + r()*80) + '%;--y2:' + Math.round(40 + r()*60) + '%;--ang:' + Math.round(100 + r()*160) + 'deg;animation-delay:' + (-r()*9).toFixed(1) + 's';
    var aud = t.a >= 1000 ? (t.a/1000).toFixed(1).replace('.0', '') + 'M' : t.a + 'K';
    return '<div class="tc" style="' + (film ? '--d:' + (2.6 + i*.09).toFixed(2) + 's' : 'animation-delay:' + (i*.03).toFixed(2) + 's') + '"><div class="av" data-l="' + t.h.charAt(1) + '" style="' + st + '">' + (t.reel ? '<span>▸ Reel</span>' : '') + (t.m ? '<span class="mg">◆ Managed</span>' : '') + '</div><div class="tb"><b class="disp">' + esc(t.h) + '</b><p class="eb">' + esc(t.c + ' · ' + t.f + ' · ' + t.r) + '</p><p class="ta">' + aud + ' audience</p></div></div>';
  }
  (function(){
    var host = $('[data-cards="film"]'); if (!host) return;
    var F = [['@northlight', 6400, 'Live', 'UK', 1, 1], ['@pixelharbor', 4800, 'Video', 'USA', 1, 0], ['@quietframe', 3900, 'Live', 'USA', 0, 1], ['@saltandsignal', 3100, 'Short-form', 'AUS', 1, 0], ['@moonlitcache', 2600, 'Video', 'UK', 1, 1],
             ['@ironfern', 2200, 'Live', 'USA', 0, 0], ['@lowtidelabs', 1900, 'Video', 'CAN', 1, 0], ['@tangentplay', 1500, 'Short-form', 'USA', 0, 1], ['@velvetqueue', 1300, 'Live', 'UK', 1, 0], ['@oddcompass', 1100, 'Video', 'AUS', 0, 0]];
    host.innerHTML = F.map(function(f, i){ return card({h:f[0], a:f[1], c:'Gaming', f:f[2], r:f[3], m:f[4], reel:f[5]}, i, true); }).join('');
  })();
  (function(){
    var live = $('.sp-dir'); if (!live) return;
    var ROSTER = [
      {h:'@northlight', c:'Gaming', n:'shooters', f:'Live', r:'UK', a:6400, m:1, reel:1},
      {h:'@pixelharbor', c:'Gaming', n:'sandbox', f:'Video', r:'USA', a:4800, m:1},
      {h:'@saltandsignal', c:'Lifestyle', n:'travel', f:'Short-form', r:'AUS', a:3100, m:1, reel:1},
      {h:'@quietframe', c:'Gaming', n:'strategy', f:'Live', r:'USA', a:920, m:0},
      {h:'@halfcourtpress', c:'Sports', n:'basketball', f:'Video', r:'USA', a:2700, m:1},
      {h:'@deadpandiner', c:'Comedy', n:'sketch', f:'Short-form', r:'UK', a:5200, m:0, reel:1},
      {h:'@moonlitcache', c:'Gaming', n:'racing', f:'Video', r:'UK', a:1400, m:1},
      {h:'@fernandfold', c:'Lifestyle', n:'home', f:'Video', r:'CAN', a:780, m:0},
      {h:'@secondserve', c:'Sports', n:'tennis', f:'Short-form', r:'AUS', a:640, m:1},
      {h:'@lowtidelabs', c:'Lifestyle', n:'food', f:'Short-form', r:'USA', a:2100, m:0, reel:1},
      {h:'@tangentplay', c:'Gaming', n:'sandbox', f:'Short-form', r:'USA', a:1500, m:0},
      {h:'@openmicowl', c:'Comedy', n:'stand-up', f:'Live', r:'USA', a:410, m:1},
      {h:'@trackdayrio', c:'Sports', n:'motorsport', f:'Live', r:'UK', a:1800, m:0},
      {h:'@velvetqueue', c:'Lifestyle', n:'fashion', f:'Video', r:'UK', a:3600, m:1}
    ];
    var CATS = ['Gaming', 'Lifestyle', 'Sports', 'Comedy'], FMTS = ['Video', 'Live', 'Short-form'];
    var S = {q:'', c:null, f:null, sort:'featured'};
    var grid = $('[data-cards="spec"]', live), urlEl = $('[data-dir-url]', live), nEl = $('[data-dir-n]', live), empty = $('.dir-empty', live), qEl = $('[data-dir-q]', live);
    function passes(t, skip){
      if (S.q){ var hay = (t.h + ' ' + t.c + ' ' + t.n + ' ' + t.f + ' ' + t.r).toLowerCase(), ws = S.q.toLowerCase().split(/\s+/).filter(Boolean);
        for (var i = 0; i < ws.length; i++) if (hay.indexOf(ws[i]) < 0) return false; }
      if (skip !== 'c' && S.c && t.c !== S.c) return false;
      if (skip !== 'f' && S.f && t.f !== S.f) return false;
      return true;
    }
    function mk(host, key, vals){
      var all = [null].concat(vals).map(function(v){
        var b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.innerHTML = (v || 'All') + ' <b></b>';
        b.addEventListener('click', function(){ S[key] = (S[key] === v) ? null : v; render(); });
        host.appendChild(b); return {v:v, b:b};
      });
      return function(){
        all.forEach(function(o){
          var n = ROSTER.filter(function(t){ return passes(t, key) && (o.v === null || t[key] === o.v); }).length;
          o.b.lastChild.textContent = n; o.b.setAttribute('aria-pressed', S[key] === o.v ? 'true' : 'false');
          o.b.disabled = n === 0 && S[key] !== o.v;
        });
      };
    }
    var upC = mk($('[data-dir-cat]', live), 'c', CATS), upF = mk($('[data-dir-fmt]', live), 'f', FMTS);
    function render(){
      var res = ROSTER.filter(function(t){ return passes(t); });
      if (S.sort === 'audience') res = res.slice().sort(function(a, b){ return b.a - a.a; });
      else if (S.sort === 'name') res = res.slice().sort(function(a, b){ return a.h.localeCompare(b.h); });
      grid.innerHTML = res.map(function(t, i){ return card(t, i, false); }).join('');
      nEl.textContent = res.length; empty.hidden = res.length > 0;
      upC(); upF();
      $$('[data-sort]', live).forEach(function(b){ b.setAttribute('aria-pressed', b.getAttribute('data-sort') === S.sort ? 'true' : 'false'); });
      var p = []; if (S.q.trim()) p.push('q=' + encodeURIComponent(S.q.trim()).replace(/%20/g, '+')); if (S.c) p.push('category=' + S.c); if (S.f) p.push('format=' + S.f.toLowerCase()); if (S.sort !== 'featured') p.push('sort=' + S.sort);
      urlEl.textContent = '/talent' + (p.length ? '?' + p.join('&') : '');
    }
    qEl.addEventListener('input', function(){ S.q = qEl.value; render(); });
    $$('[data-sort]', live).forEach(function(b){ b.addEventListener('click', function(){ S.sort = b.getAttribute('data-sort'); render(); }); });
    render();
  })();

  /* ================= dotted world map ================= */
  (function(){
    var host = $('[data-map]'); if (!host) return;
    var RUNS = "M37 0h2M41 0h0M82 0h24M157 0h1M178 0h14M37 1h8M48 1h1M53 1h1M56 1h0M58 1h0M60 1h1M63 1h2M84 1h17M103 1h1M155 1h1M166 1h1M174 1h20M196 1h9M214 1h0M0 2h1M15 2h0M38 2h0M42 2h7M56 2h1M61 2h1M64 2h8M85 2h17M104 2h1M156 2h0M165 2h2M169 2h1M172 2h33M208 2h12M239 2h0M11 3h14M32 3h3M38 3h0M42 3h10M54 3h0M56 3h1M63 3h0M66 3h0M69 3h5M83 3h1M86 3h17M132 3h9M160 3h1M165 3h2M169 3h57M232 3h0M234 3h3M0 4h1M9 4h33M49 4h0M54 4h1M57 4h3M63 4h1M69 4h0M71 4h3M86 4h13M131 4h14M149 4h1M154 4h1M157 4h11M170 4h69M0 5h2M4 5h1M12 5h52M71 5h7M85 5h11M129 5h12M143 5h3M150 5h15M167 5h0M169 5h70M3 6h1M9 6h52M63 6h0M68 6h6M77 6h0M85 6h7M105 6h5M129 6h4M137 6h5M147 6h92M13 7h44M59 7h0M62 7h1M65 7h0M72 7h4M86 7h6M106 7h1M126 7h7M135 7h103M10 8h47M64 8h0M68 8h2M74 8h1M87 8h4M115 8h0M124 8h7M134 8h102M11 9h9M22 9h34M68 9h5M89 9h2M123 9h8M134 9h89M229 9h4M12 10h4M27 10h29M68 10h5M76 10h1M123 10h8M136 10h78M217 10h0M221 10h1M227 10h1M15 11h0M17 11h0M29 11h28M69 11h9M116 11h0M128 11h2M132 11h0M136 11h76M225 11h3M13 12h0M32 12h28M67 12h0M69 12h9M116 12h1M125 12h1M129 12h1M134 12h77M224 12h4M10 13h0M31 13h0M33 13h31M67 13h13M114 13h1M118 13h0M126 13h1M133 13h76M224 13h3M34 14h30M67 14h15M114 14h1M117 14h2M124 14h89M224 14h2M35 15h30M67 15h14M113 15h0M117 15h3M123 15h90M215 15h0M224 15h0M35 16h40M79 16h0M116 16h1M121 16h92M215 16h0M223 16h0M37 17h36M75 17h1M81 17h2M119 17h93M37 18h39M84 18h0M119 18h93M37 19h40M119 19h20M142 19h0M145 19h6M155 19h56M37 20h36M76 20h0M119 20h8M130 20h8M146 20h4M154 20h56M214 20h1M37 21h35M114 21h7M127 21h1M132 21h6M148 21h3M155 21h52M213 21h2M37 22h33M114 22h6M129 22h1M133 22h5M141 22h3M147 22h5M156 22h49M37 23h33M114 23h5M133 23h1M137 23h15M156 23h43M201 23h0M203 23h1M213 23h1M38 24h31M114 24h5M130 24h0M134 24h1M138 24h14M156 24h42M203 24h2M213 24h0M39 25h29M116 25h0M122 25h0M124 25h2M138 25h1M141 25h12M155 25h45M204 25h1M211 25h2M39 26h29M116 26h1M119 26h7M136 26h1M142 26h0M144 26h55M204 26h1M208 26h5M41 27h25M115 27h11M144 27h55M206 27h0M208 27h2M42 28h23M114 28h15M133 28h1M143 28h57M207 28h0M43 29h0M45 29h20M113 29h18M133 29h67M43 30h13M59 30h1M65 30h0M113 30h38M154 30h46M43 31h1M46 31h8M65 31h0M111 31h30M144 31h8M155 31h44M45 32h0M47 32h7M65 32h1M110 32h32M144 32h8M158 32h41M45 33h0M48 33h6M110 33h32M145 33h8M156 33h1M165 33h33M49 34h5M109 34h34M146 34h12M166 34h31M200 34h0M50 35h4M67 35h0M109 35h35M146 35h13M166 35h13M181 35h13M50 36h4M60 36h1M68 36h2M109 36h35M147 36h11M169 36h8M182 36h8M51 37h4M59 37h2M72 37h1M109 37h35M147 37h10M169 37h6M183 37h6M192 37h1M53 38h7M109 38h36M148 38h8M169 38h5M183 38h7M200 38h1M55 39h0M58 39h5M109 39h36M148 39h6M169 39h4M185 39h6M200 39h0M59 40h5M109 40h38M149 40h3M170 40h2M185 40h7M200 40h0M62 41h1M109 41h40M170 41h2M186 41h6M63 42h0M71 42h0M73 42h0M109 42h39M152 42h1M171 42h1M189 42h3M201 42h2M64 43h0M70 43h1M73 43h5M111 43h42M171 43h2M190 43h0M65 44h0M68 44h11M111 44h41M171 44h0M173 44h0M186 44h0M202 44h1M68 45h12M112 45h40M173 45h1M187 45h0M203 45h0M68 46h16M114 46h4M124 46h27M183 46h1M187 46h1M197 46h2M69 47h16M126 47h25M184 47h1M187 47h1M196 47h1M68 48h17M127 48h22M185 48h1M188 48h0M194 48h4M205 48h0M67 49h18M126 49h22M186 49h1M193 49h5M200 49h2M205 49h0M66 50h22M126 50h21M187 50h1M193 50h4M205 50h0M208 50h0M210 50h0M66 51h23M126 51h20M186 51h3M193 51h4M199 51h1M208 51h0M211 51h1M66 52h27M127 52h19M188 52h2M196 52h1M201 52h0M204 52h0M209 52h6M66 53h29M128 53h18M189 53h1M212 53h4M67 54h29M128 54h17M190 54h1M209 54h0M213 54h4M67 55h29M129 55h16M194 55h2M202 55h0M212 55h3M217 55h1M68 56h27M129 56h16M202 56h0M218 56h1M68 57h26M129 57h17M207 57h0M69 58h25M129 58h17M207 58h3M215 58h0M69 59h24M128 59h18M152 59h0M204 59h0M206 59h4M214 59h1M70 60h23M128 60h18M151 60h2M203 60h7M214 60h2M72 61h21M128 61h16M149 61h3M201 61h11M214 61h2M73 62h20M128 62h15M149 62h3M201 62h16M73 63h19M129 63h13M150 63h1M158 63h0M199 63h19M73 64h19M129 64h14M149 64h2M197 64h22M230 64h0M73 65h16M130 65h13M149 65h2M196 65h24M73 66h14M130 66h12M149 66h1M196 66h25M73 67h14M130 67h11M195 67h26M73 68h14M130 68h11M196 68h25M72 69h14M131 69h9M197 69h24M72 70h13M132 70h7M197 70h24M72 71h12M132 71h6M197 71h7M209 71h12M72 72h11M132 72h4M197 72h4M210 72h0M212 72h8M72 73h9M212 73h7M235 73h0M71 74h10M213 74h6M236 74h0M71 75h9M214 75h1M217 75h0M236 75h2M71 76h7M236 76h1M71 77h5M216 77h2M236 77h0M71 78h6M217 78h1M234 78h1M71 79h4M232 79h1M71 80h3M231 80h2M70 81h5M70 82h4M70 83h3M71 84h2M80 84h0M71 85h2M74 86h2";
    var COLS = 240, ROWS = 87, STEP = 1.5;
    var OFF = [['a', 'TX', 33.15, -96.82, 'l'], ['b', 'NYC', 40.71, -74.01, 'r'], ['c', 'MIA', 25.76, -80.19, 'r'], ['d', 'LDN', 51.51, -.13, 'r'], ['e', 'SYD', -33.87, 151.21, 'l']];
    var RT = [['b', 'd'], ['c', 'd', 0, 1], ['d', 'e'], ['e', 'a', 1], ['a', 'b'], ['b', 'c'], ['c', 'a', 0, 1]];
    function gp(id){ for (var i = 0; i < OFF.length; i++) if (OFF[i][0] === id) return {x:(OFF[i][3] + 180)/STEP - .5, y:(75 - OFF[i][2])/STEP - .5}; }
    function path(r){
      var a = gp(r[0]), b = gp(r[1]); if (r[2]){ if (b.x < a.x) b.x += COLS; else a.x += COLS; }
      var dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy), nx = dy/len, ny = -dx/len;
      if (ny > 0 || (ny === 0 && nx > 0)){ nx = -nx; ny = -ny; }
      var sg = r[3] ? -1 : 1, cx = (a.x + b.x)/2 + nx*len*.22*sg, cy = (a.y + b.y)/2 + ny*len*.22*sg;
      return 'M' + a.x.toFixed(2) + ' ' + a.y.toFixed(2) + 'Q' + cx.toFixed(2) + ' ' + cy.toFixed(2) + ' ' + b.x.toFixed(2) + ' ' + b.y.toFixed(2);
    }
    var s = '<svg viewBox="-0.5 -0.5 240 87" preserveAspectRatio="none" aria-hidden="true"><path class="wd" d="' + RUNS + '"/>';
    RT.forEach(function(r, i){
      var d = path(r), one = '<path class="rt" d="' + d + '"/><path class="rp" pathLength="1" style="animation-delay:' + (-i*1.1) + 's" d="' + d + '"/>';
      s += '<g>' + one + (r[2] ? '<g transform="translate(-240 0)">' + one + '</g>' : '') + '</g>';
    });
    s += '</svg>';
    OFF.forEach(function(o, i){
      s += '<span class="pin ' + o[4] + '" style="left:' + (((o[3] + 180)/STEP/COLS)*100).toFixed(2) + '%;top:' + (((75 - o[2])/STEP/ROWS)*100).toFixed(2) + '%;--i:' + i + '"><b>' + o[1] + '</b></span>';
    });
    host.innerHTML = s;
    $$('.pin', host).forEach(function(p, i){ p.style.setProperty('--pd', (-i*.5) + 's'); });
  })();
})();
