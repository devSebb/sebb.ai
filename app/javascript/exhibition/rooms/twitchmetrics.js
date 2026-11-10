(function(){
  var R = document.getElementById('twitchmetrics'); if (!R) return;
  var E = window.Exhibit || {reduce:true, loop:function(el, fn){ fn(0, 16); }, visible:function(el, cb){ cb(true); }};
  function $(s, c){ return (c || R).querySelector(s); }
  function $$(s, c){ return [].slice.call((c || R).querySelectorAll(s)); }

  var PC = {tw:'#9146ff', yt:'#ff0000', ig:'#e4405f', tt:'#69C9D0', x:'#F2F3F5', kk:'#53fc18'};
  var MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var END = Date.UTC(2026, 10, 9), DAY = 864e5;
  function fmt(n){
    var a = Math.abs(n);
    if (a >= 1e6) return (n/1e6).toFixed(2).replace(/0$/, '').replace(/\.0$/, '') + 'M';
    if (a >= 1e4) return (n/1e3).toFixed(1).replace(/\.0$/, '') + 'K';
    if (a >= 1e3) return (n/1e3).toFixed(1).replace(/\.0$/, '') + 'K';
    return '' + Math.round(n);
  }
  function commas(n){ return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function dlabel(ms, year){ var d = new Date(ms); return MON[d.getUTCMonth()] + ' ' + d.getUTCDate() + (year ? ', ' + d.getUTCFullYear() : ''); }
  function rng(seed){ return function(){ seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }; }
  /* same rule as the product: direction comes from the real delta */
  function trend(delta, pct){
    var up = delta > 0, dn = delta < 0, p = Math.abs(pct).toFixed(1);
    return '<span class="tr ' + (up ? 'up' : dn ? 'dn' : 'fl0') + '">' + (up ? '▲ +' : dn ? '▼ -' : '– ') + fmt(Math.abs(delta)) +
      ' <em>(' + (p === '0.0' ? '' : pct > 0 ? '+' : '-') + p + '%)</em></span>';
  }
  function dots(list){ return list.map(function(k){ return '<i class="pd ' + k + '"></i>'; }).join(''); }

  /* ---------- icons ---------- */
  var IC = {
    search:'<circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L14 14"/>',
    chart:'<path d="M2 14V8.5h3V14zM6.5 14V2.5h3V14zM11 14V6h3v8z"/>',
    trend:'<path d="M1.5 12l4-4.5 3 2.5 5.5-6.5" fill="none"/><path d="M10.5 3.5H14V7" fill="none"/>',
    users:'<circle cx="6" cy="5.2" r="2.6"/><path d="M1.5 14c0-3 2-4.6 4.5-4.6s4.5 1.6 4.5 4.6z"/><path d="M10.6 3a2.4 2.4 0 010 4.6M12 9.8c1.6.5 2.6 2 2.6 4.2" fill="none"/>',
    pad:'<rect x="1.5" y="4.5" width="13" height="7.6" rx="3.8"/><path d="M5 7v2.6M3.7 8.3h2.6M10.4 7.6h.1M12 9.2h.1" fill="none"/>',
    list:'<path d="M2.5 4h11M2.5 8h11M2.5 12h11" fill="none"/>',
    grid:'<rect x="2" y="2" width="5" height="5" rx="1"/><rect x="9" y="2" width="5" height="5" rx="1"/><rect x="2" y="9" width="5" height="5" rx="1"/><rect x="9" y="9" width="5" height="5" rx="1"/>',
    download:'<path d="M8 2v8M4.6 7L8 10.4 11.4 7M2.5 13.5h11" fill="none"/>',
    shield:'<path d="M8 1.5l5.5 2v4c0 3.5-2.4 5.8-5.5 7-3.1-1.2-5.5-3.5-5.5-7v-4z"/><path d="M5.6 8l1.8 1.8L10.6 6" fill="none"/>',
    copy:'<rect x="5.5" y="5.5" width="8" height="8" rx="1.5"/><path d="M10.5 3.5v-1h-8v8h1" fill="none"/>',
    pdf:'<path d="M4 1.5h5.5l3 3V14.5H4z"/><path d="M9.5 1.5v3h3M6 8.5h4.5M6 11h4.5" fill="none"/>',
    csv:'<rect x="2" y="2.5" width="12" height="11" rx="1.5"/><path d="M2 6.2h12M2 9.8h12M6.2 2.5v11" fill="none"/>',
    gauge:'<path d="M2 11.5a6 6 0 1112 0z"/><path d="M8 11.5l3-4.5" fill="none"/>'
  };
  function icons(root){ $$('[data-ic]', root).forEach(function(el){ el.innerHTML = '<svg class="ic" viewBox="0 0 16 16" aria-hidden="true">' + (IC[el.getAttribute('data-ic')] || '') + '</svg>'; }); }

  /* ---------- header ---------- */
  $$('.hd').forEach(function(el){
    var u = el.getAttribute('data-user'), act = +el.getAttribute('data-active');
    el.innerHTML = '<b class="logo">TwitchMetrics</b><nav>' + ['Channels','Categories','Reports','Solutions ▾'].map(function(n, i){
        return '<span' + (i === act ? ' class="on"' : '') + '>' + n + '</span>'; }).join('') + '</nav>' +
      '<div class="srch"><i data-ic="search"></i>Search creators &amp; games…</div>' +
      (u ? '<div class="who"><i class="av" style="--c:#9146ff;--d:#E32C19">' + u.charAt(0) + '</i>' + u + ' ▾</div>'
         : '<span class="login">Log in</span><span class="btn red sm">Sign up</span>');
  });

  /* ---------- data ---------- */
  var CREATORS = [
    {n:'Nova Quill',   s:'nova-quill',   c:'#9146ff', d:'#E32C19', p:{tw:612000, yt:284000, ig:96400, tt:201000, x:58200, kk:31900}, g:6.7,  st:'a', sy:'4 min ago'},
    {n:'DriftLoaf',    s:'driftloaf',    c:'#53fc18', d:'#0f766e', p:{tw:1120000, yt:540000, kk:280000},                        g:2.1,  st:'a', sy:'12 min ago'},
    {n:'Kestrel Wynn', s:'kestrel-wynn', c:'#ff0000', d:'#7c2d12', p:{yt:498000, tw:210000, ig:74000, x:41000},                 g:4.9,  st:'a', sy:'1 hour ago'},
    {n:'Okami Byte',   s:'okami-byte',   c:'#69C9D0', d:'#4F3B8C', p:{tt:318000, tw:142000, ig:52000},                          g:-1.2, st:'a', sy:'1 hour ago'},
    {n:'Juno Farrow',  s:'juno-farrow',  c:'#e4405f', d:'#f59e0b', p:{ig:151000, tt:98600, yt:55000},                           g:6.4,  st:'a', sy:'3 hours ago'},
    {n:'PixelMoth',    s:'pixelmoth',    c:'#5865F2', d:'#9146ff', p:{tw:402000, kk:128300, yt:80000},                          g:0,    st:'p', sy:'5 hours ago', ex:'11/25/2026'},
    {n:'MossyCart',    s:'mossycart',    c:'#22c55e', d:'#365314', p:{tw:38400, yt:12200},                                      g:34,   st:'p', sy:'13 hours ago', ex:'11/26/2026'},
    {n:'Echo Varga',   s:'echo-varga',   c:'#f59e0b', d:'#E32C19', p:{kk:226000, tw:94000, x:18000},                            g:11.8, st:'a', sy:''},
    {n:'Brindle Fox',  s:'brindle-fox',  c:'#5B8DEF', d:'#1e3a8a', p:{yt:912000, tt:455000, ig:120000},                         g:-0.6, st:'a', sy:''},
    {n:'Tessa Rook',   s:'tessa-rook',   c:'#E86FA6', d:'#9146ff', p:{tt:688000, ig:240000, tw:66000, kk:12000},                g:3.3,  st:'a', sy:''}
  ];
  CREATORS.forEach(function(c){ c.keys = Object.keys(c.p); c.tot = c.keys.reduce(function(a, k){ return a + c.p[k]; }, 0); });
  function av(c, extra){ return '<i class="av' + (extra || '') + '" style="--c:' + c.c + ';--d:' + c.d + '">' + c.n.charAt(0) + '</i>'; }

  /* a year of daily follower counts per platform for the sample creator */
  var SERIES = {};
  (function(){
    var ends = CREATORS[0].p, growth = {tw:.34, yt:.22, ig:.18, tt:.52, x:.09, kk:.9}, seed = 7;
    Object.keys(ends).forEach(function(k){
      var r = rng(seed += 13), n = 366, a = [], v = ends[k] / (1 + growth[k]), step = (ends[k] - v) / n, i;
      for (i = 0; i < n; i++){ v += step * (.2 + r() * 1.6) + (r() < .04 ? step * 14 * r() : 0) - (r() < .05 ? step * 5 * r() : 0); a.push(v); }
      var k2 = ends[k] / a[n - 1]; SERIES[k] = a.map(function(x){ return x * k2; });
    });
  })();
  function slice(k, days, maxPts){
    var a = SERIES[k], start = a.length - 1 - days, stepN = Math.max(1, Math.ceil(days / maxPts)), vals = [], ts = [], i;
    for (i = a.length - 1; i >= start; i -= stepN){ vals.unshift(a[i]); ts.unshift(END - (a.length - 1 - i) * DAY); }
    return {vals:vals, ts:ts};
  }

  /* ---------- svg charts ---------- */
  function curve(pts){
    var d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1), i, cx;
    for (i = 1; i < pts.length; i++){ cx = ((pts[i-1][0] + pts[i][0]) / 2).toFixed(1); d += 'C' + cx + ' ' + pts[i-1][1].toFixed(1) + ' ' + cx + ' ' + pts[i][1].toFixed(1) + ' ' + pts[i][0].toFixed(1) + ' ' + pts[i][1].toFixed(1); }
    return d;
  }
  function box(host, baseW){
    var r = host.getBoundingClientRect(), w = r.width || 600, h = r.height || 220;
    return baseW ? {W:baseW, H:Math.max(60, baseW * h / w)} : {W:w, H:h};
  }
  function drawLine(host, vals, ts, color, o){
    var W = o.W, H = o.H, fs = o.fs || 10, pl = o.pl || 40, pr = 14, pt = 20, pb = fs + 12;
    var mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals), pad = (mx - mn) * .14 || 1; mn -= pad; mx += pad;
    function X(i){ return pl + (W - pl - pr) * i / (vals.length - 1); }
    function Y(v){ return pt + (H - pt - pb) * (1 - (v - mn) / (mx - mn)); }
    var s = '<svg viewBox="0 0 ' + W.toFixed(0) + ' ' + H.toFixed(0) + '" role="img" aria-label="Follower growth line chart">', i, g, v;
    for (g = 0; g <= 3; g++){ v = mn + (mx - mn) * g / 3; s += '<line class="gl" x1="' + pl + '" x2="' + (W - pr) + '" y1="' + Y(v).toFixed(1) + '" y2="' + Y(v).toFixed(1) + '"/><text class="ax" font-size="' + fs + '" x="' + (pl - 7) + '" y="' + (Y(v) + fs * .35).toFixed(1) + '" text-anchor="end">' + fmt(v) + '</text>'; }
    var nx = Math.min(o.ticks || 6, vals.length), ix;
    for (g = 0; g < nx; g++){ ix = Math.round((vals.length - 1) * g / (nx - 1)); s += '<text class="ax" font-size="' + fs + '" x="' + X(ix).toFixed(1) + '" y="' + (H - 4) + '" text-anchor="' + (g === 0 ? 'start' : g === nx - 1 ? 'end' : 'middle') + '">' + dlabel(ts[ix]) + '</text>'; }
    var pts = vals.map(function(v, i){ return [X(i), Y(v)]; }), d = curve(pts), base = (H - pb).toFixed(1);
    s += '<path class="ar" d="' + d + 'L' + X(vals.length - 1).toFixed(1) + ' ' + base + 'L' + pl + ' ' + base + 'Z" fill="' + color + '" fill-opacity=".13"/>';
    s += '<path class="ln" pathLength="1" d="' + d + '" stroke="' + color + '"/>';
    var last = pts[pts.length - 1];
    s += '<circle class="pulse" cx="' + last[0].toFixed(1) + '" cy="' + last[1].toFixed(1) + '" r="4" fill="' + color + '"/><circle class="pk" cx="' + last[0].toFixed(1) + '" cy="' + last[1].toFixed(1) + '" r="4" fill="' + color + '" stroke="#313338" stroke-width="2"/>';
    s += '<g class="pk"><rect x="' + (last[0] - 62).toFixed(1) + '" y="' + (last[1] - 23).toFixed(1) + '" width="58" height="17" rx="4" fill="#1E1F22" stroke="#3F4147"/><text class="ax" font-size="' + fs + '" x="' + (last[0] - 33).toFixed(1) + '" y="' + (last[1] - 11).toFixed(1) + '" text-anchor="middle" style="fill:#F2F3F5">Peak ' + fmt(vals[vals.length - 1]) + '</text></g>';
    s += '<g class="hv" style="display:none"><line y1="' + pt + '" y2="' + base + '" stroke="#949BA4" stroke-dasharray="3 3"/><circle r="4.5" fill="' + color + '" stroke="#F2F3F5" stroke-width="2"/></g></svg>';
    host.innerHTML = s;
    return {X:X, Y:Y, n:vals.length, pl:pl, pr:pr};
  }
  function drawBars(host, o){
    var b = box(host, 620), W = b.W, H = b.H, fs = 9.5, pl = 40, pr = 40, pt = 22, pb = 20, n = o.a.length;
    var ma = Math.max.apply(null, o.a) * 1.12, mb = Math.max.apply(null, o.b) * 1.3, gw = (W - pl - pr) / n, s, i, g, y;
    s = '<svg viewBox="0 0 ' + W.toFixed(0) + ' ' + H.toFixed(0) + '" role="img" aria-label="Viewers and channels per hour">';
    s += '<text class="ax" font-size="' + fs + '" x="' + pl + '" y="10" text-anchor="end">Viewers</text><text class="ax" font-size="' + fs + '" x="' + (W - pr) + '" y="10">Channels</text>';
    for (g = 0; g <= 4; g++){ y = pt + (H - pt - pb) * (1 - g / 4);
      s += '<line class="gl" x1="' + pl + '" x2="' + (W - pr) + '" y1="' + y.toFixed(1) + '" y2="' + y.toFixed(1) + '"/>' +
        '<text class="ax" font-size="' + fs + '" x="' + (pl - 6) + '" y="' + (y + 3).toFixed(1) + '" text-anchor="end">' + fmt(ma * g / 4) + '</text>' +
        '<text class="ax" font-size="' + fs + '" x="' + (W - pr + 6) + '" y="' + (y + 3).toFixed(1) + '">' + fmt(mb * g / 4) + '</text>'; }
    for (i = 0; i < n; i++){
      var x = pl + gw * i, ha = (H - pt - pb) * o.a[i] / ma, hb = (H - pt - pb) * o.b[i] / mb, bw = gw * .37, cls = 'bar' ;
      s += '<g' + (i === n - 1 ? ' class="now"' : '') + '><rect class="' + cls + '" style="animation-delay:' + (.3 + i * .03).toFixed(2) + 's" x="' + (x + gw * .11).toFixed(1) + '" y="' + (H - pb - ha).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + ha.toFixed(1) + '" rx="2" fill="#9146ff"/>' +
        '<rect class="' + cls + '" style="animation-delay:' + (.45 + i * .03).toFixed(2) + 's" x="' + (x + gw * .52).toFixed(1) + '" y="' + (H - pb - hb).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + hb.toFixed(1) + '" rx="2" fill="#4F3B8C"/></g>';
      if (i % 3 === 0) s += '<text class="ax" font-size="' + fs + '" x="' + (x + gw / 2).toFixed(1) + '" y="' + (H - 5) + '" text-anchor="middle">' + (i < 10 ? '0' : '') + i + ':00</text>';
    }
    host.innerHTML = s + '</svg>';
  }
  function spark(vals, color, w, h){
    var mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals), pts = vals.map(function(v, i){ return [1 + (w - 2) * i / (vals.length - 1), 2 + (h - 4) * (1 - (v - mn) / ((mx - mn) || 1))]; });
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" aria-hidden="true"><path d="' + curve(pts) + 'L' + (w - 1) + ' ' + h + 'L1 ' + h + 'Z" fill="' + color + '" fill-opacity=".14"/><path class="ln" pathLength="1" d="' + curve(pts) + '" stroke="' + color + '" vector-effect="non-scaling-stroke" style="stroke-width:1.5"/></svg>';
  }
  function walk(seed, n, drift){ var r = rng(seed), v = 50, a = [], i; for (i = 0; i < n; i++){ v += (r() - .5) * 9 + drift; a.push(v); } return a; }

  /* ---------- scene 3: roster ---------- */
  (function(){
    var host = $('[data-roster]'); if (!host) return;
    var h = '<div class="th"><span>Creator</span><span>Platforms</span><span class="r">Followers</span><span class="r">7D</span><span>30-day trend</span><span>Status ▲</span><span>Synced</span><span class="r">Actions</span></div>';
    CREATORS.slice(0, 7).forEach(function(c, i){
      var col = c.g > 0 ? '#22c55e' : c.g < 0 ? '#FF5B49' : '#949BA4';
      h += '<div style="--i:' + i + '"' + (i === 0 ? ' class="hot"' : '') + '>' +
        '<span class="who">' + av(c) + '<span><b>' + c.n + '</b><small>/' + c.s + '</small></span></span>' +
        '<span class="pls">' + c.keys.map(function(k){ return '<i class="ring ' + k + '"></i>'; }).join('') + '</span>' +
        '<span class="num">' + fmt(c.tot) + '</span>' +
        '<span class="g" style="color:' + col + '">' + (c.g > 0 ? '+' : '') + c.g.toFixed(1) + '%</span>' +
        '<span>' + spark(walk(i * 31 + 5, 22, c.g / 4), col, 100, 24) + '</span>' +
        '<span class="st">' + (c.st === 'a' ? '<em class="a">ACTIVE</em>' : '<em class="p">PENDING</em><small>exp ' + c.ex + '</small>') + '</span>' +
        '<span class="sy">' + (i === 0 ? '<i class="live"></i>' : '') + c.sy + '</span>' +
        '<span class="ac">' + (c.st === 'a' ? '<span>Manage</span><span>Remove</span>' : '<span>Regenerate</span><span>Cancel</span>') + '</span></div>';
    });
    host.innerHTML = h;
    $$('.sum .card').forEach(function(card, i){ card.insertAdjacentHTML('beforeend', spark(walk(90 + i * 17, 18, 1.2 + i), i === 2 ? '#22c55e' : i === 1 ? '#9146ff' : '#E32C19', 100, 46)); });
  })();

  /* ---------- scene 4: game page ---------- */
  (function(){
    var top = $('[data-top]'), games = $('[data-games]'); if (!top) return;
    var rows = [[1, 48200, 12300, 4.1], [0, 31900, 3100, 2.6], [7, 22400, 9800, 11.8], [5, 18700, -420, -0.3], [3, 9600, -1900, -1.2], [9, 7300, 2100, 3.3]];
    top.innerHTML = rows.map(function(r, i){ var c = CREATORS[r[0]];
      return '<div style="--i:' + i + '"' + (i === 0 ? ' class="hot"' : '') + '><span class="rk">' + (i + 1) + '</span>' + av(c) +
        '<span class="nm"><b>' + c.n + '</b>' + trend(r[2], r[3]) + '</span><span class="vw"><b>' + fmt(r[1]) + ' viewers</b><span>' + dots(c.keys.slice(0, 4)) + '</span></span></div>'; }).join('');
    var G = [['Riftline', 312000, 21400, 7.4, '#E32C19', '#4F3B8C'], ['Just Chatting', 240000, -6200, -2.5, '#949BA4', '#383A40'], ['Starfall Arena', 184206, 12300, 7.1, '#5865F2', '#69C9D0'],
             ['Hollow Circuit', 121000, 4800, 4.1, '#f59e0b', '#7c2d12'], ['Ember Tactics', 96300, -900, -0.9, '#E32C19', '#f59e0b'], ['Tide Runners', 71800, 15600, 27.8, '#22c55e', '#1e3a8a']];
    games.innerHTML = G.map(function(g, i){
      return '<div style="--i:' + i + '"' + (i === 2 ? ' class="cur"' : '') + '><span class="rk">' + (i + 1) + '</span><i class="cov" style="--c:' + g[4] + ';--d:' + g[5] + '"></i><div><b>' + g[0] + '</b><span>' + fmt(g[1]) + ' viewers</span>' + trend(g[2], g[3]) + '</div></div>'; }).join('');
    var a = [], b = [], r = rng(42), i;
    for (i = 0; i < 24; i++){ var w = .5 - .5 * Math.cos((i - 4) / 24 * Math.PI * 2); a.push(70000 + 150000 * w + r() * 24000); b.push(2600 + 3300 * w + r() * 700); }
    a[23] = 184206; b[23] = 6412;
    drawBars($('[data-chart="va"]'), {a:a, b:b});
    var tick = $('[data-tick]'), val = 184206, acc = 0, r2 = rng(9);
    if (tick && !E.reduce) E.loop(tick, function(t, dt){ acc += dt; if (acc < 900) return; acc = 0; val += Math.round((r2() - .42) * 140); tick.textContent = commas(val); });
  })();

  /* ---------- scene 2 chart, then clone the profile into the landing preview ---------- */
  function sceneCharts(){
    var host = $('.s2 [data-chart="fg"]'); if (!host) return;
    var b = box(host, 620), d = slice('tw', 30, 30);
    drawLine(host, d.vals, d.ts, PC.tw, {W:b.W, H:b.H, fs:9.5, pl:38, ticks:6});
  }
  icons(R);
  sceneCharts();
  var pv = $('[data-clone]'), s2 = $('.s2');
  if (pv && s2) pv.innerHTML = s2.innerHTML;

  /* ---------- scene 5: pipeline diagram ---------- */
  function T(cls, x, y, txt, extra){ return '<text class="' + cls + '" x="' + x + '" y="' + y + '"' + (extra || '') + '>' + txt + '</text>'; }
  (function(){
    var host = $('[data-pipe]'); if (!host) return;
    var s = '<svg viewBox="0 0 1000 576" role="img" aria-label="Data pipeline: callers, shared Twitch rate budget, platform APIs, tiered snapshots, profile page">', i, n = 0;
    function inn(){ return ' class="in" style="--i:' + (n++) + '"'; }
    /* column 1: callers, lowest priority first so the wires do not cross */
    var callers = [['Sweep', 'backfill on a GitHub worker', 350, '#949BA4'], ['Tier snapshot', 'followers and viewers per creator', 150, '#9146ff'],
                   ['Inngest step', 'default scope for every cron', 100, '#5865F2'], ['Game job', 'category pages, top channels', 50, '#69C9D0'], ['Page request', 'a visitor opens a profile', 0, '#22c55e']];
    var by = 56, bh = 330, bx = 292, bw = 66;
    function ry(r){ return by + bh - r * bh / 800; }
    s += T('tk', 24, 36, 'WHO IS ASKING') + T('tk', bx + bw / 2, 36, 'TWITCH BUDGET', ' text-anchor="middle"') + T('tk', 440, 36, 'PLATFORM APIS') + T('tk', 640, 36, 'SNAPSHOT TIERS') + T('tk', 862, 36, 'WHAT A BRAND SEES');
    callers.forEach(function(c, k){
      var y = 56 + k * 68, yc = y + 29, yr = Math.min(ry(c[2]), by + bh - 5);
      s += '<g' + inn() + '><rect class="bx" x="24" y="' + y + '" width="198" height="58" rx="8"/><rect x="24" y="' + (y + 8) + '" width="3.5" height="42" rx="1.5" fill="' + c[3] + '"/>' +
        T('t1', 38, y + 24, c[0]) + T('t2', 38, y + 42, c[1]) + T('t2', 212, y + 24, c[2] ? 'reserve ' + c[2] : 'never waits', ' text-anchor="end" style="fill:' + c[3] + ';font-weight:800"') + '</g>';
      s += '<path class="wf" stroke="' + c[3] + '" style="animation-duration:' + (1.6 - k * .26).toFixed(2) + 's" d="M222 ' + yc + 'C258 ' + yc + ' 258 ' + yr.toFixed(1) + ' ' + bx + ' ' + yr.toFixed(1) + '"/>';
    });
    /* column 2: the bucket */
    s += '<g' + inn() + '><rect class="bxd" x="' + bx + '" y="' + by + '" width="' + bw + '" height="' + bh + '" rx="8"/>' +
      '<clipPath id="twitchmetrics-bk"><rect x="' + (bx + 3) + '" y="' + (by + 3) + '" width="' + (bw - 6) + '" height="' + (bh - 6) + '" rx="6"/></clipPath>' +
      '<g clip-path="url(#twitchmetrics-bk)"><rect class="drain" x="' + bx + '" y="' + by + '" width="' + bw + '" height="' + bh + '" fill="#9146ff" fill-opacity=".55"/></g>';
    [350, 150, 100, 50].forEach(function(r){ s += '<line x1="' + (bx - 4) + '" x2="' + (bx + bw + 4) + '" y1="' + ry(r).toFixed(1) + '" y2="' + ry(r).toFixed(1) + '" stroke="#F2F3F5" stroke-width="1" stroke-dasharray="2 3"/>' + T('t2', bx + bw - 6, (ry(r) - 4).toFixed(1), r, ' text-anchor="end" style="fill:#F2F3F5;font-weight:800;font-size:9px"'); });
    s += T('tn', bx + bw / 2, by + 30, '800', ' text-anchor="middle"') + T('t2', bx + bw / 2, by + 44, 'pts / min', ' text-anchor="middle" style="fill:#F2F3F5"') +
      T('t2', bx + bw / 2, 404, 'one bucket for', ' text-anchor="middle"') + T('t2', bx + bw / 2, 417, 'every process,', ' text-anchor="middle"') + T('t2', bx + bw / 2, 430, 'resets each 60 s', ' text-anchor="middle"') + '</g>';
    /* column 3: platforms */
    var plats = [['Twitch', PC.tw], ['YouTube', PC.yt], ['Instagram', PC.ig], ['TikTok', PC.tt], ['X', PC.x], ['Kick', PC.kk]];
    s += '<path class="w" d="M412 78V363"/>';
    plats.forEach(function(p, k){ var y = 56 + k * 57;
      s += '<g' + inn() + '><path class="w" d="M412 ' + (y + 22) + 'H440"/><rect class="bx" x="440" y="' + y + '" width="124" height="45" rx="8"/><circle cx="460" cy="' + (y + 22.5) + '" r="5.5" fill="' + p[1] + '"/>' + T('t1', 474, y + 27, p[0]) +
        '<path class="w" d="M564 ' + (y + 22) + 'H590"/></g>'; });
    s += '<path class="wf" stroke="#9146ff" d="M' + (bx + bw) + ' 130C385 130 385 78 440 78"/><path class="w" d="M590 78V363"/>' +
      T('t2', 502, 404, 'Twitch calls are paced by', ' text-anchor="middle"') + T('t2', 502, 417, 'the bucket. The other five', ' text-anchor="middle"') + T('t2', 502, 430, 'keep their own quotas.', ' text-anchor="middle"');
    /* column 4: tiers + store */
    var tiers = [['Tier 1 · 100K+ followers', 'every 6 hours', '4× a day', '#E32C19'], ['Tier 2 · 10K to 100K', 'daily at 02:00 UTC', '1× a day', '#f59e0b'], ['Tier 3 · under 10K', 'daily at 03:00 UTC', '2 shards', '#69C9D0']];
    tiers.forEach(function(t, k){ var y = 56 + k * 84;
      s += '<path class="wf" stroke="' + t[3] + '" style="animation-duration:' + (.8 + k * .5) + 's" d="M590 ' + (120 + k * 100) + 'C615 ' + (120 + k * 100) + ' 615 ' + (y + 36) + ' 640 ' + (y + 36) + '"/>' +
        '<g' + inn() + '><rect class="bx" x="640" y="' + y + '" width="178" height="72" rx="8"/>' + T('t1', 654, y + 23, t[0]) + T('t2', 654, y + 40, t[1]) +
        '<rect x="' + (806 - t[2].length * 5.6 - 12) + '" y="' + (y + 29) + '" width="' + (t[2].length * 5.6 + 12) + '" height="15" rx="7.5" fill="#1E1F22" stroke="#3F4147"/>' + T('t2', 800, y + 40, t[2], ' text-anchor="end" style="font-size:9px;font-weight:800"') +
        '<rect x="654" y="' + (y + 54) + '" width="150" height="5" rx="2.5" fill="#1E1F22"/><rect class="prog" style="animation-duration:' + (3 + k * 1.7) + 's" x="654" y="' + (y + 54) + '" width="' + (132 - k * 34) + '" height="5" rx="2.5" fill="' + t[3] + '"/></g>'; });
    s += '<path class="w" d="M818 92H834V340M818 176H834M818 260H834"/><path class="wf" stroke="#DBDEE1" d="M834 300V346H818"/>' +
      '<g' + inn() + '><rect class="bxd" x="640" y="314" width="178" height="72" rx="8"/>' + T('t1', 654, 337, 'Postgres') + T('t2', 654, 354, 'one snapshot row per creator,') + T('t2', 654, 367, 'platform and run · Prisma') + '</g>' +
      T('t2', 729, 404, 'Bigger audiences are measured', ' text-anchor="middle"') + T('t2', 729, 417, 'more often. Steps over 300 s', ' text-anchor="middle"') + T('t2', 729, 430, 'run on GitHub Actions.', ' text-anchor="middle"');
    /* column 5: the page */
    s += '<path class="wf" stroke="#E32C19" d="M818 368H862"/><g' + inn() + '><rect class="bx" x="862" y="56" width="116" height="330" rx="10"/>' +
      '<circle cx="920" cy="98" r="24" fill="#9146ff"/><circle cx="920" cy="98" r="24" fill="#E32C19" fill-opacity=".45"/>' + T('t1', 920, 104, 'N', ' text-anchor="middle" style="font-size:20px;font-weight:900"') +
      T('t1', 920, 144, 'Nova Quill', ' text-anchor="middle"') + T('t2', 920, 159, 'Verified profile', ' text-anchor="middle" style="fill:#22c55e;font-weight:800"') +
      '<line x1="874" x2="966" y1="172" y2="172" stroke="#3F4147"/>' + T('tk', 874, 190, 'ON TWITCH') + '<text class="tn" data-pipe-n x="874" y="214">612,000</text>' + T('t2', 874, 230, '▲ +9.8K (+1.6%)', ' style="fill:#22c55e;font-weight:800"') +
      '<path class="ln" pathLength="1" stroke="#9146ff" d="M874 276C886 270 892 274 902 262S918 266 930 252 948 256 966 240"/><path d="M874 276C886 270 892 274 902 262S918 266 930 252 948 256 966 240V284H874Z" fill="#9146ff" fill-opacity=".14"/>' +
      '<line x1="874" x2="966" y1="298" y2="298" stroke="#3F4147"/>' + T('t2', 874, 316, 'Server-rendered') + T('t2', 874, 331, 'Cached, ISR 600 s') + T('t2', 874, 346, 'tRPC + Redis') +
      '<circle class="pulse" cx="879" cy="367" r="4" fill="#22c55e"/><circle cx="879" cy="367" r="4" fill="#22c55e"/>' + T('t2', 890, 371, '4 min ago') + '</g>' +
      T('t2', 920, 404, 'One link that is', ' text-anchor="middle"') + T('t2', 920, 417, 'always current.', ' text-anchor="middle"');
    /* bottom: who spent one minute of budget */
    var segs = [['sweep', 300, '#949BA4'], ['tier snapshots', 170, '#9146ff'], ['Inngest steps', 110, '#5865F2'], ['game jobs', 70, '#69C9D0'], ['page requests', 90, '#22c55e'], ['left over', 60, '#1E1F22']], x = 24;
    s += '<g' + inn() + '>' + T('tk', 24, 466, 'ONE MINUTE OF BUDGET, BY WHO SPENT IT') + T('t2', 976, 466, 'The sweep stops while 350 points remain, so everything above it always has room.', ' text-anchor="end"') +
      '<rect class="bxd" x="24" y="476" width="952" height="34" rx="8"/>';
    segs.forEach(function(g, k){ var w = g[1] / 800 * 952;
      s += '<rect x="' + (x + 2).toFixed(1) + '" y="479" width="' + (w - 3).toFixed(1) + '" height="28" rx="5" fill="' + g[2] + '" fill-opacity="' + (k === 5 ? 1 : .8) + '"' + (k === 5 ? ' stroke="#3F4147" stroke-dasharray="3 3"' : '') + '/>' +
        T('t1', (x + w / 2).toFixed(1), 497, g[1], ' text-anchor="middle" style="font-size:11px;fill:' + (k === 3 || k === 4 || k === 0 ? '#1E1F22' : '#F2F3F5') + '"') +
        T('t2', (x + w / 2).toFixed(1), 528, g[0], ' text-anchor="middle"'); x += w; });
    s += '<rect class="head" x="975" y="472" width="2" height="42" fill="#F2F3F5"/>' + T('t2', 24, 554, '0 s') + T('t2', 976, 554, '60 s · bucket refills', ' text-anchor="end"') + T('t2', 500, 554, 'A job that would dip below its reserve sleeps until the reset time in the response headers, then carries on.', ' text-anchor="middle"') + '</g>';
    host.innerHTML = s + '</svg>';
    var num = $('[data-pipe-n]', host), v = 612000, acc = 0, r = rng(3);
    if (num && !E.reduce) E.loop(host, function(t, dt){ acc += dt; if (acc < 1300) return; acc = 0; v += Math.round(r() * 9); num.textContent = commas(v); });
  })();

  /* ---------- under the floor: architecture ---------- */
  (function(){
    var host = $('[data-arch]'); if (!host) return;
    function B(x, y, w, h, t, a, b, dark){ return '<rect class="' + (dark ? 'bx' : 'bxd') + '" style="' + (dark ? '' : 'fill:#2B2D31') + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="8"/>' + T('t1', x + 11, y + 21, t) + (a ? T('t2', x + 11, y + 36, a) : '') + (b ? T('t2', x + 11, y + 49, b) : ''); }
    var s = '<svg viewBox="0 0 580 500" role="img" aria-label="Architecture: serving path, claim path and ingestion path all meeting in Postgres">';
    s += T('tk', 16, 26, 'SERVING · WHAT A VISITOR HITS');
    s += B(16, 36, 92, 58, 'Visitor', 'brand, fan,', 'manager') + B(134, 36, 132, 58, 'Next.js 15 page', 'server-rendered, ISR', 'landing: 600 s') + B(292, 36, 124, 58, 'tRPC v11', 'React Query,', '5 min stale time') + B(442, 36, 122, 58, 'Upstash Redis', 'cache and', 'rate limits');
    s += '<path class="wf" stroke="#E32C19" d="M108 65H134"/><path class="wf" stroke="#E32C19" d="M266 65H292"/><path class="wf" stroke="#E32C19" d="M416 65H442"/>';
    s += T('tk', 16, 142, 'CLAIMING · HOW A PROFILE BECOMES VERIFIED');
    s += B(16, 152, 92, 58, 'Creator', 'signs in with', 'each platform') + B(134, 152, 132, 58, 'Auth.js OAuth', '6 providers, custom for', 'Kick, TikTok, Instagram') + B(292, 152, 124, 58, 'Token vault', 'AES-256-GCM,', 'encrypted at rest');
    s += '<path class="wf" stroke="#22c55e" d="M108 181H134"/><path class="wf" stroke="#22c55e" d="M266 181H292"/><path class="wf" stroke="#22c55e" d="M416 181H442"/>';
    s += '<rect class="bx" x="442" y="124" width="122" height="216" rx="10" style="fill:#313338;stroke:#5865F2"/>' + T('t1', 453, 148, 'Postgres') + T('t2', 453, 163, 'Prisma schema') +
      ['creators', 'platform accounts', 'snapshots', 'growth rollups', 'rosters', 'reports'].map(function(n, i){ return '<rect x="453" y="' + (174 + i * 26) + '" width="100" height="20" rx="5" fill="#1E1F22" stroke="#3F4147"/>' + T('t2', 461, 188 + i * 26, n, ' style="fill:#DBDEE1"'); }).join('');
    s += '<path class="wf" stroke="#DBDEE1" d="M503 94V124"/>';
    s += T('tk', 16, 258, 'INGESTION · HOW THE NUMBERS STAY FRESH');
    s += B(16, 268, 118, 58, 'Inngest crons', 'tier 1 every 6 h,', 'steps capped at 300 s') + B(16, 348, 118, 58, 'GitHub workers', 'long jobs, tier 3', 'in 2 shards') +
      B(170, 300, 118, 74, 'Rate budget', '800 pts/min shared,', 'priority per call via') + T('t2', 181, 362, 'AsyncLocalStorage') + B(322, 300, 96, 74, 'Six APIs', 'Twitch, YouTube,', 'Instagram, TikTok,') + T('t2', 333, 362, 'X, Kick');
    s += '<path class="wf" stroke="#9146ff" d="M134 297C152 297 152 325 170 325"/><path class="wf" stroke="#9146ff" d="M134 377C152 377 152 349 170 349"/><path class="wf" stroke="#9146ff" d="M288 337H322"/><path class="wf" stroke="#9146ff" d="M418 320H442"/>';
    s += T('t2', 430, 312, 'snapshots', ' text-anchor="middle" style="font-size:8.5px"');
    s += T('tk', 16, 434, 'OUTPUTS');
    s += B(16, 444, 172, 44, 'Media kit link', 'public profile, always current') + B(204, 444, 172, 44, 'Roster export', 'react-pdf report and CSV') + B(392, 444, 172, 44, 'Paid reports', 'Stripe checkout');
    s += '<path class="w" d="M503 340V444M503 420H102V444M290 420V444" stroke-dasharray="3 4"/>';
    host.innerHTML = s + '</svg>';
  })();

  /* ---------- specimen A: follower growth ---------- */
  (function(){
    var host = $('[data-fg-chart]'); if (!host) return;
    var per = 30, plat = 'tw', cur = null, data = null, tip = document.createElement('div'); tip.className = 'x-tip';
    function draw(){
      var b = box(host); data = slice(plat, per, 46);
      cur = drawLine(host, data.vals, data.ts, PC[plat], {W:b.W, H:b.H, fs:11, pl:46, ticks:b.W < 420 ? 4 : 6});
      host.appendChild(tip); tip.style.opacity = 0;
      var first = data.vals[0], last = data.vals[data.vals.length - 1];
      $('[data-fg-now]').textContent = fmt(last);
      $('[data-fg-delta]').outerHTML = trend(last - first, (last - first) / first * 100).replace('class="tr', 'data-fg-delta class="tr');
      $('[data-fg-range]').textContent = dlabel(data.ts[0], 1) + ' – ' + dlabel(END, 1);
    }
    function pick(group, attr, cb){ $$('button', group).forEach(function(b){ b.setAttribute('aria-pressed', b.classList.contains('on'));
      b.addEventListener('click', function(){ $$('button', group).forEach(function(o){ o.classList.toggle('on', o === b); o.setAttribute('aria-pressed', o === b); }); cb(b.getAttribute(attr)); }); }); }
    pick($('[data-fg-period]'), 'data-p', function(v){ per = +v; draw(); });
    pick($('[data-fg-plat]'), 'data-k', function(v){ plat = v; draw(); });
    function move(e){
      if (!cur) return;
      var r = host.getBoundingClientRect(), x = e.clientX - r.left, i = Math.round((x - cur.pl) / (r.width - cur.pl - cur.pr) * (cur.n - 1));
      i = Math.max(0, Math.min(cur.n - 1, i));
      var g = $('.hv', host), px = cur.X(i), py = cur.Y(data.vals[i]), diff = i ? data.vals[i] - data.vals[i - 1] : 0;
      g.style.display = ''; g.firstChild.setAttribute('x1', px); g.firstChild.setAttribute('x2', px); g.lastChild.setAttribute('cx', px); g.lastChild.setAttribute('cy', py);
      tip.innerHTML = '<span>' + dlabel(data.ts[i], 1) + '</span><b>' + commas(data.vals[i]) + '</b><span style="color:' + (diff >= 0 ? '#22c55e' : '#FF5B49') + '">' + (diff >= 0 ? '+' : '-') + fmt(Math.abs(diff)) + ' from previous</span>';
      tip.style.opacity = 1; tip.style.left = (px > r.width / 2 ? px - tip.offsetWidth - 12 : px + 12) + 'px';
    }
    host.addEventListener('pointermove', move); host.addEventListener('pointerdown', move);
    host.addEventListener('pointerleave', function(){ tip.style.opacity = 0; var g = $('.hv', host); if (g) g.style.display = 'none'; });
    draw();
    if ('ResizeObserver' in window){ var w0 = host.clientWidth; new ResizeObserver(function(){ if (Math.abs(host.clientWidth - w0) > 2){ w0 = host.clientWidth; draw(); } }).observe(host); }
  })();

  /* ---------- specimen B: stats row ---------- */
  (function(){
    var host = $('[data-sr-tiles]'); if (!host) return;
    function dur(s){ var m = Math.round(s / 60); return Math.floor(m / 60) + 'h ' + ('0' + m % 60).slice(-2) + 'm'; }
    var DEF = [['AirTime', ['tw','kk'], dur, ''], ['Avg AirTime', ['tw','kk'], dur, 'per stream'], ['Peak Viewers', ['tw'], fmt, 'best single stream'], ['Avg Viewers', ['tw','yt','kk'], fmt, 'across streams'], ['Followers Gained', ['tw','yt','ig','tt','x','kk'], function(v){ return '+' + fmt(v); }, 'all platforms']];
    var VAL = [[733500, 15120, 48200, 12600, 38400], [2191200, 14760, 61900, 11900, 104300], [4460400, 14400, 61900, 10800, 187600], [8632800, 13860, 74300, 9700, 352100]];
    var DAYS = [30, 91, 183, 365], STREAMS = [48, 148, 310, 623], shown = VAL[0].slice(), raf = 0;
    host.innerHTML = DEF.map(function(d){ return '<div><span>' + d[0] + ' ' + dots(d[1]) + '</span><b></b><small></small></div>'; }).join('');
    var bs = $$('b', host), sm = $$('small', host);
    function paint(vals){ bs.forEach(function(b, i){ b.textContent = DEF[i][2](vals[i]); }); }
    function set(p, instant){
      var from = shown.slice(), to = VAL[p], t0 = 0;
      $('[data-sr-range]').textContent = dlabel(END - DAYS[p] * DAY, 1) + ' – ' + dlabel(END, 1);
      sm.forEach(function(el, i){ el.textContent = i === 0 ? STREAMS[p] + ' streams' : DEF[i][3]; });
      cancelAnimationFrame(raf);
      if (instant || E.reduce){ shown = to.slice(); paint(shown); return; }
      (function step(t){ t0 = t0 || t; var k = Math.min(1, (t - t0) / 600), e = 1 - Math.pow(1 - k, 3);
        shown = from.map(function(v, i){ return v + (to[i] - v) * e; }); paint(shown); if (k < 1) raf = requestAnimationFrame(step); })(performance.now());
    }
    $$('button', $('[data-sr-period]')).forEach(function(b){ b.setAttribute('aria-pressed', b.classList.contains('on'));
      b.addEventListener('click', function(){ $$('button', b.parentNode).forEach(function(o){ o.classList.toggle('on', o === b); o.setAttribute('aria-pressed', o === b); }); set(+b.getAttribute('data-p')); }); });
    set(0, true);
  })();

  /* ---------- specimen C: creator cards ---------- */
  (function(){
    var track = $('[data-cc-track]'); if (!track) return;
    function render(k){
      var list = CREATORS.filter(function(c){ return k === 'all' || c.p[k]; }).map(function(c){ return {c:c, f:k === 'all' ? c.tot : c.p[k]}; }).sort(function(a, b){ return b.c.g - a.c.g; });
      track.innerHTML = list.map(function(o){ var c = o.c, delta = o.f * c.g / 100 / (1 + c.g / 100);
        return '<div class="x-card">' + av(c) + '<b>' + c.n + '</b><span>' + fmt(o.f) + ' followers</span><span class="dots">' + dots(c.keys) + '</span>' + trend(Math.round(delta), c.g) + spark(walk(c.n.length * 7 + c.tot % 50, 20, c.g / 5), c.g > 0 ? '#22c55e' : c.g < 0 ? '#FF5B49' : '#949BA4', 120, 34) + '<small>7 days</small></div>'; }).join('');
      track.scrollLeft = 0;
    }
    $$('button', $('[data-cc-plat]')).forEach(function(b){ b.setAttribute('aria-pressed', b.classList.contains('on'));
      b.addEventListener('click', function(){ $$('button', b.parentNode).forEach(function(o){ o.classList.toggle('on', o === b); o.setAttribute('aria-pressed', o === b); }); render(b.getAttribute('data-k')); }); });
    function go(dir){ track.scrollBy({left:dir * 300, behavior:E.reduce ? 'auto' : 'smooth'}); }
    $('[data-cc-prev]').addEventListener('click', function(){ go(-1); });
    $('[data-cc-next]').addEventListener('click', function(){ go(1); });
    render('all');
  })();

  /* ---------- specimen D: rate budget simulator ---------- */
  (function(){
    var host = $('[data-rb-lanes]'); if (!host) return;
    var WIN = 10, LIMIT = 800, rem = 470, t = 4.2;
    var L = [
      {n:'Page request', res:0,   rate:40, inflow:5,  q:0,   c:'#22c55e'},
      {n:'Game job',     res:50,  rate:26, inflow:4,  q:8,   c:'#69C9D0'},
      {n:'Inngest step', res:100, rate:30, inflow:6,  q:14,  c:'#5865F2'},
      {n:'Tier snapshot',res:150, rate:44, inflow:14, q:52,  c:'#9146ff'},
      {n:'Sweep',        res:350, rate:70, inflow:38, q:268, c:'#949BA4'}
    ];
    host.innerHTML = L.map(function(l, i){ return '<button type="button" class="x-lane" style="--c:' + l.c + '" data-i="' + i + '" aria-label="Send a burst of ' + l.n + ' calls"><span><b>' + l.n + '</b><small>' + (l.res ? 'keeps ' + l.res + ' in reserve' : 'no reserve, never waits') + '</small></span><span class="x-q"><i></i><em></em></span><span class="x-st"></span></button>'; }).join('');
    var rows = $$('.x-lane', host), fill = $('[data-rb-fill]'), remEl = $('[data-rb-rem]'), resetEl = $('[data-rb-reset]'), note = $('[data-rb-note]');
    rows.forEach(function(b){ b.addEventListener('click', function(){ var l = L[+b.getAttribute('data-i')]; l.q = Math.min(600, l.q + 140); if (E.reduce) step(0); }); });
    function step(dt){
      t += dt; if (t >= WIN){ t = 0; rem = LIMIT; }
      var waiting = [];
      L.forEach(function(l){
        l.q = Math.min(600, l.q + l.inflow * dt);
        var can = rem - l.res, use = 0;
        if (l.q >= 1 && can > 0){ use = Math.min(l.q, l.rate * dt, can); rem -= use; l.q -= use; l.st = 'run'; }
        else if (l.q >= 1){ l.st = l.res ? 'wait' : 'fail'; waiting.push(l.n.toLowerCase()); }
        else l.st = 'idle';
      });
      fill.style.width = (rem / LIMIT * 100).toFixed(1) + '%';
      remEl.textContent = Math.round(rem); resetEl.textContent = Math.max(1, Math.ceil((1 - t / WIN) * 60)) + 's';
      note.textContent = waiting.length ? 'Waiting for reset: ' + waiting.join(', ') : 'All lanes running';
      rows.forEach(function(b, i){ var l = L[i], q = b.querySelector('.x-q'), s = b.querySelector('.x-st');
        q.firstChild.style.width = Math.min(100, l.q / 4.2).toFixed(1) + '%'; q.lastChild.textContent = Math.round(l.q) + ' queued';
        s.className = 'x-st ' + l.st; s.textContent = l.st === 'run' ? 'running' : l.st === 'wait' ? 'waiting' : l.st === 'fail' ? '429, fails fast' : 'idle'; });
    }
    step(0);
    if (!E.reduce) E.loop(host, function(tt, dt){ step(dt / 1000); });
  })();

  /* charts depend on final font metrics and box sizes; redraw once everything has loaded */
  window.addEventListener('load', function(){ sceneCharts(); icons(R); if (pv && s2) { pv.innerHTML = s2.innerHTML; } });
})();
