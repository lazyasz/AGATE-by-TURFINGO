/* ============================================
   AGATE ESPORTS — Core Application Logic
   ============================================ */

const App = (() => {
  // ---- SEED DATA ----
  const TOURNAMENTS = [
    { id: 't1', game: 'VALORANT', title: 'Agate Invitational S3', date: '2026-07-15', prize: '$5,000', slots: 16, registered: 11, status: 'open', color: '#ff4655', desc: '5v5 Tactical Shooter — Double Elimination' },
    { id: 't2', game: 'CS2', title: 'Counter-Strike Showdown', date: '2026-07-22', prize: '$3,500', slots: 12, registered: 10, status: 'closing', color: '#de9b35', desc: '5v5 Competitive — Best of 3 Series' },
    { id: 't3', game: 'APEX LEGENDS', title: 'Apex Arena Championship', date: '2026-08-01', prize: '$4,000', slots: 20, registered: 20, status: 'full', color: '#da292a', desc: '3v3 Battle Royale — Points Based' },
    { id: 't4', game: 'DOTA 2', title: 'Aegis Cup Qualifier', date: '2026-08-10', prize: '$8,000', slots: 16, registered: 7, status: 'open', color: '#a12a12', desc: '5v5 MOBA — Captain\'s Mode' },
    { id: 't5', game: 'LEAGUE OF LEGENDS', title: 'Rift Rivals Open', date: '2026-08-18', prize: '$6,000', slots: 16, registered: 14, status: 'closing', color: '#c89b3c', desc: '5v5 MOBA — Draft Pick Format' },
    { id: 't6', game: 'PUBG MOBILE', title: 'Battleground Blitz', date: '2026-09-02', prize: '$2,500', slots: 24, registered: 9, status: 'open', color: '#f2a900', desc: '4-Player Squad — Classic Erangel' }
  ];

  const ROLES = ['IGL', 'Entry Fragger', 'Support', 'Lurker', 'AWPer', 'Flex', 'Controller', 'Duelist', 'Initiator', 'Sentinel'];

  // ---- STORAGE HELPERS ----
  function getStore(key) { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } }
  function setStore(key, data) { localStorage.setItem(key, JSON.stringify(data)); }
  function getObj(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } }

  // ---- INIT ----
  function init() {
    if (!localStorage.getItem('ag_tournaments')) setStore('ag_tournaments', TOURNAMENTS);
    if (!localStorage.getItem('ag_users')) {
      setStore('ag_users', [{ id: 'admin', username: 'admin', email: 'admin@agate.gg', password: 'admin123', role: 'admin', created: new Date().toISOString() }]);
    }
    if (!localStorage.getItem('ag_teams')) setStore('ag_teams', []);
    updateNavAuth();
    initMobileMenu();
    initPageAnimations();
  }

  // ---- AUTH ----
  function register(username, email, password, role, gamertag, preferredGame) {
    const users = getStore('ag_users');
    if (users.find(u => u.email === email)) return { ok: false, msg: 'Email already registered.' };
    if (users.find(u => u.username === username)) return { ok: false, msg: 'Username already taken.' };
    const user = { id: 'u' + Date.now(), username, email, password, role: role || 'player', gamertag: gamertag || '', preferredGame: preferredGame || '', created: new Date().toISOString() };
    users.push(user);
    setStore('ag_users', users);
    setSession(user);
    return { ok: true, user };
  }

  function login(email, password) {
    const users = getStore('ag_users');
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return { ok: false, msg: 'Invalid email or password.' };
    setSession(user);
    return { ok: true, user };
  }

  function logout() { localStorage.removeItem('ag_session'); window.location.href = 'index.html'; }
  function setSession(user) { localStorage.setItem('ag_session', JSON.stringify({ id: user.id, username: user.username, email: user.email, role: user.role })); }
  function getSession() { return getObj('ag_session'); }
  function isLoggedIn() { return !!getSession(); }
  function isAdmin() { const s = getSession(); return s && s.role === 'admin'; }

  // ---- TEAMS ----
  function registerTeam(teamName, teamTag, tournamentId, players) {
    const teams = getStore('ag_teams');
    const session = getSession();
    const team = {
      id: 'tm' + Date.now(),
      name: teamName,
      tag: teamTag,
      tournamentId,
      players,
      registeredBy: session ? session.username : 'anonymous',
      registeredAt: new Date().toISOString(),
      regId: 'AG-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    };
    teams.push(team);
    setStore('ag_teams', teams);
    // Update tournament registered count
    const tournaments = getStore('ag_tournaments');
    const t = tournaments.find(x => x.id === tournamentId);
    if (t) { t.registered = Math.min(t.registered + 1, t.slots); setStore('ag_tournaments', tournaments); }
    return team;
  }

  function getTeams() { return getStore('ag_teams'); }
  function getTournaments() { return getStore('ag_tournaments'); }
  function getTournament(id) { return getStore('ag_tournaments').find(t => t.id === id); }

  // ---- VALIDATION ----
  function validate(rules) {
    let valid = true;
    rules.forEach(({ input, error, checks }) => {
      const errEl = document.getElementById(error);
      const inputEl = document.getElementById(input);
      if (!inputEl || !errEl) return;
      let msg = '';
      for (const check of checks) {
        const result = check(inputEl.value.trim());
        if (result) { msg = result; break; }
      }
      if (msg) {
        valid = false;
        errEl.textContent = msg;
        errEl.classList.add('visible');
        inputEl.classList.add('error');
      } else {
        errEl.classList.remove('visible');
        inputEl.classList.remove('error');
      }
    });
    return valid;
  }

  const V = {
    required: (label) => (v) => v ? null : `${label} is required.`,
    minLen: (n) => (v) => v.length >= n ? null : `Must be at least ${n} characters.`,
    email: () => (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Enter a valid email.',
    match: (otherId, label) => (v) => v === document.getElementById(otherId)?.value ? null : `${label} do not match.`,
  };

  // ---- UI HELPERS ----
  function toast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) { container = document.createElement('div'); container.className = 'toast-container'; document.body.appendChild(container); }
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.textContent = message;
    container.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(30px)'; setTimeout(() => t.remove(), 300); }, 3000);
  }

  function updateNavAuth() {
    const authContainer = document.querySelector('.nav-auth');
    if (!authContainer) return;
    const session = getSession();
    if (session) {
      authContainer.innerHTML = `<span class="nav-user">⚡ ${session.username}</span>
        ${session.role === 'admin' ? '<a href="admin.html" class="btn btn-sm btn-outline">Dashboard</a>' : ''}
        <button onclick="App.logout()" class="btn btn-sm btn-outline">Logout</button>`;
    } else {
      authContainer.innerHTML = `<a href="login.html" class="btn btn-sm btn-outline">Login</a><a href="register.html" class="btn btn-sm btn-primary">Sign Up</a>`;
    }
  }

  function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => { navLinks.classList.toggle('open'); });
    }
  }

  function initPageAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('slide-up'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
  }

  function requireAuth(redirect = 'login.html') {
    if (!isLoggedIn()) { window.location.href = redirect; return false; }
    return true;
  }

  function requireAdmin() {
    if (!isAdmin()) { window.location.href = 'index.html'; return false; }
    return true;
  }

  function formatDate(isoStr) {
    return new Date(isoStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  return { init, register, login, logout, getSession, isLoggedIn, isAdmin, registerTeam, getTeams, getTournaments, getTournament, validate, V, toast, updateNavAuth, requireAuth, requireAdmin, formatDate, ROLES };
})();

document.addEventListener('DOMContentLoaded', App.init);
