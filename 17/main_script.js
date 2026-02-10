var currentStep = 0;
var city = '';
var olN = 0;
var matchCount = 0;

// Photo toggle - called directly via onclick="toggle(this)"
function toggle(el) {
  el.classList.toggle('sel');
  var step = el.closest('.step');
  if (!step) return;
  var btn = step.querySelector('.btn-next');
  if (!btn) return;
  var selected = step.querySelectorAll('.photo-opt.sel');
  if (selected.length > 0) {
    btn.classList.add('on');
  } else {
    btn.classList.remove('on');
  }
}

// Step navigation - called directly via onclick="next()"
function next() {
  var cur = document.getElementById('s' + currentStep);
  if (cur) cur.classList.remove('active');
  currentStep++;

  if (currentStep === 9) {
    var loader = document.getElementById('loader');
    loader.classList.add('active');
    var c = city || 'deiner Gegend';
    var msgs = ['Geile Frauen in der Nähe von ' + c + ' werden gesucht...', 'Vorlieben werden überprüft...', 'Profile werden geladen...'];
    var mi = 0;
    var ltxt = document.getElementById('loader-txt');
    ltxt.textContent = msgs[0];
    var msgInt = setInterval(function() {
      mi++;
      if (mi < msgs.length) ltxt.textContent = msgs[mi];
    }, 700);
    setTimeout(function() {
      clearInterval(msgInt);
      loader.classList.remove('active');
      matchCount = Math.floor(Math.random() * 12) + 8;
      document.getElementById('match-count').textContent = matchCount;
      document.getElementById('s9').classList.add('active');
      toast(matchCount + ' Frauen in der Nähe von ' + c + ' warten auf dich');
    }, 2200);
    return;
  }

  var nxt = document.getElementById('s' + currentStep);
  if (nxt) nxt.classList.add('active');
}

// Toast
function toast(msg) {
  var el = document.getElementById('toast-txt');
  var t = document.getElementById('toast');
  if (!el || !t) return;
  el.textContent = msg;
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 4000);
}

function randomToast() {
  var c = city || 'deiner Gegend';
  var msgs = [
    'Jemand in der Nähe von ' + c + ' ist gerade beigetreten',
    'Eine Frau in deiner Nähe sucht gerade',
    Math.floor(Math.random() * 4 + 2) + ' neue Frauen haben sich in der Nähe angemeldet',
    'Neue Aktivität in ' + c
  ];
  toast(msgs[Math.floor(Math.random() * msgs.length)]);
}

// Online counter
function startCounter() {
  olN = Math.floor(Math.random() * 80) + 40;
  var el = document.getElementById('oc');
  if (el) el.textContent = olN;
  setInterval(function() {
    olN += Math.floor(Math.random() * 5) - 2;
    if (olN < 20) olN = 20;
    if (el) el.textContent = olN;
  }, 6000);
}

// Geo detection
function getLoc() {
  return Promise.race([
    new Promise(function(resolve) {
      var apis = ['https://ipapi.co/json/', 'https://ipwho.is/', 'https://ip-api.com/json/?fields=city,regionName,country'];
      var tried = 0;
      function tryNext() {
        if (tried >= apis.length) { resolve(); return; }
        var url = apis[tried++];
        try {
          var ctrl = new AbortController();
          var tid = setTimeout(function() { ctrl.abort(); }, 1500);
          fetch(url, {signal: ctrl.signal}).then(function(r) { return r.json(); }).then(function(d) {
            clearTimeout(tid);
            var c = d.city || (d.location && d.location.city);
            if (c && c.length > 1) { city = c; resolve(); }
            else tryNext();
          }).catch(function() { clearTimeout(tid); tryNext(); });
        } catch(e) { tryNext(); }
      }
      tryNext();
    }),
    new Promise(function(resolve) { setTimeout(resolve, 3000); })
  ]).then(function() {
    if (!city) {
      try {
        var tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        var p = tz.split('/');
        if (p.length > 1) city = p[p.length - 1].replace(/_/g, ' ');
      } catch(e) {}
    }
    if (!city) city = 'deiner Gegend';
  });
}

function updateCity() {
  var els = document.querySelectorAll('.city');
  for (var i = 0; i < els.length; i++) els[i].textContent = city;
  var ct = document.getElementById('city-top');
  if (ct) ct.textContent = city;
}

// Init
try {
  getLoc().then(function() {
    updateCity();
    startCounter();
    setInterval(randomToast, 15000 + Math.random() * 10000);
    setTimeout(randomToast, 5000);
  }).catch(function() {
    city = 'your area';
    updateCity();
    startCounter();
  });
} catch(e) {
  city = 'your area';
  updateCity();
  startCounter();
}
