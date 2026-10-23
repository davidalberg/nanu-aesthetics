/* Ratgeber-Artikel (gehört zu css/story.css).
   - Lesefortschritt oben
   - .stepper: Reiter, Zurück/Weiter, Pfeiltasten und Wischen; der aktive Schritt setzt seine
     data-vars als CSS-Variablen auf .stepper__visual und seinen data-label-Text in .stepper__label
   - Checklisten mit Punktestand */
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Lesefortschritt ---------- */
  var bar = document.querySelector('.readbar span');
  var art = document.querySelector('.story');
  if(bar && art){
    var tick = false;
    var update = function(){
      var r = art.getBoundingClientRect();
      var total = r.height - window.innerHeight;
      var p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
      bar.style.transform = 'scaleX(' + p + ')';
      tick = false;
    };
    window.addEventListener('scroll', function(){ if(!tick){ tick = true; requestAnimationFrame(update); } }, {passive:true});
    update();
  }

  /* ---------- Schritte ---------- */
  function applyVars(el, str){
    (str || '').split(';').forEach(function(pair){
      var i = pair.indexOf(':');
      if(i > 0){ el.style.setProperty(pair.slice(0, i).trim(), pair.slice(i + 1).trim()); }
    });
  }

  document.querySelectorAll('.stepper').forEach(function(sc, si){
    var visual = sc.querySelector('.stepper__visual');
    var label = sc.querySelector('.stepper__label');
    var big = sc.querySelector('.stepper__big');
    var holder = sc.querySelector('.stepper__panels');
    var panels = Array.prototype.slice.call(sc.querySelectorAll('.stepper__panel'));
    if(!visual || !holder || !panels.length) return;

    /* Reiter oben, Zurück/Weiter unten */
    var body = document.createElement('div');
    body.className = 'stepper__body';
    sc.insertBefore(body, holder);
    var tabs = document.createElement('div');
    tabs.className = 'stepper__tabs';
    tabs.setAttribute('role', 'tablist');
    body.appendChild(tabs);
    body.appendChild(holder);
    var nav = document.createElement('div');
    nav.className = 'stepper__nav';
    nav.innerHTML = '<button type="button" class="stepper__btn">← Zurück</button>' +
      '<span class="stepper__count" aria-live="polite"></span>' +
      '<button type="button" class="stepper__btn stepper__btn--next">Weiter →</button>';
    body.appendChild(nav);
    var prev = nav.children[0], count = nav.children[1], next = nav.children[2];

    var cur = 0;
    var btns = panels.map(function(p, i){
      var b = document.createElement('button');
      var id = 'st' + si + '-' + i;
      b.type = 'button';
      b.className = 'stepper__tab';
      b.id = id + '-tab';
      b.textContent = p.getAttribute('data-label') || String(i + 1);
      b.setAttribute('role', 'tab');
      p.id = p.id || id;
      p.setAttribute('role', 'tabpanel');
      p.setAttribute('aria-labelledby', b.id);
      b.setAttribute('aria-controls', p.id);
      b.addEventListener('click', function(){ go(i); });
      tabs.appendChild(b);
      return b;
    });

    function go(i){
      if(i < 0 || i >= panels.length) return;
      cur = i;
      var p = panels[i];
      panels.forEach(function(x, k){ x.classList.toggle('is-active', k === i); });
      btns.forEach(function(b, k){ b.setAttribute('aria-selected', k === i ? 'true' : 'false'); b.tabIndex = k === i ? 0 : -1; });
      tabs.scrollTo({left: btns[i].offsetLeft - 24, behavior: reduce ? 'auto' : 'smooth'});
      applyVars(visual, p.getAttribute('data-vars'));
      if(label && p.hasAttribute('data-label')){ label.textContent = p.getAttribute('data-label'); }
      if(big && p.hasAttribute('data-big')){ big.textContent = p.getAttribute('data-big'); }
      count.textContent = (i + 1) + ' / ' + panels.length;
      prev.disabled = i === 0;
      next.disabled = i === panels.length - 1;
    }
    prev.addEventListener('click', function(){ go(cur - 1); });
    next.addEventListener('click', function(){ go(cur + 1); });
    tabs.addEventListener('keydown', function(e){
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if(d){ e.preventDefault(); go(cur + d); btns[cur].focus(); }
    });

    /* Wischen auf Grafik und Text */
    var sx = null, sy = 0;
    [visual, holder].forEach(function(el){
      el.addEventListener('touchstart', function(e){ sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, {passive:true});
      el.addEventListener('touchend', function(e){
        if(sx === null) return;
        var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
        sx = null;
        if(Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5){ go(cur + (dx < 0 ? 1 : -1)); }
      }, {passive:true});
    });

    sc.classList.add('is-ready');
    go(0);
  });

  /* ---------- Checklisten mit Punktestand ---------- */
  document.querySelectorAll('[data-checklist]').forEach(function(box){
    var inputs = box.querySelectorAll('input[type=checkbox]');
    var out = box.querySelector('[data-score]');
    var fill = box.querySelector('.score__bar span');
    var texts = JSON.parse(box.getAttribute('data-checklist') || '[]');
    function render(){
      var n = 0;
      inputs.forEach(function(i){ if(i.checked) n++; });
      var t = '';
      texts.forEach(function(x){ if(n >= x[0]) t = x[1]; });
      if(out) out.textContent = n + ' von ' + inputs.length + ': ' + t;
      if(fill) fill.style.width = (n / inputs.length * 100) + '%';
    }
    inputs.forEach(function(i){ i.addEventListener('change', render); });
    render();
  });
})();
