// JS/pdf/pdfSituacija.js
// Stub za pdfSituacija – generira osnovni PDF situacije

export function generateSituacijaPDF(data, type = "privremena") {
  const { jsPDF } = window.jspdf;
  if (!jsPDF) {
    console.error("jsPDF nije dostupan");
    return null;
  }

  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const meta = data.meta || {};
  const items = data.items || [];

  const userEmail = localStorage.getItem('keramika_current_user') || '';
  const profileKey = userEmail ? `user_profile_${userEmail}` : 'user_profile';
  const profile = JSON.parse(localStorage.getItem(profileKey) || '{}');

  doc.setFontSize(14);
  doc.text(`${type === "okončana" ? "OKONČANA" : "PRIVREMENA"} SITUACIJA`, 10, 20);

  doc.setFontSize(10);
  doc.text(profile.companyName || '', 10, 30);
  doc.text(`Gradilište: ${meta.siteName || '-'}`, 10, 38);
  doc.text(`Situacija br.: ${meta.situationNo || '-'}`, 10, 44);
  doc.text(`Investitor: ${meta.investorName || '-'}`, 10, 50);

  let y = 62;
  doc.setFontSize(9);
  items.forEach(item => {
    if (item.qty > 0) {
      doc.text(`${item.name || item.opis}: ${item.qty.toFixed(2)} ${item.unit || item.jm} = ${item.total.toFixed(2)} €`, 10, y);
      y += 6;
      if (y > 270) { doc.addPage(); y = 20; }
    }
  });

  y += 4;
  doc.setFontSize(11);
  doc.text(`UKUPNO: ${(data.total || 0).toFixed(2)} €`, 10, y);

  return doc;
}
