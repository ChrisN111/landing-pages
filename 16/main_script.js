// ===== OS DETECTION =====
var osType = 'desktop';
(function() {
  var ua = navigator.userAgent || navigator.vendor || '';
  if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    osType = 'ios';
  } else if (/android/i.test(ua)) {
    osType = 'android';
  }
  document.body.classList.add('os-' + osType);
})();

// ===== GLOBALS =====
var city = '';
var girlName = '';
var girlAge = 0;
var dist = 0;
var names = ['Jessica','Amanda','Sarah','Lauren','Ashley','Megan','Rachel','Nicole','Samantha','Brittany','Emily','Natalie','Stephanie','Heather','Amber'];

function pickGirl() {
  girlName = names[Math.floor(Math.random() * names.length)];
  girlAge = Math.floor(Math.random() * 13) + 43; // 43-55
  dist = (Math.random() * 4 + 0.5).toFixed(1);
}

// ===== GEO =====
function getLoc() {
  return Promise.race([
    new Promise(function(resolve) {
      var apis = ['https://ipapi.co/json/','https://ipwho.is/','https://ip-api.com/json/?fields=city,regionName,country'];
      var tried = 0;
      function tryNext() {
        if (tried >= apis.length) { resolve(); return; }
        var url = apis[tried++];
        var ctrl = new AbortController();
        var tid = setTimeout(function(){ ctrl.abort(); }, 1500);
        fetch(url, {signal:ctrl.signal}).then(function(r){return r.json()}).then(function(d){
          clearTimeout(tid);
          var c = d.city || (d.location && d.location.city);
          if (c && c.length > 1) { city = c; resolve(); }
          else tryNext();
        }).catch(function(){ clearTimeout(tid); tryNext(); });
      }
      tryNext();
    }),
    new Promise(function(r){ setTimeout(r, 3000); })
  ]).then(function() {
    if (!city) {
      try {
        var tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        var p = tz.split('/');
        if (p.length > 1) city = p[p.length-1].replace(/_/g,' ');
      } catch(e){}
    }
    if (!city) city = 'deiner Gegend';
  });
}

function timeStr() {
  var d = new Date();
  return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
}
function dateStr() {
  var d = new Date();
  var days = ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'];
  var months = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
  return days[d.getDay()] + ', ' + d.getDate() + '. ' + months[d.getMonth()];
}

// ===== PHASE 1: LOCK SCREEN =====
function showLock() {
  document.getElementById('lock-time').textContent = timeStr();
  document.getElementById('lock-date').textContent = dateStr();
  document.getElementById('lock-loc').textContent = city + ' \u2022 ' + Math.floor(Math.random()*20+8) + ' Frauen in der Nähe';
  document.getElementById('notif-name').textContent = girlName + ', ' + girlAge;
  document.getElementById('notif-text').textContent = dist + ' km entfernt \u2022 Hat dir eine Videonachricht geschickt \uD83D\uDCF9';

  // Update clock
  setInterval(function(){
    var el = document.getElementById('lock-time');
    if (el) el.textContent = timeStr();
  }, 10000);

  // Slide notification down after short delay (mimics real notification arriving)
  setTimeout(function(){
    document.getElementById('notif').classList.add('in');
    // Haptic
    try { if (navigator.vibrate) navigator.vibrate([100, 50, 100]); } catch(e){}
  }, 600);

  // Show hint AFTER 2s so user has time to read the notification first
  setTimeout(function(){
    document.getElementById('notif-hint').classList.add('vis');
  }, 2800);
}

// ===== PHASE 2: OPEN CHAT =====
function goOffer() {
  window.location.href = document.getElementById('offer-link').href;
}

function openChat() {
  // Only proceed if notification is visible
  if (!document.getElementById('notif').classList.contains('in')) return;

  document.getElementById('lock').classList.add('hide');
  var app = document.getElementById('app');
  app.style.display = 'flex';

  document.getElementById('chat-name').textContent = girlName + ', ' + girlAge;
  document.getElementById('hd-dist').textContent = dist + ' km';
  document.getElementById('urg-text').textContent = girlName + ' ist jetzt online \u2022 ' + city;

  // Start toasts only in chat phase
  setInterval(function(){
    var msgs = [
      'Jemand in der Nähe von ' + city + ' ist gerade beigetreten',
      Math.floor(Math.random()*3+2) + ' neue Frauen online in der Nähe',
      girlName + ' hat dein Profil angesehen',
      'Neue Nachricht von ' + names[Math.floor(Math.random()*names.length)]
    ];
    toast(msgs[Math.floor(Math.random()*msgs.length)]);
  }, 18000);

  // Profile header and toast click → offer
  document.getElementById('hd-bar').addEventListener('click', goOffer);
  document.getElementById('toast').addEventListener('click', goOffer);

  startChat();
}

// ===== CHAT ENGINE =====
var chat = null;
var ra = null;

function scrollDown() {
  // Double rAF ensures layout is complete before scrolling
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      chat.scrollTop = chat.scrollHeight + 9999;
    });
  });
}

