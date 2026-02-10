window.onerror=function(msg,url,line,col,err){document.body.innerHTML='<div style="color:red;padding:40px;font-size:16px">JS Error: '+msg+'<br>Line: '+line+'<br>Col: '+col+'</div>';};
const C={offer:'https://example.com',name:'Emma',fb:'New York'};
let S={os:'ios',city:'',a:{},matchN:0,olN:0};

const W=ms=>new Promise(r=>setTimeout(r,ms));
const esc=t=>{const d=document.createElement('div');d.textContent=t;return d.innerHTML};
const $=id=>document.getElementById(id);
const ch=$('ch'),rc=$('rc');

function scr(){requestAnimationFrame(()=>{ch.scrollTo({top:ch.scrollHeight,behavior:'smooth'})})}
function prg(p){$('pf').style.width=p+'%';$('pp').textContent=p+'%'}
function tnow(){const d=new Date();return d.getHours().toString().padStart(2,'0')+':'+d.getMinutes().toString().padStart(2,'0')}

// ============================================================
// TIMING — the golden rule: NEVER a gap without typing dots
// ============================================================
// Typing duration: how long dots show. Scales with text length.
// Short msg (20 chars) = ~1.2s, medium (60) = ~2s, long (100+) = ~2.8s
function typDur(text){ return Math.max(1000, Math.min(2800, 700 + text.length * 22)) }

// Read pause: tiny breather AFTER message appears, before next typing starts.
// Just enough to let eyes register the new bubble, NOT enough to feel like dead air.
// The typing dots for the NEXT message are the real "reading time".
function readPause(text){ return Math.max(300, Math.min(800, text.length * 5)) }

function detectOS(){
  const u=navigator.userAgent||'';
  if(/android/i.test(u))return 'android';
  if(/iPad|iPhone|iPod/.test(u)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1))return 'ios';
  return 'ios';
}

async function getLoc(){
  // Hard 3s max for ALL geo attempts combined — never hang the splash
  try {
    await Promise.race([
      (async()=>{
        const apis=['https://ipapi.co/json/','https://ipwho.is/','https://ip-api.com/json/?fields=city,regionName,country'];
        for(const url of apis){
          try{
            const ctrl=new AbortController();
            const tid=setTimeout(()=>ctrl.abort(),1500);
            const r=await fetch(url,{signal:ctrl.signal});
            clearTimeout(tid);
            const d=await r.json();
            const c=d.city||(d.location&&d.location.city);
            if(c&&c.length>1){S.city=c;return;}
          }catch(e){}
        }
      })(),
      W(3000) // hard ceiling — after 3s, move on no matter what
    ]);
  }catch(e){}
  // Fallback: timezone
  if(!S.city){
    try{const tz=Intl.DateTimeFormat().resolvedOptions().timeZone;const p=tz.split('/');if(p.length>1)S.city=p[p.length-1].replace(/_/g,' ');}catch(e){}
  }
  if(!S.city)S.city=C.fb;
}

async function splash(){
  await getLoc();
  S.matchN=Math.floor(Math.random()*16)+10;
  const st=[{p:15,t:'Dein Standort wird ermittelt...',d:600},{p:35,t:`📍 ${S.city}`,d:700},{p:55,t:'Aktive Profile werden gescannt...',d:800},{p:80,t:`${S.matchN} Matches in deiner Nähe gefunden!`,d:600},{p:100,t:'Fertig!',d:400}];
  for(const s of st){$('sp-f').style.width=s.p+'%';$('sp-st').textContent=s.t;if(s.p===35)$('sp-c').textContent='📍 '+S.city;await W(s.d);}
  await W(300);$('splash').classList.add('hide');$('app').style.display='flex';setTimeout(go,600);
}

function theme(){if(S.os==='android')$('app').classList.add('droid')}

// ============================================================
// MESSAGE SYSTEM — send() is the ONLY way to add Emma messages
// Flow: show typing dots → remove dots → add message → tiny read pause
// NEVER call W() between send() calls — send() handles ALL timing
// ============================================================
async function send(text, html=false){
  showTyp(); // show dots immediately (no gap!)
  await W(typDur(text)); // hold dots for natural duration
  hideTyp(); // remove dots
  addMsg(text,'r',html); // show message
  await W(readPause(text)); // tiny pause to register, then next send() starts typing immediately
}

