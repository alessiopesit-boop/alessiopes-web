/* ============================================================
   Alessio Pes — script condivisi
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- TEMA (default dark, persistente) ---------- */
  function applyTheme(t) {
    if (t === 'light') document.documentElement.setAttribute('data-theme', 'light');
    else document.documentElement.removeAttribute('data-theme');
    if (window.__net && window.__net.recolor) window.__net.recolor();
  }
  var savedTheme = 'dark';
  try { savedTheme = localStorage.getItem('ap-theme') || 'dark'; } catch (e) {}
  applyTheme(savedTheme);

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.theme-toggle');
    if (!btn) return;
    var next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
    try { localStorage.setItem('ap-theme', next); } catch (err) {}
  });

  /* ---------- NAV scroll ---------- */
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 24); };
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- MOBILE NAV (hamburger + menu) ---------- */
  (function () {
    if (!nav) return;
    var inner = nav.querySelector('.nav-inner');
    var linksWrap = nav.querySelector('.nav-links');
    if (!inner || !linksWrap) return;

    var burger = document.createElement('button');
    burger.className = 'nav-burger';
    burger.setAttribute('aria-label', 'Apri il menu');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-controls', 'mobileMenu');
    burger.innerHTML = '<span></span><span></span><span></span>';
    inner.appendChild(burger);

    var menu = document.createElement('nav');
    menu.className = 'mobile-menu';
    menu.id = 'mobileMenu';
    menu.setAttribute('aria-label', 'Menu di navigazione');
    var html = '';
    linksWrap.querySelectorAll('a').forEach(function (a) {
      if (a.classList.contains('nav-cta')) return;
      var cur = a.getAttribute('aria-current') === 'page' ? ' aria-current="page"' : '';
      html += '<a href="' + a.getAttribute('href') + '"' + cur + '>' + a.textContent.trim() + '</a>';
    });
    var cta = linksWrap.querySelector('.nav-cta');
    if (cta) html += '<a class="mm-cta" href="' + cta.getAttribute('href') + '">' + cta.textContent.trim() + '</a>';
    menu.innerHTML = html;
    nav.appendChild(menu);

    function close() {
      menu.classList.remove('open'); burger.classList.remove('on');
      burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Apri il menu');
    }
    function open() {
      menu.classList.add('open'); burger.classList.add('on');
      burger.setAttribute('aria-expanded', 'true'); burger.setAttribute('aria-label', 'Chiudi il menu');
    }
    burger.addEventListener('click', function () { menu.classList.contains('open') ? close() : open(); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    document.addEventListener('click', function (e) {
      if (!menu.classList.contains('open')) return;
      if (!e.target.closest('.mobile-menu') && !e.target.closest('.nav-burger')) close();
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 760) close(); });
  })();

  /* ---------- PAGE LOADER (transizione tra pagine) ---------- */
  (function () {
    var loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.id = 'pageLoader';
    loader.setAttribute('aria-hidden', 'true');
    loader.setAttribute('role', 'status');
    loader.innerHTML = '<div class="pl-stack"><div class="pl-squares"><span></span><span></span><span></span><span></span></div>' +
      '<div class="pl-cap mono"><span class="pl-prompt">~$</span> caricamento<span class="cursor-blk blink"></span></div></div>';
    function mount() { document.body.appendChild(loader); }
    if (document.body) mount(); else window.addEventListener('DOMContentLoaded', mount);

    function show() { loader.classList.add('show'); loader.setAttribute('aria-hidden', 'false'); }
    function hide() { loader.classList.remove('show'); loader.setAttribute('aria-hidden', 'true'); }

    // se si torna indietro (bfcache) il loader non deve restare appeso
    window.addEventListener('pageshow', hide);

    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest('a');
      if (!a) return;
      var href = a.getAttribute('href');
      if (!href) return;
      if (a.target && a.target !== '_self') return;
      if (a.hasAttribute('download')) return;
      if (/^(mailto:|tel:|sms:|#|javascript:)/i.test(href)) return;
      var url;
      try { url = new URL(a.href, location.href); } catch (err) { return; }
      if (url.origin !== location.origin) return; // link esterni: nessun loader
      // stessa pagina (hash interno o identica): nessun loader
      if (url.pathname === location.pathname && (url.hash || url.href === location.href)) return;
      // Nessuna animazione forzata: il browser naviga normalmente.
      // Il loader compare SOLO se il caricamento dura davvero (oltre ~120ms):
      // sui caricamenti istantanei non si vede, online appare durante l'attesa reale.
      setTimeout(show, 120);
    });
  })();

  /* ---------- REVEAL ---------- */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  /* ---------- VIEW TOGGLE (progetti) ---------- */
  (function () {
    var grid = document.getElementById('projGrid');
    var bGrid = document.getElementById('btnGrid');
    var bList = document.getElementById('btnList');
    if (!grid || !bGrid || !bList) return;
    function set(mode) {
      var list = mode === 'list';
      grid.classList.toggle('is-list', list);
      bList.classList.toggle('active', list); bGrid.classList.toggle('active', !list);
      bList.setAttribute('aria-pressed', list); bGrid.setAttribute('aria-pressed', !list);
      try { localStorage.setItem('ap-proj-view', mode); } catch (e) {}
    }
    bGrid.addEventListener('click', function () { set('grid'); });
    bList.addEventListener('click', function () { set('list'); });
    var saved = 'grid';
    try { saved = localStorage.getItem('ap-proj-view') || 'grid'; } catch (e) {}
    if (saved === 'list') set('list');
  })();

  /* ---------- COOKIE / PRIVACY BANNER ---------- */
  (function () {
    var seen = false;
    try { seen = localStorage.getItem('ap-cookie-ok') === '1'; } catch (e) {}
    if (seen) return;
    var bar = document.createElement('div');
    bar.className = 'cookie';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Informativa cookie');
    bar.innerHTML = '<p>Questo sito usa solo cookie tecnici necessari al funzionamento (es. la scelta del tema). Nessun tracciamento pubblicitario. Maggiori dettagli nella <a href="privacy.html">privacy & cookie policy</a>.</p>' +
      '<div class="cookie-actions"><button class="btn btn-primary" data-ck="ok">Ho capito</button><a class="btn btn-ghost" href="privacy.html">Leggi l\'informativa</a></div>';
    function mount() {
      document.body.appendChild(bar);
      setTimeout(function () { bar.classList.add('show'); }, 30);
    }
    if (document.body) mount(); else window.addEventListener('DOMContentLoaded', mount);
    bar.addEventListener('click', function (e) {
      if (e.target.closest('[data-ck="ok"]')) {
        try { localStorage.setItem('ap-cookie-ok', '1'); } catch (err) {}
        bar.classList.remove('show');
        setTimeout(function () { bar.remove(); }, 300);
      }
    });
  })();

  /* ---------- TERMINALE (home) ---------- */
  (function () {
    var el = document.getElementById('typed');
    if (!el) return;
    var P = 'alessio@studio:~$ ';
    var seq = [
      { cmd: 'nuovo-cliente --tipo "negozio di zona"' },
      { out: 'ok — vediamo di cosa hai bisogno', cls: 'dim' },
      { cmd: './crea-sito --su-misura' },
      { out: 'design ........ ✓ pensato per te', cls: 'ok', step: true },
      { out: 'mobile ........ ✓ perfetto da telefono', cls: 'ok', step: true },
      { out: 'google ........ ✓ ti trovano i clienti', cls: 'ok', step: true },
      { out: 'online ........ ✓ in 1-2 settimane', cls: 'ok', step: true },
      { cmd: 'assistenza --dopo-la-consegna' },
      { out: 'ci sono io · rispondo io · niente call center', cls: 'out' },
      { out: '# dal primo caffè al sito online, sempre io', cls: 'cm' }
    ];
    function renderAll() {
      el.innerHTML = seq.map(function (s) {
        return s.cmd
          ? '<div class="line"><span class="dim">' + P + '</span><span class="out">' + s.cmd + '</span></div>'
          : '<div class="line ' + s.cls + '">' + s.out + '</div>';
      }).join('') + '<div class="line"><span class="dim">' + P + '</span><span class="cursor-blk"></span></div>';
    }
    if (reduce) { renderAll(); return; }
    var i = 0;
    function blinkCursor(node) {
      var c = document.createElement('span'); c.className = 'cursor-blk'; node.appendChild(c);
      setInterval(function () { c.style.opacity = c.style.opacity === '0' ? '1' : '0'; }, 530);
    }
    function typeInto(node, text, speed, done) {
      var k = 0;
      (function tk() { node.textContent = text.slice(0, k); if (k++ <= text.length) setTimeout(tk, speed); else done && done(); })();
    }
    function next() {
      if (i >= seq.length) {
        var c = document.createElement('div'); c.className = 'line';
        c.innerHTML = '<span class="dim">' + P + '</span>'; el.appendChild(c); blinkCursor(c); return;
      }
      var s = seq[i]; var div = document.createElement('div');
      if (s.cmd) {
        div.className = 'line';
        div.innerHTML = '<span class="dim">' + P + '</span><span class="t-cmd out"></span><span class="cursor-blk"></span>';
        el.appendChild(div);
        var tgt = div.querySelector('.t-cmd'), cur = div.querySelector('.cursor-blk');
        typeInto(tgt, s.cmd, 30, function () { cur.remove(); i++; setTimeout(next, 320); });
      } else {
        div.className = 'line ' + (s.cls || 'out'); el.appendChild(div);
        if (s.step) typeInto(div, s.out, 6, function () { i++; setTimeout(next, 150); });
        else typeInto(div, s.out, 9, function () { i++; setTimeout(next, 240); });
      }
      el.scrollTop = el.scrollHeight;
    }
    setTimeout(next, 450);
  })();

  /* ---------- PARTICLE NETWORK (theme-aware) ---------- */
  (function () {
    var canvas = document.getElementById('net');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var w, h, dpr, nodes = [], raf;
    var mouse = { x: -9999, y: -9999, active: false };
    var COL = { a1: [122, 162, 255], a2: [150, 215, 240], node: 0.85, link: 0.5, mlink: 0.65 };
    function recolor() {
      var light = document.documentElement.getAttribute('data-theme') === 'light';
      if (light) { COL = { a1: [70, 110, 225], a2: [60, 130, 180], node: 0.5, link: 0.28, mlink: 0.4 }; }
      else { COL = { a1: [122, 162, 255], a2: [150, 215, 240], node: 0.85, link: 0.5, mlink: 0.65 }; }
    }
    recolor();
    window.__net = { recolor: recolor };
    if (reduce) { // disegno statico leggero
      // continua comunque con un singolo frame
    }
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      var hero = canvas.parentElement; w = hero.clientWidth; h = hero.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr; canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.min(92, Math.floor(w * h / 15000));
      nodes = [];
      for (var i = 0; i < count; i++) nodes.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, r: Math.random() * 1.5 + 0.7 });
    }
    function step() {
      ctx.clearRect(0, 0, w, h);
      var LINK = 130, a1 = COL.a1, a2 = COL.a2;
      for (var k = 0; k < nodes.length; k++) {
        var n = nodes[k];
        if (mouse.active) {
          var mdx = n.x - mouse.x, mdy = n.y - mouse.y, md2 = mdx * mdx + mdy * mdy;
          if (md2 < 22500 && md2 > 0.01) { var md = Math.sqrt(md2), f = (1 - md / 150) * 0.6; n.vx += (mdx / md) * f * 0.18; n.vy += (mdy / md) * f * 0.18; }
        }
        n.x += n.vx; n.y += n.vy; n.vx *= 0.992; n.vy *= 0.992;
        if (Math.abs(n.vx) < 0.05) n.vx += (Math.random() - 0.5) * 0.04;
        if (Math.abs(n.vy) < 0.05) n.vy += (Math.random() - 0.5) * 0.04;
        if (n.x < 0 || n.x > w) n.vx *= -1; if (n.y < 0 || n.y > h) n.vy *= -1;
        n.x = Math.max(0, Math.min(w, n.x)); n.y = Math.max(0, Math.min(h, n.y));
      }
      for (var i = 0; i < nodes.length; i++) for (var j = i + 1; j < nodes.length; j++) {
        var a = nodes[i], b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < LINK) { var o = (1 - d / LINK) * COL.link; ctx.strokeStyle = 'rgba(' + a1[0] + ',' + a1[1] + ',' + a1[2] + ',' + o + ')'; ctx.lineWidth = 0.7;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
      if (mouse.active) for (var m = 0; m < nodes.length; m++) {
        var nn = nodes[m], ddx = nn.x - mouse.x, ddy = nn.y - mouse.y, dd = Math.sqrt(ddx * ddx + ddy * ddy);
        if (dd < 190) { var oo = (1 - dd / 190) * COL.mlink; ctx.strokeStyle = 'rgba(' + a2[0] + ',' + a2[1] + ',' + a2[2] + ',' + oo + ')'; ctx.lineWidth = 0.8;
          ctx.beginPath(); ctx.moveTo(nn.x, nn.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
      }
      for (var p = 0; p < nodes.length; p++) { var nd = nodes[p]; ctx.fillStyle = 'rgba(' + a1[0] + ',' + a1[1] + ',' + a1[2] + ',' + COL.node + ')'; ctx.beginPath(); ctx.arc(nd.x, nd.y, nd.r, 0, Math.PI * 2); ctx.fill(); }
      if (!reduce) raf = requestAnimationFrame(step);
    }
    var hero = canvas.parentElement;
    hero.addEventListener('pointermove', function (e) { var r = hero.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true; });
    hero.addEventListener('pointerleave', function () { mouse.active = false; mouse.x = -9999; mouse.y = -9999; });
    resize(); step();
    window.addEventListener('resize', function () { if (raf) cancelAnimationFrame(raf); resize(); step(); });
  })();
})();
