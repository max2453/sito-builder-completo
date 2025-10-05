document.addEventListener('DOMContentLoaded', () => {
  const navButtons = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.section');
  const materieTableBody = document.getElementById('materie-table-body');
  const compitiTableBody = document.getElementById('compiti-table-body');
  const materieForm = document.getElementById('materie-form');
  const compitiForm = document.getElementById('compiti-form');
  const gradesTableBody = document.getElementById('grades-table-body');
  const gradesForm = document.getElementById('grades-form');
  const goalForm = document.getElementById('goal-form');
  const goalMsg = document.getElementById('grade-needed-msg');
  const calendarMonthYear = document.getElementById('calendar-month-year');
  const calendarBody = document.getElementById('calendar-body');
  const prevMonthBtn = document.getElementById('prev-month');
  const nextMonthBtn = document.getElementById('next-month');
  const calendarEventForm = document.getElementById('calendar-event-form');
  const eventForm = document.getElementById('event-form');
  const eventsList = document.getElementById('events-list');
  const cancelEventBtn = document.getElementById('cancel-event');
  const eventDateInput = document.getElementById('event-date');
  const eventTitleInput = document.getElementById('event-title');
  const eventTypeInput = document.getElementById('event-type');
  const goalEntryForm = document.getElementById('goal-entry-form');
  const goalList = document.getElementById('goal-list');
  const materialForm = document.getElementById('material-entry-form');
  const materialList = document.getElementById('material-list');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      sections.forEach(sec => sec.classList.remove('active'));
      const target = btn.dataset.section;
      const section = document.getElementById(target);
      if (section) {
        section.classList.add('active');
        if (target === 'data-entry') { renderMaterie(); renderCompiti(); }
        else if (target === 'grades') renderGrades();
        else if (target === 'calendar') renderCalendar();
        else if (target === 'goals') renderGoals();
        else if (target === 'materials') renderMaterials();
      }
    });
  });
  const firstActiveBtn = document.querySelector('.nav-btn.active') || navButtons[0];
  if (firstActiveBtn) firstActiveBtn.click();

  function load(key) {
    try { return JSON.parse(localStorage.getItem(key)) || null; } catch { return null; }
  }
  function save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
  function loadData() {
    return {
      materie: load('materie') || [],
      compiti: load('compiti') || [],
      voti: load('schoolGrades') || {}
    };
  }
  function saveData(data) {
    save('materie', data.materie);
    save('compiti', data.compiti);
    save('schoolGrades', data.voti);
  }
  function renderMaterie() {
    const data = loadData();
    materieTableBody.innerHTML = '';
    data.materie.forEach((m, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${m}</td><td><button onclick="deleteMateria(${i})">🗑️</button></td>`;
      materieTableBody.appendChild(tr);
    });
  }
  window.deleteMateria = function (i) {
    let data = loadData();
    if (confirm(`Eliminare materia "${data.materie[i]}"?`)) {
      const mat = data.materie[i];
      data.materie.splice(i, 1);
      data.compiti = data.compiti.filter(c => c.materia !== mat);
      if (data.voti[mat]) delete data.voti[mat];
      saveData(data);
      renderMaterie();
      renderCompiti();
      renderGrades();
    }
  };
  materieForm.addEventListener('submit', e => {
    e.preventDefault();
    const nome = document.getElementById('materie-input').value.trim();
    if (!nome) { alert('Inserisci materia'); return; }
    let data = loadData();
    if (data.materie.includes(nome)) { alert('Materia già presente'); return; }
    data.materie.push(nome);
    if (!data.voti[nome]) data.voti[nome] = [];
    saveData(data);
    renderMaterie();
    renderGrades();
    materieForm.reset();
  });
  function renderCompiti() {
    const data = loadData();
    compitiTableBody.innerHTML = '';
    data.compiti.forEach((c, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${c.materia}</td><td>${c.titolo}</td><td>${c.scadenza}</td><td>${c.priorita}</td><td><button onclick="deleteCompito(${i})">🗑️</button></td>`;
      compitiTableBody.appendChild(tr);
    });
  }
  window.deleteCompito = function (i) {
    let data = loadData();
    if (confirm('Eliminare questo compito?')) {
      data.compiti.splice(i, 1);
      saveData(data);
      renderCompiti();
    }
  };
  compitiForm.addEventListener('submit', e => {
    e.preventDefault();
    const m = document.getElementById('compito-materia').value.trim();
    const t = document.getElementById('compito-titolo').value.trim();
    const s = document.getElementById('compito-scadenza').value;
    const p = document.getElementById('compito-priorita').value.trim().toLowerCase();
    if (!m || !t || !s || !p) { alert('Completa tutti i campi'); return; }
    let data = loadData();
    if (!data.materie.includes(m)) { alert('Materia non presente'); return; }
    data.compiti.push({ materia: m, titolo: t, scadenza: s, priorita: p });
    saveData(data);
    renderCompiti();
    compitiForm.reset();
  });
  function getGradeColorClass(v) {
    if (v <= 4) return 'grade-rosso';
    if (v === 5) return 'grade-giallo';
    if (v >= 6) return 'grade-verde';
    return '';
  }
  function renderGrades() {
    let data = loadData();
    let goals = load('gradeGoals') || {};
    gradesTableBody.innerHTML = '';
    if (Object.keys(data.voti).length === 0) {
      gradesTableBody.innerHTML = '<tr><td colspan="4">Nessun voto inserito.</td></tr>';
      goalMsg.innerHTML = '';
      return;
    }
    for (let m in data.voti) {
      data.voti[m].forEach((v, i) => {
        let tr = document.createElement('tr');
        tr.innerHTML = `<td>${m}</td><td class="${getGradeColorClass(v)}">${v.toFixed(1)}</td><td>${new Date().toLocaleDateString()}</td><td><button onclick="deleteVote('${m}',${i})">🗑️</button></td>`;
        gradesTableBody.appendChild(tr);
      });
    }
    updateGradeMsg(data.voti, goals);
  }
  window.deleteVote = function (m, i) {
    let data = loadData();
    data.voti[m].splice(i, 1);
    if (data.voti[m].length === 0) delete data.voti[m];
    saveData(data);
    renderGrades();
  };
  gradesForm.addEventListener('submit', e => {
    e.preventDefault();
    const m = document.getElementById('grade-materia').value.trim();
    const v = parseFloat(document.getElementById('grade-voto').value);
    if (!m || isNaN(v)) { alert('Inserisci materia e voto validi'); return; }
    let data = loadData();
    if (!data.materie.includes(m)) { alert('Materia non presente'); return; }
    if (!data.voti[m]) data.voti[m] = [];
    data.voti[m].push(v);
    saveData(data);
    renderGrades();
    gradesForm.reset();
  });
  goalForm.addEventListener('submit', e => {
    e.preventDefault();
    const m = document.getElementById('goal-materia').value.trim();
    const v = parseFloat(document.getElementById('goal-voto').value);
    if (!m || isNaN(v)) { alert('Materia e obiettivo validi'); return; }
    let goals = load('gradeGoals') || {};
    goals[m] = v;
    save('gradeGoals', goals);
    updateGradeMsg(loadData().voti, goals);
    goalForm.reset();
  });
  function updateGradeMsg(voti, goals) {
    let msg = '';
    for (let m in goals) {
      const ob = goals[m];
      const vt = voti[m] || [];
      if (vt.length === 0) {
        msg += `Per ${m}: nessun voto.<br>`;
        continue;
      }
      const media = vt.reduce((a, b) => a + b, 0) / vt.length;
      const n = vt.length;
      const needed = (ob * (n + 1) - media * n).toFixed(2);
      if (needed > 10) msg += `Per ${m}: obiettivo alto (oltre 10).<br>`;
      else if (needed <= 0) msg += `Per ${m}: obiettivo raggiunto.<br>`;
      else msg += `Per ${m}: prendi almeno ${needed} per raggiungere obiettivo.<br>`;
    }
    goalMsg.innerHTML = msg;
  }
  let currentDate = new Date();
  let events = [];
  function loadEvents() {
    const data = localStorage.getItem('studentsAIEvents');
    events = data ? JSON.parse(data) : [];
  }
  function saveEvents() {
    localStorage.setItem('studentsAIEvents', JSON.stringify(events));
  }
  function renderCalendar() {
    loadEvents();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayIndex = (firstDay.getDay() + 6) % 7;
    calendarMonthYear.textContent = firstDay.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
    calendarBody.innerHTML = '';
    let date = 1 - startDayIndex;
    for (let w = 0; w < 6; w++) {
      const tr = document.createElement('tr');
      for (let d = 0; d < 7; d++) {
        const td = document.createElement('td');
        if (date > 0 && date <= daysInMonth) {
          td.textContent = date;
          td.classList.add('calendar-day');
          const localDate = new Date(year, month, date);
          const dateISO = localDate.getFullYear() + '-' +
            String(localDate.getMonth() + 1).padStart(2, '0') + '-' +
            String(localDate.getDate()).padStart(2, '0');
          td.dataset.date = dateISO;
          if (events.some(e => e.data === dateISO)) td.classList.add('calendar-event-day');
          td.addEventListener('click', () => openEventForm(dateISO));
        }
        tr.appendChild(td);
        date++;
      }
      calendarBody.appendChild(tr);
    }
    renderEventList();
  }
  function openEventForm(date, eventIndex = null) {
    calendarEventForm.classList.add('visible');
    eventDateInput.value = date;
    if (eventIndex !== null) {
      const ev = events[eventIndex];
      eventTitleInput.value = ev.titolo;
      eventTypeInput.value = ev.tipo;
      eventForm.dataset.editIndex = eventIndex;
    } else {
      eventTitleInput.value = '';
      eventTypeInput.value = 'lezione';
      delete eventForm.dataset.editIndex;
    }
  }
  eventForm.addEventListener('submit', e => {
    e.preventDefault();
    const date = eventDateInput.value;
    const title = eventTitleInput.value.trim();
    const type = eventTypeInput.value;
    if (!title) {
      alert("Inserisci un titolo per l'evento");
      return;
    }
    if (eventForm.dataset.editIndex !== undefined) {
      const idx = Number(eventForm.dataset.editIndex);
      events[idx] = { data: date, titolo: title, tipo: type };
    } else {
      events.push({ data: date, titolo: title, tipo: type });
    }
    saveEvents();
    calendarEventForm.classList.remove('visible');
    renderCalendar();
  });
  cancelEventBtn.addEventListener('click', () => {
    calendarEventForm.classList.remove('visible');
    delete eventForm.dataset.editIndex;
  });
  function renderEventList() {
    if (events.length === 0) {
      eventsList.innerHTML = '<p>Nessun evento aggiunto.</p>';
      return;
    }
    let html = '<h3>Eventi:</h3><ul>';
    events.forEach((ev, i) => {
      const color = {
        lezione: '#3f51b5',
        compito: '#f57c00',
        interrogazione: '#d32f2f',
        altro: '#757575',
      }[ev.tipo] || '#333';
      html += `<li style="color:${color}; font-weight:600;">
        <strong>${ev.data} [${ev.tipo}]</strong>: ${escapeHtml(ev.titolo)}
        <button onclick="editEvent(${i})" style="margin-left:10px;">✏️</button>
        <button onclick="deleteEvent(${i})" style="color:red; background:none; border:none; cursor:pointer; margin-left:10px;">🗑️</button>
      </li>`;
    });
    html += '</ul>';
    eventsList.innerHTML = html;
  }
  window.editEvent = function (i) {
    openEventForm(events[i].data, i);
  };
  window.deleteEvent = function (i) {
    if (confirm('Eliminare evento?')) {
      events.splice(i, 1);
      saveEvents();
      renderCalendar();
    }
  };
  prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });
  nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });
  renderCalendar();
  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }[m]));
  }

  function loadGoals() { return load('personalGoals') || []; }
  function saveGoals(goals) { save('personalGoals', goals); }
  function renderGoals() {
    const goals = loadGoals();
    if (goals.length === 0) {
      goalList.innerHTML = '<p>Nessun obiettivo definito.</p>';
      return;
    }
    let html = '<ul>';
    goals.forEach((g, i) => {
      html += `<li><strong>${g.testo}</strong> - scadenza: ${g.scadenza} <button onclick="deleteGoal(${i})" style="color:red; cursor:pointer; border:none; background:none;">🗑️</button></li>`;
    });
    html += '</ul>';
    goalList.innerHTML = html;
  }
  window.deleteGoal = function (i) {
    const goals = loadGoals();
    goals.splice(i, 1);
    saveGoals(goals);
    renderGoals();
  };
  goalEntryForm.addEventListener('submit', e => {
    e.preventDefault();
    const testo = document.getElementById('goal-text').value.trim();
    const scadenza = document.getElementById('goal-deadline').value;
    if (!testo) { alert('Inserisci un obiettivo'); return; }
    const goals = loadGoals();
    goals.push({ testo, scadenza });
    saveGoals(goals);
    renderGoals();
    goalEntryForm.reset();
  });
  renderGoals();
  function loadMaterials() { return load('studyMaterials') || []; }
  function saveMaterials(materials) { save('studyMaterials', materials); }
  function renderMaterials() {
    const materials = loadMaterials();
    if (materials.length === 0) {
      materialList.innerHTML = '<p>Nessun materiale aggiunto.</p>';
      return;
    }
    let html = '<ul>';
    materials.forEach((m, i) => {
      html += `<li><a href="${escapeHtml(m.link)}" target="_blank" rel="noopener">${escapeHtml(m.titolo)}</a><button onclick="deleteMaterial(${i})" style="color:red; cursor:pointer; border:none; background:none; margin-left:8px;">🗑️</button></li>`;
    });
    html += '</ul>';
    materialList.innerHTML = html;
  }
  window.deleteMaterial = function (i) {
    const materials = loadMaterials();
    if (i >= 0 && i < materials.length) {
      if (confirm(`Eliminare materiale "${materials[i].titolo}"?`)) {
        materials.splice(i, 1);
        saveMaterials(materials);
        renderMaterials();
      }
    }
  };
  materialForm.addEventListener('submit', e => {
    e.preventDefault();
    const titolo = document.getElementById('material-title').value.trim();
    const link = document.getElementById('material-link').value.trim();
    if (!titolo || !link) {
      alert('Inserisci titolo e link');
      return;
    }
    try {
      new URL(link);
    } catch {
      alert('Inserisci URL valido');
      return;
    }
    const materials = loadMaterials();
    materials.push({ titolo, link });
    saveMaterials(materials);
    renderMaterials();
    materialForm.reset();
  });
});
