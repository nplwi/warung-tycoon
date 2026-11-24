import { useCallback, useEffect, useRef, useState } from 'react';
import { CustomerCounter } from './components/CustomerCounter';
import { KitchenWorkbench } from './components/KitchenWorkbench';
import { ShiftEndModal } from './components/ShiftEndModal';
import { StartOverlay } from './components/StartOverlay';
import { TopHud } from './components/TopHud';
import {
  BASE_BOIL_SECONDS,
  BASE_FRY_SECONDS,
  BURN_THRESHOLD,
  CUSTOMER_ARCHETYPES,
  formatRupiah,
  INGREDIENTS,
  MAX_CUSTOMER_SLOTS,
  MAX_KETTLE_SERVINGS,
  SHIFT_DURATION_SECONDS,
  UPGRADE_CONFIGS,
  WARM_DECAY_PER_SEC,
} from './constants/gameData';
import {
  Customer,
  DrinkItem,
  FloatingPopup,
  GamePhase,
  GorenganType,
  IngredientId,
  Inventory,
  KettleState,
  PlatedGorengan,
  SavedProgress,
  ShiftStats,
  TrayState,
  UpgradesState,
  WokSlot,
} from './types/game';
import {
  doesTrayMatchOrder,
  isPeakHour,
  nextId,
  spawnCustomer,
} from './utils/gameLogic';
import { soundEngine } from './utils/sound';
import { loadProgress, resetProgress, saveProgress } from './utils/storage';

const EMPTY_TRAY: TrayState = {
  drink: null,
  gorengan: { tahu: 0, tempe: 0, bakwan: 0 },
  nasiKucing: 0,
};

const EMPTY_STATS: ShiftStats = {
  customersServed: 0,
  customersLost: 0,
  speedTipsEarned: 0,
  revenueEarned: 0,
  itemsTrashed: 0,
  burnedCount: 0,
};

function createWokSlots(wokLevel: number): WokSlot[] {
  const count = wokLevel === 0 ? 2 : wokLevel === 1 ? 3 : 4;
  return Array.from({ length: count }, (_, id) => ({
    id,
    type: null,
    progress: 0,
    status: 'empty',
  }));
}

