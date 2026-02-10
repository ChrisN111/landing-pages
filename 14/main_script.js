var currentStep = 0;
var city = '';
var olN = 0;
var bgIdx = 0;
var bgEls;

function getLoc() {
  return Promise.race([
    new Promise(function(resolve) {
      var apis = ['https://ipapi.co/json/','https://ipwho.is/','https://ip-api.com/json/?fields=city,regionName,country'];
      var tried = 0;
      function tryNext() {
        if (tried >= apis.length) { resolve(); return; }
        var url = apis[tried++];
        var ctrl = new AbortController();
        var tid = setTimeout(function() { ctrl.abort(); }, 1500);
        fetch(url, { signal: ctrl.signal })
          .then(function(r) { return r.json(); })
          .then(function(d) {
            clearTimeout(tid);
            var c = d.city || (d.location && d.location.city);
            if (c && c.length > 1) { city = c; resolve(); }
            else tryNext();
          })
          .catch(function() { clearTimeout(tid); tryNext(); });
      }
      tryNext();
    }),
    new Promise(function(r) { setTimeout(r, 3000); })
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
  var els = document.querySelectorAll('.city-txt');
  for (var i = 0; i < els.length; i++) els[i].textContent = city;
  var ct = document.getElementById('city-top');
  if (ct) ct.textContent = city;
}

function startBgSlide() {
  bgEls = document.querySelectorAll('.bg-slide img');
  setInterval(function() {
    for (var i = 0; i < bgEls.length; i++) bgEls[i].classList.remove('on');
    bgIdx = (bgIdx + 1) % bgEls.length;
    bgEls[bgIdx].classList.add('on');
  }, 6000);
}

function goNext() {
  var cur = document.getElementById('s' + currentStep);
  if (cur) {
    cur.classList.remove('active');
    var vids = cur.querySelectorAll('video');
    for (var i = 0; i < vids.length; i++) vids[i].pause();
  }
  currentStep++;

  if (currentStep === 10) {
    var loader = document.getElementById('loader');
    loader.classList.add('active');
    var msgs = ['Geile Frauen in der Nähe von ' + city + ' werden gesucht...','Deine Vorlieben werden überprüft...','Profile werden geladen...','Fast fertig...'];
    var mi = 0;
    var ltxt = document.getElementById('loader-txt');
    ltxt.textContent = msgs[0];
    var msgInt = setInterval(function() {
      mi++;
      if (mi < msgs.length) ltxt.textContent = msgs[mi];
    }, 600);
    setTimeout(function() {
      clearInterval(msgInt);
      loader.classList.remove('active');
      var mc = Math.floor(Math.random() * 15) + 8;
      document.getElementById('match-count').textContent = mc;
      var s10 = document.getElementById('s10');
      s10.classList.add('active');
      var v = s10.querySelector('video');
      if (v) v.play();
      toast(mc + ' Frauen in der Nähe von ' + city + ' warten auf dich');
    }, 2500);
    return;
  }

  var nxt = document.getElementById('s' + currentStep);
  if (nxt) {
    nxt.classList.add('active');
    var vids = nxt.querySelectorAll('video');
    for (var i = 0; i < vids.length; i++) vids[i].play();
  }
}

function togChk(el) {
  el.classList.toggle('sel');
}

function startCounter() {
  olN = Math.floor(Math.random() * 60) + 30;
  document.getElementById('oc').textContent = olN;
  setInterval(function() {
    olN += Math.floor(Math.random() * 5) - 2;
    if (olN < 15) olN = 15;
    document.getElementById('oc').textContent = olN;
  }, 5000);
}

var notifTimer = null;
function toast(msg) {
  var notif = document.getElementById('notif');
  document.getElementById('notif-msg').textContent = msg;
  document.getElementById('notif-time').textContent = 'now';
  if (notifTimer) { clearTimeout(notifTimer); notif.classList.remove('show'); }
  setTimeout(function() { notif.classList.add('show'); }, 50);
  notifTimer = setTimeout(function() { notif.classList.remove('show'); notifTimer = null; }, 4500);
}

function randomToast() {
  var names = ['Jessica','Emma','Sarah','Ashley','Megan','Lauren','Nicole','Amanda','Samantha','Rachel','Lisa','Tiffany','Katie','Amber','Monica'];
  var ages = [28,31,34,27,42,36,29,38,45,33,26,39,44,30,35];
  var n = names[Math.floor(Math.random() * names.length)];
  var a = ages[Math.floor(Math.random() * ages.length)];
  var msgs = [
    n + ', ' + a + ' ist gerade online in der Nähe von ' + city,
    'Neue Nachricht von ' + n + ', ' + a + ' \u2014 "Hast du heute Abend Zeit?"',
    n + ' hat dein Profil geliked \u2014 sie ist ' + Math.round(Math.random() * 3 + 1) + ' km entfernt',
    Math.floor(Math.random() * 4 + 2) + ' neue Frauen haben sich in der Nähe von ' + city + ' angemeldet',
    n + ', ' + a + ' sucht gerade jemanden'
  ];
  toast(msgs[Math.floor(Math.random() * msgs.length)]);
}

getLoc().then(function() {
  updateCity();
  startCounter();
  startBgSlide();
  setInterval(randomToast, 14000 + Math.random() * 10000);
  setTimeout(randomToast, 4000);
});
