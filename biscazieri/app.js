/* ════════════════════════════════════════
   CONFIG — modifica qui
════════════════════════════════════════ */
const C = {
  address: "Via Gandolfi, 21 - Alessandria",

  music: {
    spotifyPlaylist: "https://open.spotify.com/playlist/1WwdJ7KVWoZdESdDYvY88j?si=73ee6fe5b00c45af&pt=9e576b5cc196cd3fde47275c5cfd14b2",
    youtube1:        "https://music.youtube.com/playlist?list=PLTirHryYJPRIcS0j46BfrZuF5pNgo8QrB&jct=55Lcn4L5bza5_Z0peyILuQ",
  },

  board: {
    url: "https://excalidraw.com/#room=8c0d73e0e6ef4b09e1f7,m8yPQ-nPzT60cNsbPypTmQ",
  },

  map: {
    osmBbox:  "8.60403,44.8932,8.61203,44.9012",
    gAddress: "Via+Gandolfi+21+Alessandria",
  },

  photos: {
    album: "https://drive.proton.me/urls/W7969F36ZW#Lx8ACeAe2KmE",
  },

  guestbook: {
    tally: "https://tally.so/r/kdRRld",
  },

  games: [
    {n:"Skribbl.io",   i:"🎨", d:"Disegna e indovina · 2–16",   u:"https://skribbl.io"},
    {n:"Gartic Phone", i:"📞", d:"Telefono senza fili",          u:"https://garticphone.com"},
    {n:"Kahoot!",      i:"🧠", d:"Quiz live · crea il tuo",      u:"https://kahoot.it"},
    {n:"GeoGuessr",    i:"🌍", d:"Indovina dove sei nel mondo",  u:"https://www.geoguessr.com"},
  ],
};

/* ════════════════════════════════════════
   STRUTTURA SEZIONI HOME
════════════════════════════════════════ */
const ALL_CARDS = [
  {id:"music",    i:"🎵", t:"Musica",    s:"Spotify + YouTube Music",  b:null,  bv:false},
  {id:"games",    i:"🎮", t:"Giochi",    s:"Multiplayer nel browser",  b:"New", bv:true},
  {id:"board",    i:"🖊️", t:"Lavagna",   s:"Excalidraw · zero login",  b:"∞",   bv:false},
  {id:"photos",   i:"📸", t:"Album",     s:"Ricordi condivisi",        b:null,  bv:false},
  {id:"food",     i:"🍕", t:"Cibo",      s:"Delivery in zona",         b:null,  bv:false},
  {id:"map",      i:"🗺️", t:"Zona",      s:"Bar, farmacia, taxi",      b:null,  bv:false},
  {id:"contacts", i:"📞", t:"Contatti",  s:"Numeri utili",             b:null,  bv:false},
  {id:"guestbook",i:"✍",  t:"Guestbook", s:"Lascia un messaggio",     b:null,  bv:false},
];

const CATEGORIES = [
  { label: "🎉 intrattenimento", ids: ["music","games","board","photos"] },
  { label: "🛠️ utilità",         ids: ["food","map","contacts"] },
  { label: "💬 community",       ids: ["guestbook"] },
];

// Tutto ciò che non è nella nav primaria finisce nello sheet
const NAV_PRIMARY  = ["","music","games","map"];
const SHEET_ITEMS  = ALL_CARDS.filter(c => !NAV_PRIMARY.includes(c.id));

/* ════════════════════════════════════════
   TEMA
════════════════════════════════════════ */
(function(){
  const saved = localStorage.getItem('Ittroiaio_theme') ||
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  document.documentElement.dataset.theme = saved;
})();

function toggleTheme(){
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  document.getElementById('theme-icon').textContent = next === 'light' ? '🌙' : '☀️';
  localStorage.setItem('Ittroiaio_theme', next);
  document.querySelector('meta[name="theme-color"]').content = next === 'light' ? '#EEF0FA' : '#070B16';
}
function syncThemeIcon(){
  const t = document.documentElement.dataset.theme;
  const el = document.getElementById('theme-icon');
  if(el) el.textContent = t === 'light' ? '🌙' : '☀️';
}