let typEl=null;
function showTyp(){
  if(typEl)return; // already showing
  typEl=document.createElement('div');typEl.className='m r';
  typEl.innerHTML='<div class="b"><div class="ty"><span></span><span></span><span></span></div></div>';
  ch.appendChild(typEl);scr();
}
function hideTyp(){if(typEl){typEl.remove();typEl=null;}}

function addMsg(text,type='r',html=false){
  const r=document.createElement('div');r.className='m '+type;
  r.innerHTML=`<div class="b">${html?text:esc(text)}<div class="bt">${tnow()}</div></div>`;
  ch.appendChild(r);scr();return r;
}

function photo(){
  const r=document.createElement('div');r.className='m r';
  r.innerHTML=`<div class="ph"><img src="data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='200' height='260'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:%23ff6b9d'/><stop offset='100%' style='stop-color:%23c44dff'/></linearGradient></defs><rect fill='url(%23g)' width='200' height='260' rx='8'/><text x='100' y='120' text-anchor='middle' fill='white' font-size='44'>👩</text><text x='100' y='158' text-anchor='middle' fill='rgba(255,255,255,0.7)' font-size='13'>Profilfoto</text></svg>`)}" /><div class="ph-ov"><div class="ph-oi">🔒</div><div class="ph-ot">Profil erstellen zum Ansehen</div></div></div>`;
  ch.appendChild(r);scr();
}

function compat(scores){
  const tot=Math.round(scores.reduce((a,b)=>a+b.v,0)/scores.length);
  const circ=2*Math.PI*52;
  const el=document.createElement('div');el.className='cc';
  el.innerHTML=`<div class="cc-hd"><div class="cc-hi">💖</div><div class="cc-ht">Dein Kompatibilitäts-Score</div></div><div class="cc-rw"><svg class="cc-rg" viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="8"/><circle id="cring" cx="60" cy="60" r="52" fill="none" stroke="url(#cgrad)" stroke-width="8" stroke-dasharray="${circ}" stroke-dashoffset="${circ}" stroke-linecap="round" transform="rotate(-90 60 60)"/><defs><linearGradient id="cgrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="var(--pink)"/><stop offset="100%" stop-color="#ff8a5c"/></linearGradient></defs></svg><div class="cc-pct" id="cnum">0%</div></div><div class="cc-bars">${scores.map(s=>`<div class="cc-bi"><div class="cc-bl">${s.l}</div><div class="cc-bt"><div class="cc-bf" style="width:0;background:${s.c}"></div></div><div class="cc-bv">${s.v}%</div></div>`).join('')}</div>`;
  ch.appendChild(el);scr();
  setTimeout(()=>{
    el.querySelector('#cring').style.transition='stroke-dashoffset 2s cubic-bezier(.4,0,.2,1)';
    el.querySelector('#cring').style.strokeDashoffset=circ-(circ*tot/100);
    el.querySelectorAll('.cc-bf').forEach((b,i)=>{b.style.width=scores[i].v+'%'});
    let c=0;const iv=setInterval(()=>{c+=2;if(c>=tot){c=tot;clearInterval(iv)}$('cnum').textContent=c+'%'},30);
  },100);
}

function matchCards(){
  const isM=S.a.seeking==='male';
  const data=[
    {n:isM?'M████':'S████',e:isM?'👨':'👩',age:Math.floor(Math.random()*10)+44,d:'2 km',p:94},
    {n:isM?'J████':'A████',e:isM?'👨‍🦱':'👱‍♀️',age:Math.floor(Math.random()*10)+46,d:'5 km',p:89},
    {n:isM?'D████':'L████',e:isM?'👨':'👩‍🦰',age:Math.floor(Math.random()*10)+42,d:'8 km',p:87},
  ];
  const el=document.createElement('div');el.className='ms';
  el.innerHTML=data.map(d=>`<div class="mc"><div class="mc-av">${d.e}</div><div class="mc-if"><div class="mc-nm">${d.n}, ${d.age}</div><div class="mc-dt">${S.city} · ${d.d} entfernt</div><div class="mc-cp">${d.p}% Match</div></div><div class="mc-lk">🔒</div></div>`).join('');
  ch.appendChild(el);scr();
}

