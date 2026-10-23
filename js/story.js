/* Scrollytelling für Ratgeber-Artikel (gehört zu css/story.css).
   - Lesefortschritt oben
   - .scrolly: aktiver Schritt (.sstep) setzt seine data-vars als CSS-Variablen auf .scrolly__visual
     und seinen data-label-Text in .scrolly__label */
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

  document.querySelectorAll('.scrolly').forEach(function(sc){
    var visual = sc.querySelector('.scrolly__visual');
    var label = sc.querySelector('.scrolly__label');
    var big = sc.querySelector('.scrolly__big');
    var steps = Array.prototype.slice.call(sc.querySelectorAll('.sstep'));
    if(!visual || !steps.length) return;

    function activate(step){
      steps.forEach(function(s){ s.classList.toggle('is-active', s === step); });
      applyVars(visual, step.getAttribute('data-vars'));
      if(label && step.hasAttribute('data-label')){ label.textContent = step.getAttribute('data-label'); }
      if(big && step.hasAttribute('data-big')){ big.textContent = step.getAttribute('data-big'); }
    }
    activate(steps[0]);

    if(reduce || !('IntersectionObserver' in window)){
      document.documentElement.classList.add('no-story');
      return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ activate(e.target); } });
    }, {rootMargin:'-45% 0px -45% 0px'});
    steps.forEach(function(s){ io.observe(s); });
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
