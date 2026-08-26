(function(){
  'use strict';

  /* ---------- Nav: hide on scroll down, show on scroll up ---------- */
  var nav = document.getElementById('nav');
  var lastY = window.scrollY;
  var menuOpen = false;
  window.addEventListener('scroll', function(){
    var y = window.scrollY;
    if(!menuOpen){
      if(y > lastY && y > 90){ nav.classList.add('nav--hidden'); }
      else { nav.classList.remove('nav--hidden'); }
    }
    lastY = y;
    /* sticky CTA after hero */
    var hero = document.querySelector('.hero');
    var sticky = document.getElementById('stickycta');
    if(hero && sticky){
      if(y > hero.offsetTop + hero.offsetHeight - 120){ sticky.classList.add('show'); }
      else { sticky.classList.remove('show'); }
    }
  }, {passive:true});

  /* ---------- Burger menu ---------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobilemenu');
  if(burger && menu){ burger.addEventListener('click', function(){
    menuOpen = !menuOpen;
    burger.setAttribute('aria-expanded', String(menuOpen));
    burger.setAttribute('aria-label', menuOpen ? 'Menü schließen' : 'Menü öffnen');
    menu.classList.toggle('open', menuOpen);
    if(menuOpen){ nav.classList.remove('nav--hidden'); }
  });
  menu.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      menuOpen = false;
      burger.setAttribute('aria-expanded','false');
      menu.classList.remove('open');
    });
  });
  }

  /* ---------- Scroll reveals ---------- */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveals = document.querySelectorAll('.reveal');
  if(reduceMotion || !('IntersectionObserver' in window)){
    reveals.forEach(function(el){ el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, {threshold:.12, rootMargin:'0px 0px -30px 0px'});
    reveals.forEach(function(el){ io.observe(el); });
  }

  /* ---------- Before/After slider ---------- */
  var ba = document.getElementById('ba');
  var baAfter = document.getElementById('baAfter');
  var baHandle = document.getElementById('baHandle');
  if(ba && baAfter && baHandle){
  var pos = 50;
  var dragging = false;

  function setPos(p){
    pos = Math.max(0, Math.min(100, p));
    baAfter.style.clipPath = 'inset(0 0 0 ' + pos + '%)';
    baHandle.style.left = pos + '%';
    ba.setAttribute('aria-valuenow', Math.round(pos));
    ba.setAttribute('aria-valuetext', Math.round(100 - pos) + ' % Nachher sichtbar');
  }
  setPos(50);

  function posFromEvent(ev){
    var rect = ba.getBoundingClientRect();
    var x = (ev.touches ? ev.touches[0].clientX : ev.clientX) - rect.left;
    return (x / rect.width) * 100;
  }

  ba.addEventListener('pointerdown', function(ev){
    dragging = true;
    if(ba.setPointerCapture && ev.pointerId !== undefined){
      try{ ba.setPointerCapture(ev.pointerId); }catch(e){}
    }
    setPos(posFromEvent(ev));
    ev.preventDefault();
  });
  ba.addEventListener('pointermove', function(ev){
    if(dragging){ setPos(posFromEvent(ev)); }
  });
  ['pointerup','pointercancel'].forEach(function(t){
    ba.addEventListener(t, function(){ dragging = false; });
  });
  /* Touch fallback for older browsers without pointer events */
  if(!window.PointerEvent){
    ba.addEventListener('touchstart', function(ev){ dragging = true; setPos(posFromEvent(ev)); }, {passive:true});
    ba.addEventListener('touchmove', function(ev){ if(dragging){ setPos(posFromEvent(ev)); } }, {passive:true});
    ba.addEventListener('touchend', function(){ dragging = false; });
    ba.addEventListener('mousedown', function(ev){ dragging = true; setPos(posFromEvent(ev)); ev.preventDefault(); });
    window.addEventListener('mousemove', function(ev){ if(dragging){ setPos(posFromEvent(ev)); } });
    window.addEventListener('mouseup', function(){ dragging = false; });
  }
  ba.addEventListener('keydown', function(ev){
    if(ev.key === 'ArrowLeft'){ setPos(pos - 4); ev.preventDefault(); }
    else if(ev.key === 'ArrowRight'){ setPos(pos + 4); ev.preventDefault(); }
    else if(ev.key === 'Home'){ setPos(0); ev.preventDefault(); }
    else if(ev.key === 'End'){ setPos(100); ev.preventDefault(); }
  });
  }

  /* ---------- Marquee: Inhalt doppeln für nahtlosen Loop ---------- */
  var mtrack = document.getElementById('marqueeTrack');
  if(mtrack){ mtrack.innerHTML += mtrack.innerHTML; }

  /* ---------- Reviews slider (Crossfade, aus V2) ---------- */
  var track = document.getElementById('rtrack');
  if(track){
  var reviews = Array.prototype.slice.call(track.querySelectorAll('.review'));
  var slides = reviews.length;
  var idx = 0;
  var dotsWrap = document.getElementById('rdots');
  var dots = [];
  for(var i = 0; i < slides; i++){
    (function(n){
      var d = document.createElement('button');
      d.className = 'rdot';
      d.setAttribute('role','tab');
      d.setAttribute('aria-label','Bewertung ' + (n+1) + ' anzeigen');
      d.setAttribute('aria-selected', n === 0 ? 'true' : 'false');
      d.addEventListener('click', function(){ go(n); });
      dotsWrap.appendChild(d);
      dots.push(d);
    })(i);
  }
  function go(n){
    reviews[idx].classList.remove('is-active');
    dots[idx].setAttribute('aria-selected','false');
    idx = (n + slides) % slides;
    reviews[idx].classList.add('is-active');
    dots[idx].setAttribute('aria-selected','true');
  }
  document.getElementById('rprev').addEventListener('click', function(){ go(idx - 1); });
  document.getElementById('rnext').addEventListener('click', function(){ go(idx + 1); });
  /* swipe support */
  var startX = null;
  track.addEventListener('touchstart', function(ev){ startX = ev.touches[0].clientX; }, {passive:true});
  track.addEventListener('touchend', function(ev){
    if(startX === null){ return; }
    var dx = ev.changedTouches[0].clientX - startX;
    if(Math.abs(dx) > 45){ go(idx + (dx < 0 ? 1 : -1)); }
    startX = null;
  }, {passive:true});
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq__q').forEach(function(btn){
    btn.addEventListener('click', function(){
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      /* close others */
      document.querySelectorAll('.faq__q[aria-expanded="true"]').forEach(function(other){
        if(other !== btn){
          other.setAttribute('aria-expanded','false');
          document.getElementById(other.getAttribute('aria-controls')).style.maxHeight = '0';
        }
      });
      btn.setAttribute('aria-expanded', String(!expanded));
      panel.style.maxHeight = expanded ? '0' : panel.scrollHeight + 'px';
    });
  });
})();