function tags(list,cb){
  const wrap=document.createElement('div');wrap.className='ig';const sel=new Set();
  list.forEach(t=>{const el=document.createElement('div');el.className='tg';el.textContent=t;
    el.addEventListener('click',()=>{if(sel.has(t)){sel.delete(t);el.classList.remove('sel')}else if(sel.size<5){sel.add(t);el.classList.add('sel')}
      btn.textContent=`Weiter mit ${sel.size} Interessen →`;if(sel.size>=2)btn.classList.add('show');else btn.classList.remove('show');});wrap.appendChild(el);});
  ch.appendChild(wrap);scr();
  // Button goes in the fixed #rc area so it's always visible
  const bw=document.createElement('div');bw.className='ro';bw.style.opacity='1';bw.style.transform='none';
  const btn=document.createElement('button');btn.className='tg-go';btn.textContent='Wähle mindestens 2 →';
  btn.addEventListener('click',()=>{if(sel.size>=2){cb([...sel]);wrap.remove();rc.innerHTML='';}});
  bw.appendChild(btn);rc.innerHTML='';rc.appendChild(bw);
}

// Show reply buttons — no extra delay, send() already handled pacing
function opts(options){
  rc.innerHTML='';
  const w2=document.createElement('div');w2.className='ro';
  options.forEach(o=>{const b=document.createElement('button');b.className='rb';
    b.innerHTML=`<span class="em">${o.emoji}</span> ${esc(o.text)}`;
    b.addEventListener('click',()=>{rc.innerHTML='';rpl(o)});w2.appendChild(b)});
  rc.appendChild(w2);
  requestAnimationFrame(scr);
}

function toast(m){$('ttx').textContent=m;$('tt').classList.add('show');setTimeout(()=>$('tt').classList.remove('show'),4000)}
function rToast(){const m=[`Jemand in ${S.city} hat sich gerade angemeldet`,`Ein neues Match wurde in der Nähe gefunden!`,`${Math.floor(Math.random()*4)+2} Personen sind in den letzten 5 Min beigetreten`,`Neue Aktivität in der Nähe von ${S.city}`];toast(m[Math.floor(Math.random()*m.length)])}

// =========================================================
// CONVERSATION FLOW
// Rule: between send() calls, NEVER use bare W().
// send() → send() flows seamlessly (typing dots fill all gaps).
// Only use W() for special moments (photo reveal, compat animation).
// =========================================================
async function go(){
  S.olN=Math.floor(Math.random()*120)+80;
  $('oc').textContent=S.olN;$('oci').textContent=S.city;$('hn').textContent=C.name;
  $('nm').textContent=`${C.name} hat Matches für dich in ${S.city} gefunden!`;
  setTimeout(()=>$('ntf').classList.add('go'),1500);
  setInterval(()=>{S.olN+=Math.floor(Math.random()*5)-2;S.olN=Math.max(50,S.olN);$('oc').textContent=S.olN},8000);
  setInterval(rToast,20000+Math.random()*15000);

  // Initial typing appears immediately — no dead air
  await send(`Hey! 😊 Ich bin ${C.name} — stell dir mich als deine Dating-Concierge vor.`);

  const day=['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'][new Date().getDay()];
  await send(`Ich habe gerade nachgeschaut — es sind ${S.olN} Singles in ${S.city} gerade aktiv. Das ist überdurchschnittlich für einen ${day}!`);
  prg(5);

  await send(`Lass mich dein Match-Profil erstellen. Dauert etwa eine Minute — ich verspreche, es wird unterhaltsam 😉`);
  prg(8);

  opts([{emoji:'👋',text:"Los geht's!",step:'go'},{emoji:'😏',text:"Überrasch mich",step:'go'}]);
}

