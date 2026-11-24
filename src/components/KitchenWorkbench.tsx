import React, { useState } from 'react';
import {
  AlertTriangle,
  Coffee,
  Droplets,
  Flame,
  PackagePlus,
  Snowflake,
  Trash2,
  Utensils,
} from 'lucide-react';
import {
  BURN_THRESHOLD,
  DRINK_LABELS,
  formatDrinkName,
  formatRupiah,
  GORENGAN_LABELS,
  INGREDIENT_ORDER,
  INGREDIENTS,
  MAX_KETTLE_SERVINGS,
} from '../constants/gameData';
import {
  DrinkBase,
  DrinkItem,
  GorenganType,
  IngredientId,
  Inventory,
  KettleState,
  PlatedGorengan,
  TrayState,
  WokSlot,
} from '../types/game';
import { isTrayEmpty } from '../utils/gameLogic';

interface KitchenWorkbenchProps {
  cash: number;
  inventory: Inventory;
  kettle: KettleState;
  wokSlots: WokSlot[];
  warmRack: PlatedGorengan[];
  tray: TrayState;
  onBoilWater: () => void;
  onCraftDrink: (drink: DrinkItem) => void;
  onStartFry: (type: GorenganType) => void;
  onClickWokSlot: (slotId: number) => void;
  onPickFromRack: (id: string) => void;
  onDiscardFromRack: (id: string) => void;
  onGrabNasiKucing: () => void;
  onTrashTray: () => void;
  onEmergencyRestock: (id: IngredientId) => void;
}

