"use strict";

// Coupures en euros
const EURO_BILLS = [500, 200, 100, 50, 20, 10, 5, 2, 1];

// Coupures en centimes
const CENT_COINS = [50, 20, 10, 5, 2, 1];

export function computeBills(amount) {
  const n = Number(amount);

  if (!Number.isFinite(n) || n < 0) {
    return { ok: false, error: "Le montant doit être positif." };
  }

  // Séparation euros / centimes
  let euros = Math.floor(n);
  let cents = Math.round((n - euros) * 100);

  const breakdown = [];

  // Calcul des coupures en euros
  for (const bill of EURO_BILLS) {
    const count = Math.floor(euros / bill);
    if (count > 0) {
      breakdown.push({ type: "€", value: bill, count });
      euros -= bill * count;
    }
  }

  // Calcul des pièces en centimes
  for (const coin of CENT_COINS) {
    const count = Math.floor(cents / coin);
    if (count > 0) {
      breakdown.push({ type: "c", value: coin, count });
      cents -= coin * count;
    }
  }

  return {
    ok: true,
    amount: n,
    breakdown,
    billsCount: breakdown.reduce((acc, x) => acc + x.count, 0),
  };
}