/* ════════════════════════════════════════
   ROUTER
════════════════════════════════════════ */
function go(sec){ closeSheet(); location.hash = sec ? '#'+sec : '#'; }

function route(){
  const hash = location.hash.replace(/^#\/?/,'').trim();
  const sec  = hash || '';
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById('page-'+sec);
  if(!pg){ location.hash='#'; return; }
  pg.classList.add('active');
  window.scrollTo({top:0, behavior:'smooth'});
  const card = ALL_CARDS.find(c => c.id === sec);
  document.getElementById('bar-crumb').textContent = sec ? (card ? card.t : sec) : '';
  document.getElementById('back-btn').classList.toggle('on', sec !== '');
  document.querySelectorAll('.bnav-item').forEach(b => b.classList.remove('active'));
  const bn = document.getElementById('bn-'+(sec||'home'));
  if(bn) bn.classList.add('active');
  else   document.getElementById('bn-altro').classList.add('active');
}

window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', () => {
  syncThemeIcon();
  buildHome();
  buildSheetGrid();
  injectConfig();
  buildGames();
  buildStars();
  loadGB();
  route();
  makeQR('qr-board', C.board.url, 156);
});

/* ════════════════════════════════════════
   BUILD HOME — sezioni categorizzate
════════════════════════════════════════ */
function buildHome(){
  document.getElementById('hero-addr').textContent = C.address;
  const container = document.getElementById('home-sections');

  CATEGORIES.forEach(cat => {
    const ids   = cat.ids;
    const cards = ids.map(id => ALL_CARDS.find(c => c.id === id)).filter(Boolean);

    const section = document.createElement('div');
    section.className = 'home-cat';

    const label = document.createElement('div');
    label.className = 'cat-label';
    label.textContent = cat.label;
    section.appendChild(label);

    const grid = document.createElement('div');
    grid.className = 'cat-grid';

    cards.forEach(c => {
      const el = document.createElement('div');
      el.className = 'card';
      el.dataset.id = c.id;
      el.setAttribute('role','button');
      el.setAttribute('tabindex','0');
      el.onclick = () => go(c.id);
      el.onkeydown = e => { if(e.key==='Enter'||e.key===' ') go(c.id); };
      el.innerHTML = `${c.b?`<span class="c-badge${c.bv?' v':''}">${c.b}</span>`:''}<span class="c-icon">${c.i}</span><div class="c-title">${c.t}</div><div class="c-sub">${c.s}</div>`;
      grid.appendChild(el);
    });

    section.appendChild(grid);
    container.appendChild(section);
  });
}

/* ════════════════════════════════════════
   SHEET
════════════════════════════════════════ */
function buildSheetGrid(){
  const g = document.getElementById('sheet-grid');
  SHEET_ITEMS.forEach(c => {
    const el = document.createElement('button');
    el.className = 'sheet-item';
    el.innerHTML = `<span class="si-icon">${c.i}</span><span class="si-label">${c.t}</span>`;
    el.onclick = () => go(c.id);
    g.appendChild(el);
  });
}
function openSheet(){
  document.getElementById('sheet-overlay').classList.add('on');
  document.getElementById('sheet').classList.add('on');
  document.getElementById('bn-altro').classList.add('active');
}
function closeSheet(){
  document.getElementById('sheet-overlay').classList.remove('on');
  document.getElementById('sheet').classList.remove('on');
}

