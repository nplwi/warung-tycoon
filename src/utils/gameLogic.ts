import {
  CUSTOMER_ARCHETYPES,
  MENU_PRICES,
} from '../constants/gameData';
import {
  Customer,
  CustomerArchetypeId,
  DrinkBase,
  DrinkItem,
  GorenganCounts,
  GorenganType,
  OrderSpec,
  TrayState,
  UpgradesState,
} from '../types/game';

let uidCounter = 1;
export function nextId(prefix: string): string {
  uidCounter += 1;
  return `${prefix}-${Date.now()}-${uidCounter}`;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function createOrderForArchetype(
  archetype: CustomerArchetypeId,
  day: number
): OrderSpec {
  const drinkBases: DrinkBase[] = ['kopi', 'teh', 'susu_jahe'];
  const gorenganTypes: GorenganType[] = ['tahu', 'tempe', 'bakwan'];

  // Most orders include a drink, especially for ojol & mahasiswa
  const hasDrink = archetype === 'ojol' ? Math.random() < 0.85 : Math.random() < 0.88;
  let drink: DrinkItem | null = null;
  if (hasDrink) {
    const base = pickRandom(drinkBases);
    const sweet = base === 'susu_jahe' ? true : Math.random() < 0.65;
    const iced = base === 'susu_jahe' ? false : Math.random() < 0.28;
    drink = { base, sweet, iced };
  }

  const gorengan: GorenganCounts = { tahu: 0, tempe: 0, bakwan: 0 };
  // Workers & students often order 1-2 gorengan
  const wantsGorengan =
    !drink || (archetype === 'pekerja' ? Math.random() < 0.78 : Math.random() < 0.62);

  if (wantsGorengan) {
    const gType = pickRandom(gorenganTypes);
    const maxQty = day >= 2 || archetype === 'pekerja' ? 2 : 2;
    const qty = Math.random() < 0.45 ? maxQty : 1;
    gorengan[gType] = qty;
  }

  // Nasi Kucing: popular for Pekerja & Mahasiswa, or if no gorengan
  let nasiKucing = 0;
  const wantsNasi =
    (!drink && gorengan.tahu + gorengan.tempe + gorengan.bakwan === 0) ||
    (archetype === 'pekerja' && Math.random() < 0.55) ||
    (archetype === 'mahasiswa' && Math.random() < 0.35) ||
    (archetype === 'ojol' && Math.random() < 0.2);

  if (wantsNasi) {
    nasiKucing = archetype === 'pekerja' && Math.random() < 0.3 ? 2 : 1;
  }

  // Guarantee at least 1 item in order
  if (!drink && gorengan.tahu + gorengan.tempe + gorengan.bakwan === 0 && nasiKucing === 0) {
    drink = { base: 'kopi', sweet: true, iced: false };
  }

  let basePrice = 0;
  if (drink) {
    basePrice += MENU_PRICES[drink.base];
  }
  const totalGorengan = gorengan.tahu + gorengan.tempe + gorengan.bakwan;
  basePrice += totalGorengan * MENU_PRICES.gorengan;
  basePrice += nasiKucing * MENU_PRICES.nasiKucing;

  return {
    drink,
    gorengan,
    nasiKucing,
    basePrice,
  };
}

export function spawnCustomer(
  slotIndex: number,
  day: number,
  upgrades: UpgradesState,
  elapsedSeconds: number
): Customer {
  const archetypes: CustomerArchetypeId[] = ['mahasiswa', 'ojol', 'pekerja'];
  const archetype = pickRandom(archetypes);
  const cfg = CUSTOMER_ARCHETYPES[archetype];
  const name = pickRandom(cfg.names);

  // Display upgrade adds +12% patience per level; later days slightly tighter
  const displayBonus = 1 + upgrades.displayLevel * 0.12;
  const dayFactor = Math.max(0.78, 1 - (day - 1) * 0.05);
  const maxPatience = Math.round(cfg.basePatience * displayBonus * dayFactor);

  return {
    id: nextId('cust'),
    slotIndex,
    archetype,
    name,
    order: createOrderForArchetype(archetype, day),
    maxPatience,
    patience: maxPatience,
    arrivedAt: elapsedSeconds,
  };
}

export function doesTrayMatchOrder(tray: TrayState, order: OrderSpec): boolean {
  // Check drink
  if (order.drink === null && tray.drink !== null) return false;
  if (order.drink !== null && tray.drink === null) return false;
  if (order.drink && tray.drink) {
    if (
      order.drink.base !== tray.drink.base ||
      order.drink.sweet !== tray.drink.sweet ||
      order.drink.iced !== tray.drink.iced
    ) {
      return false;
    }
  }

  // Check gorengan exact counts
  if (
    tray.gorengan.tahu !== order.gorengan.tahu ||
    tray.gorengan.tempe !== order.gorengan.tempe ||
    tray.gorengan.bakwan !== order.gorengan.bakwan
  ) {
    return false;
  }

  // Check nasi kucing
  if (tray.nasiKucing !== order.nasiKucing) return false;

  return true;
}

export function isTrayEmpty(tray: TrayState): boolean {
  return (
    tray.drink === null &&
    tray.gorengan.tahu === 0 &&
    tray.gorengan.tempe === 0 &&
    tray.gorengan.bakwan === 0 &&
    tray.nasiKucing === 0
  );
}

export function getShiftClockString(elapsedSeconds: number): string {
  // 0..300s maps to 00:00..05:00 (60s = 1 in-game hour)
  const clamped = Math.max(0, Math.min(300, elapsedSeconds));
  const totalInGameMinutes = Math.floor(clamped); // 300 seconds = 300 in-game minutes (5 hours)
  const hours = Math.floor(totalInGameMinutes / 60);
  const mins = totalInGameMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

export function isPeakHour(elapsedSeconds: number): boolean {
  // Peak hours: 01:00 to 03:00 -> 60s to 180s
  return elapsedSeconds >= 60 && elapsedSeconds < 180;
}

export function formatCountdown(remainingSeconds: number): string {
  const s = Math.max(0, Math.ceil(remainingSeconds));
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
