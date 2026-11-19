// Leonida Trophy Guide: checklist tracker with saved progress, filters, spoiler
// mode, export/import, a platinum roadmap and per-trophy guides with sources.
// Data lives in data/trophies.json; progress lives in localStorage; nothing is
// fetched from the network at run time.
const STORAGE_KEY = 'gta6-trophy-progress-v1';
const SPOILER_KEY = 'gta6-trophy-spoiler-v1';

const listEl = document.getElementById('trophyList');
const countLine = document.getElementById('countLine');
const emptyMsg = document.getElementById('emptyMsg');
const searchInput = document.getElementById('search');
const kindFilter = document.getElementById('kindFilter');
const gradeFilter = document.getElementById('gradeFilter');
const earnedFilter = document.getElementById('earnedFilter');
const spoilerToggle = document.getElementById('spoilerToggle');
const onlineNote = document.getElementById('onlineNote');

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
const roadmap = doc.roadmap || [];

let earned = new Set(readStoredIds());
let spoilerOn = localStorage.getItem(SPOILER_KEY) === '1';
spoilerToggle.checked = spoilerOn;

function readStoredIds() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(raw) ? raw.filter((id) => Number.isInteger(id)) : [];
  } catch {
    return [];
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

function gradeLabel(t) {
  return t.grade.charAt(0).toUpperCase() + t.grade.slice(1);
}

function isSpoilerHidden(t) {
  return spoilerOn && t.kind === 'story' && t.grade !== 'platinum' && !earned.has(t.id);
}

function badge(text, cls) {
  const s = document.createElement('span');
  s.className = 'badge ' + cls;
  s.textContent = text;
  return s;
}

function renderProgress() {
  const total = trophies.length;
  const done = earned.size;
  document.getElementById('earnedCount').textContent = String(done);
  document.getElementById('progressFill').style.width = ((done / total) * 100).toFixed(1) + '%';
  document.getElementById('progressPct').textContent =
    ((done / total) * 100).toFixed(0) + '% to the platinum';
  const counts = {};
  for (const t of trophies) {
    if (earned.has(t.id)) counts[t.grade] = (counts[t.grade] || 0) + 1;
  }
  document.getElementById('gradeCounts').textContent =
    'Platinum ' + (counts.platinum || 0) + '/1 · Gold ' + (counts.gold || 0) +
    '/2 · Silver ' + (counts.silver || 0) + '/6 · Bronze ' + (counts.bronze || 0) + '/46';
}

function trophyMatches(t) {
  const q = searchInput.value.trim().toLowerCase();
  if (q && !(t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))) return false;
  const kind = kindFilter.value;
  if (kind === 'missable') { if (!t.missable) return false; }
  else if (kind === 'online') { return false; }
  else if (kind !== 'all' && t.kind !== kind) return false;
  if (gradeFilter.value !== 'all' && t.grade !== gradeFilter.value) return false;
  if (earnedFilter.value === 'earned' && !earned.has(t.id)) return false;
  if (earnedFilter.value === 'todo' && earned.has(t.id)) return false;
  return true;
}

function renderList() {
  listEl.replaceChildren();
  const shown = trophies.filter(trophyMatches);
  onlineNote.hidden = kindFilter.value !== 'online';
  countLine.textContent = 'Showing ' + shown.length + ' of ' + trophies.length + ' trophies · ' +
    earned.size + ' earned';
  emptyMsg.hidden = shown.length > 0;
  for (const t of shown) {
    const li = document.createElement('li');
    li.className = 'trophy' + (earned.has(t.id) ? ' earned' : '');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.id);
    box.setAttribute('aria-label', 'Mark ' + t.name + ' as earned');
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.id); else earned.delete(t.id);
      saveProgress();
      renderProgress();
      renderList();
    });
    const body = document.createElement('div');
    const h = document.createElement('h3');
    h.textContent = isSpoilerHidden(t) ? 'Hidden story trophy — earn it to reveal' : t.name;
    const desc = document.createElement('p');
    desc.className = 'desc';
    desc.textContent = isSpoilerHidden(t)
      ? 'Spoiler-safe mode is on. Tick the box when you earn this story trophy to reveal its name and description.'
      : t.description;
    const meta = document.createElement('p');
    meta.className = 'meta';
    meta.append(badge(gradeLabel(t), t.grade), badge(t.kind, 'kind'));
    if (t.count) {
      const c = document.createElement('span');
      c.textContent = 'Target: ' + t.count.toLocaleString('en-US');
      meta.append(c);
    }
    if (t.missable) meta.append(badge('Missable', 'missable'));
    body.append(h, desc, meta);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'guide-btn';
    btn.textContent = 'Guide & sources';
    btn.addEventListener('click', () => openDetail(t.id));
    li.append(box, body, btn);
    listEl.append(li);
  }
}

