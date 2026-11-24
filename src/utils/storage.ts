import {
  INITIAL_CASH,
  INITIAL_INVENTORY,
  INITIAL_REPUTATION,
  INITIAL_UPGRADES,
} from '../constants/gameData';
import { SavedProgress } from '../types/game';

const STORAGE_KEY = 'warung_tycoon_midnight_shift_v1';

export function getDefaultProgress(): SavedProgress {
  return {
    highScoreCash: INITIAL_CASH,
    bestReputation: INITIAL_REPUTATION,
    unlockedDay: 1,
    cash: INITIAL_CASH,
    reputation: INITIAL_REPUTATION,
    inventory: { ...INITIAL_INVENTORY },
    upgrades: { ...INITIAL_UPGRADES },
  };
}

export function loadProgress(): SavedProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProgress();
    const parsed = JSON.parse(raw) as Partial<SavedProgress>;
    return {
      highScoreCash: parsed.highScoreCash ?? INITIAL_CASH,
      bestReputation: parsed.bestReputation ?? INITIAL_REPUTATION,
      unlockedDay: parsed.unlockedDay ?? 1,
      cash: parsed.cash ?? INITIAL_CASH,
      reputation: parsed.reputation ?? INITIAL_REPUTATION,
      inventory: { ...INITIAL_INVENTORY, ...(parsed.inventory ?? {}) },
      upgrades: { ...INITIAL_UPGRADES, ...(parsed.upgrades ?? {}) },
    };
  } catch {
    return getDefaultProgress();
  }
}

export function saveProgress(progress: SavedProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage quota errors
  }
}

export function resetProgress(): SavedProgress {
  const fresh = getDefaultProgress();
  saveProgress(fresh);
  return fresh;
}
