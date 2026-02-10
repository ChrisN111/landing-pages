var C = {name:'Emma', fb:'New York'};
var S = {os:'ios', city:'', a:{}, matchN:0, olN:0};

var W = function(ms) { return new Promise(function(r) { setTimeout(r, ms) }) };
var esc = function(t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML };
var $ = function(id) { return document.getElementById(id) };
var ch = $('ch'), rc = $('rc');

function scr() { requestAnimationFrame(function() { ch.scrollTo({top: ch.scrollHeight, behavior: 'smooth'}) }) }
function prg(p) { $('pf').style.width = p + '%'; $('pp').textContent = p + '%' }
function tnow() { var d = new Date(); return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0') }

function detectOS() {
  var u = navigator.userAgent || '';
  if (/android/i.test(u)) return 'android';
  if (/iPad|iPhone|iPod/.test(u) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'ios';
  return 'ios';
}

function getLoc() {
  return Promise.race([
    new Promise(function(resolve) {
      var apis = ['https://ipapi.co/json/', 'https://ipwho.is/', 'https://ip-api.com/json/?fields=city,regionName,country'];
      var tried = 0;
      function tryNext() {
        if (tried >= apis.length) { resolve(); return; }
        var url = apis[tried++];
        var ctrl = new AbortController();
        var tid = setTimeout(function() { ctrl.abort() }, 1500);
        fetch(url, {signal: ctrl.signal}).then(function(r) { return r.json() }).then(function(d) {
          clearTimeout(tid);
          var c = d.city || (d.location && d.location.city);
          if (c && c.length > 1) { S.city = c; resolve(); }
          else tryNext();
        }).catch(function() { clearTimeout(tid); tryNext(); });
      }
      tryNext();
    }),
    W(3000)
  ]).then(function() {
    if (!S.city) {
      try {
        var tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        var p = tz.split('/');
        if (p.length > 1) S.city = p[p.length - 1].replace(/_/g, ' ');
      } catch(e) {}
    }
    if (!S.city) S.city = C.fb;
  });
}

function splash() {
  return getLoc().then(function() {
    S.matchN = Math.floor(Math.random() * 16) + 10;
    var steps = [
      {p:20, t:'Dein Standort wird ermittelt...', d:400},
      {p:45, t:'\uD83D\uDCCD ' + S.city, d:500},
      {p:70, t:'Aktive Profile werden gescannt...', d:500},
      {p:90, t:S.matchN + ' Matches in der Nähe gefunden!', d:400},
      {p:100, t:'Fertig!', d:300}
    ];
    var i = 0;
    function next() {
      if (i >= steps.length) {
        setTimeout(function() {
          $('splash').classList.add('hide');
          $('app').style.display = 'flex';
          setTimeout(go, 400);
        }, 200);
        return;
      }
      var s = steps[i++];
      $('sp-f').style.width = s.p + '%';
      $('sp-st').textContent = s.t;
      if (s.p === 45) $('sp-c').textContent = '\uD83D\uDCCD ' + S.city;
      setTimeout(next, s.d);
    }
    next();
  });
}

function theme() { if (S.os === 'android') $('app').classList.add('droid') }

// === FAST MESSAGE — 600ms typing flash then instant message ===
function msg(text, type) {
  type = type || 'r';
  var r = document.createElement('div');
  r.className = 'm ' + type;
  r.innerHTML = '<div class="b">' + esc(text) + '<div class="bt">' + tnow() + '</div></div>';
  ch.appendChild(r);
  scr();
}

var typEl = null;
function showTyp() {
  if (typEl) return;
  typEl = document.createElement('div');
  typEl.className = 'm r';
  typEl.innerHTML = '<div class="b"><div class="ty"><span></span><span></span><span></span></div></div>';
  ch.appendChild(typEl);
  scr();
}
function hideTyp() { if (typEl) { typEl.remove(); typEl = null; } }

function send(text) {
  showTyp();
  return W(600).then(function() {
    hideTyp();
    msg(text);
    return W(150);
  });
}

function matchCards() {
  var isM = S.a.seeking === 'male';
  var data = [
    {n: isM ? 'M\u2588\u2588\u2588\u2588' : 'S\u2588\u2588\u2588\u2588', e: isM ? '\uD83D\uDC68' : '\uD83D\uDC69', age: Math.floor(Math.random()*10)+35, d: '2 km', p: 94},
    {n: isM ? 'J\u2588\u2588\u2588\u2588' : 'A\u2588\u2588\u2588\u2588', e: isM ? '\uD83D\uDC68\u200D\uD83E\uDDB1' : '\uD83D\uDC71\u200D\u2640\uFE0F', age: Math.floor(Math.random()*10)+30, d: '5 km', p: 91},
    {n: isM ? 'D\u2588\u2588\u2588\u2588' : 'L\u2588\u2588\u2588\u2588', e: isM ? '\uD83D\uDC68' : '\uD83D\uDC69\u200D\uD83E\uDDB0', age: Math.floor(Math.random()*10)+28, d: '8 km', p: 87}
  ];
  var el = document.createElement('div');
  el.className = 'ms';
  el.innerHTML = data.map(function(d) {
    return '<div class="mc"><div class="mc-av">' + d.e + '</div><div class="mc-if"><div class="mc-nm">' + d.n + ', ' + d.age + '</div><div class="mc-dt">' + S.city + ' \u00B7 ' + d.d + ' entfernt</div><div class="mc-cp">' + d.p + '% Match</div></div><div class="mc-lk">\uD83D\uDD12</div></div>';
  }).join('');
  ch.appendChild(el);
  scr();
}

function opts(options) {
  rc.innerHTML = '';
  var w2 = document.createElement('div');
  w2.className = 'ro';
  options.forEach(function(o) {
    var b = document.createElement('button');
    b.className = 'rb';
    b.innerHTML = '<span class="em">' + o.emoji + '</span> ' + esc(o.text);
    b.addEventListener('click', function() { rc.innerHTML = ''; rpl(o) });
    w2.appendChild(b);
  });
  rc.appendChild(w2);
  requestAnimationFrame(scr);
}

function showCTA(text) {
  rc.innerHTML = '';
  var w2 = document.createElement('div');
  w2.className = 'ro';
  w2.style.opacity = '1';
  w2.style.transform = 'none';
  var a = document.createElement('a');
  a.className = 'cta';
  a.textContent = text;
  a.href = document.getElementById('offer-link').href;
  w2.appendChild(a);
  rc.appendChild(w2);
  requestAnimationFrame(scr);
}

function toast(m) { $('ttx').textContent = m; $('tt').classList.add('show'); setTimeout(function() { $('tt').classList.remove('show') }, 4000) }
function rToast() {
  var msgs = ['Jemand in ' + S.city + ' hat sich gerade angemeldet', 'Ein neues Match wurde in der Nähe gefunden!', (Math.floor(Math.random()*4)+2) + ' Personen sind in den letzten 5 Min beigetreten', 'Neue Aktivität in der Nähe von ' + S.city];
  toast(msgs[Math.floor(Math.random() * msgs.length)]);
}

// =========================================================
// 4-STEP FLOW: gender+seeking → goal → age → results
// Total time target: 15-20 seconds
// =========================================================
function go() {
  S.olN = Math.floor(Math.random() * 120) + 80;
  $('oc').textContent = S.olN;
  $('oci').textContent = S.city;
  $('hn').textContent = C.name;
  $('nm').textContent = S.matchN + ' Personen in der Nähe von ' + S.city + ' möchten dich treffen';
  setTimeout(function() { $('ntf').classList.add('go') }, 800);
  setInterval(function() { S.olN += Math.floor(Math.random()*5) - 2; S.olN = Math.max(50, S.olN); $('oc').textContent = S.olN }, 8000);
  setInterval(rToast, 18000 + Math.random() * 12000);

  send('Hey! \uD83D\uDC4B ' + S.olN + ' Personen sind gerade in der Nähe von ' + S.city + ' aktiv. 3 kurze Fragen und ich zeige dir, wer interessiert ist.').then(function() {
    prg(10);
    opts([
      {emoji: '\uD83D\uDC68', text: "Ich bin ein Mann und suche Frauen", val: 'mf', step: 'gender'},
      {emoji: '\uD83D\uDC69', text: "Ich bin eine Frau und suche Männer", val: 'fm', step: 'gender'},
      {emoji: '\uD83D\uDCAB', text: "Andere", val: 'oo', step: 'gender'}
    ]);
  });
}

function rpl(o) {
  msg(o.text, 's');
  switch(o.step) {
    case 'gender':
      if (o.val === 'mf') { S.a.gender = 'male'; S.a.seeking = 'female'; }
      else if (o.val === 'fm') { S.a.gender = 'female'; S.a.seeking = 'male'; }
      else { S.a.gender = 'other'; S.a.seeking = 'any'; }
      qGoal();
      break;
    case 'goal':
      S.a.goal = o.val;
      qAge();
      break;
    case 'age':
      S.a.age = o.val;
      qResults();
      break;
  }
}

function qGoal() {
  send('Was suchst du? \uD83D\uDE0F').then(function() {
    prg(35);
    opts([
      {emoji: '\uD83D\uDD25', text: 'Lockerer Spaß & Hookups', val: 'casual', step: 'goal'},
      {emoji: '\u2764\uFE0F', text: 'Etwas Ernstes', val: 'serious', step: 'goal'},
      {emoji: '\uD83C\uDFB2', text: 'Offen für alles', val: 'open', step: 'goal'}
    ]);
  });
}

function qAge() {
  var goalR = {
    casual: 'Ohne Verpflichtungen \u2014 verstanden \uD83D\uDE0F',
    serious: 'Toll, dass du weißt was du willst \u2764\uFE0F',
    open: 'Ehrlich die beste Einstellung \uD83C\uDFB2'
  };
  send(goalR[S.a.goal] || 'Verstanden!').then(function() {
    return send('Welche Altersgruppe interessiert dich?');
  }).then(function() {
    prg(60);
    opts([
      {emoji: '\uD83C\uDF38', text: '18 \u2013 25', val: '18-25', step: 'age'},
      {emoji: '\uD83C\uDF3A', text: '25 \u2013 35', val: '25-35', step: 'age'},
      {emoji: '\uD83C\uDF39', text: '35 \u2013 50', val: '35-50', step: 'age'},
      {emoji: '\u2728', text: 'Jedes Alter', val: 'any', step: 'age'}
    ]);
  });
}

function qResults() {
  prg(80);
  send('Perfekt \u2014 lass mich deine Matches laden... \uD83D\uDD0D').then(function() {
    showTyp();
    return W(1200);
  }).then(function() {
    hideTyp();
    prg(95);
    var seekL = S.a.seeking === 'male' ? 'Männer' : S.a.seeking === 'female' ? 'Frauen' : 'Personen';
    msg(S.matchN + ' ' + seekL + ' in der Nähe von ' + S.city + ' passen zu dem was du suchst. Hier sind deine Top 3:');
    return W(300);
  }).then(function() {
    matchCards();
    rToast();
    return W(600);
  }).then(function() {
    prg(100);
    msg('Sie sind gerade online \u2014 tippe unten um ihre vollständigen Profile zu sehen \uD83D\uDC40');
    return W(200);
  }).then(function() {
    showCTA('\uD83D\uDD13 ' + S.matchN + ' Matches in der Nähe von ' + S.city + ' ansehen');
  });
}

// === INIT ===
function init() {
  S.os = detectOS();
  theme();
  splash();
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
