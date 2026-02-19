// JS/auth/auth.js
// Lokalni sustav autentikacije (email + lozinka)
// Podaci se pohranjuju u localStorage

const USERS_KEY = 'keramika_users';
const SESSION_KEY = 'keramika_current_user';

// Vraća email trenutno prijavljenog korisnika ili null
export function getCurrentUser() {
  return localStorage.getItem(SESSION_KEY) || null;
}

// Provjera je li korisnik prijavljen
export function isLoggedIn() {
  return !!getCurrentUser();
}

// Hashira lozinku – koristi Web Crypto API (SHA-256) s fallback na btoa
async function hashPassword(password) {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return 'sha256:' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      // pass through to fallback
    }
  }
  // Fallback za file:// protokol i starije preglednike
  return 'b64:' + btoa(encodeURIComponent('k2salt_' + password));
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Registracija novog korisnika
export async function register(email, password) {
  if (!email || !password) throw new Error('Email i lozinka su obavezni.');
  if (password.length < 4) throw new Error('Lozinka mora imati najmanje 4 znaka.');

  const users = getUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('Korisnik s tim emailom već postoji.');
  }

  const passwordHash = await hashPassword(password);
  users.push({ email: email.toLowerCase(), passwordHash });
  saveUsers(users);
  localStorage.setItem(SESSION_KEY, email.toLowerCase());
}

// Prijava postojećeg korisnika
export async function login(email, password) {
  if (!email || !password) throw new Error('Email i lozinka su obavezni.');

  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) throw new Error('Korisnik nije pronađen.');

  const passwordHash = await hashPassword(password);
  if (passwordHash !== user.passwordHash) throw new Error('Pogrešna lozinka.');

  localStorage.setItem(SESSION_KEY, user.email);
}

// Odjava
export function logout() {
  localStorage.removeItem(SESSION_KEY);
}