/* ════════════════════════════════════════
   INJECT CONFIG
════════════════════════════════════════ */
function sh(id, url){ const e=document.getElementById(id); if(e&&url&&url!=='#') e.href=url; }
function injectConfig(){
  sh('lc-sp-pl', C.music.spotifyPlaylist);
  sh('lc-yt1',   C.music.youtube1);
  sh('lc-board', C.board.url);

  const mf = document.getElementById('map-iframe');
  if(mf) mf.src = `https://www.openstreetmap.org/export/embed.html?bbox=${C.map.osmBbox}&layer=mapnik`;
  sh('lc-gmaps', `https://www.google.com/maps/search/${encodeURIComponent(C.map.gAddress)}`);

  const fa = document.getElementById('food-addr');
  if(fa) fa.textContent = C.address;

  const lph = document.getElementById('lc-photos');
  if(C.photos.album){ if(lph) lph.href = C.photos.album; }
  else if(lph) lph.style.opacity = '.45';
}

/* ════════════════════════════════════════
   GAMES
════════════════════════════════════════ */
function buildGames(){
  const g = document.getElementById('games-grid'); if(!g) return;
  C.games.forEach(gm => {
    g.innerHTML += `<a class="gc" href="${gm.u}" target="_blank" rel="noopener">
      <span class="gc-icon">${gm.i}</span>
      <div class="gc-name">${gm.n}</div>
      <div class="gc-sub">${gm.d}</div></a>`;
  });
}

/* ════════════════════════════════════════
   QR
════════════════════════════════════════ */
function makeQR(id, text, sz){
  const el = document.getElementById(id); if(!el||!text||text.includes('INSERISCI')) return;
  el.innerHTML='';
  try{ new QRCode(el,{text,width:sz||180,height:sz||180,colorDark:'#000',colorLight:'#fff',correctLevel:QRCode.CorrectLevel.M}); }
  catch(e){ el.textContent='QR n/d'; }
}

/* ════════════════════════════════════════
   STELLE GUESTBOOK
════════════════════════════════════════ */
let gbStars=0;
function buildStars(){
  document.querySelectorAll('#stars span').forEach(s => {
    s.addEventListener('click',()=>{
      gbStars=+s.dataset.v;
      document.querySelectorAll('#stars span').forEach((st,i)=>{
        st.textContent = i<gbStars?'★':'☆';
        st.classList.toggle('lit',i<gbStars);
      });
    });
  });
}

/* ════════════════════════════════════════
   GUESTBOOK
════════════════════════════════════════ */
function loadGB(){
  const msgs=JSON.parse(localStorage.getItem('Ittroiaio_gb')||'[]');
  const el=document.getElementById('gb-msgs'); if(!el||!msgs.length) return;
  el.innerHTML=`<p style="font-family:var(--mono);font-size:.58rem;color:var(--mut2);letter-spacing:.1em;text-transform:uppercase;margin-bottom:12px">Messaggi salvati</p>`;
  msgs.slice().reverse().forEach(m=>{
    el.innerHTML+=`<div class="gb-item"><span class="gb-name">${esc(m.name)}</span><span class="gb-star">${'★'.repeat(m.s)}${'☆'.repeat(5-m.s)}</span><div class="gb-text">${esc(m.msg)}</div><div class="gb-date">${m.date}</div></div>`;
  });
}
function submitGB(){
  const name=document.getElementById('gb-name').value.trim();
  const msg=document.getElementById('gb-msg').value.trim();
  if(!name||!msg) return toast('Compila nome e messaggio ✦');
  const msgs=JSON.parse(localStorage.getItem('Ittroiaio_gb')||'[]');
  msgs.push({name,msg,s:gbStars,date:new Date().toLocaleDateString('it-IT',{day:'2-digit',month:'long',year:'numeric'})});
  localStorage.setItem('Ittroiaio_gb',JSON.stringify(msgs));
  document.getElementById('gb-name').value='';
  document.getElementById('gb-msg').value='';
  gbStars=0; buildStars(); loadGB();
  toast('Grazie '+name+' ✦');
}
function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

/* ════════════════════════════════════════
   TOAST
════════════════════════════════════════ */
let _tt;
function toast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg; t.classList.add('on');
  clearTimeout(_tt); _tt=setTimeout(()=>t.classList.remove('on'),2600);
}
