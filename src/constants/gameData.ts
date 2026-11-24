import {
  CustomerArchetypeId,
  DrinkBase,
  DrinkItem,
  GorenganType,
  IngredientId,
  Inventory,
  OrderSpec,
  UpgradesState,
} from '../types/game';

export const SHIFT_DURATION_SECONDS = 300; // 5 minutes real-time
export const MAX_CUSTOMER_SLOTS = 4;
export const MAX_KETTLE_SERVINGS = 4;
export const BASE_BOIL_SECONDS = 3.2;
export const BASE_FRY_SECONDS = 5.0;
export const BURN_THRESHOLD = 155; // 100 = ready, 155 = burned
export const WARM_DECAY_PER_SEC = 2.6; // ~38s from 100 to 0

export const INITIAL_CASH = 35000;
export const INITIAL_REPUTATION = 80;

export const INITIAL_INVENTORY: Inventory = {
  water: 16,
  coffee: 10,
  tea: 10,
  sugar: 14,
  milkGinger: 8,
  batter: 14,
  nasiKucing: 8,
};

export const INITIAL_UPGRADES: UpgradesState = {
  stoveLevel: 0,
  wokLevel: 0,
  displayLevel: 0,
};

export interface IngredientMeta {
  id: IngredientId;
  name: string;
  shortName: string;
  unit: string;
  wholesalePrice: number;
  wholesaleQty: number;
  emergencyPrice: number;
  emergencyQty: number;
  maxStock: number;
}

export const INGREDIENTS: Record<IngredientId, IngredientMeta> = {
  water: {
    id: 'water',
    name: 'Air Galon',
    shortName: 'Air',
    unit: 'porsi',
    wholesalePrice: 4000,
    wholesaleQty: 12,
    emergencyPrice: 4000,
    emergencyQty: 6,
    maxStock: 40,
  },
  coffee: {
    id: 'coffee',
    name: 'Kopi Bubuk',
    shortName: 'Kopi',
    unit: 'sachet',
    wholesalePrice: 6000,
    wholesaleQty: 8,
    emergencyPrice: 6000,
    emergencyQty: 4,
    maxStock: 32,
  },
  tea: {
    id: 'tea',
    name: 'Teh Tubruk',
    shortName: 'Teh',
    unit: 'sachet',
    wholesalePrice: 4500,
    wholesaleQty: 8,
    emergencyPrice: 4500,
    emergencyQty: 4,
    maxStock: 32,
  },
  sugar: {
    id: 'sugar',
    name: 'Gula Pasir',
    shortName: 'Gula',
    unit: 'porsi',
    wholesalePrice: 4000,
    wholesaleQty: 10,
    emergencyPrice: 4500,
    emergencyQty: 5,
    maxStock: 40,
  },
  milkGinger: {
    id: 'milkGinger',
    name: 'Susu & Jahe',
    shortName: 'Susu Jahe',
    unit: 'porsi',
    wholesalePrice: 8000,
    wholesaleQty: 6,
    emergencyPrice: 8500,
    emergencyQty: 3,
    maxStock: 28,
  },
  batter: {
    id: 'batter',
    name: 'Adonan Gorengan',
    shortName: 'Adonan',
    unit: 'buah',
    wholesalePrice: 7000,
    wholesaleQty: 10,
    emergencyPrice: 7500,
    emergencyQty: 5,
    maxStock: 36,
  },
  nasiKucing: {
    id: 'nasiKucing',
    name: 'Nasi Kucing',
    shortName: 'Nasi Kucing',
    unit: 'bungkus',
    wholesalePrice: 12000,
    wholesaleQty: 6,
    emergencyPrice: 12500,
    emergencyQty: 3,
    maxStock: 24,
  },
};

export const INGREDIENT_ORDER: IngredientId[] = [
  'water',
  'coffee',
  'tea',
  'sugar',
  'milkGinger',
  'batter',
  'nasiKucing',
];

export const DRINK_LABELS: Record<DrinkBase, string> = {
  kopi: 'Kopi Hitam',
  teh: 'Teh',
  susu_jahe: 'Susu Jahe',
};

