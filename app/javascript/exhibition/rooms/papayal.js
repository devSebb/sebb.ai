(function(){
  var root = document.getElementById('papayal'); if (!root) return;
  var E = window.Exhibit || { reduce: false, visible: function(el, cb){ cb(true); } };
  function $(s, c){ return (c || root).querySelector(s); }
  function $$(s, c){ return [].slice.call((c || root).querySelectorAll(s)); }
  function icon(n, s){ return '<svg class="pp-i" style="--s:' + (s || 1) + 'em" aria-hidden="true"><use href="#pp-i-' + n + '"/></svg>'; }
  function money(c){ return '$' + (c / 100).toFixed(2); }

  /* ---------- deterministic QR-style and barcode art (not scannable; stands in for the app's codes) ---------- */
  function rng(seed){ var h = 2166136261; for (var i = 0; i < seed.length; i++){ h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
    return function(){ h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return (h >>> 0) / 4294967296; }; }
  function qr(el, seed){
    var n = 25, r = rng(seed), d = '', x, y;
    function finder(fx, fy){ return function(x, y){ var a = x - fx, b = y - fy; if (a < -1 || b < -1 || a > 7 || b > 7) return null;
      if (a < 0 || b < 0 || a > 6 || b > 6) return 0; return (a === 0 || a === 6 || b === 0 || b === 6 || (a > 1 && a < 5 && b > 1 && b < 5)) ? 1 : 0; }; }
    var fs = [finder(0, 0), finder(n - 7, 0), finder(0, n - 7)];
    for (y = 0; y < n; y++) for (x = 0; x < n; x++){
      var v = null; for (var k = 0; k < 3 && v === null; k++) v = fs[k](x, y);
      if (v === null) v = (x === 6 || y === 6) ? ((x + y) % 2 ? 0 : 1) : (r() > .52 ? 1 : 0);
      if (v) d += 'M' + x + ' ' + y + 'h1v1h-1z';
    }
    el.innerHTML = '<svg viewBox="0 0 ' + n + ' ' + n + '" shape-rendering="crispEdges" aria-hidden="true"><path fill="currentColor" d="' + d + '"/></svg>';
  }
  function bar(el, seed){
    var r = rng(seed + 'b'), x = 0, d = '';
    while (x < 196){ var w = 1 + Math.floor(r() * 3); d += 'M' + x + ' 0h' + w + 'v40h-' + w + 'z'; x += w + 1 + Math.floor(r() * 3); }
    el.innerHTML = '<svg viewBox="0 0 200 40" preserveAspectRatio="none" shape-rendering="crispEdges" aria-hidden="true"><path fill="currentColor" d="' + d + '"/></svg>';
  }
  $$('[data-qr]').forEach(function(el){ qr(el, el.getAttribute('data-qr')); });
  $$('[data-bar]').forEach(function(el){ bar(el, el.getAttribute('data-bar')); });

  /* ---------- film: the redemption countdown ticks while its scene is showing ---------- */
  var sc4 = $('.pp-sc4'), tick = $('.pp-sc4 .pp-tick i'), filmOn = false, left = 84;
  E.visible($('.film'), function(v){ filmOn = v; }, .2);
  if (tick && !E.reduce) setInterval(function(){
    if (!filmOn || !sc4.classList.contains('on')) { left = 84; return; }
    left = left > 0 ? left - 1 : 90;
    tick.textContent = Math.floor(left / 60) + ':' + ('0' + left % 60).slice(-2);
  }, 1000);

  /* ---------- specimen 1: gift card ---------- */
  (function(){
    var live = $('.pp-sp-card'); if (!live) return;
    var btn = $('[data-flip]', live), tilt = $('[data-tilt]', live), sweep = $('.pp-sweep', live);
    function runSweep(){ sweep.classList.remove('run'); void sweep.offsetWidth; sweep.classList.add('run'); }
    function flip(){ btn.setAttribute('aria-pressed', btn.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); runSweep(); }
    sweep.addEventListener('animationend', function(){ sweep.classList.remove('run'); });
    btn.addEventListener('click', flip);
    $('[data-flipbtn]', live).addEventListener('click', flip);
    $('[data-sweepbtn]', live).addEventListener('click', function(){ btn.setAttribute('aria-pressed', 'false'); runSweep(); });
    live.addEventListener('pointermove', function(e){
      if (e.pointerType === 'touch') return;
      var r = btn.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      px = Math.max(-1, Math.min(1, px)); py = Math.max(-1, Math.min(1, py));
      tilt.style.setProperty('--ry', (px * 16).toFixed(2) + 'deg'); tilt.style.setProperty('--rx', (-py * 14).toFixed(2) + 'deg');
    });
    live.addEventListener('pointerleave', function(){ tilt.style.setProperty('--ry', '0deg'); tilt.style.setProperty('--rx', '0deg'); });
  })();

  /* ---------- specimen 2: purchase flow ---------- */
  (function(){
    var flow = $('[data-flow]'); if (!flow) return;
    var body = $('[data-body]', flow), cta = $('[data-cta]', flow), back = $('[data-back]', flow), title = $('[data-title]', flow),
        count = $('[data-stepcount]', flow), prog = $$('[data-prog] span', flow);
    var st = { step: 0, amt: 25 };
    function fee(){ return Math.round(st.amt * 100 * .04); }
    function total(){ return st.amt * 100 + fee(); }
    function kv(k, v, cls){ return '<span class="pp-kv ' + (cls || '') + '"><em>' + k + '</em><b>' + v + '</b></span>'; }
    function field(l, v, m){ return '<label class="pp-field' + (m ? ' is-multi' : '') + '"><em>' + l + '</em><span>' + v + '</span></label>'; }
    var titles = ['Farmacia Central', 'Destinatario', 'Confirmar', 'Pago', '¡Tarjeta enviada!'];
    function render(){
      var h = '', s = st.step;
      if (s === 0){
        h = '<div class="pp-hc"><div class="pp-hc-top"><span class="pp-mark pp-hc-logo">' + icon('pill') + '</span><i class="pp-egg pp-hc-ring"></i></div><span class="pp-hc-wave">' + icon('wave', 2.6) + '</span>' +
            '<div class="pp-hc-bot"><span class="pp-hc-num">1234 5678 9009 8765</span><span class="pp-hc-meta"><span class="pp-hc-cap">TARJETA DE REGALO</span><span class="pp-hc-valid"><em>VÁLIDA HASTA</em><b>08/28</b></span></span></div></div>' +
            '<b class="pp-sect">Elige el monto</b><div class="pp-chips">' + [5, 10, 25, 50].map(function(a){ return '<button type="button" class="pp-chip' + (a === st.amt ? ' on' : '') + '" data-amt="' + a + '" aria-pressed="' + (a === st.amt) + '">$' + a + '</button>'; }).join('') + '</div>' +
            kv('Cargo de servicio', money(fee())) + kv('Total', money(total()), 'tot');
      } else if (s === 1){
        h = '<div class="pp-sum"><span><em>Comercio</em><b>Farmacia Central</b></span><span><em>Monto</em><b>' + money(st.amt * 100) + '</b></span></div>' +
            field('Nombre completo', 'Rosa Morales') + field('Correo', 'rosa@example.com') + field('Nota (opcional)', 'Para tus medicinas, mamá. Te quiero.<i class="pp-caret"></i>', true);
      } else if (s === 2){
        h = '<div class="pp-cardbox">' + kv('Comercio', 'Farmacia Central') + kv('Para', 'Rosa Morales') + kv('Entrega', 'Correo, al instante') + kv('Tarjeta de regalo', money(st.amt * 100)) + kv('Cargo de servicio', money(fee())) + kv('Total', money(total()), 'tot') + '</div>' +
            '<span class="pp-banner">' + icon('shield', 1.8) + '<span><b>Sin sorpresas</b><em class="pp-sys">Si Rosa ya tiene una tarjeta de este comercio, tu aporte se suma a su saldo.</em></span></span>';
      } else if (s === 3){
        h = '<div class="pp-sum"><span><em>Total a pagar</em><b>' + money(total()) + ' USD</b></span></div>' +
            field('Tarjeta', '•••• •••• •••• 4242') + '<div class="pp-sum"><span><em>Vence</em><b>08 / 28</b></span><span><em>CVC</em><b>•••</b></span></div>' +
            '<span class="pp-sys pp-helper">' + icon('lock', 1) + ' Datos de ejemplo. El pago real se confirma con Stripe.</span>';
      } else {
        h = '<div class="pp-cardbox pp-done"><span class="pp-disc">' + icon('check', 3.2) + '</span><b>¡Tarjeta enviada!</b>' +
            '<p class="pp-sys pp-muted">Rosa recibirá una tarjeta de regalo digital de Farmacia Central con ' + money(st.amt * 100) + '. Ya le avisamos.</p>' + kv('Saldo de la tarjeta', money(st.amt * 100), 'tot') + '</div>';
      }
      body.innerHTML = h;
      title.textContent = titles[s];
      count.textContent = s < 4 ? 'Paso ' + (s + 1) + ' de 4' : 'Listo';
      prog.forEach(function(p, k){ p.className = k < s ? 'done' : k === s ? 'act' : ''; p.firstChild.innerHTML = k < s ? icon('check', 1.1) : ''; });
      cta.textContent = ['Enviar $' + st.amt, 'Continuar', 'Ir a pagar', 'Pagar ' + money(total()), 'Enviar otra'][s];
      back.style.visibility = s === 0 ? 'hidden' : 'visible';
    }
    body.addEventListener('click', function(e){ var c = e.target.closest('[data-amt]'); if (!c) return; st.amt = +c.getAttribute('data-amt'); render(); var n = $('[data-amt="' + st.amt + '"]', body); if (n) n.focus(); });
    cta.addEventListener('click', function(){ st.step = st.step === 4 ? 0 : st.step + 1; render(); });
    back.addEventListener('click', function(){ if (st.step > 0) { st.step = st.step === 4 ? 0 : st.step - 1; render(); } });
    render();
  })();

  /* ---------- specimen 3: departures board ---------- */
  (function(){
    var board = $('[data-board]'); if (!board) return;
    var live = board.closest('.spec-live'), reels = $$('[data-reel]', board), flap = $('[data-flap]', live), idx = 3, timer = 0, seen = false, auto = 0;
    var lines = ['TARJETA $25 · FARMACIA · ENTREGADA', 'TARJETA $10 · MASCOTAS · RECLAMADA', 'TARJETA $5 · RECARGAS · EN CAMINO', 'TARJETA $40 · TELEFONÍA · ENTREGADA'];
    var glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$';
    function scramble(text){
      clearInterval(timer); if (E.reduce) { flap.textContent = text; return; }
      var f = 0, total = 22;
      timer = setInterval(function(){
        f++; var out = '', settle = Math.floor(text.length * f / total);
        for (var i = 0; i < text.length; i++) out += (i < settle || text[i] === ' ' || text[i] === '·') ? text[i] : glyphs[Math.floor(Math.random() * glyphs.length)];
        flap.textContent = out; if (f >= total) { clearInterval(timer); flap.textContent = text; }
      }, 40);
    }
    function run(){
      idx = (idx + 1) % 4;
      reels[0].style.setProperty('--i', idx);
      setTimeout(function(){ reels[1].style.setProperty('--i', idx); }, E.reduce ? 0 : 160);
      scramble(lines[idx]);
    }
    function schedule(){ clearInterval(auto); if (seen && !E.reduce) auto = setInterval(run, 3600); }
    $('[data-run]', live).addEventListener('click', function(){ run(); schedule(); });
    board.addEventListener('click', function(){ run(); schedule(); });
    E.visible(live, function(v){ seen = v; schedule(); }, .4);
  })();

  /* ---------- specimen 4: ledger simulator and rotating code ---------- */
  (function(){
    var live = $('.pp-sp-ledger'); if (!live) return;
    var rows = $('[data-rows]', live), td = $('[data-td]', live), tc = $('[data-tc]', live), accts = $('[data-accts]', live), bal = $('[data-balanced]', live);
    var btn = {}; $$('[data-act]', live).forEach(function(b){ btn[b.getAttribute('data-act')] = b; b.addEventListener('click', function(){ act(b.getAttribute('data-act'), true); }); });
    var S, n;
    function reset(){ S = { cash: 0, cards: 0, payable: 0, fees: 0, d: 0, c: 0 }; n = 1040; rows.innerHTML = '<p class="pp-lg-empty">Sin asientos todavía. Compra una tarjeta para empezar.</p>'; }
    function post(kind, label, meta, lines, animate){
      var e = rows.querySelector('.pp-lg-empty'); if (e) e.remove();
      n++; var h = '<span class="pp-j-h"><b>#' + n + '</b><i class="k-' + kind + '">' + label + '</i><em>' + meta + '</em></span>';
      lines.forEach(function(l){ S.d += l[1]; S.c += l[2];
        h += '<span class="pp-j-l' + (l[2] ? ' cr' : '') + '"><span>' + l[0] + '</span><span>' + (l[1] ? (l[1] / 100).toFixed(2) : '') + '</span><span>' + (l[2] ? (l[2] / 100).toFixed(2) : '') + '</span></span>'; });
      var div = document.createElement('div'); div.className = 'pp-j'; if (!animate) div.style.animation = 'none'; div.innerHTML = h; rows.appendChild(div); rows.scrollTop = rows.scrollHeight;
    }
    function act(a, animate){
      if (a === 'reset') reset();
      if (a === 'buy'){ S.cash += 2600; S.cards += 2500; S.fees += 100;
        post('p', 'Compra', 'PaymentIntent confirmado', [['Stripe · por cobrar', 2600, 0], ['Saldo de tarjeta', 0, 2500], ['Cargo de servicio', 0, 100]], animate); }
      if (a === 'redeem' && S.cards >= 1000){ S.cards -= 1000; S.payable += 970; S.fees += 30;
        post('r', 'Canje', 'Farmacia Central · clave idempotente', [['Saldo de tarjeta', 1000, 0], ['Por pagar a comercio', 0, 970], ['Comisión del comercio', 0, 30]], animate); }
      if (a === 'settle' && S.payable > 0){ var p = S.payable; S.payable = 0; S.cash -= p;
        post('s', 'Liquidación', 'Pago a Farmacia Central', [['Por pagar a comercio', p, 0], ['Stripe · banco', 0, p]], animate); }
      paint();
    }
    function paint(){
      td.textContent = (S.d / 100).toFixed(2); tc.textContent = (S.c / 100).toFixed(2);
      var ok = S.d === S.c && S.cash === S.cards + S.payable + S.fees;
      bal.parentNode.classList.toggle('bad', !ok);
      bal.innerHTML = (ok ? 'Cuadra ' + icon('check', 1) : 'No cuadra');
      accts.innerHTML = [['Stripe · banco', S.cash], ['Saldo por canjear', S.cards], ['Por pagar a comercios', S.payable], ['Fees cobrados', S.fees]].map(function(a){ return '<div><em>' + a[0] + '</em><b>' + money(a[1]) + '</b></div>'; }).join('');
      btn.redeem.disabled = S.cards < 1000; btn.settle.disabled = S.payable <= 0;
    }
    reset(); act('buy', false); act('redeem', false);

    var tok = $('[data-tok]', live), cnt = $('[data-count]', live), ring = $('[data-ringp]', live), qel = $('[data-tokqr]', live), remain = 90, seen = false, C = 276.46;
    var alpha = '123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    function show(){ cnt.textContent = Math.floor(remain / 60) + ':' + ('0' + remain % 60).slice(-2); ring.style.strokeDashoffset = (C * (1 - remain / 90)).toFixed(1); }
    function regen(){ var t = ''; for (var i = 0; i < 10; i++) t += alpha[Math.floor(Math.random() * alpha.length)];
      tok.textContent = t.slice(0, 4) + '-' + t.slice(4, 7) + '-' + t.slice(7); qr(qel, t); remain = 90; show(); }
    $('[data-regen]', live).addEventListener('click', regen);
    E.visible(live, function(v){ seen = v; }, .2);
    setInterval(function(){ if (!seen) return; if (remain <= 1) regen(); else { remain--; show(); } }, 1000);
    show();
  })();
})();