async function rpl(o){
  addMsg(o.text,'s');
  // After user taps, show typing dots immediately (she's "reading" your reply)
  // The next send() call starts with showTyp() so there's zero gap
  switch(o.step){
    case 'go': await qGender();break;
    case 'gender': S.a.gender=o.val; await qSeeking();break;
    case 'seeking': S.a.seeking=o.val; await qAge();break;
    case 'age': S.a.age=o.val; await qGoal();break;
    case 'goal': S.a.goal=o.val; await qWeekend();break;
    case 'weekend': S.a.weekend=o.val; await qDeal();break;
    case 'deal': S.a.deal=o.val; await qInterests();break;
    case 'photo_react': await qCompat();break;
    case 'compat_react': await qMatches();break;
    case 'final': goOffer();break;
  }
}

async function qGender(){
  await send("OK zuerst — die Basics:");
  prg(12);
  opts([{emoji:'👨',text:"Ich bin ein Mann",val:'male',step:'gender'},{emoji:'👩',text:"Ich bin eine Frau",val:'female',step:'gender'}]);
}

async function qSeeking(){
  const g=S.a.gender;
  await send(g==='male'?"Verstanden, willkommen an Bord! 💪 Und du möchtest treffen...":"Willkommen! 💕 Und du möchtest treffen...");
  prg(20);
  opts([{emoji:'👩',text:'Frauen',val:'female',step:'seeking'},{emoji:'👨',text:'Männer',val:'male',step:'seeking'},{emoji:'💫',text:'Offen für alle',val:'any',step:'seeking'}]);
}

async function qAge(){
  await send("Perfekt. Welche Altersgruppe spricht dich an?");
  prg(28);
  rToast();
  opts([{emoji:'🌸',text:'30 – 45',val:'30-45',step:'age'},{emoji:'🌺',text:'45 – 55',val:'45-55',step:'age'},{emoji:'🌹',text:'55+',val:'55+',step:'age'},{emoji:'✨',text:"Alter ist nur eine Zahl",val:'any',step:'age'}]);
}

async function qGoal(){
  const ageR={'30-45':"Tolle Altersgruppe — jede Menge Energie und Lebenserfahrung kombiniert!",'45-55':"Der Sweet Spot ehrlich gesagt — in dem Alter kennen sich die Leute wirklich selbst 👌",'55+':"Super — diese Gruppe hat die besten Gespräche meiner Erfahrung nach",'any':"Offenheit ist ehrlich gesagt die beste Dating-Superkraft"};
  await send(ageR[S.a.age]||"Nice!");
  await send("Jetzt die wichtige Frage — was suchst du wirklich? Kein Urteil, ich hab schon alles gehört 😄");
  prg(36);
  opts([
    {emoji:'❤️',text:'Eine echte, dauerhafte Beziehung',val:'serious',step:'goal'},
    {emoji:'☕',text:'Lockeres Dating & gute Gesellschaft',val:'casual',step:'goal'},
    {emoji:'💬',text:'Gesellschaft & tiefe Gespräche',val:'companion',step:'goal'},
    {emoji:'🎲',text:"Einfach schauen was passiert",val:'open',step:'goal'},
  ]);
}

async function qWeekend(){
  const goalR={
    serious:`Das ist die #1 Antwort in ${S.city} gerade — du bist definitiv nicht allein ❤️`,
    casual:"Da ist nichts falsch dran! Manche der besten Dinge beginnen ohne Druck 😎",
    companion:"Ehrlich unterschätzt. Leute die echte Gespräche suchen, sind meist die interessantesten",
    open:"Respekt. Manchmal passieren die besten Dinge, wenn man nichts erzwingt"
  };
  await send(goalR[S.a.goal]||"Toll!");
  await send("OK jetzt was Lustiges — beschreib deinen idealen Samstag. Das hilft mir beim Lifestyle-Matching:");
  prg(44);
  opts([
    {emoji:'🍷',text:'Abendessen & gute Gespräche',val:'dining',step:'weekend'},
    {emoji:'🌳',text:'Langer Spaziergang, Natur, frische Luft',val:'outdoors',step:'weekend'},
    {emoji:'🎬',text:'Gemütlicher Abend — Film & Snacks',val:'cozy',step:'weekend'},
    {emoji:'🏛️',text:'Etwas Neues erkunden',val:'culture',step:'weekend'},
    {emoji:'🍳',text:'Etwas von Grund auf kochen',val:'cooking',step:'weekend'},
  ]);
}