function addMsg(text, type) {
  var d = document.createElement('div');
  d.className = 'msg msg-' + type;
  d.innerHTML = '<div class="bub">' + text + '</div><div class="msg-time">' + timeStr() + '</div>';
  chat.appendChild(d);
  scrollDown();
}

function addVideo() {
  var d = document.createElement('div');
  d.className = 'msg msg-in';
  d.innerHTML = '<div class="vid-msg" id="vid-container"><video id="vid" src="tits_drop.mp4" playsinline preload="auto" loop></video><div class="play-ov" id="play-ov"><div class="play-btn"></div></div></div><div class="msg-time">' + timeStr() + '</div>';
  chat.appendChild(d);
  scrollDown();
  // Also scroll after video loads its dimensions
  var v = document.getElementById('vid');
  v.addEventListener('loadeddata', scrollDown);
  document.getElementById('vid-container').addEventListener('click', function(){
    var ov = document.getElementById('play-ov');
    if (v.paused) { v.play(); ov.classList.add('gone'); }
    else { v.pause(); ov.classList.remove('gone'); }
  });
}

function showTyping() {
  var d = document.createElement('div');
  d.className = 'msg msg-in';
  d.id = 'typing-ind';
  d.innerHTML = '<div class="bub"><div class="typing"><span></span><span></span><span></span></div></div>';
  chat.appendChild(d);
  scrollDown();
}
function hideTyping() {
  var el = document.getElementById('typing-ind');
  if (el) el.remove();
}

function showBtns(options) {
  ra.innerHTML = '';
  var wrap = document.createElement('div');
  wrap.className = 'reply-btns';
  options.forEach(function(o){
    var b = document.createElement('button');
    b.className = 'rbtn';
    b.textContent = o.text;
    b.addEventListener('click', function(){
      ra.innerHTML = '';
      addMsg(o.text, 'out');
      if (o.cb) o.cb();
    });
    wrap.appendChild(b);
  });
  ra.appendChild(wrap);
  scrollDown();
}

function showCTA() {
  ra.innerHTML = '';
  var wrap = document.createElement('div');
  wrap.className = 'reply-btns';
  var a = document.createElement('a');
  a.className = 'cta-btn';
  a.textContent = '\uD83D\uDD13 ' + girlName + 's vollständiges Profil ansehen';
  a.href = document.getElementById('offer-link').href;
  wrap.appendChild(a);
  ra.appendChild(wrap);
  scrollDown();
}

var toastTimer = null;
function toast(msg) {
  if (toastTimer) clearTimeout(toastTimer);
  var el = document.getElementById('toast');
  el.classList.remove('show');
  // Brief reset for re-trigger animation
  setTimeout(function(){
    document.getElementById('toast-txt').textContent = msg;
    el.classList.add('show');
    toastTimer = setTimeout(function(){ el.classList.remove('show'); toastTimer = null; }, 5000);
  }, 50);
}

function startChat() {
  chat = document.getElementById('chat');
  ra = document.getElementById('ra');

  showTyping();
  setTimeout(function(){
    hideTyping();
    addMsg('Hey \uD83D\uDE0A bist du aus ' + city + '?', 'in');
    setTimeout(function(){
      showTyping();
      setTimeout(function(){
        hideTyping();
        addMsg('Ich hab das f\u00fcr dich aufgenommen... zeig es niemandem \uD83D\uDE1C', 'in');
        setTimeout(function(){
          addVideo();
          setTimeout(function(){
            showBtns([
              {text:'Wow \uD83D\uDD25 du siehst umwerfend aus', cb:phase2},
              {text:'Hey! Ja ich bin in der N\u00e4he \uD83D\uDE0F', cb:phase2}
            ]);
            toast(girlName + ' ist ' + dist + ' km von ' + city + ' entfernt');
          }, 800);
        }, 400);
      }, 900);
    }, 600);
  }, 1000);
}

function phase2() {
  showTyping();
  setTimeout(function(){
    hideTyping();
    addMsg('Mmm freut mich dass es dir gefallen hat \u2764\uFE0F', 'in');
    setTimeout(function(){
      showTyping();
      setTimeout(function(){
        hideTyping();
        addMsg('Ich suche jemanden in ' + city + ' f\u00fcr heute Nacht... hast du Zeit? \uD83D\uDE08', 'in');
        setTimeout(function(){
          showBtns([
            {text:'Ja, ich hab heute Abend Zeit \uD83D\uDE0F', cb:phase3},
            {text:'Erz\u00e4hl mir mehr \u00fcber dich...', cb:phase3}
          ]);
        }, 400);
      }, 800);
    }, 500);
  }, 900);
}

function phase3() {
  showTyping();
  setTimeout(function(){
    hideTyping();
    addMsg('Ich hab noch mehr Fotos und Videos auf meinem Profil \uD83D\uDE1C tippe unten um alles zu sehen... aber mach keinen Screenshot ok? \uD83E\uDD2B', 'in');
    setTimeout(function(){
      showCTA();
      toast('3 andere Personen sehen gerade ' + girlName + 's Profil an');
    }, 500);
  }, 800);
}

// ===== INIT =====
getLoc().then(function(){
  pickGirl();
  showLock();
});
