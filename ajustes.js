/* Cover to Cover — ajustes de lectura compartidos (el engrane).
   Todas las páginas del sitio cargan este archivo. Los ajustes se guardan en
   localStorage, que es común a todo giannifontanot.github.io, así que lo que se
   cambia en la biblioteca o en un libro se aplica en todas las páginas (también
   en otras pestañas abiertas).
   Cada página solo necesita usar estos tokens en su CSS:
     --scale   multiplica el tamaño del texto (13 pt = 1)
     --track   espacio entre letras
     --reader  tipo de letra elegido (si no hay, la página usa la suya)
     [data-theme="light"|"dark"] en <html> para el fondo
   y los colores --bg --panel --fg --muted --line --wine --wash y la fuente --display. */
(function () {
  'use strict';
  var d = document, root = d.documentElement, KEY = 'c2c-ajustes';

  var PTS = [];
  for (var p = 10; p <= 24; p++) PTS.push(p);
  var TRACKS = [-0.02, -0.01, 0, 0.02, 0.04, 0.06, 0.08, 0.1];
  var FONTS = {
    '':       { n: 'Spectral', h: 'Con serif',   s: '',
                css: '"Spectral",Georgia,serif',
                t: 'Con serif. Lectura larga y pausada; es la letra de los libros.' },
    nunito:   { n: 'Nunito',   h: 'Redondeada',  s: '"Nunito",Arial,sans-serif',
                css: '"Nunito",Arial,sans-serif',
                t: 'Sin serif, redondeada. Limpia y amable, cansa menos la vista.' },
    atkinson: { n: 'Atkinson', h: 'Baja visión', s: '"Atkinson Hyperlegible",Verdana,sans-serif',
                css: '"Atkinson Hyperlegible",Verdana,sans-serif',
                t: 'Para baja visión: cada letra es inconfundible (I l 1, b d, O 0).' }
  };
  var DEF = { pt: 13, tr: 2, font: '', theme: 'light' };

  function ls(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); }
    catch (e) { return null; }
  }
  function load() {
    var o = {};
    try { o = JSON.parse(ls(KEY) || '{}') || {}; } catch (e) { o = {}; }
    if (o.pt === undefined) { /* ajustes guardados por la primera versión del libro */
      var op = parseInt(ls('cautivados-puntos'), 10), ot = parseInt(ls('cautivados-espacio'), 10), of = ls('cautivados-fuente');
      if (op) o.pt = op;
      if (ot >= 0) o.tr = ot;
      if (of !== null) o.font = of;
    }
    return {
      pt: PTS.indexOf(o.pt) >= 0 ? o.pt : DEF.pt,
      tr: (o.tr >= 0 && o.tr < TRACKS.length) ? o.tr : DEF.tr,
      font: Object.prototype.hasOwnProperty.call(FONTS, o.font) ? o.font : DEF.font,
      theme: o.theme === 'dark' ? 'dark' : 'light'
    };
  }
  var S = load();
  function save() { ls(KEY, JSON.stringify(S)); }

  function apply() {
    root.style.setProperty('--scale', (S.pt * 4 / 3 / 17).toFixed(4));
    root.style.setProperty('--track', TRACKS[S.tr] + 'em');
    if (S.font) root.style.setProperty('--reader', FONTS[S.font].s);
    else root.style.removeProperty('--reader');
    root.setAttribute('data-theme', S.theme);
    root.setAttribute('data-anim', 'zoom');
    sync();
  }
  apply(); /* lo antes posible, para que la página no parpadee */

  window.addEventListener('storage', function (e) {
    if (e.key === KEY) { S = load(); apply(); }
  });

  /* ---------- interfaz ---------- */
  var ui = null;

  var CSS = [
    '.aj-gear{position:fixed;z-index:40;top:calc(env(safe-area-inset-top,0px) + 12px);right:max(16px,env(safe-area-inset-right,0px));width:38px;height:38px;padding:0;display:grid;place-items:center;border:1px solid var(--line);border-radius:50%;background:var(--panel);color:var(--muted);box-shadow:0 2px 10px rgba(43,33,24,.14);cursor:pointer;opacity:.92}',
    '.aj-gear:hover{opacity:1;color:var(--wine)}',
    '.aj-gear svg{width:18px;height:18px}',
    '.aj-gear:focus-visible,.aj-pop button:focus-visible,.aj-fo:has(input:focus-visible){outline:2px solid var(--wine);outline-offset:2px}',
    '.aj-pop{position:fixed;inset:0;z-index:60;display:grid;place-items:center;padding:16px;background:rgba(43,33,24,.42);opacity:0;transition:opacity 380ms ease;letter-spacing:0;font-size:16px;line-height:1.5}',
    '.aj-pop[hidden]{display:none!important}',
    '.aj-pop.on{opacity:1}',
    '.aj-card{background:var(--panel);color:var(--fg);border:1px solid var(--line);border-radius:8px;box-shadow:0 18px 50px rgba(43,33,24,.28);width:min(520px,100%);max-height:min(88vh,700px);display:grid;grid-template-rows:auto 1fr;overflow:hidden;transform:scale(.86);opacity:0;transition:transform 380ms cubic-bezier(.2,.7,.2,1),opacity 380ms ease}',
    '.aj-pop.on .aj-card{transform:none;opacity:1}',
    '.aj-head{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:14px 18px 10px;border-bottom:1px solid var(--line)}',
    '.aj-head h2{margin:0;font-family:var(--display);font-weight:600;font-size:20px;color:var(--wine)}',
    '.aj-x{border:0;background:transparent;padding:4px 10px;font-size:22px;line-height:1;color:var(--muted);border-radius:4px;cursor:pointer}',
    '.aj-x:hover{background:var(--wash);color:var(--fg)}',
    '.aj-body{overflow:auto;padding:16px 18px 18px;display:grid;gap:14px}',
    '.aj-lbl{font-family:var(--display);font-size:13px;font-weight:600;color:var(--fg)}',
    '.aj-fonts{border:0;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}',
    '.aj-fonts legend{padding:0;margin-bottom:8px}',
    '.aj-fo{position:relative;display:grid;justify-items:center;text-align:center;gap:2px;padding:10px 6px;border:1px solid var(--line);border-radius:6px;background:var(--panel);cursor:pointer}',
    '.aj-fo:hover{border-color:var(--wine)}',
    '.aj-fo:has(input:checked){border-color:var(--wine);background:var(--wash)}',
    '.aj-fo input{position:absolute;opacity:0;pointer-events:none}',
    '.aj-fo .aa{font-size:27px;line-height:1.1;color:var(--wine)}',
    '.aj-fo b{font-family:var(--display);font-weight:600;font-size:13px}',
    '.aj-fo small{font-family:var(--display);font-size:11.5px;color:var(--muted)}',
    '.aj-row{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;background:var(--wash);border:1px solid var(--line);border-radius:8px;padding:8px 8px 8px 14px}',
    '.aj-step{display:flex;align-items:center;gap:2px;background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:3px}',
    '.aj-step button{border:0;border-radius:4px;background:transparent;color:var(--fg);padding:6px 12px;line-height:1;font-family:var(--display);font-weight:600;font-size:14px;cursor:pointer}',
    '.aj-step button:hover{background:var(--wash);color:var(--wine)}',
    '.aj-step button:disabled{opacity:.35;cursor:default;background:transparent}',
    '.aj-step button[aria-pressed="true"]{background:var(--wine);color:var(--panel)}',
    '.aj-step output{font-family:var(--display);font-size:12.5px;color:var(--muted);min-width:4.2em;text-align:center;font-variant-numeric:tabular-nums}',
    '.aj-actions{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}',
    '.aj-actions button{font-family:var(--display);font-size:13px;font-weight:600;border-radius:6px;padding:8px 14px;border:1px solid var(--line);background:transparent;color:var(--fg);cursor:pointer}',
    '.aj-actions .aj-done{background:var(--wine);border-color:var(--wine);color:var(--panel)}',
    '@media (prefers-reduced-motion:reduce){.aj-card{transform:none!important}.aj-pop,.aj-card{transition-duration:150ms}}'
  ].join('\n');

  var GEAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>';

  function fontCard(k) {
    var f = FONTS[k];
    return '<label class="aj-fo" data-k="' + k + '" title="' + f.t + '">' +
      '<input type="radio" name="aj-fuente" value="' + k + '">' +
      '<span class="aa" style="font-family:' + f.css.replace(/"/g, '&quot;') + '">Aa</span>' +
      '<b>' + f.n + '</b><small>' + f.h + '</small></label>';
  }

  function build() {
    if (ui) return;
    [['Nunito', 'Nunito:ital,wght@0,400;0,600;1,400'],
     ['Atkinson', 'Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400']].forEach(function (f) {
      if (d.querySelector('link[href*="' + f[1].split(':')[0] + '"]')) return;
      var l = d.createElement('link'); l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=' + f[1] + '&display=swap';
      d.head.appendChild(l);
    });
    var st = d.createElement('style'); st.textContent = CSS; d.head.appendChild(st);

    var gear = d.createElement('button');
    gear.type = 'button'; gear.className = 'aj-gear';
    gear.setAttribute('aria-label', 'Ajustes de lectura'); gear.setAttribute('aria-haspopup', 'dialog');
    gear.innerHTML = GEAR;

    var pop = d.createElement('div');
    pop.className = 'aj-pop'; pop.hidden = true;
    pop.innerHTML =
      '<div class="aj-card" role="dialog" aria-modal="true" aria-labelledby="aj-t">' +
        '<div class="aj-head"><h2 id="aj-t">Ajustes de lectura</h2><button type="button" class="aj-x" aria-label="Cerrar">×</button></div>' +
        '<div class="aj-body">' +
          '<fieldset class="aj-fonts"><legend class="aj-lbl">Tipo de letra</legend>' +
            fontCard('') + fontCard('nunito') + fontCard('atkinson') + '</fieldset>' +
          '<div class="aj-row"><span class="aj-lbl" id="aj-fs">Tamaño</span><div class="aj-step" role="group" aria-labelledby="aj-fs">' +
            '<button type="button" data-a="pt-" aria-label="Disminuir tamaño de letra">A−</button><output aria-live="polite" data-o="pt"></output>' +
            '<button type="button" data-a="pt+" aria-label="Aumentar tamaño de letra">A+</button></div></div>' +
          '<div class="aj-row"><span class="aj-lbl" id="aj-ls">Espacio entre letras</span><div class="aj-step" role="group" aria-labelledby="aj-ls">' +
            '<button type="button" data-a="tr-" aria-label="Reducir espacio entre letras">−</button><output aria-live="polite" data-o="tr"></output>' +
            '<button type="button" data-a="tr+" aria-label="Aumentar espacio entre letras">+</button></div></div>' +
          '<div class="aj-row"><span class="aj-lbl" id="aj-th">Fondo</span><div class="aj-step" role="group" aria-labelledby="aj-th">' +
            '<button type="button" data-th="light">Claro</button><button type="button" data-th="dark">Oscuro</button></div></div>' +
          '<div class="aj-actions"><button type="button" data-a="reset">Restablecer</button><button type="button" class="aj-done" data-a="done">Listo</button></div>' +
        '</div>' +
      '</div>';

    d.body.appendChild(gear); d.body.appendChild(pop);
    ui = { gear: gear, pop: pop, card: pop.firstChild, opener: null };

    gear.addEventListener('click', open);
    pop.addEventListener('click', function (e) {
      if (e.target === pop) { close(); return; }
      var b = e.target.closest && e.target.closest('button');
      if (!b) return;
      var a = b.getAttribute('data-a'), th = b.getAttribute('data-th');
      var i = PTS.indexOf(S.pt);
      if (b.classList.contains('aj-x') || a === 'done') { close(); return; }
      if (a === 'pt+' && i < PTS.length - 1) S.pt = PTS[i + 1];
      else if (a === 'pt-' && i > 0) S.pt = PTS[i - 1];
      else if (a === 'tr+' && S.tr < TRACKS.length - 1) S.tr++;
      else if (a === 'tr-' && S.tr > 0) S.tr--;
      else if (a === 'reset') S = { pt: DEF.pt, tr: DEF.tr, font: DEF.font, theme: DEF.theme };
      else if (th) S.theme = th;
      else return;
      save(); apply();
    });
    pop.addEventListener('change', function (e) {
      if (e.target.name === 'aj-fuente') { S.font = e.target.value; save(); apply(); }
    });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !pop.hidden) close(); });

    /* oculta una letra si no logró cargar en este dispositivo */
    window.addEventListener('load', function () {
      if (!d.fonts || !d.fonts.load) return;
      [['nunito', 'Nunito'], ['atkinson', 'Atkinson Hyperlegible']].forEach(function (f) {
        d.fonts.load('400 24px "' + f[1] + '"', 'Aa').then(function (l) {
          if (l.length) return;
          var el = pop.querySelector('[data-k="' + f[0] + '"]'); if (el) el.hidden = true;
          if (S.font === f[0]) { S.font = ''; save(); apply(); }
        }).catch(function () {});
      });
    });
    sync();
  }

  function sync() {
    if (!ui) return;
    var p = ui.pop, i = PTS.indexOf(S.pt);
    p.querySelector('[data-o="pt"]').textContent = S.pt + ' pt';
    p.querySelector('[data-a="pt-"]').disabled = i === 0;
    p.querySelector('[data-a="pt+"]').disabled = i === PTS.length - 1;
    var dd = S.tr - DEF.tr;
    p.querySelector('[data-o="tr"]').textContent = dd === 0 ? 'Normal' : (dd > 0 ? '+' + dd : '−' + (-dd));
    p.querySelector('[data-a="tr-"]').disabled = S.tr === 0;
    p.querySelector('[data-a="tr+"]').disabled = S.tr === TRACKS.length - 1;
    [].forEach.call(p.querySelectorAll('input[name="aj-fuente"]'), function (r) { r.checked = r.value === S.font; });
    [].forEach.call(p.querySelectorAll('[data-th]'), function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-th') === S.theme));
    });
  }

  function open() {
    var p = ui.pop;
    ui.opener = d.activeElement;
    clearTimeout(p._t); p.hidden = false; void p.offsetWidth; p.classList.add('on');
    var first = p.querySelector('input[name="aj-fuente"]:checked') || p.querySelector('.aj-x');
    if (first) first.focus({ preventScroll: true });
  }
  function close() {
    var p = ui.pop;
    if (p.hidden) return;
    p.classList.remove('on');
    var done = false;
    function end() {
      if (done) return; done = true;
      if (!p.classList.contains('on')) p.hidden = true;
      if (ui.opener && ui.opener.focus) ui.opener.focus();
    }
    ui.card.addEventListener('transitionend', end, { once: true });
    p._t = setTimeout(end, 450);
  }

  window.C2C = { ajustes: function () { return JSON.parse(JSON.stringify(S)); }, abrir: function () { build(); open(); } };

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', build);
  else build();
})();