async function qDeal(){
  const wkR={
    dining:`Ein Feinschmecker! Fun Fact — etwa 60% der ersten Dates in ${S.city} sind Abendessen, du bist also genau richtig 🍷`,
    outdoors:"Ein Naturmensch — du wärst überrascht wie viele das BEHAUPTEN aber nie wirklich rausgehen 😂 Du bist echt",
    cozy:"Die Gemütlichen sind meist die unkompliziertesten Partner. Das ist übrigens ein Kompliment 🥰",
    culture:"Eine neugierige Seele! Leute wie du haben meistens die BESTEN Geschichten. Deine Matches werden es lieben mit dir zu reden",
    cooking:"Du kochst selbst? Das ist praktisch eine Superkraft beim Dating. Ernsthaft — du bist gerade ganz oben auf jeder Liste 🍳"
  };
  await send(wkR[S.a.weekend]||"Tolle Wahl!");
  await send("Letzte Persönlichkeitsfrage — was ist das absolute Must-have bei einem Partner für dich?");
  prg(52);
  opts([
    {emoji:'😂',text:'Kann mich richtig zum Lachen bringen',val:'humor',step:'deal'},
    {emoji:'🤝',text:'Treu & ehrlich, egal was passiert',val:'loyalty',step:'deal'},
    {emoji:'🧠',text:'Kann ein tiefes Gespräch führen',val:'intellect',step:'deal'},
    {emoji:'🔥',text:'Starke körperliche Anziehung',val:'chemistry',step:'deal'},
    {emoji:'💛',text:'Gutes Herz & emotionale Wärme',val:'kindness',step:'deal'},
  ]);
}

async function qInterests(){
  const dealR={
    humor:"JA. Wenn jemand dich zum Lachen bringt bis der Bauch wehtut — das ist die Person 😂",
    loyalty:"Ohne dieses Fundament kann man nichts Echtes aufbauen. Die Treue-Sucher auf unserer Plattform haben die längsten Beziehungen",
    intellect:"Ein Sapiosexueller! Nichts ist besser als ein Geist der dich auf Trab hält 🧠",
    chemistry:"Hey — Schmetterlinge im Bauch kann man nicht faken. Wenn es da ist, ist es da. Kein Grund sich dafür zu schämen 🔥",
    kindness:"Weißt du was? Freundlichkeit ist der #1 Indikator für langfristigen Beziehungserfolg laut Forschung. Du bist dem Spiel voraus 💛"
  };
  await send(dealR[S.a.deal]||"Gute Wahl!");
  await send("OK letzter Schritt bevor ich deine Matches berechne — tippe auf die Interessen die dich beschreiben:");
  prg(60);

  tags([
    '🎵 Musik','📚 Lesen','✈️ Reisen','🏋️ Fitness','🍳 Kochen',
    '🎬 Filme','📷 Fotografie','🌱 Gärtnern','🐕 Hunde','🐈 Katzen',
    '🎨 Kunst','💃 Tanzen','🎮 Gaming','🧘 Yoga','🏖️ Strand',
    '⛰️ Wandern','🍷 Wein','☕ Kaffee','🏠 Zuhause','🎭 Theater'
  ], async(sel)=>{
    S.a.interests=sel;
    addMsg(sel.join(', '),'s');
    prg(68);

    let react="Solide Auswahl! Die verraten mir viel darüber, mit wem du gut harmonieren würdest";
    if(sel.includes('🐕 Hunde')&&sel.includes('🐈 Katzen')) react="Hunde- UND Katzenmensch? Du bist quasi ein Disney-Protagonist 🦁";
    else if(sel.includes('🍷 Wein')&&sel.includes('🍳 Kochen')) react="Wein + Kochen? Du bist buchstäblich das Traumdate von jedem. Kein Scherz";
    else if(sel.includes('✈️ Reisen')&&sel.includes('📷 Fotografie')) react="Reisen + Fotografie — lass mich raten, Kamerarolle besteht zu 90% aus Sonnenuntergängen? 😄";
    else if(sel.includes('🎮 Gaming')) react="Ein Gamer! Keine Sorge, ich verrate es deinen Matches nicht 😂 (Spaß — das ist heutzutage cool)";
    else if(sel.includes('📚 Lesen')) react="Ein Leser! Leute die lesen sind die besten Partner — die können wirklich zuhören 📖";
    else if(sel.includes('🏋️ Fitness')&&sel.includes('🧘 Yoga')) react="Fitness UND Yoga? Deine Matches werden Mühe haben mitzuhalten 💪";
    else if(sel.includes('🐕 Hunde')) react="Hundemensch! Fun Fact: Profile die Hunde erwähnen bekommen 5x mehr Matches. Du gewinnst schon 🐕";
    else if(sel.includes('☕ Kaffee')) react=`Kaffeeliebhaber — du passt perfekt rein, ${S.city} läuft auf Koffein ☕`;
    else if(sel.length>=4) react="Eine Person mit vielen Interessen! Das ist super fürs Matching — gibt mir so viel mehr zum Arbeiten";

    await send(react);
    await send("Alright, lass mich die Zahlen berechnen... 🔍");
    prg(74);

    // This is the ONE intentional wait — simulating "processing"
    // Show typing dots during the wait so it doesn't feel frozen
    showTyp();
    await W(2200);
    hideTyp();

    const seekL=S.a.seeking==='male'?'Männer':S.a.seeking==='female'?'Frauen':'Personen';
    await send(`Fertig! Ich habe ${S.matchN} ${seekL} in der Nähe von ${S.city} gefunden, die deinen Vibe teilen. Einige dieser Scores sind krass 😳`);
    prg(78);

    await send("Hier — schau dir dein Top-Match an:");
    // Photo appears, then typing dots while she "gets" the next message
    photo();
    await send("Profil ist gesperrt bis du drin bist — aber glaub mir, dieses Match ist gut 👀");
    prg(82);

    opts([
      {emoji:'😍',text:"OK ich bin neugierig — zeig mir mehr",step:'photo_react'},
      {emoji:'👀',text:"Wer hat noch mit mir gematcht?",step:'photo_react'},
    ]);
  });
}

