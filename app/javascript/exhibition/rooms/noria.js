(function(){
  var root = document.getElementById('noria'); if (!root) return;
  var E = window.Exhibit || {reduce:true, visible:function(el,cb){cb(true);}, loop:function(el,fn){requestAnimationFrame(function(t){fn(t,16);});},
    fit:function(cv){var r=cv.getBoundingClientRect(),c=cv.getContext('2d');cv.width=r.width;cv.height=r.height;c.w=r.width;c.h=r.height;return c;}};
  function $(s, el){ return (el || root).querySelector(s); }
  function $$(s, el){ return [].slice.call((el || root).querySelectorAll(s)); }

  /* ---------------- flow field (port of HeroField) ---------------- */
  function field(cv, opt){
    var P = [], w = 0, h = 0, k = 1, c = null, px = -1e4, py = -1e4, api = {count:0, radius:260, onseed:null};
    function rand(a, b){ return a + Math.random() * (b - a); }
    function spawn(now){ return {x:rand(0,w), y:rand(0,h), sp:rand(26,70)*k, sz:rand(.7,1.8)*Math.max(.6,k), al:rand(.1,.3), ac:Math.random() < .8, die:now + rand(4000,11000)}; }
    function step(now, dt){
      var cx = w * (opt.cx || .5), cy = h * (opt.cy || .5), ringR = Math.min(w, h) * .42, R = api.radius;
      c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
      c.fillStyle = 'rgba(10,10,10,0.085)'; c.fillRect(0, 0, w, h);
      c.globalCompositeOperation = 'lighter'; c.lineCap = 'round';
      for (var i = 0; i < P.length; i++){
        var p = P[i];
        if (now > p.die || p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20){ P[i] = spawn(now); continue; }
        var sx = p.x / k, sy = p.y / k;
        var n = Math.sin(sx * .004 + now * .00035) + Math.cos(sy * .0045 - now * .00028) + Math.sin((sx + sy) * .0019 + now * .0002);
        var vx = Math.cos(n * 1.15) * .6, vy = Math.sin(n * 1.15) * .6;
        var dx = p.x - cx, dy = p.y - cy, dist = Math.sqrt(dx*dx + dy*dy) || 1;
        var ow = Math.exp(-Math.pow(dist - ringR, 2) / (2 * Math.pow(ringR * .55, 2)));
        var tg = Math.atan2(dy, dx) + Math.PI / 2;
        vx += Math.cos(tg) * ow * 1.1; vy += Math.sin(tg) * ow * 1.1;
        var qx = p.x - px, qy = p.y - py, pd = Math.sqrt(qx*qx + qy*qy);
        if (pd < R){ var s = (1 - pd / R) * 2.2, pt = Math.atan2(qy, qx) + Math.PI / 2; vx += Math.cos(pt) * s; vy += Math.sin(pt) * s; }
        var a = Math.atan2(vy, vx), nx = p.x + Math.cos(a) * p.sp * dt, ny = p.y + Math.sin(a) * p.sp * dt;
        c.strokeStyle = p.ac ? '#00e5ff' : '#f2f2f0';
        c.globalAlpha = p.al * (.55 + ow * .45) * (opt.gain || 1);
        c.lineWidth = p.sz;
        c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(nx, ny); c.stroke();
        p.x = nx; p.y = ny;
      }
      c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    }
    function seed(now, warm){
      k = Math.max(.35, Math.min(1, w / 1100));
      api.radius = Math.round(Math.max(90, Math.min(260, w * .3)));
      P.length = 0;
      var count = Math.max(60, Math.min(750, Math.round((w * h) / (opt.per || 2400))));
      var t0 = now - warm * 16, i;
      for (i = 0; i < count; i++) P.push(spawn(t0));
      c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1; c.fillStyle = '#0a0a0a'; c.fillRect(0, 0, w, h);
      for (i = 0; i < warm; i++) step(t0 + i * 16, .016);
      api.count = count; if (api.onseed) api.onseed(api);
    }
    api.reseed = function(){ if (c && w) seed(performance.now(), E.reduce ? 240 : 40); };
    api.point = function(x, y){ px = x; py = y; };
    E.loop(cv, function(t, dt){
      c = E.fit(cv);
      if (!c.w || !c.h) return;
      if (Math.abs(c.w - w) > 1 || Math.abs(c.h - h) > 1){ w = c.w; h = c.h; seed(t, E.reduce ? 240 : 90); }
      else if (!E.reduce) step(t, dt / 1000);
    });
    return api;
  }

  var heroCv = $('.s1 .field');
  if (heroCv) field(heroCv, {cx:.5, cy:.54, per:1500, gain:1.25});

  var spF = $('.sp-field');
  if (spF){
    var fApi = field($('canvas', spF), {per:800, gain:1.9});
    var cEl = $('[data-count]', spF), rEl = $('[data-rad]', spF);
    fApi.onseed = function(a){ cEl.textContent = a.count; rEl.textContent = a.radius; };
    spF.addEventListener('pointermove', function(e){ var r = spF.getBoundingClientRect(); fApi.point(e.clientX - r.left, e.clientY - r.top); });
    spF.addEventListener('pointerleave', function(){ fApi.point(-1e4, -1e4); });
    $('[data-reseed]', spF).addEventListener('click', function(){ fApi.reseed(); });
  }

  /* ---------------- language pill + theme beacon ---------------- */
  var spL = $('.sp-lang');
  if (spL){
    var COPY = {
      en:{tag:'01 — AI engineering, not AI theater', l1:'Linear', l2:'to', l3:'Exponential.', sub:'Custom AI software, agents, and automations — built for how you actually operate, shipped in weeks.', cta:'Book a free 30-minute call'},
      es:{tag:'01 — Ingeniería de IA, no teatro de IA', l1:'Lineal', l2:'a', l3:'Exponencial.', sub:'Software de IA, agentes y automatizaciones a la medida — hechos para cómo opera tu empresa y entregados en semanas.', cta:'Agenda una llamada gratis de 30 min'}
    };
    var url = $('[data-url]', spL);
    $$('[data-lang]', spL).forEach(function(b){
      b.addEventListener('click', function(){
        var lang = b.getAttribute('data-lang'); if (spL.getAttribute('lang') === lang) return;
        spL.setAttribute('lang', lang); url.textContent = '/' + lang;
        $$('[data-lang]', spL).forEach(function(o){ o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
        $$('[data-k]', spL).forEach(function(n){ n.textContent = COPY[lang][n.getAttribute('data-k')]; });
        spL.classList.remove('swap'); void spL.offsetWidth; spL.classList.add('swap');
      });
    });
    var bc = $('[data-beacon]', spL), bl = $('[data-beacon-label]', spL);
    bc.addEventListener('click', function(){
      var lt = spL.classList.toggle('lt');
      bc.setAttribute('aria-pressed', lt ? 'true' : 'false'); bl.textContent = lt ? 'Beacon: light' : 'Beacon: dark';
    });
  }

  /* ---------------- slot generator (port of lib/booking/slots.ts) ---------------- */
  var spS = $('.sp-slot');
  if (spS) (function(){
    var HOST = 'America/Chicago', WINDOW = [9 * 60, 18 * 60], DUR = 30, STEP = 30;
    function pad(n){ return (n < 10 ? '0' : '') + n; }
    function tzOffsetMs(ms, tz){
      var parts = {}, f = new Intl.DateTimeFormat('en-US', {timeZone:tz, hour12:false, year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit'});
      f.formatToParts(new Date(ms)).forEach(function(p){ parts[p.type] = p.value; });
      var hr = parts.hour === '24' ? 0 : +parts.hour;
      return Date.UTC(+parts.year, +parts.month - 1, +parts.day, hr, +parts.minute, +parts.second) - ms;
    }
    function wallToUtc(y, m, d, hh, mm, tz){
      var guess = Date.UTC(y, m - 1, d, hh, mm), o1 = tzOffsetMs(guess, tz), utc = guess - o1, o2 = tzOffsetMs(utc, tz);
      if (o2 !== o1) utc = guess - o2;
      return utc;
    }
    function slotsFor(y, m, d){
      var out = [];
      for (var s = WINDOW[0]; s + DUR <= WINDOW[1]; s += STEP) out.push(wallToUtc(y, m, d, Math.floor(s / 60), s % 60, HOST));
      return out;
    }
    function off(ms){ var mins = Math.round(ms / 60000), sg = mins < 0 ? '−' : '+'; mins = Math.abs(mins); return 'UTC' + sg + Math.floor(mins / 60) + (mins % 60 ? ':' + pad(mins % 60) : ''); }
    function zulu(ms){ var d = new Date(ms); return pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + 'Z'; }
    function ics(ms){ return new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); }
    var tz = 'America/Guayaquil', date = '2027-03-15', picked = 0;
    var out = $('[data-out]', spS), hostEl = $('[data-host]', spS), youEl = $('[data-you]', spS), firstEl = $('[data-first]', spS), icsEl = $('[data-ics]', spS);
    function render(){
      var p = date.split('-').map(Number), list;
      try { list = slotsFor(p[0], p[1], p[2]); } catch (e) { out.textContent = 'This browser cannot resolve named time zones.'; return; }
      var tf = new Intl.DateTimeFormat('en-US', {timeZone:tz, hour:'numeric', minute:'2-digit'});
      var df = new Intl.DateTimeFormat('en-US', {timeZone:tz, weekday:'short', month:'short', day:'numeric'});
      hostEl.textContent = HOST + ' · ' + off(tzOffsetMs(list[0], HOST));
      youEl.textContent = tz + ' · ' + off(tzOffsetMs(list[0], tz));
      firstEl.textContent = zulu(list[0]) + ' = ' + tf.format(new Date(list[0]));
      out.innerHTML = ''; var lastDay = '';
      list.forEach(function(ms, i){
        var day = df.format(new Date(ms));
        if (day !== lastDay){ var h = document.createElement('h5'); h.textContent = day + ' · your time'; out.appendChild(h); lastDay = day; }
        var b = document.createElement('button'); b.type = 'button'; b.textContent = tf.format(new Date(ms)); b.style.setProperty('--i', i);
        b.setAttribute('aria-pressed', i === picked ? 'true' : 'false');
        b.addEventListener('click', function(){ picked = i; $$('button', out).forEach(function(o){ o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); }); line(list); });
        out.appendChild(b);
      });
      line(list);
    }
    function line(list){ icsEl.textContent = 'DTSTART:' + ics(list[picked]) + '  DTEND:' + ics(list[picked] + DUR * 60000); }
    function group(sel, set){
      $$(sel + ' button', spS).forEach(function(b){
        b.addEventListener('click', function(){
          $$(sel + ' button', spS).forEach(function(o){ o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
          set(b.getAttribute('data-v')); render();
        });
      });
    }
    group('[data-tz]', function(v){ tz = v; });
    group('[data-date]', function(v){ date = v; });
    render();
  })();

  /* ---------------- pixel portraits + player cards ---------------- */
  var crew = $('[data-crew]');
  if (crew) (function(){
    var S = 24, CX = 11.5, CY = 10, RX = 5.6, RY = 6.8;
    var EMPTY = 0, SK1 = 1, SK2 = 2, SK3 = 3, HAIR = 4, HAIR2 = 5, GLOW = 6, SHIRT = 7, SHIRT2 = 8, INK = 9, GEAR = 10, RIM = 11;
    function inHead(x, y){ return Math.pow((x - CX) / RX, 2) + Math.pow((y - CY) / RY, 2) <= 1; }
    function build(sp){
      var g = [], x, y;
      for (y = 0; y < S; y++){ g.push([]); for (x = 0; x < S; x++) g[y].push(EMPTY); }
      function set(x, y, v){ if (x >= 0 && x < S && y >= 0 && y < S) g[y][x] = v; }
      function row(y, a, b, v){ for (var i = a; i <= b; i++) set(i, y, v); }
      for (y = 18; y < S; y++){ var half = 5.5 + (y - 18) * 1.1; for (x = 0; x < S; x++){ var d = x + .5 - (CX + .5); if (Math.abs(d) <= half) set(x, y, d > half - 2.5 ? SHIRT2 : SHIRT); } }
      if (sp.zip){ for (y = 19; y < S; y++) set(12, y, GEAR); row(18, 9, 14, SHIRT2); }
      else { set(11, 18, SK3); set(12, 18, SK3); set(11, 19, SK3); set(12, 19, SK3); }
      for (y = 15; y <= 17; y++) row(y, 9, 14, y === 17 ? SK3 : SK2);
      for (y = 0; y < S; y++) for (x = 0; x < S; x++){
        if (!inHead(x + .5, y + .5)) continue;
        var dx = x + .5 - CX, v = SK1;
        if (dx > 3.6 || y >= 15) v = SK3; else if (dx > 1.8 || dx < -4.2 || y >= 14) v = SK2;
        set(x, y, v);
      }
      set(5, 10, SK2); set(5, 11, SK2); set(18, 10, SK3); set(18, 11, SK3);
      row(8, 8, 9, INK); row(8, 13, 14, INK); set(9, 10, INK); set(14, 10, INK); set(12, 12, SK3);
      row(14, 10, 13, INK);
      if (sp.top === 'cap'){
        row(2, 8, 15, SHIRT); row(3, 7, 16, SHIRT); row(4, 6, 17, SHIRT); row(5, 6, 17, SHIRT); row(6, 6, 17, SHIRT2);
        row(7, 2, 12, GEAR); row(3, 9, 11, GLOW);
        set(5, 7, HAIR); set(5, 8, HAIR); set(18, 7, HAIR); set(18, 8, HAIR); set(18, 9, HAIR);
      } else if (sp.top === 'long'){
        for (y = 1; y <= 6; y++) for (x = 4; x <= 19; x++){
          if (Math.pow((x + .5 - CX) / 7.6, 2) + Math.pow((y + .5 - 5.2) / 4.6, 2) > 1) continue;
          if (y === 6 && x >= 8 && x <= 13) continue;
          set(x, y, (x + y * 2) % 5 === 0 ? HAIR2 : HAIR);
        }
        for (y = 7; y <= 17; y++){ set(4, y, HAIR); set(5, y, y % 3 ? HAIR : HAIR2); set(18, y, HAIR); set(19, y, y % 4 ? HAIR : HAIR2); if (y > 12){ set(6, y, HAIR); set(17, y, HAIR); } }
        [[7, 11], [12, 16]].forEach(function(r){ row(9, r[0] + 1, r[1] - 1, GEAR); row(11, r[0] + 1, r[1] - 1, GEAR); set(r[0], 10, GEAR); set(r[1], 10, GEAR); for (var i = r[0] + 1; i < r[1]; i++) set(i, 10, GLOW); });
        set(11, 10, GEAR); set(12, 10, GEAR);
      } else {
        for (y = 0; y <= 4; y++) row(y, 10, 13, y % 2 ? HAIR : HAIR2);
        row(5, 9, 14, HAIR); row(4, 6, 9, HAIR2); row(4, 14, 17, HAIR2);
        row(2, 6, 9, GEAR); row(2, 14, 17, GEAR); set(5, 3, GEAR); set(18, 3, GEAR);
        for (y = 4; y <= 8; y++){ set(5, y, GEAR); set(18, y, GEAR); }
        for (y = 9; y <= 12; y++){ set(18, y, GEAR); set(19, y, GEAR); }
        row(13, 15, 18, GEAR); set(14, 13, GLOW);
      }
      function filled(x, y){ return x >= 0 && x < S && y >= 0 && y < S && g[y][x] !== EMPTY && g[y][x] !== RIM; }
      for (y = 0; y < S; y++) for (x = 0; x < S; x++){ if (g[y][x] === EMPTY && (filled(x - 1, y) || filled(x, y + 1))) set(x, y, RIM); }
      return g;
    }
    function palette(ac){
      var p = []; p[SK1] = '#dcdcd6'; p[SK2] = '#a9a9a3'; p[SK3] = '#6f6f6a'; p[HAIR] = '#26282a'; p[HAIR2] = '#474b4e'; p[GLOW] = ac;
      p[SHIRT] = ac; p[SHIRT2] = 'color-mix(in srgb,' + ac + ' 62%,#000)'; p[INK] = '#0a0a0a'; p[GEAR] = '#3a3f42'; p[RIM] = 'color-mix(in srgb,' + ac + ' 38%,transparent)';
      return p;
    }
    function seed(x, y, salt){ var n = Math.sin(x * 12.9898 + y * 78.233 + salt * 37.719) * 43758.5453; return n - Math.floor(n); }
    var NS = 'http://www.w3.org/2000/svg';
    var CREW = [
      {p:'P1', title:'The Generalist', role:'Strategy · product · code', ac:'#27e0a2', top:'cap', stats:[['Mapping', 9], ['Product', 8], ['Code', 7]], sp:'Reads the whole floor.'},
      {p:'P2', title:'The Builder', role:'Interfaces · data · agents', ac:'#00e5ff', top:'long', zip:true, stats:[['Frontend', 9], ['Backend', 9], ['Agents', 8]], sp:'Turns a maybe into a link.'},
      {p:'P3', title:'The Closer', role:'Scope · cadence · delivery', ac:'#ff3b1f', top:'hawk', stats:[['Scope', 9], ['Cadence', 8], ['Follow-up', 9]], sp:'Keeps every thread warm.'}
    ];
    CREW.forEach(function(m, idx){
      var card = document.createElement('article'); card.className = 'pc'; card.style.setProperty('--ca', m.ac);
      card.innerHTML = '<div class="pc-top"><span>' + m.p + '</span><span>Ready</span></div>';
      var av = document.createElement('button'); av.type = 'button'; av.className = 'av'; av.setAttribute('aria-label', 'Reboot portrait ' + m.p);
      var svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('shape-rendering', 'crispEdges'); svg.setAttribute('aria-hidden', 'true');
      var grid = build(m), pal = palette(m.ac);
      grid.forEach(function(r, y){ r.forEach(function(v, x){
        if (v === EMPTY) return;
        var eye = v === INK && y === 10, t = seed(x, y, idx + 1) * .58 + (y / S) * .42;
        var stp = eye ? 7 : Math.min(7, Math.floor(t * 8));
        var rc = document.createElementNS(NS, 'rect'); rc.setAttribute('x', x); rc.setAttribute('y', y); rc.setAttribute('width', 1.04); rc.setAttribute('height', 1.04);
        rc.style.fill = pal[v]; rc.style.setProperty('--d', (stp / 8 * 1.2).toFixed(2) + 's');
        if (eye){ rc.setAttribute('class', 'eye'); rc.style.setProperty('--bl', (2 + (idx + 1) * 1.3) + 's'); }
        svg.appendChild(rc);
      }); });
      av.appendChild(svg);
      var crt = document.createElement('span'); crt.className = 'crt'; av.appendChild(crt);
      var scan = document.createElement('span'); scan.className = 'scan'; av.appendChild(scan);
      card.appendChild(av);
      var html = '<h5>' + m.title + '</h5><p class="pc-role">' + m.role + '</p><ul>';
      m.stats.forEach(function(s, si){
        html += '<li>' + s[0] + '<span role="img" aria-label="' + s[0] + ': ' + s[1] + ' of 10">';
        for (var k2 = 0; k2 < 10; k2++) html += '<i' + (k2 < s[1] ? ' class="f"' : '') + ' style="--d:' + (.5 + si * .15 + k2 * .035).toFixed(2) + 's"></i>';
        html += '</span></li>';
      });
      html += '</ul><div class="pc-sp"><span>Special move</span><p>' + m.sp + '</p></div>';
      card.insertAdjacentHTML('beforeend', html);
      crew.appendChild(card);
      function boot(){ av.classList.remove('boot'); card.classList.remove('boot'); void av.offsetWidth; av.classList.add('boot'); card.classList.add('boot'); }
      av.addEventListener('click', boot);
      card._boot = boot;
    });
    var booted = false;
    E.visible(crew, function(v){ if (v && !booted && !E.reduce){ booted = true; $$('.pc', crew).forEach(function(c2, i){ setTimeout(c2._boot, i * 140); }); } }, .25);
  })();
})();
