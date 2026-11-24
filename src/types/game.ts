export type IngredientId =
  | 'water'
  | 'coffee'
  | 'tea'
  | 'sugar'
  | 'milkGinger'
  | 'batter'
  | 'nasiKucing';

export type Inventory = Record<IngredientId, number>;

export type DrinkBase = 'kopi' | 'teh' | 'susu_jahe';

export interface DrinkItem {
  base: DrinkBase;
  sweet: boolean;
  iced: boolean;
}

export type GorenganType = 'tahu' | 'tempe' | 'bakwan';

export type GorenganCounts = Record<GorenganType, number>;

export interface OrderSpec {
  drink: DrinkItem | null;
  gorengan: GorenganCounts;
  nasiKucing: number;
  basePrice: number;
}

export type CustomerArchetypeId = 'mahasiswa' | 'ojol' | 'pekerja';

export interface Customer {
  id: string;
  slotIndex: number;
  archetype: CustomerArchetypeId;
  name: string;
  order: OrderSpec;
  maxPatience: number;
  patience: number;
  arrivedAt: number;
  isLeaving?: boolean;
}

export type WokStatus = 'empty' | 'cooking' | 'ready' | 'burned';

export interface WokSlot {
  id: number;
  type: GorenganType | null;
  progress: number; // 0-100 cooking, 100-150 ready, >=150 burned
  status: WokStatus;
}

export interface PlatedGorengan {
  id: string;
  type: GorenganType;
  freshness: number; // 100 -> 0; > 25 is Hangat
}

export interface KettleState {
  hotServings: number; // 0 to MAX_KETTLE_SERVINGS
  isBoiling: boolean;
  boilProgress: number; // 0 to 100
}

export interface TrayState {
  drink: DrinkItem | null;
  gorengan: GorenganCounts;
  nasiKucing: number;
}

export interface UpgradesState {
  stoveLevel: number; // 0..3 Kompor Tekanan Tinggi
  wokLevel: number; // 0..2 Wajan Lebih Besar (2 -> 3 -> 4 slots)
  displayLevel: number; // 0..3 Termos & Rak Display
}

export interface FloatingPopup {
  id: string;
  slotIndex: number;
  text: string;
  subtext?: string;
  tone: 'cash' | 'tip' | 'angry';
}

export type GamePhase = 'menu' | 'playing' | 'paused' | 'shift_end';

export interface ShiftStats {
  customersServed: number;
  customersLost: number;
  speedTipsEarned: number;
  revenueEarned: number;
  itemsTrashed: number;
  burnedCount: number;
}

export interface SavedProgress {
  highScoreCash: number;
  bestReputation: number;
  unlockedDay: number;
  cash: number;
  reputation: number;
  inventory: Inventory;
  upgrades: UpgradesState;
}
