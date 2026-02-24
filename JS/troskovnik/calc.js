// JS/troskovnik/calc.js
import { calculateAuto } from "../calculations/autoCalc.js";
import { UNIT_PRICES } from "../calculations/cjenik.js";

function getItemCalcMethod(item, id) {
  if (item.calcMethod) return item.calcMethod;
  const escapedId = String(id).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const select = document.querySelector(
    `#troskovnikItemsList select[data-item-id="${escapedId}"][data-role="calc-method"]`
  );
  return select?.value || "custom";
}

function getItemTileFormat(item, id) {
  if (item.tileFormat) return item.tileFormat;
  const escapedId = String(id).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const select = document.querySelector(
    `#troskovnikItemsList select[data-item-id="${escapedId}"][data-role="tile-format"]`
  );
  return select?.value || "custom";
}

export function calcFromTroskovnik() {
  console.log("🔥 calcFromTroskovnik START");

  // provjera troškovnika
  if (!window.troskovnikItems || !window.troskovnikItems.length) {
    alert("Troškovnik nije učitan");
    return;
  }

  // svi izračuni iz automatskog obračuna
  const autoData = calculateAuto();
  const auto = autoData?.results || {};

  const resultCard = document.getElementById("troskovnikResult");
  const resultBox = document.getElementById("troskovnikOutput");

  if (!resultCard || !resultBox) {
    console.error("❌ Result DOM not found");
    return;
  }

  const checked = document.querySelectorAll(
    "#troskovnikItemsList input[type='checkbox']:checked"
  );

  if (!checked.length) {
    alert("Nema odabranih stavki");
    return;
  }

  let output = [];

  checked.forEach(chk => {
    const id = String(chk.value);
    const item = window.troskovnikItems.find(
      i => String(i.id) === id
    );
    if (!item) return;

    const method = getItemCalcMethod(item, id);
    const tileFormat = getItemTileFormat(item, id);

    // ==========================
    // MAPIRANJE METODE NA KOLICINU
    // ==========================
    const methodToQty = {
      pod:         auto.pod         || 0,
      zidovi:      auto.zidovi      || 0,
      hidroPod:    auto.hidroPod    || 0,
      hidroTus:    auto.hidroTus    || 0,
      hidroUkupno: auto.hidroUkupno || 0,
      hidroTraka:  auto.hidroTraka  || 0,
      silikon:     auto.silikon     || 0,
      sokl:        auto.sokl        || 0,
      lajsne:      auto.lajsne      || 0,
      gerung:      auto.gerung      || 0,
      stepenice:   auto.stepenice   || 0,
      custom:      0,
    };

    const qty = methodToQty[method] ?? 0;

    // ==========================
    // CIJENA – iz troškovnika; fallback UNIT_PRICES
    // ==========================
    let unitPrice = 0;
    if (item.cijena != null && item.cijena > 0) {
      unitPrice = item.cijena;
    } else if (item.ukupno != null && item.kolicina != null && item.kolicina > 0) {
      unitPrice = item.ukupno / item.kolicina;
    } else {
      unitPrice = UNIT_PRICES[method] || 0;
    }

    const total = qty * unitPrice;

    output.push({
      opis: item.opis,
      jm: item.jm,
      qty,
      unitPrice,
      total,
      tileFormat,
    });
  });

  // ==========================
  // ISPIS
  // ==========================
  resultCard.style.display = "block";

  const totalSum = output.reduce((s, o) => s + o.total, 0);

  resultBox.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>Stavka</th>
          <th>JM</th>
          <th>Kol.</th>
          <th>Jed. cijena</th>
          <th>Ukupno</th>
        </tr>
      </thead>
      <tbody>
        ${output.map(o => `
          <tr>
            <td>${o.opis}</td>
            <td>${o.jm}</td>
            <td>${o.qty.toFixed(2)}</td>
            <td>${o.unitPrice.toFixed(2)}</td>
            <td>${o.total.toFixed(2)}</td>
          </tr>
        `).join("")}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="4"><b>UKUPNO</b></td>
          <td><b>${totalSum.toFixed(2)}</b></td>
        </tr>
      </tfoot>
    </table>
  `;

  console.log("✅ Rezultat:", output);
}
