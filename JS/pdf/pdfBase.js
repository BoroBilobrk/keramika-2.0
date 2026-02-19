// JS/pdf/pdfBase.js
// Osnovna PDF funkcija - koristi korisnički profil umjesto tvrdo kodiranih podataka

export function createBasePdf(meta) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "mm", "a4");

  // Čitanje korisničkih podataka iz localStorage
  const userEmail = localStorage.getItem('keramika_current_user') || '';
  const profileKey = userEmail ? `user_profile_${userEmail}` : 'user_profile';
  const logoKey = userEmail ? `user_logo_${userEmail}` : 'user_logo';

  const profile = JSON.parse(localStorage.getItem(profileKey) || '{}');
  const logo = localStorage.getItem(logoKey);

  // LOGO (samo ako je učitan)
  if (logo) {
    doc.addImage(logo, "PNG", 150, 10, 40, 20);
  }

  // PODACI O TVRTKI
  doc.setFontSize(10);
  doc.text(profile.companyName || '', 10, 15);
  doc.text(profile.owner || '', 10, 20);
  doc.text(profile.address || '', 10, 25);
  if (profile.oib) doc.text(`OIB: ${profile.oib}`, 10, 30);
  if (profile.iban) doc.text(`IBAN: ${profile.iban}`, 10, 35);

  // GRADILIŠTE
  doc.setFontSize(11);
  doc.text(`GRADILIŠTE: ${meta.siteName || ''}`, 10, 50);

  return doc;
}
