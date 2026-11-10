/* Shared runtime. Rooms must NOT edit this file. Exposes window.Exhibit. */
(function(){
  var q = new URLSearchParams(location.search);
  var still = q.has('still');
  if (still) document.documentElement.classList.add('still');
  var reduce = still || matchMedia('(prefers-reduced-motion: reduce)').matches;
  var E = window.Exhibit = {
    reduce: reduce,
    /* cb(true|false) whenever el enters/leaves the viewport */
    visible: function(el, cb, threshold){
      if (!('IntersectionObserver' in window)) { cb(true); return; }
      new IntersectionObserver(function(e){ cb(e[e.length-1].isIntersecting); }, {threshold: threshold || .15}).observe(el);
    },
    /* run fn(t, dt) every frame only while el is on screen (and, if inside a .scene, while that scene is .on). Draws one frame when reduced motion. */
    loop: function(el, fn){
      var on = false, raf = 0, last = 0, sc = el.closest('.scene');
      function frame(t){ raf = 0; if (!on) return; if (!sc || sc.classList.contains('on')) fn(t, Math.min(50, t - (last||t))); last = t; raf = requestAnimationFrame(frame); }
      if (reduce) { requestAnimationFrame(function(t){ fn(t, 16); }); return; }
      E.visible(el.closest('.film,.spec,.eng-diagram') || el, function(v){ on = v; if (v && !raf) { last = 0; raf = requestAnimationFrame(frame); } });
    },
    /* size a canvas to its box with DPR capped at 2; returns ctx with .w/.h in CSS px */
    fit: function(cv){
      var r = cv.getBoundingClientRect(), d = Math.min(2, window.devicePixelRatio || 1), c = cv.getContext('2d');
      var W = Math.round(r.width*d), H = Math.round(r.height*d);
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
      c.setTransform(d,0,0,d,0,0); c.w = r.width; c.h = r.height; return c;
    }
  };
  function films(){
    document.querySelectorAll('[data-film]').forEach(function(f){
      if (f._built) return; f._built = true;
      var scenes = [].slice.call(f.querySelectorAll('.stage > .scene')), i = 0, want = !reduce, seen = false;
      var ui = document.createElement('div'); ui.className = 'film-ui';
      var pp = document.createElement('button'); pp.className = 'film-pp'; pp.type = 'button';
      var ch = document.createElement('div'); ch.className = 'film-chaps';
      var cap = document.createElement('p'); cap.className = 'film-cap'; cap.setAttribute('aria-live','polite');
      var chaps = scenes.map(function(s, k){
        var b = document.createElement('button'); b.type = 'button'; b.className = 'film-chap';
        b.textContent = s.getAttribute('data-title') || ('Scene ' + (k+1));
        var bar = document.createElement('i'); b.appendChild(bar);
        if (s.getAttribute('data-dur')) b.style.setProperty('--dur', s.getAttribute('data-dur'));
        b.addEventListener('click', function(){ show(k); });
        bar.addEventListener('animationend', function(){ if (k === i) show(i+1); });
        ch.appendChild(b); return b;
      });
      ui.appendChild(pp); ui.appendChild(ch); f.appendChild(ui); f.appendChild(cap);
      function sync(){ f.classList.toggle('run', want && seen); pp.textContent = want ? '❚❚' : '▶'; pp.setAttribute('aria-label', want ? 'Pause film' : 'Play film'); }
      function show(n){
        i = (n + scenes.length) % scenes.length;
        scenes.forEach(function(s, k){ s.classList.toggle('on', k === i); });
        chaps.forEach(function(c, k){ c.classList.remove('on'); c.classList.toggle('done', k < i);
          if (k === i) { void c.offsetWidth; c.classList.add('on'); c.setAttribute('aria-current','true'); } else c.removeAttribute('aria-current'); });
        cap.innerHTML = scenes[i].getAttribute('data-cap') || '';
        f.dispatchEvent(new CustomEvent('scenechange', {detail:{index:i, scene:scenes[i]}}));
      }
      pp.addEventListener('click', function(){ want = !want; sync(); });
      E.visible(f, function(v){ seen = v; sync(); }, .3);
      show(parseInt(q.get('scene') || '0', 10) || 0); sync();
    });
  }
  E.films = films;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', films); else films();
})();
