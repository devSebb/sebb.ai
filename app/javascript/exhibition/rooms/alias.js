(function(){
  var room = document.getElementById('alias'); if (!room) return;
  var E = window.Exhibit || {reduce:false, loop:function(){}, visible:function(el,cb){cb(true);}};
  function $(s, r){ return (r || room).querySelector(s); }
  function $$(s, r){ return [].slice.call((r || room).querySelectorAll(s)); }
  function money(c){ var n = Math.abs(c); return (c < 0 ? '−' : '') + '$' + Math.floor(n/100).toLocaleString('en-US') + '.' + ('0' + (n % 100)).slice(-2); }

  /* ---- topbar clock (Doto) ---- */
  var clocks = $$('[data-clock]');
  function tick(){ var d = new Date(), h = ('0'+d.getHours()).slice(-2), m = ('0'+d.getMinutes()).slice(-2);
    clocks.forEach(function(c){ c.innerHTML = h + '<u>:</u>' + m; }); }
  if (clocks.length && !document.documentElement.classList.contains('still')) { tick(); setInterval(tick, 20000); }

  /* ---- 1 · spotlight panels + theme switch ---- */
  var sx1 = $('.sx1');
  if (sx1) {
    var panels = $$('.sp', sx1), real = false;
    function light(cx, cy){ panels.forEach(function(p){ var r = p.getBoundingClientRect(); p.style.setProperty('--mx', (cx - r.left) + 'px'); p.style.setProperty('--my', (cy - r.top) + 'px'); }); }
    sx1.addEventListener('pointermove', function(e){ real = true; light(e.clientX, e.clientY); });
    sx1.addEventListener('pointerleave', function(){ real = false; });
    E.loop(sx1, function(t){ if (real) return; var r = sx1.getBoundingClientRect(), k = t / 1000;
      light(r.left + r.width * (.5 + .42 * Math.sin(k * .55)), r.top + r.height * (.58 + .3 * Math.sin(k * .83 + 1))); });
    var lives = $$('.spec-live'), btns = $$('.thsw button', sx1);
    btns.forEach(function(b){ b.addEventListener('click', function(){ var th = b.getAttribute('data-set');
      lives.forEach(function(l){ l.setAttribute('data-th', th); });
      btns.forEach(function(o){ o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); }); }); });
  }

  /* ---- 2 · objective rings ---- */
  var rg = $('.rg');
  if (rg) {
    var goals = [['104%','NEW DESIGNS'],['91%','MARGIN'],['72%','SHIP SPEED'],['48%','NEW SHOPS']];
    var big = $('[data-big]', rg), sm = $('[data-sm]', rg), arcs = $$('.arc', rg), rows = $$('.rl button', rg), pinned = -1;
    function show(i){ rg.classList.toggle('hot', i >= 0);
      arcs.forEach(function(a, k){ a.classList.toggle('is', k === i); }); rows.forEach(function(r, k){ r.classList.toggle('is', k === i); });
      big.textContent = i >= 0 ? goals[i][0] : '2/4'; sm.textContent = i >= 0 ? goals[i][1] : 'ON TRACK'; }
    function replay(){ if (E.reduce) return; rg.classList.remove('go'); void rg.offsetWidth; rg.classList.add('go'); }
    arcs.concat(rows).forEach(function(el){ var i = +el.getAttribute('data-i');
      el.addEventListener('pointerenter', function(){ show(i); });
      el.addEventListener('pointerleave', function(){ show(pinned); });
      el.addEventListener('focus', function(){ show(i); });
      el.addEventListener('blur', function(){ show(pinned); });
      el.addEventListener('click', function(){ pinned = pinned === i ? -1 : i; show(pinned); replay(); }); });
    var seen = false; E.visible(rg, function(v){ if (v && !seen) { seen = true; replay(); } }, .4);
  }

  /* ---- 3 · numbers that explain themselves ---- */
  var pl = $('[data-pl]'), ex = $('[data-ex]');
  if (pl && ex) {
    var cov = 'October · all 5 stores';
    var M = [
      {l:'Revenue', v:4821040, what:'What buyers paid the shops, without the sales tax the marketplace collects.', f:'Order total − sales tax, summed over orders', s:'Order-notification emails, parsed', c:cov, st:'1,604 of 1,611 emails accepted (99.6%)'},
      {l:'Marketplace fees', v:-641218, p:1, what:'Transaction, payment-processing and listing fees charged by the marketplace.', f:'Sum of fee lines in the monthly statement', s:'Statement CSV, uploaded by hand', c:cov, st:'Partial · statements loaded for 3 of 5 stores'},
      {l:'Production cost', v:-1988462, p:1, what:'What the print provider charged to make and ship these orders.', f:'Production + provider shipping + tax, per matched order', s:'Print provider API, synced daily', c:cov, st:'Partial · 1,562 of 1,604 orders matched (97.4%)'},
      {l:'Advertising', v:-295000, what:'Ad spend billed by the marketplace during the month.', f:'Sum of advertising lines', s:'Statement CSV and saved cost entries', c:cov, st:'Recorded'},
      {l:'Refunds', v:-112835, what:'Money returned to buyers, counted in the month the refund was issued.', f:'Sum of refund amounts', s:'Refund-notification emails, parsed', c:cov, st:'Recorded · 38 refunds'},
      {l:'Software and other', v:-41291, what:'Subscriptions and one-off costs the partners entered themselves.', f:'Sum of saved cost entries', s:'Costs tab, entered by a partner', c:cov, st:'Recorded · every entry is in the audit log'},
      {l:'Operating profit', v:1742234, p:1, tot:1, what:'What is left after every recorded cost. Each partner is owed half.', f:'Revenue − fees − production − advertising − refunds − other', s:'The six rows above', c:cov, st:'Partial · inherits the gaps in fees and production cost'}
    ];
    var sel = 2;
    pl.innerHTML = M.map(function(m, i){ return '<button type="button" data-i="' + i + '" class="' + (m.tot ? 'tot ' : '') + (m.p ? 'part' : '') + '" aria-label="Explain ' + m.l + '"><span>' + m.l + '</span><b>' + money(m.v) + '</b><u>ⓘ</u></button>'; }).join('');
    function explain(i, anim){ sel = i; var m = M[i];
      $$('button', pl).forEach(function(b, k){ b.classList.toggle('is', k === i); b.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
      ex.innerHTML = '<h5>' + m.l + '<span>' + money(m.v) + '</span></h5><dl>' +
        [['What', m.what], ['Formula', m.f], ['Source', m.s], ['Dates and stores', m.c], ['Status', m.st], ['Stored as', m.v + ' cents']].map(function(r){ return '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>'; }).join('') + '</dl>';
      if (anim && !E.reduce) { ex.classList.remove('in'); void ex.offsetWidth; ex.classList.add('in'); } }
    pl.addEventListener('click', function(e){ var b = e.target.closest('button'); if (b) explain(+b.getAttribute('data-i'), true); });
    explain(sel, false);
  }

  /* ---- 4 · money-flow zoom ---- */
  var mf = $('[data-mf]');
  if (mf) {
    var G = '#80858e';
    var top = [
      {l:'Taken home', v:9640000, c:'#3987e5', t:'Taken home, by partner', parts:[['Partner A', 4820000, '#3987e5'], ['Partner B', 4820000, '#7fb2f0']]},
      {l:'Reinvested', v:3150000, c:'#d95926', t:'Venture two money in: $31,500.00 from shop payouts, $4,000.00 personal', parts:[['Launch spending', 1825000, '#c98500'], ['Running expenses', 612000, '#d55181'], ['Supplier advances', 540000, '#9085e9'], ['Not yet spent', 573000, G]]},
      {l:'Still in the marketplace', v:1340000, c:'#199e70', t:'Still in the marketplace, by state', parts:[['Ready for the next payout', 902000, '#199e70'], ['Months still settling', 290000, '#c98500'], ['Held for open refunds', 148000, G]]}
    ];
    function layout(parts, get){ var total = parts.reduce(function(s, p){ return s + get(p); }, 0), raw = parts.map(function(p){ return Math.max(.8, get(p) / total * 100); });
      var scale = raw.reduce(function(a, b){ return a + b; }, 0), start = 0;
      return parts.map(function(p, i){ var w = raw[i] / scale * 100, o = {start:start, width:w, share:get(p) / total * 100}; start += w; return o; }); }
    var L = layout(top, function(p){ return p.v; });
    var topEl = $('[data-top]', mf), botEl = $('[data-bot]', mf), leg = $('[data-leg]', mf), poly = $('polygon', mf), l1 = $('[data-l1]', mf), l2 = $('[data-l2]', mf);
    var zl = $('[data-zl]', mf), bt = $('[data-bt]', mf), bv = $('[data-bv]', mf), fz = $('.fz', mf), cur = [68.2, 90.5], raf = 0;
    topEl.innerHTML = top.map(function(p, i){ return '<button type="button" data-i="' + i + '" style="width:' + L[i].width + '%;background:' + p.c + '" aria-label="' + p.l + ': ' + money(p.v) + ', ' + L[i].share.toFixed(1) + '%. Enlarge."></button>'; }).join('');
    function draw(a, b){ cur = [a, b]; poly.setAttribute('points', a + ',0 ' + b + ',0 100,24 0,24'); l1.setAttribute('x1', a); l2.setAttribute('x1', b); }
    function pick(i, anim){ var p = top[i], a = L[i].start, b = L[i].start + L[i].width;
      $$('button', topEl).forEach(function(x, k){ x.classList.toggle('is', k === i); x.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
      fz.style.setProperty('--zc', p.c); zl.textContent = p.l + ' ' + money(p.v) + ' · ' + L[i].share.toFixed(1) + '%, enlarged';
      var tot = p.parts.reduce(function(s, x){ return s + x[1]; }, 0), PL = layout(p.parts, function(x){ return x[1]; });
      bt.textContent = p.t; bv.textContent = money(tot);
      botEl.innerHTML = p.parts.map(function(x, k){ return '<i style="width:' + PL[k].width + '%;background:' + x[2] + ';animation-delay:' + (anim ? .15 + k * .07 : 0) + 's"></i>'; }).join('');
      leg.innerHTML = p.parts.map(function(x, k){ return '<li><i style="background:' + x[2] + '"></i><span>' + x[0] + '</span><b>' + money(x[1]) + '</b><em>' + PL[k].share.toFixed(1) + '%</em></li>'; }).join('');
      cancelAnimationFrame(raf);
      if (!anim || E.reduce) { draw(a, b); return; }
      var from = cur.slice(), t0 = 0;
      (function step(t){ if (!t0) t0 = t; var k = Math.min(1, (t - t0) / 460), e = 1 - Math.pow(1 - k, 3);
        draw(from[0] + (a - from[0]) * e, from[1] + (b - from[1]) * e); if (k < 1) raf = requestAnimationFrame(step); })(performance.now()); }
    topEl.addEventListener('click', function(e){ var b = e.target.closest('button'); if (b) pick(+b.getAttribute('data-i'), true); });
    pick(1, false);
  }
})();
