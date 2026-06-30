/* =========================================================
   LUNA NEGRA · Jessica — El Oráculo
   Flujo: nombre → tema → preguntas de perfil → barajado → tirada → lectura.
   ========================================================= */

(function () {
  'use strict';

  /* ============== Utilidades ============== */
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  const sample = (arr, n) => shuffle(arr).slice(0, n);
  const randReverse = () => Math.random() < 0.45;

  /* ============== Preguntas por tema ============== */
  // Cada tema tiene 3-4 preguntas. Las respuestas se inyectan al texto de la lectura.
  const PROFILE_QUESTIONS = {
    amor: [
      {
        key: 'estado',
        label: '¿Dónde está tu corazón ahora?',
        options: [
          { value: 'sola', label: '💫 Estoy sola/o', note: 'sin pareja' },
          { value: 'inicio', label: '🌅 Conociendo a alguien', note: 'inicio de vínculo' },
          { value: 'construyendo', label: '🏡 Construyendo una relación', note: 'en pareja' },
          { value: 'reparando', label: '🪞 Reparando algo', note: 'duelo o crisis' },
        ],
      },
      {
        key: 'prioridad',
        label: '¿Qué buscás con más fuerza?',
        options: [
          { value: 'conexion', label: '🤍 Conexión profunda' },
          { value: 'pasión', label: '🔥 Pasión' },
          { value: 'paz', label: '🕊 Paz y estabilidad' },
          { value: 'cierre', label: '🚪 Cerrar un ciclo' },
        ],
      },
      {
        key: 'horizonte',
        label: '¿El tiempo que te importa es…',
        options: [
          { value: 'corto', label: '⏱ Próximas semanas' },
          { value: 'medio', label: '🌙 Próximos meses' },
          { value: 'largo', label: '♾ Mirada de año o más' },
        ],
      },
    ],
    dinero: [
      {
        key: 'situacion',
        label: '¿Cómo describirías tu momento con el dinero?',
        options: [
          { value: 'urgencia', label: '🔥 Necesito moverme ya' },
          { value: 'decision', label: '🤔 Tengo que decidir algo' },
          { value: 'estable', label: '⚖️ Estable, pero quiero crecer' },
          { value: 'nuevo', label: '🌱 Empezando de cero' },
        ],
      },
      {
        key: 'frente',
        label: 'El tema puntual es…',
        options: [
          { value: 'trabajo', label: '💼 Trabajo / empleo' },
          { value: 'negocio', label: '🏢 Negocio propio' },
          { value: 'inversion', label: '📈 Inversión / ahorro' },
          { value: 'deuda', label: '🪨 Ordenar deudas' },
        ],
      },
      {
        key: 'horizonte',
        label: '¿Plazo que mirás?',
        options: [
          { value: 'inmediato', label: '⏱ Inmediato' },
          { value: 'trimestre', label: '📆 Próximos 3 meses' },
          { value: 'año', label: '🗓 Este año' },
        ],
      },
    ],
    salud: [
      {
        key: 'foco',
        label: '¿Qué dimensión te preocupa más?',
        options: [
          { value: 'cuerpo', label: '💪 Cuerpo físico' },
          { value: 'mente', label: '🧠 Mente y emociones' },
          { value: 'descanso', label: '🌙 Descanso y energía' },
          { value: 'habitos', label: '🍃 Hábitos diarios' },
        ],
      },
      {
        key: 'momento',
        label: '¿En qué punto estás?',
        options: [
          { value: 'sintomas', label: '⚡ Tengo síntomas o molestias' },
          { value: 'prevencion', label: '🛡 Quiero prevenir' },
          { value: 'recuperacion', label: '🔄 Recuperándome de algo' },
          { value: 'estancado', label: '⏳ Estancado, sin avanzar' },
        ],
      },
      {
        key: 'apertura',
        label: '¿Qué tan abierta/o estás a cambiar rutinas?',
        options: [
          { value: 'total', label: '✨ Totalmente abierta/o' },
          { value: 'parcial', label: '🌗 A medias, con cuidado' },
          { value: 'minimo', label: '🌑 Quiero lo mínimo posible' },
        ],
      },
    ],
    prosperidad: [
      {
        key: 'momento',
        label: '¿En qué momento estás con la abundancia?',
        options: [
          { value: 'sembrar', label: '🌱 Sembrando, todavía sin fruto' },
          { value: 'crecer', label: '📈 Cosechando y queriendo crecer' },
          { value: 'reiniciar', label: '🦋 Reinventándome' },
          { value: 'bloqueada', label: '🔒 Me siento bloqueada/o' },
        ],
      },
      {
        key: 'fuente',
        label: '¿De dónde querés que venga la prosperidad?',
        options: [
          { value: 'trabajo', label: '💼 De mi trabajo' },
          { value: 'emprendimiento', label: '🛠 De un emprendimiento' },
          { value: 'relaciones', label: '🤝 De vínculos y comunidad' },
          { value: 'ser', label: '🪞 De adentro hacia afuera' },
        ],
      },
      {
        key: 'horizonte',
        label: '¿Plazo?',
        options: [
          { value: 'corto', label: '⏱ Próximos meses' },
          { value: 'medio', label: '📆 Este año' },
          { value: 'largo', label: '♾ Construcción a largo plazo' },
        ],
      },
    ],
  };

  /* ============== Tiradas ============== */
  const SPREADS = {
    celtic: {
      id: 'celtic', title: 'Cruz Celta',
      desc: 'Diez cartas, lectura completa de tu situación.',
      cards: [
        { pos: 'Presente', icon: '⊕', meaning: 'Lo que está pasando ahora mismo, en el centro del asunto.' },
        { pos: 'Reto',     icon: '⊗', meaning: 'El obstáculo o tensión que cruza tu presente.' },
        { pos: 'Subconsciente', icon: '☾', meaning: 'Lo que sentís debajo, sin animarte a ponerlo en palabras.' },
        { pos: 'Pasado lejano', icon: '⌛', meaning: 'Origen lejano de la situación.' },
        { pos: 'Pasado reciente', icon: '◷', meaning: 'Lo recién vivido que aún pesa.' },
        { pos: 'Futuro cercano', icon: '➤', meaning: 'Hacia dónde empuja la rueda en breve.' },
        { pos: 'Vos misma', icon: '☉', meaning: 'Tu actitud y posición interna frente al asunto.' },
        { pos: 'Entorno', icon: '☷', meaning: 'Cómo te ven y cómo influye lo que te rodea.' },
        { pos: 'Esperanza · Miedo', icon: '±', meaning: 'Lo que esperás y lo que temés — son la misma energía.' },
        { pos: 'Resultado', icon: '★', meaning: 'El desenlace si seguís este curso.' },
      ],
    },
    seven: {
      id: 'seven', title: 'Las Siete Casas',
      desc: 'Siete cartas que cubren una semana de tu camino.',
      cards: [
        { pos: 'Lunes · Raíz', icon: '☽', meaning: 'Origen. De dónde venís en este tema.' },
        { pos: 'Martes · Cruce', icon: '✦', meaning: 'Lo que tenés que atravesar para avanzar.' },
        { pos: 'Miércoles · Voz', icon: '☼', meaning: 'Qué decir y qué callar.' },
        { pos: 'Jueves · Acción', icon: '⚚', meaning: 'Qué decisión tomar esta semana.' },
        { pos: 'Viernes · Persona', icon: '♀', meaning: 'La persona (o energía) que se cruza en tu camino.' },
        { pos: 'Sábado · Prueba', icon: '⌖', meaning: 'La prueba antes del cierre.' },
        { pos: 'Domingo · Cierre', icon: '✺', meaning: 'La respuesta final. Cómo termina esta ronda.' },
      ],
    },
    three: {
      id: 'three', title: 'Tres Cartas',
      desc: 'Pasado, presente y futuro. Directa y al hueso.',
      cards: [
        { pos: 'Lo que dejás atrás', icon: '◁', meaning: 'Pasado. El origen que ya cumplió su función.' },
        { pos: 'Donde estás parada', icon: '◐', meaning: 'Presente. La situación actual.' },
        { pos: 'Hacia dónde vas', icon: '▷', meaning: 'Futuro cercano si no cambia nada.' },
      ],
    },
  };

  function pickSpread(question) {
    const trimmed = (question || '').trim();
    if (trimmed.length === 0 || trimmed.length > 80) return SPREADS.seven;
    if (trimmed.length < 25) return SPREADS.three;
    return SPREADS.seven;
  }

  /* ============== Estado ============== */
  const state = {
    name: '',
    topic: null,
    profileAnswers: {}, // { key: value, ... }
    question: '',
    spread: null,
    drawn: [],
  };

  /* ============== DOM ============== */
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  const screens = {
    welcome: $('#screen-welcome'),
    topic: $('#screen-topic'),
    questions: $('#screen-questions'),
    shuffle: $('#screen-shuffle'),
    draw: $('#screen-draw'),
    reading: $('#screen-reading'),
  };

  function show(el) {
    Object.values(screens).forEach((s) => s.classList.remove('active'));
    el.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  /* ============== Pantalla WELCOME / nombre ============== */
  const userName = $('#userName');
  const nameContinue = $('#nameContinue');
  userName.addEventListener('input', () => {
    nameContinue.disabled = userName.value.trim().length === 0;
  });
  userName.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !nameContinue.disabled) {
      e.preventDefault(); commitName();
    }
  });
  nameContinue.addEventListener('click', commitName);

  function commitName() {
    const n = userName.value.trim();
    if (!n) return;
    state.name = n;
    $('#welcomeEcho').textContent = n;
    show(screens.topic);
  }

  /* ============== Selección de tema ============== */
  const TOPIC_LABELS = {
    amor: 'Amor', dinero: 'Dinero', salud: 'Salud', prosperidad: 'Prosperidad',
  };

  $$('.topic-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.topic = btn.dataset.topic;
      $('#topicEcho').textContent = `Pregunta sobre ${TOPIC_LABELS[state.topic]}`;
      $('#questionsTopic').textContent = TOPIC_LABELS[state.topic];
      buildQuestionsScreen();
      show(screens.questions);
    });
  });

  /* ============== Pantalla QUESTIONS ============== */
  function buildQuestionsScreen() {
    const box = $('#questionsBox');
    box.innerHTML = '';
    const qs = PROFILE_QUESTIONS[state.topic] || [];
    state.profileAnswers = {};
    qs.forEach((q, i) => {
      const item = document.createElement('div');
      item.className = 'q-item';
      item.style.animationDelay = (i * 0.15) + 's';
      item.innerHTML = `
        <span class="q-label">Pregunta ${i + 1}</span>
        <div style="margin-bottom:10px;font-style:italic;">${q.label}</div>
        <div class="q-options" data-key="${q.key}">
          ${q.options.map((o) => `
            <button type="button" class="q-option" data-value="${o.value}">
              ${o.label}${o.note ? ` <small style="opacity:.55;">(${o.note})</small>` : ''}
            </button>
          `).join('')}
        </div>
      `;
      box.appendChild(item);
    });
    // listeners
    $$('.q-option').forEach((opt) => {
      opt.addEventListener('click', () => {
        const key = opt.parentElement.dataset.key;
        // deselecciona otros del mismo grupo
        opt.parentElement.querySelectorAll('.q-option').forEach((o) => o.classList.remove('selected'));
        opt.classList.add('selected');
        state.profileAnswers[key] = opt.dataset.value;
        updateQuestionsContinue();
      });
    });
    updateQuestionsContinue();
  }

  function updateQuestionsContinue() {
    const qs = PROFILE_QUESTIONS[state.topic] || [];
    const answered = Object.keys(state.profileAnswers).length;
    $('#questionsContinue').disabled = answered < qs.length;
  }

  $('#questionsContinue').addEventListener('click', () => {
    show(screens.shuffle);
    // foco en la pregunta despuès de la transición
    setTimeout(() => { try { $('#userQuestion').focus({ preventScroll: true }); } catch (_) {} }, 700);
    // dame un toque para montar el DOM
    requestAnimationFrame(() => animateShuffle());
  });

  /* ============== Barajado animado (loop, hasta que el usuario continúe) ============== */
  let shufflePhrasesInterval = null;
  let shuffleAnimInterval = null;
  function animateShuffle() {
    const deck = $('#shuffleDeck');
    deck.innerHTML = '';
    for (let i = 0; i < 8; i++) {
      const c = document.createElement('div');
      c.className = 'scard';
      c.style.zIndex = i;
      c.style.transform = `rotate(${(i - 4) * 4}deg) translateY(${Math.abs(i - 4) * 1.5}px)`;
      c.style.transition = 'transform .5s ease';
      deck.appendChild(c);
    }
    const phrases = [
      'Cruzando las cartas con tu pregunta.',
      'Sintiendo el peso de la baraja.',
      'Pidiendo guía a la luna.',
      'Acomodando oros, copas, espadas y bastos.',
      'Mezclando destinos…',
      'Esperando que cierres tu pregunta cuando quieras.',
    ];
    let p = 0;
    const line = $('#shuffleLine');
    line.textContent = phrases[0];
    shufflePhrasesInterval = setInterval(() => {
      p = (p + 1) % phrases.length;
      line.textContent = phrases[p];
    }, 1400);
    // loop suave de animación de cartas hasta que el usuario haga click
    shuffleAnimInterval = setInterval(() => {
      const cards = deck.querySelectorAll('.scard');
      if (!cards.length) return;
      const i = Math.floor(Math.random() * cards.length);
      const c = cards[i];
      const rot = (Math.random() * 6 - 3).toFixed(1);
      const ty = (Math.random() * 4 - 2).toFixed(1);
      c.style.transform = `rotate(${rot}deg) translateY(${ty}px)`;
    }, 220);
  }

  function stopShuffle() {
    if (shufflePhrasesInterval) { clearInterval(shufflePhrasesInterval); shufflePhrasesInterval = null; }
    if (shuffleAnimInterval) { clearInterval(shuffleAnimInterval); shuffleAnimInterval = null; }
  }

  /* ============== goDraw ============== */
  function goDraw() {
    const q = $('#userQuestion').value.trim();
    state.question = q;
    state.spread = pickSpread(q);
    $('#drawTopic').textContent = TOPIC_LABELS[state.topic];
    $('#drawName').textContent = state.name;
    $('#spreadTitle').textContent = state.spread.title;
    $('#spreadDesc').textContent = state.spread.desc;
    buildSpreadArea();
    show(screens.draw);
    setTimeout(() => drawCardsSequentially(), 350);
  }

  function buildSpreadArea() {
    const area = $('#spreadArea');
    area.innerHTML = '';
    area.classList.remove('celtic-cross');

    if (state.spread.id === 'celtic') {
      area.classList.add('celtic-cross');
      const left = document.createElement('div'); left.className = 'cc-left';
      const right = document.createElement('div'); right.className = 'cc-right';
      const placement = [
        { i: 0, col: 'left', order: 1 }, { i: 1, col: 'left', order: 2 },
        { i: 2, col: 'left', order: 3 }, { i: 3, col: 'left', order: 4 },
        { i: 4, col: 'left', order: 5 },
        { i: 5, col: 'right', order: 1 }, { i: 6, col: 'right', order: 2 },
        { i: 7, col: 'right', order: 3 }, { i: 8, col: 'right', order: 4 },
        { i: 9, col: 'right', order: 5 },
      ];
      placement.forEach((p) => {
        const slot = document.createElement('div');
        slot.className = 'position-slot';
        slot.dataset.idx = p.i;
        const label = document.createElement('div');
        label.className = 'position-label';
        label.textContent = (p.i + 1) + ' · ' + state.spread.cards[p.i].pos;
        const mini = document.createElement('div'); mini.className = 'mini';
        slot.appendChild(mini); slot.appendChild(label);
        (p.col === 'left' ? left : right).appendChild(slot);
      });
      area.appendChild(left); area.appendChild(right);
    } else {
      state.spread.cards.forEach((slotDef, i) => {
        const slot = document.createElement('div');
        slot.className = 'position-slot';
        slot.dataset.idx = i;
        const label = document.createElement('div');
        label.className = 'position-label';
        label.textContent = (i + 1) + ' · ' + slotDef.pos;
        const mini = document.createElement('div'); mini.className = 'mini';
        slot.appendChild(mini); slot.appendChild(label);
        area.appendChild(slot);
      });
    }
  }

  function drawCardsSequentially() {
    const total = state.spread.cards.length;
    const chosen = sample(DECK, total);
    state.drawn = chosen.map((card, i) => ({
      card, reversed: randReverse(), slot: state.spread.cards[i],
    }));
    let i = 0;
    const revealNext = () => {
      if (i >= total) {
        $('#interpretBtn').hidden = false;
        $('#interpretBtn').style.animation = 'fadeIn .6s ease';
        return;
      }
      const slotIdx = i;
      const slot = $(`.position-slot[data-idx="${slotIdx}"] .mini`);
      const drawn = state.drawn[i];
      setTimeout(() => {
        revealCard(slot, drawn);
        i++;
        revealNext();
      }, 350 + Math.random() * 350);
    };
    revealNext();
  }

  function revealCard(el, drawn) {
    el.classList.add('face');
    if (drawn.reversed) el.classList.add('reversed');
    el.innerHTML = `
      ${drawn.reversed ? '<div class="m-pos-rev">⌇</div>' : ''}
      <div class="m-pos">${drawn.slot.icon}</div>
      <div class="m-glyph">${drawn.card.glyph}</div>
      <div class="m-name">${drawn.card.name}</div>
    `;
    burstParticles(8);
  }

  /* ============== Acción Interpretar ============== */
  function startReading() {
    const btn = $('#interpretBtn');
    btn.disabled = true;
    btn.textContent = 'Las cartas se alinean…';
    setTimeout(() => { buildReading(); }, 800);
  }

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-action]');
    if (!t) return;
    const a = t.dataset.action;
    if (a === 'interpret') startReading();
    if (a === 'replay') {
      state.drawn = [];
      $('#interpretBtn').hidden = true;
      $('#interpretBtn').disabled = false;
      $('#interpretBtn').textContent = 'Interpretar tirada';
      goDraw();
    }
    if (a === 'back-topics') {
      show(screens.topic);
    }
    if (a === 'share-reading') shareReading();
    if (a === 'continue-shuffle') { stopShuffle(); goDraw(); }
  });

  /* ============== Lectura ============== */
  // Frases de contexto por respuesta (por tema, por key, por valor)
  const CTX_LABELS = {
    amor: {
      estado:    { sola: 'en soledad', inicio: 'en el inicio de un vínculo', construyendo: 'construyendo una relación', reparando: 'en reparación' },
      prioridad: { conexion: 'buscando conexión profunda', pasion: 'buscando pasión', paz: 'buscando paz y estabilidad', cierre: 'buscando cerrar un ciclo' },
      horizonte: { corto: 'mirada corta (semanas)', medio: 'mirada de meses', largo: 'mirada de año o más' },
    },
    dinero: {
      situacion: { urgencia: 'con urgencia', decision: 'frente a una decisión', estable: 'estable, con ganas de crecer', nuevo: 'empezando de cero' },
      frente:    { trabajo: 'en el frente laboral', negocio: 'en el frente de tu negocio', inversion: 'en el frente de inversión', deuda: 'ordenando deudas' },
      horizonte: { inmediato: 'en lo inmediato', trimestre: 'a tres meses', anio: 'en el año' },
    },
    salud: {
      foco:     { cuerpo: 'con foco en el cuerpo', mente: 'con foco en mente y emociones', descanso: 'con foco en el descanso', habitos: 'con foco en los hábitos' },
      momento:  { sintomas: 'con síntomas', prevencion: 'en prevención', recuperacion: 'en recuperación', estancado: 'estancada/o' },
      apertura: { total: 'muy abierta/o a cambiar', parcial: 'a medias', minimo: 'con cambio mínimo' },
    },
    prosperidad: {
      momento:  { sembrar: 'en siembra', crecer: 'en cosecha lista para crecer', reiniciar: 'reinventándose', bloqueada: 'bloqueada/o' },
      fuente:   { trabajo: 'queriendo que venga del trabajo', emprendimiento: 'desde un emprendimiento', relaciones: 'desde vínculos y comunidad', ser: 'desde adentro' },
      horizonte:{ corto: 'mirada de meses', medio: 'en el año', largo: 'construcción a largo plazo' },
    },
  };

  function contextLine() {
    const ans = state.profileAnswers;
    const map = CTX_LABELS[state.topic] || {};
    const parts = [];
    Object.keys(ans).forEach((k) => {
      const v = ans[k];
      if (map[k] && map[k][v]) parts.push(map[k][v]);
    });
    return parts.join(' · ');
  }

  function buildReading() {
    const summary = $('#readingSummary');
    const topicLabel = TOPIC_LABELS[state.topic];
    const totalUp = state.drawn.filter(d => !d.reversed).length;
    const totalRev = state.drawn.length - totalUp;
    const majorCount = state.drawn.filter(d => d.card.suit === 'major').length;
    const judge = judgeTheme(state.drawn, state.topic);

    summary.innerHTML = `
      <div class="summary-question">
        <span class="name-mention">${state.name}</span>, tu pregunta:
        <em>"${state.question || `lectura general sobre ${topicLabel.toLowerCase()}`}"</em>
      </div>
      <div class="summary-context">Contexto que diste: <em>${contextLine() || '—'}</em></div>
      <div class="summary-text">
        <strong>Sobre ${topicLabel}:</strong>
        leí ${state.drawn.length} cartas, ${totalUp} al derecho y ${totalRev} invertidas.
        ${majorCount ? `${majorCount} son Arcanos Mayores — el destino habla alto en esta tirada.` : 'predominan los Arcanos Menores — tu vida cotidiana es protagonista.'}
        ${judge.headline}
      </div>
    `;

    const cards = $('#readingCards');
    cards.innerHTML = '';
    state.drawn.forEach((drawn, i) => {
      const slotDef = state.spread.cards[i];
      const text = drawn.reversed ? drawn.card.reversed[state.topic] : drawn.card.upright[state.topic];
      const personalized = personalize(text, drawn);
      const div = document.createElement('div');
      div.className = 'reading-card' + (drawn.reversed ? ' rev' : '');
      div.innerHTML = `
        <div class="reading-card-header">
          <div class="reading-position">${i + 1} · ${slotDef.pos}</div>
          <div class="reading-card-name">
            ${drawn.card.name}
            ${drawn.reversed ? '<small>INVERTIDA</small>' : '<small>Derecha</small>'}
          </div>
        </div>
        <div class="reading-position-meaning"><strong>Posición:</strong> ${slotDef.meaning}</div>
        <div class="reading-keywords">${drawn.card.keywords.map(k => `<span>${k}</span>`).join('')}</div>
        <div class="reading-text">${personalized}</div>
      `;
      cards.appendChild(div);
    });

    $('#readingTopic').textContent = topicLabel;
    $('#readingName').textContent = state.name;
    $('#readingTip').innerHTML = `
      🌙 Lectura interpretada por Jessica — Luna Negra · <em>"${state.name}, las cartas son el mapa; el camino lo trazás vos."</em>
    `;

    show(screens.reading);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // susurra el nombre cuando aparece naturalmente (1 de cada 3 cartas, suave)
  function personalize(text, drawn) {
    if (Math.random() < 0.34 && state.name) {
      const low = text.toLowerCase();
      if (low.startsWith('vos ')) return state.name + ', ' + text.charAt(0).toLowerCase() + text.slice(1).replace(/^./, c => c).replace('vos ', '');
      // forma natural: añadir al final si no empieza con vos
      return text + ' — mirá, ' + state.name + '.';
    }
    return text;
  }

  function judgeTheme(drawn, topic) {
    let posScore = 0;
    const POSITIVE = ['major-19', 'major-17', 'major-21', 'major-10', 'major-1'];
    const NEGATIVE = ['major-16', 'major-15', 'major-13', 'major-18'];
    drawn.forEach((d, i) => {
      const w = i === drawn.length - 1 ? 2 : 1;
      const sign = d.reversed ? -1 : 1;
      if (POSITIVE.includes(d.card.id)) posScore += sign * w;
      if (NEGATIVE.includes(d.card.id)) posScore -= sign * w;
    });
    const note = {
      amor: posScore > 1 ? 'El amor viene bien en esta tirada. Si estás construyendo, segurá. Si dudás, hay base.' : posScore < -1 ? 'Cuidado: algo en el amor pide atención seria. No quiere decir imposible, sí quiere decir trabajo interior.' : 'El amor está en movimiento neutro — depende más de vos que del otro.',
      dinero: posScore > 1 ? 'Tus finanzas muestran apertura. Buen momento para invertir, negociar o lanzar algo.' : posScore < -1 ? 'Las cartas piden pausa financiera. No apures movimientos grandes.' : 'Estabilidad financiera posible si actuás con disciplina.',
      salud: posScore > 1 ? 'Buena energía vital. Cuidá mantener lo que funciona.' : posScore < -1 ? 'Cuerpo pidiendo atención específica: no postergues un chequeo.' : 'Salud estable. Pequeños ajustes marcan diferencia.',
      prosperidad: posScore > 1 ? 'La abundancia se mueve hacia vos. Que no te agarre sin propósito.' : posScore < -1 ? 'La prosperidad requiere cambios estructurales.' : 'Hay prosperidad disponible si aprendés a recibirla.',
    };
    return { headline: note[topic] || '' };
  }

  /* ============== Share ============== */
  function shareReading() {
    const majorNames = state.drawn.filter(d => d.card.suit === 'major').map(d => d.card.name + (d.reversed ? ' (inv)' : '')).join(', ') || 'ningún Arcano Mayor';
    const text =
      `🔮 ${state.name} le preguntó a Jessica (Oráculo de Luna Negra) sobre ${TOPIC_LABELS[state.topic]}.\n` +
      `🃏 Cartas mayores: ${majorNames}\n` +
      `🔥 Mirá tu tirada: ${location.href}`;
    if (navigator.share) navigator.share({ title: 'Oráculo de Luna Negra', text }).catch(() => {});
    else if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => flash('Copiado al portapapeles ✓'));
    else prompt('Copiar:', text);
  }

  function flash(msg) {
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:rgba(26,10,46,.92);color:#fffbe7;padding:10px 18px;border-radius:4px;border:1px solid #d9c7a3;font-family:Cinzel,serif;letter-spacing:2px;font-size:11px;z-index:200';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2000);
  }

  /* ============== Partículas ============== */
  function spawnAmbient() {
    const layer = document.getElementById('particles');
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.animationDuration = (9 + Math.random() * 9) + 's';
      p.style.animationDelay = Math.random() * 8 + 's';
      p.style.width = (2 + Math.random() * 3) + 'px'; p.style.height = p.style.width;
      layer.appendChild(p);
    }
  }
  function burstParticles(n) {
    const layer = document.getElementById('particles');
    const colors = ['#d9c7a3', '#fffbe7', '#8a5fb5'];
    for (let i = 0; i < n; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = (40 + Math.random() * 20) + 'vw';
      p.style.bottom = '40vh'; p.style.top = 'auto';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.boxShadow = `0 0 10px ${p.style.background}`;
      p.style.animationDuration = '2.5s';
      p.style.animationDelay = '0s';
      layer.appendChild(p);
      setTimeout(() => p.remove(), 3000);
    }
  }

  /* ============== Audio: ambient de selva (jungle) con animales generados por WebAudio ============== */
  const audio = {
    ctx: null, on: false, master: null,
    nodes: [],
    intervalIds: [],
    timeouts: [],
  };

  // Generador de buffers de ruido curados.
  function makeNoiseBuffer(ctx, type, seconds) {
    const len = ctx.sampleRate * seconds;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    if (type === 'pink') {
      let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
      for (let i = 0; i < len; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    } else if (type === 'brown') {
      let last = 0;
      for (let i = 0; i < len; i++) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02;
        d[i] = last * 3.5;
      }
    } else {
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    }
    return buf;
  }

  // ---------- SINTETIZADORES DE ANIMALES ----------
  // Pájaro: chirrido agudo oscilante, 60-200 ms.
  function birdChirp(ctx, when, baseFreq) {
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = baseFreq;
    const g = ctx.createGain();
    const peak = 0.25 + Math.random() * 0.25;
    g.gain.value = 0;
    g.gain.setValueAtTime(0, ctx.currentTime + when);
    g.gain.linearRampToValueAtTime(peak, ctx.currentTime + when + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + when + 0.18);
    // pequeños modulantes de frecuencia para que no suene a pitido puro
    o.frequency.setValueAtTime(baseFreq, ctx.currentTime + when);
    o.frequency.linearRampToValueAtTime(baseFreq * (1 + Math.random() * 0.4 - 0.2), ctx.currentTime + when + 0.18);
    o.connect(g).connect(audio.master);
    o.start(ctx.currentTime + when);
    o.stop(ctx.currentTime + when + 0.25);
  }
  // Secuencia rápida de 3-5 chirridos = trino de pájaro.
  function birdSong(ctx, when) {
    const n = 3 + Math.floor(Math.random() * 4);
    let base = 2200 + Math.random() * 2400;
    for (let i = 0; i < n; i++) {
      birdChirp(ctx, when + i * 0.13 + Math.random() * 0.04, base + Math.random() * 800);
    }
  }

  // Cigarra: tren de pulsos a ~4-6 kHz con dientes marcados.
  function cicadaBurst(ctx, when) {
    const dur = 1.5 + Math.random() * 2.5;
    const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = 4500 + Math.random() * 1500;
    const lpf = ctx.createBiquadFilter(); lpf.type = 'lowpass'; lpf.frequency.value = 7000;
    const g = ctx.createGain();
    g.gain.value = 0;
    // modulación de tremolo en ganancia para el efecto pulsante
    const trem = ctx.createOscillator(); trem.type = 'sine'; trem.frequency.value = 60 + Math.random() * 60;
    const tremG = ctx.createGain(); tremG.gain.value = 0.04;
    trem.connect(tremG).connect(g.gain);
    g.gain.setValueAtTime(0, ctx.currentTime + when);
    g.gain.linearRampToValueAtTime(0.06, ctx.currentTime + when + 0.2);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + when + dur);
    o.connect(lpf).connect(g).connect(audio.master);
    o.start(ctx.currentTime + when);
    trem.start(ctx.currentTime + when);
    o.stop(ctx.currentTime + when + dur + 0.2);
    trem.stop(ctx.currentTime + when + dur + 0.2);
  }

  // Mono aullador: aullido grave con vibrato (~150-300 Hz, varios segundos).
  function howlerMonkey(ctx, when) {
    const dur = 2.5 + Math.random() * 2;
    const o = ctx.createOscillator(); o.type = 'sawtooth';
    const base = 150 + Math.random() * 60;
    o.frequency.setValueAtTime(base, ctx.currentTime + when);
    o.frequency.linearRampToValueAtTime(base * 0.85, ctx.currentTime + when + dur * 0.7);
    // vibrato
    const vib = ctx.createOscillator(); vib.type = 'sine'; vib.frequency.value = 4 + Math.random() * 3;
    const vibG = ctx.createGain(); vibG.gain.value = 8;
    vib.connect(vibG).connect(o.frequency);
    const lpf = ctx.createBiquadFilter(); lpf.type = 'lowpass'; lpf.frequency.value = 600;
    const g = ctx.createGain();
    g.gain.value = 0;
    g.gain.setValueAtTime(0, ctx.currentTime + when);
    g.gain.linearRampToValueAtTime(0.22, ctx.currentTime + when + 0.4);
    g.gain.setValueAtTime(0.22, ctx.currentTime + when + dur - 0.6);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + when + dur);
    o.connect(lpf).connect(g).connect(audio.master);
    o.start(ctx.currentTime + when);
    vib.start(ctx.currentTime + when);
    o.stop(ctx.currentTime + when + dur + 0.5);
    vib.stop(ctx.currentTime + when + dur + 0.5);
  }

  // Rana: croak bajo (300-500 Hz) con dos picos.
  function frogCroak(ctx, when) {
    const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = 320 + Math.random() * 120;
    const lpf = ctx.createBiquadFilter(); lpf.type = 'lowpass'; lpf.frequency.value = 800;
    const g = ctx.createGain();
    g.gain.value = 0;
    g.gain.setValueAtTime(0, ctx.currentTime + when);
    g.gain.linearRampToValueAtTime(0.14, ctx.currentTime + when + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + when + 0.18);
    o.connect(lpf).connect(g).connect(audio.master);
    o.start(ctx.currentTime + when);
    o.stop(ctx.currentTime + when + 0.25);
    // eco / segundo croak
    frogCroak(ctx, when + 0.22);
  }

  // Búho / lechuza: gruñido con dos tonos graves descendentes.
  function owlHoots(ctx, when) {
    for (let i = 0; i < 2; i++) {
      const o = ctx.createOscillator(); o.type = 'sawtooth';
      const f = 280 + Math.random() * 80;
      o.frequency.setValueAtTime(f, ctx.currentTime + when + i * 0.7);
      o.frequency.exponentialRampToValueAtTime(f * 0.7, ctx.currentTime + when + i * 0.7 + 0.4);
      const lpf = ctx.createBiquadFilter(); lpf.type = 'lowpass'; lpf.frequency.value = 900;
      const g = ctx.createGain();
      g.gain.value = 0;
      g.gain.setValueAtTime(0, ctx.currentTime + when + i * 0.7);
      g.gain.linearRampToValueAtTime(0.16, ctx.currentTime + when + i * 0.7 + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + when + i * 0.7 + 0.45);
      o.connect(lpf).connect(g).connect(audio.master);
      o.start(ctx.currentTime + when + i * 0.7);
      o.stop(ctx.currentTime + when + i * 0.7 + 0.6);
    }
  }

  // Insecto genérico: zumbido fino a 3-5 kHz.
  function insectBuzz(ctx, when) {
    const dur = 0.3 + Math.random() * 0.5;
    const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 3000 + Math.random() * 2500;
    const lpf = ctx.createBiquadFilter(); lpf.type = 'lowpass'; lpf.frequency.value = 5500;
    const g = ctx.createGain();
    g.gain.value = 0;
    g.gain.linearRampToValueAtTime(0.05, ctx.currentTime + when + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + when + dur);
    o.connect(lpf).connect(g).connect(audio.master);
    o.start(ctx.currentTime + when);
    o.stop(ctx.currentTime + when + dur + 0.1);
  }

  // Trueno lejano muy distinto al de tormenta (más seco, tipo selva).
  function distantThunder(ctx, when) {
    const buf = makeNoiseBuffer(ctx, 'brown', 1.5);
    const src = ctx.createBufferSource(); src.buffer = buf;
    const lpf = ctx.createBiquadFilter(); lpf.type = 'lowpass'; lpf.frequency.value = 250;
    const g = ctx.createGain();
    g.gain.value = 0;
    g.gain.linearRampToValueAtTime(0.35, ctx.currentTime + when + 0.2);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + when + 2.5);
    src.connect(lpf).connect(g).connect(audio.master);
    src.start(ctx.currentTime + when);
    src.stop(ctx.currentTime + when + 3);
  }

  async function startJungle() {
    if (audio.on) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      audio.ctx = audio.ctx || new AC();
      const ctx = audio.ctx;
      if (ctx.state === 'suspended') await ctx.resume();
      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);

      // --------- RUMOR DE LA SELVA: brown noise filtrado muy grave ---------
      const humBuf = makeNoiseBuffer(ctx, 'brown', 6);
      const hum = ctx.createBufferSource(); hum.buffer = humBuf; hum.loop = true;
      const humLP = ctx.createBiquadFilter(); humLP.type = 'lowpass'; humLP.frequency.value = 450;
      const humGain = ctx.createGain(); humGain.gain.value = 0.6;
      hum.connect(humLP).connect(humGain).connect(master);
      hum.start();

      // --------- VIENTO EN COPA DE ÁRBOLES ---------
      const windBuf = makeNoiseBuffer(ctx, 'pink', 8);
      const wind = ctx.createBufferSource(); wind.buffer = windBuf; wind.loop = true;
      const windFilt = ctx.createBiquadFilter(); windFilt.type = 'bandpass'; windFilt.frequency.value = 900; windFilt.Q.value = 3;
      const windGain = ctx.createGain(); windGain.gain.value = 0.18;
      wind.connect(windFilt).connect(windGain).connect(master);
      wind.start();
      const windLfo = ctx.createOscillator(); windLfo.type = 'sine'; windLfo.frequency.value = 0.13;
      const windLfoG = ctx.createGain(); windLfoG.gain.value = 700;
      windLfo.connect(windLfoG).connect(windFilt.frequency);
      windLfo.start();
      const windVolLfo = ctx.createOscillator(); windVolLfo.type = 'sine'; windVolLfo.frequency.value = 0.07;
      const windVolG = ctx.createGain(); windVolG.gain.value = 0.08;
      windVolLfo.connect(windVolG).connect(windGain.gain);
      windVolLfo.start();

      // --------- FOLLAJE: noise muy agudo tenue ---------
      const leafBuf = makeNoiseBuffer(ctx, 'pink', 8);
      const leaf = ctx.createBufferSource(); leaf.buffer = leafBuf; leaf.loop = true;
      const leafFilt = ctx.createBiquadFilter(); leafFilt.type = 'highpass'; leafFilt.frequency.value = 4000;
      const leafGain = ctx.createGain(); leafGain.gain.value = 0.04;
      leaf.connect(leafFilt).connect(leafGain).connect(master);
      leaf.start();

      // --------- LOOP DE ANIMALES ---------
      // Pájaros (trinos) cada 4-9 s
      const birdLoop = setInterval(() => {
        birdSong(ctx, Math.random() * 0.2);
      }, 4500 + Math.random() * 4500);
      audio.intervalIds.push(birdLoop);

      // Cigarras cada 9-14 s
      const cicadaLoop = setInterval(() => {
        cicadaBurst(ctx, Math.random() * 0.3);
      }, 9000 + Math.random() * 5000);
      audio.intervalIds.push(cicadaLoop);

      // Monos aulladores cada 30-50 s
      const monkeyLoop = setInterval(() => {
        howlerMonkey(ctx, Math.random() * 0.5);
      }, 30000 + Math.random() * 20000);
      audio.intervalIds.push(monkeyLoop);

      // Ranas cada 5-8 s
      const frogLoop = setInterval(() => {
        frogCroak(ctx, Math.random() * 0.1);
      }, 5000 + Math.random() * 3000);
      audio.intervalIds.push(frogLoop);

      // Búhos cada 22-40 s
      const owlLoop = setInterval(() => {
        owlHoots(ctx, Math.random() * 0.4);
      }, 22000 + Math.random() * 18000);
      audio.intervalIds.push(owlLoop);

      // Insectos varios cada 3-6 s
      const insectLoop = setInterval(() => {
        insectBuzz(ctx, Math.random() * 0.2);
      }, 3000 + Math.random() * 3000);
      audio.intervalIds.push(insectLoop);

      // Trueno lejano cada 60-120 s (de vez en cuando)
      const thunderLoop = setInterval(() => {
        if (Math.random() < 0.6) distantThunder(ctx, Math.random() * 0.4);
      }, 90000);
      audio.intervalIds.push(thunderLoop);

      // fade-in
      master.gain.setTargetAtTime(0.85, ctx.currentTime, 2.5);

      audio.master = master;
      audio.nodes = [
        hum, humLP, humGain,
        wind, windFilt, windGain, windLfo, windLfoG, windVolLfo, windVolG,
        leaf, leafFilt, leafGain,
        master,
      ];
      audio.on = true;
      const icon = document.querySelector('.sound-icon');
      if (icon) icon.textContent = '🔊';
    } catch (e) {}
  }

  function stopJungle() {
    if (!audio.on) return;
    const ctx = audio.ctx;
    const now = ctx.currentTime;
    audio.master.gain.cancelScheduledValues(now);
    audio.master.gain.setTargetAtTime(0, now, 0.8);
    audio.intervalIds.forEach((id) => clearInterval(id));
    audio.intervalIds = [];
    audio.timeouts.forEach((t) => clearTimeout(t));
    audio.timeouts = [];
    setTimeout(() => {
      audio.nodes.forEach((n) => { try { n.stop && n.stop(); } catch (_) {} });
      audio.nodes = [];
    }, 1400);
    audio.on = false;
    const icon = document.querySelector('.sound-icon');
    if (icon) icon.textContent = '🔇';
  }

  async function toggleSound() {
    if (audio.on) stopJungle();
    else await startJungle();
  }

  // Auto-arranque en el primer click del usuario (los navegadores exigen interacción).
  document.addEventListener('pointerdown', async () => {
    if (!audio.on) await startJungle();
  });

  document.getElementById('soundToggle').addEventListener('click', (e) => {
    e.stopPropagation();
    if (audio.on) toggleSound();
  });

  /* ============== Init ============== */
  spawnAmbient();
})();