export const GORENGAN_LABELS: Record<GorenganType, string> = {
  tahu: 'Tahu Isi',
  tempe: 'Tempe Mendoan',
  bakwan: 'Bakwan',
};

export const MENU_PRICES = {
  kopi: 5000,
  teh: 4000,
  susu_jahe: 7000,
  gorengan: 2500,
  nasiKucing: 5000,
};

export interface ArchetypeConfig {
  id: CustomerArchetypeId;
  label: string;
  names: string[];
  basePatience: number; // seconds
  tipMultiplier: number;
  badgeColor: string;
}

export const CUSTOMER_ARCHETYPES: Record<CustomerArchetypeId, ArchetypeConfig> = {
  mahasiswa: {
    id: 'mahasiswa',
    label: 'Mahasiswa Begadang',
    names: ['Dimas', 'Raka', 'Nadia', 'Bima', 'Sari', 'Fajar'],
    basePatience: 38,
    tipMultiplier: 1.0,
    badgeColor: 'bg-amber-900/60 text-amber-200 border-amber-700/50',
  },
  ojol: {
    id: 'ojol',
    label: 'Ojol Malam',
    names: ['Bang Jali', 'Mas Hendra', 'Bang Udin', 'Kang Asep', 'Mas Eko'],
    basePatience: 30,
    tipMultiplier: 1.35,
    badgeColor: 'bg-emerald-950/70 text-emerald-300 border-emerald-700/50',
  },
  pekerja: {
    id: 'pekerja',
    label: 'Pekerja Shift',
    names: ['Pak Budi', 'Bu Rina', 'Mas Yoga', 'Pak Slamet', 'Mbak Dewi'],
    basePatience: 44,
    tipMultiplier: 1.2,
    badgeColor: 'bg-stone-800/80 text-stone-200 border-stone-600/50',
  },
};

export interface UpgradeConfig {
  key: keyof UpgradesState;
  name: string;
  maxLevel: number;
  costs: number[];
  description: (level: number) => string;
}

export const UPGRADE_CONFIGS: UpgradeConfig[] = [
  {
    key: 'stoveLevel',
    name: 'Kompor Tekanan Tinggi',
    maxLevel: 3,
    costs: [25000, 45000, 75000],
    description: (lvl) =>
      `Mempercepat rebus air & menggoreng +${(lvl + 1) * 25}% lebih cepat.`,
  },
  {
    key: 'wokLevel',
    name: 'Wajan Lebih Besar',
    maxLevel: 2,
    costs: [30000, 60000],
    description: (lvl) =>
      lvl === 0
        ? 'Tambah slot penggorengan dari 2 menjadi 3 lubang.'
        : 'Tambah slot penggorengan maksimal menjadi 4 lubang.',
  },
  {
    key: 'displayLevel',
    name: 'Termos & Rak Hangat',
    maxLevel: 3,
    costs: [22000, 40000, 65000],
    description: (lvl) =>
      `Gorengan tetap hangat lebih lama & kesabaran pelanggan +${(lvl + 1) * 12}%.`,
  },
];

export function formatDrinkName(drink: DrinkItem): string {
  const prefix = drink.iced ? 'Es ' : '';
  if (drink.base === 'kopi') {
    return `${prefix}Kopi Hitam ${drink.sweet ? 'Manis' : 'Tanpa Gula'}`;
  }
  if (drink.base === 'teh') {
    return `${prefix}Teh ${drink.sweet ? 'Manis' : 'Tawar'}`;
  }
  return `${prefix}Susu Jahe`;
}

export function formatOrderSummary(order: OrderSpec): string {
  const parts: string[] = [];
  if (order.drink) {
    parts.push(formatDrinkName(order.drink));
  }
  const gEntries: Array<[GorenganType, number]> = [
    ['tahu', order.gorengan.tahu],
    ['tempe', order.gorengan.tempe],
    ['bakwan', order.gorengan.bakwan],
  ];
  for (const [type, qty] of gEntries) {
    if (qty > 0) {
      parts.push(`${qty} ${GORENGAN_LABELS[type]} Hangat`);
    }
  }
  if (order.nasiKucing > 0) {
    parts.push(`${order.nasiKucing} Nasi Kucing`);
  }
  return parts.join(' + ');
}

export function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}