export const KitchenWorkbench: React.FC<KitchenWorkbenchProps> = ({
  cash,
  inventory,
  kettle,
  wokSlots,
  warmRack,
  tray,
  onBoilWater,
  onCraftDrink,
  onStartFry,
  onClickWokSlot,
  onPickFromRack,
  onDiscardFromRack,
  onGrabNasiKucing,
  onTrashTray,
  onEmergencyRestock,
}) => {
  const [drinkBase, setDrinkBase] = useState<DrinkBase>('kopi');
  const [sweet, setSweet] = useState<boolean>(true);
  const [iced, setIced] = useState<boolean>(false);

  const effectiveSweet = drinkBase === 'susu_jahe' ? true : sweet;
  const effectiveIced = drinkBase === 'susu_jahe' ? false : iced;

  const canBoil =
    !kettle.isBoiling &&
    kettle.hotServings < MAX_KETTLE_SERVINGS &&
    inventory.water > 0;

  const hasBaseStock =
    (drinkBase === 'kopi' && inventory.coffee > 0) ||
    (drinkBase === 'teh' && inventory.tea > 0) ||
    (drinkBase === 'susu_jahe' && inventory.milkGinger > 0);
  const hasSugarStock =
    drinkBase === 'susu_jahe' || !effectiveSweet || inventory.sugar > 0;
  const canCraftDrink =
    kettle.hotServings > 0 && hasBaseStock && hasSugarStock && tray.drink === null;

  const hasEmptyWok = wokSlots.some((s) => s.status === 'empty');
  const trayEmpty = isTrayEmpty(tray);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-2.5 sm:gap-3 flex-1 min-h-0">
      {/* 1. Stasiun Minuman */}
      <div className="lg:col-span-3 wood-panel rounded-xl border border-[#463730] p-3 flex flex-col justify-between gap-2.5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Coffee className="w-3.5 h-3.5" />
              Stasiun Minuman
            </h2>
            <span className="font-mono-num text-[11px] text-[#D6CEC2]">
              Air Panas: {kettle.hotServings}/{MAX_KETTLE_SERVINGS}
            </span>
          </div>

          {/* Kettle Control */}
          <div className="bg-[#181512]/85 border border-[#3E312B] rounded-lg p-2 mb-2.5">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5">
                <Droplets
                  className={`w-3.5 h-3.5 ${
                    kettle.isBoiling
                      ? 'text-amber-400 animate-bounce'
                      : 'text-sky-400'
                  }`}
                />
                <span className="text-[11px] font-medium text-[#F3EFEA]">
                  {kettle.isBoiling
                    ? `Merebus... ${Math.round(kettle.boilProgress)}%`
                    : kettle.hotServings > 0
                    ? 'Teko Siap Seduh'
                    : 'Air Panas Habis'}
                </span>
              </div>
              <button
                type="button"
                onClick={onBoilWater}
                disabled={!canBoil}
                className="px-2 py-1 rounded text-[11px] font-semibold bg-amber-600/90 hover:bg-amber-500 disabled:bg-[#2E2520] disabled:text-[#6B6158] text-[#181512] transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                Rebus Air
              </button>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#120F0D] overflow-hidden">
              <div
                className={`h-full transition-all duration-150 ${
                  kettle.isBoiling ? 'bg-amber-400' : 'bg-sky-500/80'
                }`}
                style={{
                  width: `${
                    kettle.isBoiling
                      ? kettle.boilProgress
                      : (kettle.hotServings / MAX_KETTLE_SERVINGS) * 100
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Base Selector */}
          <div className="grid grid-cols-3 gap-1.5 mb-2">
            {(['kopi', 'teh', 'susu_jahe'] as DrinkBase[]).map((base) => {
              const active = drinkBase === base;
              return (
                <button
                  key={base}
                  type="button"
                  onClick={() => setDrinkBase(base)}
                  className={`py-1.5 px-1 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer ${
                    active
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                      : 'bg-[#1A1613] border-[#3E312B] text-[#A89F91] hover:text-[#F3EFEA]'
                  }`}
                >
                  {DRINK_LABELS[base]}
                </button>
              );
            })}
          </div>

          {/* Modifiers */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              disabled={drinkBase === 'susu_jahe'}
              onClick={() => setSweet((v) => !v)}
              className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${
                effectiveSweet
                  ? 'bg-[#2C221E] border-amber-600/60 text-amber-200'
                  : 'bg-[#1A1613] border-[#3E312B] text-[#A89F91]'
              }`}
            >
              {effectiveSweet ? 'Pakai Gula' : 'Tanpa Gula'}
            </button>

            <button
              type="button"
              disabled={drinkBase === 'susu_jahe'}
              onClick={() => setIced((v) => !v)}
              className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border flex items-center justify-center gap-1 transition-colors cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${
                effectiveIced
                  ? 'bg-sky-950/60 border-sky-500/50 text-sky-200'
                  : 'bg-[#2C221E] border-orange-700/50 text-orange-200'
              }`}
            >
              {effectiveIced ? (
                <>
                  <Snowflake className="w-3 h-3" /> Es Dingin
                </>
              ) : (
                <>
                  <Flame className="w-3 h-3" /> Panas
                </>
              )}
            </button>
          </div>
        </div>

        <button
          type="button"
          disabled={!canCraftDrink}
          onClick={() =>
            onCraftDrink({
              base: drinkBase,
              sweet: effectiveSweet,
              iced: effectiveIced,
            })
          }
          className="w-full py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:bg-[#2A211D] disabled:text-[#6B6158] text-[#181512] font-bold text-xs transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          {tray.drink
            ? 'Nampan Sudah Ada Minuman'
            : `Racik ${formatDrinkName({
                base: drinkBase,
                sweet: effectiveSweet,
                iced: effectiveIced,
              })}`}
        </button>
      </div>

      {/* 2. Wajan & Rak Hangat */}
      <div className="lg:col-span-4 wood-panel rounded-xl border border-[#463730] p-3 flex flex-col justify-between gap-2.5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-orange-300 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" />
              Wajan Penggorengan
            </h2>
            <span className="text-[11px] text-[#A89F91]">
              Adonan: <strong className="font-mono-num text-[#F3EFEA]">{inventory.batter}</strong>
            </span>
          </div>

          {/* Wok Slots */}
          <div
            className={`grid gap-2 mb-2.5 ${
              wokSlots.length <= 2
                ? 'grid-cols-2'
                : wokSlots.length === 3
                ? 'grid-cols-3'
                : 'grid-cols-4'
            }`}
          >
            {wokSlots.map((slot) => {
              const pct = Math.min(100, slot.progress);
              const burnPct =
                slot.progress > 100
                  ? Math.min(
                      100,
                      ((slot.progress - 100) / (BURN_THRESHOLD - 100)) * 100
                    )
                  : 0;

              let ringColor = '#F59E0B';
              if (slot.status === 'ready') ringColor = '#10B981';
              if (slot.status === 'burned') ringColor = '#EF4444';

              const radius = 17;
              const circumference = 2 * Math.PI * radius;
              const offset = circumference - (pct / 100) * circumference;

              return (
                <button
                  key={slot.id}
                  type="button"
                  disabled={slot.status === 'empty' || slot.status === 'cooking'}
                  onClick={() => onClickWokSlot(slot.id)}
                  className={`relative rounded-xl p-2 border flex flex-col items-center justify-center min-h-[82px] transition-all ${
                    slot.status === 'empty'
                      ? 'bg-[#181512]/70 border-dashed border-[#3E312B] text-[#6B6158] cursor-default'
                      : slot.status === 'cooking'
                      ? 'bg-[#211A16] border-amber-700/50 text-amber-200 cursor-wait animate-sizzle'
                      : slot.status === 'ready'
                      ? 'bg-emerald-950/45 border-emerald-400 text-emerald-200 cursor-pointer ring-1 ring-emerald-400/40'
                      : 'bg-red-950/60 border-red-500 text-red-200 cursor-pointer'
                  }`}
                >
                  {slot.status === 'empty' ? (
                    <span className="text-[10px]">Lubang {slot.id + 1}</span>
                  ) : (
                    <>
                      <div className="relative w-10 h-10 flex items-center justify-center">
                        <svg className="w-10 h-10 -rotate-90" viewBox="0 0 42 42">
                          <circle
                            cx="21"
                            cy="21"
                            r={radius}
                            fill="none"
                            stroke="#14110F"
                            strokeWidth="4"
                          />
                          <circle
                            cx="21"
                            cy="21"
                            r={radius}
                            fill="none"
                            stroke={ringColor}
                            strokeWidth="4"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute font-mono-num text-[9px] font-bold">
                          {slot.status === 'burned'
                            ? 'X'
                            : slot.status === 'ready'
                            ? 'OK'
                            : `${Math.floor(pct)}%`}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold mt-1 truncate max-w-full">
                        {slot.type ? GORENGAN_LABELS[slot.type].split(' ')[0] : ''}
                      </span>
                      {slot.status === 'ready' && (
                        <div className="w-full h-1 bg-[#14110F] rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-orange-500"
                            style={{ width: `${burnPct}%` }}
                          />
                        </div>
                      )}
                      {slot.status === 'burned' && (
                        <span className="text-[9px] font-bold text-red-300">
                          GOSONG (Buang)
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>

          {/* Fry Buttons */}
          <div className="grid grid-cols-3 gap-1.5">
            {(['tahu', 'tempe', 'bakwan'] as GorenganType[]).map((type) => (
              <button
                key={type}
                type="button"
                disabled={!hasEmptyWok || inventory.batter <= 0}
                onClick={() => onStartFry(type)}
                className="py-1.5 px-2 rounded-lg bg-[#2C221E] hover:bg-[#3A2D28] disabled:bg-[#1E1815] disabled:text-[#6B6158] border border-orange-800/50 text-orange-200 text-[11px] font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                + {GORENGAN_LABELS[type].split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Warming Rack */}
        <div className="bg-[#181512]/85 border border-[#3E312B] rounded-lg p-2">
          <div className="flex items-center justify-between text-[10px] text-[#A89F91] mb-1.5">
            <span>Rak Hangat (Klik untuk taruh di Nampan)</span>
            <span className="font-mono-num">{warmRack.length}/6</span>
          </div>
          {warmRack.length === 0 ? (
            <div className="text-[11px] text-[#6B6158] text-center py-1">
              Belum ada gorengan matang
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {warmRack.map((item) => {
                const isWarm = item.freshness > 25;
                return (
                  <div
                    key={item.id}
                    className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-1 text-[10px] font-semibold ${
                      isWarm
                        ? 'bg-amber-950/60 border-amber-500/50 text-amber-200'
                        : 'bg-stone-900 border-stone-700 text-stone-400'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        isWarm ? onPickFromRack(item.id) : onDiscardFromRack(item.id)
                      }
                      className="cursor-pointer hover:underline"
                      title={
                        isWarm
                          ? 'Taruh ke Nampan Saji'
                          : 'Sudah dingin — klik untuk buang'
                      }
                    >
                      {GORENGAN_LABELS[item.type].split(' ')[0]}{' '}
                      <span className="font-mono-num opacity-80">
                        {isWarm ? `${Math.round(item.freshness)}%` : 'Dingin'}
                      </span>
                    </button>
                    {!isWarm && (
                      <Trash2
                        onClick={() => onDiscardFromRack(item.id)}
                        className="w-3 h-3 text-red-400 cursor-pointer"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 3. Nampan Saji & Nasi Kucing */}
      <div className="lg:col-span-3 wood-panel rounded-xl border border-[#463730] p-3 flex flex-col justify-between gap-2.5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5" />
              Nampan Saji
            </h2>
            {!trayEmpty && (
              <button
                type="button"
                onClick={onTrashTray}
                className="inline-flex items-center gap-1 text-[10px] text-red-300 hover:text-red-200 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                Buang
              </button>
            )}
          </div>

          <div className="wood-counter rounded-xl border border-[#4E3E36] p-3 min-h-[108px] flex flex-col justify-center">
            {trayEmpty ? (
              <p className="text-xs text-[#7A6F64] text-center">
                Nampan kosong. Racik minuman, gorengan, atau ambil Nasi Kucing.
              </p>
            ) : (
              <div className="space-y-1.5">
                {tray.drink && (
                  <div className="flex items-center justify-between bg-[#181512]/80 border border-amber-600/40 rounded-lg px-2.5 py-1.5 text-xs">
                    <div className="flex items-center gap-2 text-amber-200 font-medium">
                      <div className="relative">
                        <Coffee className="w-4 h-4 text-amber-400" />
                        {!tray.drink.iced && (
                          <span className="absolute -top-2 left-1 w-1 h-2 bg-amber-200/60 rounded-full animate-steam-1" />
                        )}
                      </div>
                      <span>{formatDrinkName(tray.drink)}</span>
                    </div>
                  </div>
                )}

                {(['tahu', 'tempe', 'bakwan'] as GorenganType[]).map((g) =>
                  tray.gorengan[g] > 0 ? (
                    <div
                      key={g}
                      className="flex items-center justify-between bg-[#181512]/80 border border-orange-600/40 rounded-lg px-2.5 py-1 text-xs text-orange-200"
                    >
                      <span>{GORENGAN_LABELS[g]} Hangat</span>
                      <span className="font-mono-num font-bold">
                        x{tray.gorengan[g]}
                      </span>
                    </div>
                  ) : null
                )}

                {tray.nasiKucing > 0 && (
                  <div className="flex items-center justify-between bg-[#181512]/80 border border-stone-600/50 rounded-lg px-2.5 py-1 text-xs text-stone-200">
                    <span>Nasi Kucing</span>
                    <span className="font-mono-num font-bold">
                      x{tray.nasiKucing}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <button
            type="button"
            disabled={inventory.nasiKucing <= 0}
            onClick={onGrabNasiKucing}
            className="w-full py-2 px-3 rounded-lg bg-[#342823] hover:bg-[#43332C] disabled:bg-[#1E1815] disabled:text-[#6B6158] border border-[#56443B] text-[#F3EFEA] text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <span>+ Ambil Nasi Kucing</span>
            <span className="font-mono-num text-amber-300">
              Stok: {inventory.nasiKucing}
            </span>
          </button>
          <p className="text-[10px] text-[#A89F91] text-center">
            Klik kartu pelanggan di atas jika nampan sudah sesuai pesanan.
          </p>
        </div>
      </div>

      {/* 4. Stok Bahan & Belanja Darurat */}
      <div className="lg:col-span-2 wood-panel rounded-xl border border-[#463730] p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#D6CEC2] flex items-center gap-1.5">
            <PackagePlus className="w-3.5 h-3.5 text-amber-400" />
            Stok Bahan
          </h2>
          <span className="text-[10px] text-[#A89F91]">Darurat</span>
        </div>

        <div className="space-y-1.5 flex-1 flex flex-col justify-between">
          {INGREDIENT_ORDER.map((id) => {
            const meta = INGREDIENTS[id];
            const count = inventory[id];
            const low = count <= 3;
            const canBuy =
              cash >= meta.emergencyPrice && count < meta.maxStock;

            return (
              <div
                key={id}
                className={`flex items-center justify-between gap-1 rounded-lg px-2 py-1 border text-[11px] ${
                  low
                    ? 'bg-red-950/35 border-red-700/50 text-red-200'
                    : 'bg-[#181512]/75 border-[#3A2E28] text-[#D6CEC2]'
                }`}
              >
                <div className="flex items-center gap-1 min-w-0">
                  {low && (
                    <AlertTriangle className="w-3 h-3 text-red-400 shrink-0" />
                  )}
                  <span className="truncate">{meta.shortName}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="font-mono-num font-bold text-[#F3EFEA]">
                    {count}
                  </span>
                  <button
                    type="button"
                    disabled={!canBuy}
                    onClick={() => onEmergencyRestock(id)}
                    title={`Beli darurat +${meta.emergencyQty} (${formatRupiah(
                      meta.emergencyPrice
                    )})`}
                    className="px-1.5 py-0.5 rounded bg-amber-600/80 hover:bg-amber-500 disabled:bg-[#2A211D] disabled:text-[#6B6158] text-[#181512] font-bold text-[10px] cursor-pointer disabled:cursor-not-allowed"
                  >
                    +{meta.emergencyQty}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