function sourceLink(s) {
  if (s.url) {
    const a = document.createElement('a');
    a.href = s.url;
    a.textContent = s.name;
    a.rel = 'noopener';
    return a;
  }
  const span = document.createElement('span');
  span.textContent = s.name;
  return span;
}

function openDetail(id) {
  const t = trophies.find((x) => x.id === id);
  if (!t) return;
  const card = document.getElementById('detailCard');
  card.replaceChildren();
  const h = document.createElement('h2');
  h.textContent = t.name;
  const meta = document.createElement('p');
  meta.className = 'meta';
  meta.append(badge(gradeLabel(t), t.grade), badge(t.kind, 'kind'));
  if (t.missable) meta.append(badge('Missable', 'missable'));
  const desc = document.createElement('p');
  desc.textContent = 'Official description: ' + t.description;
  const guide = document.createElement('p');
  guide.className = 'guide-text';
  guide.textContent = t.guide;
  const srcTitle = document.createElement('h4');
  srcTitle.textContent = 'Sources for this guide';
  const ul = document.createElement('ul');
  for (const s of t.sources || []) {
    const li = document.createElement('li');
    li.append(sourceLink(s));
    ul.append(li);
  }
  const note = document.createElement('p');
  note.className = 'count-line';
  note.textContent = t.count
    ? 'Target: ' + t.count.toLocaleString('en-US') + ' · Roadmap stage ' + t.stage + ' of 6.'
    : 'Roadmap stage ' + t.stage + ' of 6.';
  card.append(h, meta, desc, guide, srcTitle, ul, note);
  showView('detail');
  const url = new URL(window.location.href);
  url.searchParams.set('trophy', String(id));
  url.searchParams.delete('view');
  history.replaceState(null, '', url);
  window.scrollTo(0, 0);
}

function renderRoadmap() {
  const ol = document.getElementById('roadmapList');
  ol.replaceChildren();
  for (const stage of roadmap) {
    const li = document.createElement('li');
    const h = document.createElement('h3');
    h.textContent = 'Stage ' + stage.stage + ': ' + stage.title;
    const p = document.createElement('p');
    p.textContent = stage.text;
    const names = trophies.filter((t) => t.stage === stage.stage).map((t) => t.name);
    const small = document.createElement('p');
    small.className = 'stage-trophies';
    small.textContent = 'Trophies: ' + names.join(' · ');
    li.append(h, p, small);
    ol.append(li);
  }
  const miss = document.getElementById('missableList');
  miss.replaceChildren();
  for (const t of trophies.filter((x) => x.missable)) {
    const div = document.createElement('div');
    div.className = 'miss-card';
    const h = document.createElement('h3');
    h.textContent = t.name + ' — missable';
    const p = document.createElement('p');
    p.textContent = t.guide;
    div.append(h, p);
    miss.append(div);
  }
}

function showView(view) {
  document.getElementById('checklistView').hidden = view !== 'checklist';
  document.getElementById('roadmapView').hidden = view !== 'roadmap';
  document.getElementById('detailView').hidden = view !== 'detail';
  document.getElementById('viewChecklist').classList.toggle('active', view === 'checklist');
  document.getElementById('viewRoadmap').classList.toggle('active', view === 'roadmap');
}

function setView(view) {
  showView(view);
  const url = new URL(window.location.href);
  if (view === 'roadmap') url.searchParams.set('view', 'roadmap');
  else url.searchParams.delete('view');
  url.searchParams.delete('trophy');
  history.replaceState(null, '', url);
}

document.getElementById('viewChecklist').addEventListener('click', () => setView('checklist'));
document.getElementById('viewRoadmap').addEventListener('click', () => setView('roadmap'));
document.getElementById('backBtn').addEventListener('click', () => setView('checklist'));
searchInput.addEventListener('input', renderList);
kindFilter.addEventListener('change', renderList);
gradeFilter.addEventListener('change', renderList);
earnedFilter.addEventListener('change', renderList);
spoilerToggle.addEventListener('change', () => {
  spoilerOn = spoilerToggle.checked;
  localStorage.setItem(SPOILER_KEY, spoilerOn ? '1' : '0');
  renderList();
});

document.getElementById('exportBtn').addEventListener('click', () => {
  const payload = { game: 'Grand Theft Auto VI', earned: [...earned].sort((a, b) => a - b), exported: new Date().toISOString() };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
document.getElementById('importFile').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const ids = Array.isArray(data) ? data : data.earned;
    const valid = new Set(trophies.map((t) => t.id));
    earned = new Set(ids.filter((id) => valid.has(id)));
    saveProgress();
    renderProgress();
    renderList();
  } catch {
    alert('That file is not a valid trophy progress export.');
  }
  e.target.value = '';
});

renderProgress();
renderList();
renderRoadmap();
const params = new URLSearchParams(window.location.search);
const trophyParam = Number(params.get('trophy'));
if (trophies.some((t) => t.id === trophyParam)) openDetail(trophyParam);
else if (params.get('view') === 'roadmap') setView('roadmap');