export function App() {
  const [saved, setSaved] = useState<SavedProgress>(() => loadProgress());
  const [phase, setPhase] = useState<GamePhase>('menu');
  const [day, setDay] = useState<number>(() => loadProgress().unlockedDay);
  const [cash, setCash] = useState<number>(() => loadProgress().cash);
  const [reputation, setReputation] = useState<number>(
    () => loadProgress().reputation
  );
  const [inventory, setInventory] = useState<Inventory>(
    () => loadProgress().inventory
  );
  const [upgrades, setUpgrades] = useState<UpgradesState>(
    () => loadProgress().upgrades
  );

  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [customers, setCustomers] = useState<Array<Customer | null>>(() =>
    Array(MAX_CUSTOMER_SLOTS).fill(null)
  );
  const [kettle, setKettle] = useState<KettleState>({
    hotServings: 2,
    isBoiling: false,
    boilProgress: 0,
  });
  const [wokSlots, setWokSlots] = useState<WokSlot[]>(() =>
    createWokSlots(loadProgress().upgrades.wokLevel)
  );
  const [warmRack, setWarmRack] = useState<PlatedGorengan[]>([]);
  const [tray, setTray] = useState<TrayState>(EMPTY_TRAY);
  const [stats, setStats] = useState<ShiftStats>(EMPTY_STATS);
  const [popups, setPopups] = useState<FloatingPopup[]>([]);
  const [shakingSlot, setShakingSlot] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [bgmEnabled, setBgmEnabled] = useState<boolean>(true);

  const spawnCooldownRef = useRef<number>(1.5);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 2400);
  }, []);

  const addPopup = useCallback(
    (
      slotIndex: number,
      text: string,
      tone: FloatingPopup['tone'],
      subtext?: string
    ) => {
      const id = nextId('pop');
      setPopups((prev) => [...prev, { id, slotIndex, text, tone, subtext }]);
      window.setTimeout(() => {
        setPopups((prev) => prev.filter((p) => p.id !== id));
      }, 1250);
    },
    []
  );

  const persistState = useCallback(
    (
      nextCash: number,
      nextRep: number,
      nextInv: Inventory,
      nextUpg: UpgradesState,
      nextDay: number
    ) => {
      const updated: SavedProgress = {
        highScoreCash: Math.max(saved.highScoreCash, nextCash),
        bestReputation: Math.max(saved.bestReputation, nextRep),
        unlockedDay: Math.max(saved.unlockedDay, nextDay),
        cash: nextCash,
        reputation: nextRep,
        inventory: nextInv,
        upgrades: nextUpg,
      };
      setSaved(updated);
      saveProgress(updated);
    },
    [saved.bestReputation, saved.highScoreCash, saved.unlockedDay]
  );

  const startShift = useCallback(
    (targetDay: number, currentUpgrades: UpgradesState) => {
      soundEngine.unlockAndStartBgm();
      setDay(targetDay);
      setElapsedSeconds(0);
      setCustomers(Array(MAX_CUSTOMER_SLOTS).fill(null));
      setKettle({ hotServings: 2, isBoiling: false, boilProgress: 0 });
      setWokSlots(createWokSlots(currentUpgrades.wokLevel));
      setWarmRack([]);
      setTray(EMPTY_TRAY);
      setStats(EMPTY_STATS);
      spawnCooldownRef.current = 1.2;
      setPhase('playing');
    },
    []
  );

  const handleStartFromMenu = () => {
    startShift(saved.unlockedDay, upgrades);
  };

  const handleResetSave = () => {
    const fresh = resetProgress();
    setSaved(fresh);
    setDay(fresh.unlockedDay);
    setCash(fresh.cash);
    setReputation(fresh.reputation);
    setInventory(fresh.inventory);
    setUpgrades(fresh.upgrades);
    setWokSlots(createWokSlots(fresh.upgrades.wokLevel));
    showToast('Progres direset ke Hari 1.');
  };

  // Main 100ms simulation loop
  useEffect(() => {
    if (phase !== 'playing') return;

    const dt = 0.1;
    const timer = window.setInterval(() => {
      setElapsedSeconds((prevElapsed) => {
        const nextElapsed = prevElapsed + dt;
        if (nextElapsed >= SHIFT_DURATION_SECONDS) {
          setPhase('shift_end');
          soundEngine.playShiftEndBell();
          return SHIFT_DURATION_SECONDS;
        }
        return nextElapsed;
      });

      const peak = isPeakHour(elapsedSeconds);
      const stoveMult = 1 + upgrades.stoveLevel * 0.25;
      const warmDecayMult = Math.max(0.4, 1 - upgrades.displayLevel * 0.18);

      setKettle((prev) => {
        if (!prev.isBoiling) return prev;
        const step = (100 / BASE_BOIL_SECONDS) * stoveMult * dt;
        const nextProg = prev.boilProgress + step;
        if (nextProg >= 100) {
          soundEngine.playBoil();
          return {
            hotServings: MAX_KETTLE_SERVINGS,
            isBoiling: false,
            boilProgress: 0,
          };
        }
        return { ...prev, boilProgress: nextProg };
      });

      setWokSlots((prev) =>
        prev.map((slot) => {
          if (slot.status === 'empty' || slot.status === 'burned') return slot;
          const speed = (100 / BASE_FRY_SECONDS) * stoveMult * dt;
          const nextProg = slot.progress + speed;
          if (nextProg >= BURN_THRESHOLD) {
            soundEngine.playError();
            setStats((s) => ({ ...s, burnedCount: s.burnedCount + 1 }));
            return { ...slot, progress: BURN_THRESHOLD, status: 'burned' };
          }
          if (nextProg >= 100 && slot.status === 'cooking') {
            soundEngine.playClick();
            return { ...slot, progress: nextProg, status: 'ready' };
          }
          return { ...slot, progress: nextProg };
        })
      );

      setWarmRack((prev) =>
        prev.map((item) => ({
          ...item,
          freshness: Math.max(
            0,
            item.freshness - WARM_DECAY_PER_SEC * warmDecayMult * dt
          ),
        }))
      );

      setCustomers((prev) => {
        const drainRate = peak ? 1.35 : 1.0;
        let changed = false;
        const next = prev.map((c, idx) => {
          if (!c) return null;
          const nextPatience = c.patience - drainRate * dt;
          if (nextPatience <= 0) {
            changed = true;
            soundEngine.playError();
            addPopup(idx, 'Kabur!', 'angry', '-10% Rep');
            setReputation((r) => Math.max(0, r - 10));
            setStats((s) => ({ ...s, customersLost: s.customersLost + 1 }));
            return null;
          }
          changed = true;
          return { ...c, patience: nextPatience };
        });
        return changed ? next : prev;
      });

      spawnCooldownRef.current -= dt;
      if (spawnCooldownRef.current <= 0) {
        setCustomers((prev) => {
          const emptyIndices = prev
            .map((c, idx) => (c === null ? idx : -1))
            .filter((idx) => idx !== -1);

          if (emptyIndices.length > 0) {
            const chosenSlot =
              emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
            const newCust = spawnCustomer(
              chosenSlot,
              day,
              upgrades,
              elapsedSeconds
            );
            const copy = [...prev];
            copy[chosenSlot] = newCust;
            soundEngine.playArrivalBell();
            return copy;
          }
          return prev;
        });

        const baseInterval = peak ? 4.2 : 6.8;
        const daySpeedup = Math.max(0.65, 1 - (day - 1) * 0.08);
        spawnCooldownRef.current =
          baseInterval * daySpeedup + Math.random() * 2.2;
      }
    }, 100);

    return () => window.clearInterval(timer);
  }, [phase, elapsedSeconds, day, upgrades, addPopup]);

  useEffect(() => {
    if (phase === 'shift_end') {
      persistState(cash, reputation, inventory, upgrades, day + 1);
    }
  }, [phase, cash, reputation, inventory, upgrades, day, persistState]);

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
  };

  const handleToggleBgm = () => {
    const next = soundEngine.toggleBgm();
    setBgmEnabled(next);
  };

  const handleTogglePause = () => {
    setPhase((p) => (p === 'playing' ? 'paused' : p === 'paused' ? 'playing' : p));
  };

  const handleBoilWater = () => {
    if (kettle.isBoiling || kettle.hotServings >= MAX_KETTLE_SERVINGS) return;
    const needed = MAX_KETTLE_SERVINGS - kettle.hotServings;
    if (inventory.water <= 0) {
      showToast('Air galon habis! Beli stok darurat di kanan.');
      soundEngine.playError();
      return;
    }
    const used = Math.min(needed, inventory.water);
    setInventory((inv) => ({ ...inv, water: inv.water - used }));
    setKettle((k) => ({ ...k, isBoiling: true, boilProgress: 0 }));
    soundEngine.playBoil();
  };

  const handleCraftDrink = (drink: DrinkItem) => {
    if (tray.drink !== null) {
      showToast('Nampan sudah berisi minuman!');
      return;
    }
    if (kettle.hotServings <= 0) {
      showToast('Air panas habis! Rebus air dulu.');
      soundEngine.playError();
      return;
    }

    const baseKey: IngredientId =
      drink.base === 'kopi'
        ? 'coffee'
        : drink.base === 'teh'
        ? 'tea'
        : 'milkGinger';

    if (inventory[baseKey] <= 0) {
      showToast(`Stok ${INGREDIENTS[baseKey].shortName} habis!`);
      soundEngine.playError();
      return;
    }
    const needsSugar = drink.base !== 'susu_jahe' && drink.sweet;
    if (needsSugar && inventory.sugar <= 0) {
      showToast('Stok Gula habis!');
      soundEngine.playError();
      return;
    }

    setKettle((k) => ({ ...k, hotServings: k.hotServings - 1 }));
    setInventory((inv) => ({
      ...inv,
      [baseKey]: inv[baseKey] - 1,
      sugar: needsSugar ? inv.sugar - 1 : inv.sugar,
    }));
    setTray((t) => ({ ...t, drink }));
    soundEngine.playClick();
  };

  const handleStartFry = (type: GorenganType) => {
    if (inventory.batter <= 0) {
      showToast('Adonan gorengan habis!');
      soundEngine.playError();
      return;
    }
    const emptyIdx = wokSlots.findIndex((s) => s.status === 'empty');
    if (emptyIdx === -1) {
      showToast('Semua lubang wajan penuh!');
      return;
    }

    setInventory((inv) => ({ ...inv, batter: inv.batter - 1 }));
    setWokSlots((prev) =>
      prev.map((slot, idx) =>
        idx === emptyIdx
          ? { ...slot, type, progress: 0, status: 'cooking' }
          : slot
      )
    );
    soundEngine.playSizzle();
  };

  const handleClickWokSlot = (slotId: number) => {
    const slot = wokSlots.find((s) => s.id === slotId);
    if (!slot) return;

    if (slot.status === 'burned') {
      setWokSlots((prev) =>
        prev.map((s) =>
          s.id === slotId ? { ...s, type: null, progress: 0, status: 'empty' } : s
        )
      );
      setStats((st) => ({ ...st, itemsTrashed: st.itemsTrashed + 1 }));
      soundEngine.playClick();
      return;
    }

    if (slot.status === 'ready' && slot.type) {
      if (warmRack.length >= 6) {
        showToast('Rak hangat penuh (maks 6)! Taruh ke nampan dulu.');
        soundEngine.playError();
        return;
      }
      const newItem: PlatedGorengan = {
        id: nextId('gor'),
        type: slot.type,
        freshness: 100,
      };
      setWarmRack((prev) => [...prev, newItem]);
      setWokSlots((prev) =>
        prev.map((s) =>
          s.id === slotId ? { ...s, type: null, progress: 0, status: 'empty' } : s
        )
      );
      soundEngine.playClick();
    }
  };

  const handlePickFromRack = (id: string) => {
    const item = warmRack.find((g) => g.id === id);
    if (!item) return;
    setWarmRack((prev) => prev.filter((g) => g.id !== id));
    setTray((t) => ({
      ...t,
      gorengan: {
        ...t.gorengan,
        [item.type]: t.gorengan[item.type] + 1,
      },
    }));
    soundEngine.playClick();
  };

  const handleDiscardFromRack = (id: string) => {
    setWarmRack((prev) => prev.filter((g) => g.id !== id));
    setStats((st) => ({ ...st, itemsTrashed: st.itemsTrashed + 1 }));
    soundEngine.playClick();
  };

  const handleGrabNasiKucing = () => {
    if (inventory.nasiKucing <= 0) {
      showToast('Stok Nasi Kucing habis!');
      soundEngine.playError();
      return;
    }
    setInventory((inv) => ({ ...inv, nasiKucing: inv.nasiKucing - 1 }));
    setTray((t) => ({ ...t, nasiKucing: t.nasiKucing + 1 }));
    soundEngine.playClick();
  };

  const handleTrashTray = () => {
    setTray(EMPTY_TRAY);
    setStats((st) => ({ ...st, itemsTrashed: st.itemsTrashed + 1 }));
    soundEngine.playClick();
  };

  const handleEmergencyRestock = (id: IngredientId) => {
    const meta = INGREDIENTS[id];
    if (cash < meta.emergencyPrice || inventory[id] >= meta.maxStock) return;
    setCash((c) => c - meta.emergencyPrice);
    setInventory((inv) => ({
      ...inv,
      [id]: Math.min(meta.maxStock, inv[id] + meta.emergencyQty),
    }));
    soundEngine.playCashRegister();
  };

  const handleServeCustomer = (slotIndex: number) => {
    const customer = customers[slotIndex];
    if (!customer) return;

    if (!doesTrayMatchOrder(tray, customer.order)) {
      setShakingSlot(slotIndex);
      window.setTimeout(() => setShakingSlot(null), 380);
      soundEngine.playError();
      showToast('Pesanan di nampan belum sesuai dengan pelanggan ini!');
      return;
    }

    const patienceRatio = customer.patience / customer.maxPatience;
    const arch = CUSTOMER_ARCHETYPES[customer.archetype];
    const speedTip =
      patienceRatio >= 0.55
        ? Math.round((2000 * arch.tipMultiplier) / 500) * 500
        : 0;
    const earned = customer.order.basePrice + speedTip;

    setCash((c) => c + earned);
    setReputation((r) => Math.min(100, r + (speedTip > 0 ? 3 : 1)));
    setStats((s) => ({
      ...s,
      customersServed: s.customersServed + 1,
      speedTipsEarned: s.speedTipsEarned + speedTip,
      revenueEarned: s.revenueEarned + earned,
    }));
    setCustomers((prev) => prev.map((c, idx) => (idx === slotIndex ? null : c)));
    setTray(EMPTY_TRAY);

    soundEngine.playCashRegister();
    addPopup(
      slotIndex,
      `+${formatRupiah(earned)}`,
      speedTip > 0 ? 'tip' : 'cash',
      speedTip > 0 ? `Tip Kilat ${formatRupiah(speedTip)}` : undefined
    );
  };

  const handleBuyUpgrade = (key: keyof UpgradesState) => {
    const cfg = UPGRADE_CONFIGS.find((u) => u.key === key);
    if (!cfg) return;
    const lvl = upgrades[key];
    if (lvl >= cfg.maxLevel) return;
    const cost = cfg.costs[lvl];
    if (cash < cost) return;

    const nextCash = cash - cost;
    const nextUpg = { ...upgrades, [key]: lvl + 1 };
    setCash(nextCash);
    setUpgrades(nextUpg);
    soundEngine.playCashRegister();
    persistState(nextCash, reputation, inventory, nextUpg, day + 1);
  };

  const handleBuyWholesale = (id: IngredientId) => {
    const meta = INGREDIENTS[id];
    if (cash < meta.wholesalePrice || inventory[id] >= meta.maxStock) return;
    const nextCash = cash - meta.wholesalePrice;
    const nextInv = {
      ...inventory,
      [id]: Math.min(meta.maxStock, inventory[id] + meta.wholesaleQty),
    };
    setCash(nextCash);
    setInventory(nextInv);
    soundEngine.playCashRegister();
    persistState(nextCash, reputation, nextInv, upgrades, day + 1);
  };

  const handleNextDay = () => {
    startShift(day + 1, upgrades);
  };

  const handleBackToMenu = () => {
    setPhase('menu');
  };

  const remainingSeconds = Math.max(0, SHIFT_DURATION_SECONDS - elapsedSeconds);

  return (
    <div className="pixel-night-bg min-h-screen lg:h-screen lg:overflow-hidden flex flex-col">
      <TopHud
        day={day}
        elapsedSeconds={elapsedSeconds}
        remainingSeconds={remainingSeconds}
        cash={cash}
        reputation={reputation}
        isMuted={isMuted}
        bgmEnabled={bgmEnabled}
        isPaused={phase === 'paused'}
        onToggleMute={handleToggleMute}
        onToggleBgm={handleToggleBgm}
        onTogglePause={handleTogglePause}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 py-2.5 sm:px-4 sm:py-3 flex flex-col gap-2.5 min-h-0">
        <CustomerCounter
          customers={customers}
          tray={tray}
          popups={popups}
          shakingSlot={shakingSlot}
          onServeCustomer={handleServeCustomer}
        />

        <KitchenWorkbench
          cash={cash}
          inventory={inventory}
          kettle={kettle}
          wokSlots={wokSlots}
          warmRack={warmRack}
          tray={tray}
          onBoilWater={handleBoilWater}
          onCraftDrink={handleCraftDrink}
          onStartFry={handleStartFry}
          onClickWokSlot={handleClickWokSlot}
          onPickFromRack={handlePickFromRack}
          onDiscardFromRack={handleDiscardFromRack}
          onGrabNasiKucing={handleGrabNasiKucing}
          onTrashTray={handleTrashTray}
          onEmergencyRestock={handleEmergencyRestock}
        />
      </main>

      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 px-4 py-2 pixel-paper font-vt text-lg font-bold shadow-[4px_4px_0_#0B0908]">
          {toast}
        </div>
      )}

      {phase === 'paused' && (
        <div className="fixed inset-0 z-40 bg-[#14110F]/85 flex items-center justify-center p-4">
          <div className="pixel-chalkboard p-6 max-w-sm w-full text-center">
            <h2 className="font-pixel text-sm text-[#FFB300] mb-3">
              SHIFT DIJEDA
            </h2>
            <p className="font-vt text-lg text-[#D7CCC8] mb-5">
              Warung tutup sebentar. Lanjutkan melayani pelanggan malam?
            </p>
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleTogglePause}
                className="pixel-btn w-full py-2.5 bg-[#FFB300] text-[#14110F] font-pixel text-[10px] cursor-pointer"
              >
                LANJUTKAN SHIFT
              </button>
              <button
                type="button"
                onClick={handleBackToMenu}
                className="pixel-btn w-full py-2 bg-[#3E2723] text-[#EFEBE9] font-pixel text-[10px] cursor-pointer"
              >
                MENU UTAMA
              </button>
            </div>
          </div>
        </div>
      )}

      {phase === 'menu' && (
        <StartOverlay
          progress={saved}
          onStartDay={handleStartFromMenu}
          onResetSave={handleResetSave}
        />
      )}

      {phase === 'shift_end' && (
        <ShiftEndModal
          day={day}
          cash={cash}
          reputation={reputation}
          stats={stats}
          inventory={inventory}
          upgrades={upgrades}
          onBuyUpgrade={handleBuyUpgrade}
          onBuyWholesale={handleBuyWholesale}
          onNextDay={handleNextDay}
          onBackToMenu={handleBackToMenu}
        />
      )}
    </div>
  );
}

export default App;
