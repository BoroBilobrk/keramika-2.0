// JS/profile/profile.js
// Upravljanje korisničkim profilom (podaci o tvrtki + logo)

import { getCurrentUser } from '../auth/auth.js';

// Ključevi za localStorage
export function getProfileKey() {
  const user = getCurrentUser();
  return user ? `user_profile_${user}` : 'user_profile';
}

export function getLogoKey() {
  const user = getCurrentUser();
  return user ? `user_logo_${user}` : 'user_logo';
}

// Čitanje profila
export function loadProfile() {
  try {
    return JSON.parse(localStorage.getItem(getProfileKey()) || '{}');
  } catch (e) {
    return {};
  }
}

// Spremanje profila
export function saveProfile(profileData) {
  localStorage.setItem(getProfileKey(), JSON.stringify(profileData));
}

// Čitanje loga (base64 data URL ili null)
export function loadLogo() {
  return localStorage.getItem(getLogoKey()) || null;
}

// Spremanje loga
export function saveLogo(base64DataUrl) {
  if (base64DataUrl) {
    localStorage.setItem(getLogoKey(), base64DataUrl);
  } else {
    localStorage.removeItem(getLogoKey());
  }
}

// Inicijalizacija prikaza profila u UI-u
export function initProfileView() {
  const profile = loadProfile();
  const logo = loadLogo();

  // Popuni polja u formi
  const fields = ['companyName', 'owner', 'address', 'oib', 'iban', 'phone', 'email'];
  fields.forEach(field => {
    const el = document.getElementById(`profile_${field}`);
    if (el) el.value = profile[field] || '';
  });

  // Prikaz loga
  const preview = document.getElementById('logoPreview');
  if (preview) {
    if (logo) {
      preview.src = logo;
      preview.style.display = 'block';
    } else {
      preview.style.display = 'none';
    }
  }
}

// Spremi podatke iz forme
export function saveProfileFromForm() {
  const profile = {};
  const fields = ['companyName', 'owner', 'address', 'oib', 'iban', 'phone', 'email'];
  fields.forEach(field => {
    const el = document.getElementById(`profile_${field}`);
    if (el) profile[field] = el.value.trim();
  });

  saveProfile(profile);

  // Ažuriraj header
  updateHeaderBrand();

  alert('Profil spremljen.');
}

// Ažurira naziv tvrtke u headeru
export function updateHeaderBrand() {
  const profile = loadProfile();
  const brandEl = document.getElementById('headerBrand');
  if (brandEl) {
    brandEl.textContent = profile.companyName || 'Keramika 2.0';
  }
}