async function qCompat(){
  await send("Lass mich deine vollständige Kompatibilitätsanalyse erstellen — das ist der spaßige Teil:");
  prg(88);

  const base=S.a.goal==='serious'?85:S.a.goal==='companion'?82:78;
  compat([
    {l:'Lifestyle',v:Math.min(98,base+Math.floor(Math.random()*12)),c:'var(--pink)'},
    {l:'Interessen',v:Math.min(98,base-3+Math.floor(Math.random()*15)),c:'#ff8a5c'},
    {l:'Werte',v:Math.min(98,base+2+Math.floor(Math.random()*10)),c:'var(--gold)'},
    {l:'Standort',v:Math.min(99,88+Math.floor(Math.random()*10)),c:'var(--green)'},
  ]);

  // Let the compat animation play — show typing dots so it's not dead
  showTyp();
  await W(3000);
  hideTyp();

  await send("Dieser Score gehört zu den Top 15% der Profile die ich diese Woche erstellt habe. Du wirst hier sehr erfolgreich sein 🙌");
  prg(93);
  opts([
    {emoji:'🚀',text:"Zeig mir meine Matches!",step:'compat_react'},
    {emoji:'🤩',text:"Besser als erwartet!",step:'compat_react'},
  ]);
}

async function qMatches(){
  await send(`Hier ist eine Vorschau deiner Top 3 Matches in ${S.city}:`);
  prg(97);
  matchCards();

  // Let user see the cards animate in — typing dots fill the gap
  showTyp();
  await W(2000);
  hideTyp();

  await send(`Alle ${S.matchN} Matches sind bereit. Einige sind GERADE JETZT online. Tippe unten um dein kostenloses Profil zu erstellen und zu chatten 💬`);
  prg(100);
  rToast();
  opts([
    {emoji:'🔓',text:'Meine Matches freischalten — bring mich hin!',step:'final'},
    {emoji:'💬',text:"Los geht's, ich bin bereit!",step:'final'},
  ]);
}

function goOffer(){
  var link = document.getElementById('offer-link');
  if(link && link.href) window.location.href = link.href;
}

async function init(){
  try{S.os=detectOS();theme();await splash()}
  catch(e){document.body.innerHTML='<div style="color:red;padding:40px;font-size:18px">Error: '+e.message+'<br><br>Stack: '+e.stack+'</div>';}
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init)}else{init()}
