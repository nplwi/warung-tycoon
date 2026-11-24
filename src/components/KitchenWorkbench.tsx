import React, { useState } from 'react';
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
import {
  PixelDrinkIcon,
  PixelGorenganIcon,
  PixelNasiKucingIcon,
} from './PixelSprites';

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
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-2.5 flex-1 min-h-0">
      {/* 1. Stasiun Minuman */}
      <div className="lg:col-span-3 pixel-wood p-3 flex flex-col justify-between gap-2">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-pixel text-[10px] text-[#FFB300]">
              STASIUN MINUMAN
            </h2>
            <span className="font-vt text-base text-[#EFEBE9]">
              Teko: {kettle.hotServings}/{MAX_KETTLE_SERVINGS}
            </span>
          </div>

          {/* Kettle on Stove */}
          <div className="bg-[#14110F] border-2 border-[#0B0908] p-2 mb-2">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <svg
                  viewBox="0 0 14 12"
                  className="w-6 h-5 shrink-0"
                  shapeRendering="crispEdges"
                >
                  <rect x="3" y="2" width="7" height="7" fill="#90A4AE" />
                  <rect x="4" y="1" width="5" height="1" fill="#CFD8DC" />
                  <rect x="10" y="3" width="2" height="4" fill="#607D8B" />
                  <rect x="1" y="4" width="2" height="2" fill="#B0BEC5" />
                  <rect
                    x="3"
                    y="10"
                    width="7"
                    height="2"
                    fill={kettle.isBoiling ? '#FFB300' : '#4E342E'}
                  />
                </svg>
                <span className="font-vt text-base text-[#EFEBE9]">
                  {kettle.isBoiling
                    ? `Merebus ${Math.round(kettle.boilProgress)}%`
                    : kettle.hotServings > 0
                      ? 'Air Panas Siap'
                      : 'Teko Kosong'}
                </span>
              </div>
              <button
                type="button"
                onClick={onBoilWater}
                disabled={!canBoil}
                className="pixel-btn px-2 py-1 bg-[#FFB300] disabled:bg-[#261714] disabled:text-[#6D4C41] text-[#14110F] font-pixel text-[8px] cursor-pointer disabled:cursor-not-allowed"
              >
                REBUS
              </button>
            </div>
            <div className="h-2.5 w-full bg-[#261714] border border-[#0B0908]">
              <div
                className={`h-full transition-all duration-150 ${kettle.isBoiling ? 'bg-[#FFB300]' : 'bg-[#29B6F6]'
                  }`}
                style={{
                  width: `${kettle.isBoiling
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
                  className={`pixel-btn py-1.5 px-1 font-vt text-base leading-none cursor-pointer ${active
                      ? 'bg-[#FFB300] text-[#14110F] font-bold'
                      : 'bg-[#261714] text-[#D7CCC8]'
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
              className={`pixel-btn py-1 px-2 font-vt text-base cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${effectiveSweet
                  ? 'bg-[#4E342E] text-[#FFE082]'
                  : 'bg-[#14110F] text-[#A1887F]'
                }`}
            >
              {effectiveSweet ? 'Pakai Gula' : 'Tanpa Gula'}
            </button>

            <button
              type="button"
              disabled={drinkBase === 'susu_jahe'}
              onClick={() => setIced((v) => !v)}
              className={`pixel-btn py-1 px-2 font-vt text-base cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${effectiveIced
                  ? 'bg-[#0277BD] text-[#EFEBE9]'
                  : 'bg-[#D84315] text-[#EFEBE9]'
                }`}
            >
              {effectiveIced ? 'Es Dingin' : 'Panas'}
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
          className="pixel-btn w-full py-2 px-2 bg-[#FFB300] hover:bg-[#FFC107] disabled:bg-[#261714] disabled:text-[#6D4C41] text-[#14110F] font-pixel text-[9px] cursor-pointer disabled:cursor-not-allowed"
        >
          {tray.drink
            ? 'NAMPAN PENUH'
            : `RACIK ${formatDrinkName({
              base: drinkBase,
              sweet: effectiveSweet,
              iced: effectiveIced,
            }).toUpperCase()}`}
        </button>
      </div>

      {/* 2. Wajan & Rak Hangat */}
      <div className="lg:col-span-4 pixel-wood p-3 flex flex-col justify-between gap-2">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-pixel text-[10px] text-[#FFB300]">
              WAJAN &amp; RAK HANGAT
            </h2>
            <span className="font-vt text-base text-[#EFEBE9]">
              Adonan: {inventory.batter}
            </span>
          </div>

          {/* Wok Slots */}
          <div
            className={`grid gap-2 mb-2 ${wokSlots.length <= 2
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

              return (
                <button
                  key={slot.id}
                  type="button"
                  disabled={slot.status === 'empty' || slot.status === 'cooking'}
                  onClick={() => onClickWokSlot(slot.id)}
                  className={`border-2 border-[#0B0908] p-2 min-h-[78px] flex flex-col items-center justify-center transition-colors ${slot.status === 'empty'
                      ? 'bg-[#14110F] text-[#6D4C41] cursor-default'
                      : slot.status === 'cooking'
                        ? 'bg-[#261714] text-[#FFB300] cursor-wait'
                        : slot.status === 'ready'
                          ? 'bg-[#2E7D32] text-[#EFEBE9] cursor-pointer shadow-[2px_2px_0_#0B0908]'
                          : 'bg-[#D32F2F] text-[#EFEBE9] cursor-pointer shadow-[2px_2px_0_#0B0908]'
                    }`}
                >
                  {slot.status === 'empty' ? (
                    <span className="font-vt text-base">Lubang {slot.id + 1}</span>
                  ) : (
                    <>
                      <PixelGorenganIcon />
                      <span className="font-vt text-base font-bold leading-tight mt-0.5">
                        {slot.type ? GORENGAN_LABELS[slot.type].split(' ')[0] : ''}
                      </span>
                      <div className="w-full h-2 bg-[#14110F] border border-[#0B0908] mt-1">
                        <div
                          className={`h-full ${slot.status === 'burned'
                              ? 'bg-[#14110F]'
                              : slot.status === 'ready'
                                ? 'bg-[#FFB300]'
                                : 'bg-[#FF8F00]'
                            }`}
                          style={{
                            width: `${slot.status === 'ready' ? burnPct : pct
                              }%`,
                          }}
                        />
                      </div>
                      <span className="font-pixel text-[8px] mt-1">
                        {slot.status === 'burned'
                          ? 'GOSONG!'
                          : slot.status === 'ready'
                            ? 'ANGKAT!'
                            : `${Math.floor(pct)}%`}
                      </span>
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
                className="pixel-btn py-1.5 px-1 bg-[#4E342E] hover:bg-[#5D4037] disabled:bg-[#261714] disabled:text-[#6D4C41] text-[#FFE082] font-vt text-base font-bold cursor-pointer disabled:cursor-not-allowed"
              >
                + {GORENGAN_LABELS[type].split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Warming Rack */}
        <div className="bg-[#14110F] border-2 border-[#0B0908] p-2">
          <div className="flex items-center justify-between font-vt text-sm text-[#D7CCC8] mb-1">
            <span>Rak Hangat (Klik ke Nampan)</span>
            <span>{warmRack.length}/6</span>
          </div>
          {warmRack.length === 0 ? (
            <div className="font-vt text-base text-[#6D4C41] text-center">
              Belum ada gorengan matang
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {warmRack.map((item) => {
                const isWarm = item.freshness > 25;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      isWarm ? onPickFromRack(item.id) : onDiscardFromRack(item.id)
                    }
                    className={`pixel-btn px-2 py-0.5 font-vt text-sm cursor-pointer ${isWarm
                        ? 'bg-[#FFB300] text-[#14110F] font-bold'
                        : 'bg-[#5D4037] text-[#D7CCC8]'
                      }`}
                  >
                    {GORENGAN_LABELS[item.type].split(' ')[0]}{' '}
                    {isWarm ? `${Math.round(item.freshness)}%` : '(Dingin/Buang)'}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 3. Nampan Saji & Nasi Kucing */}
      <div className="lg:col-span-3 pixel-wood p-3 flex flex-col justify-between gap-2">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-pixel text-[10px] text-[#A5D6A7]">
              NAMPAN SAJI
            </h2>
            {!trayEmpty && (
              <button
                type="button"
                onClick={onTrashTray}
                className="pixel-btn px-2 py-0.5 bg-[#D32F2F] text-[#EFEBE9] font-pixel text-[8px] cursor-pointer"
              >
                BUANG
              </button>
            )}
          </div>

          <div className="pixel-paper p-2.5 min-h-[112px] flex flex-col justify-center">
            {trayEmpty ? (
              <p className="font-vt text-lg text-[#5D4037] text-center leading-tight">
                Nampan kosong. Racik minuman, gorengan, atau ambil Nasi Kucing.
              </p>
            ) : (
              <div className="space-y-1.5">
                {tray.drink && (
                  <div className="flex items-center gap-2 bg-[#D7CCC8] border border-[#0B0908] px-2 py-1 font-vt text-base font-bold">
                    <PixelDrinkIcon iced={tray.drink.iced} />
                    <span>{formatDrinkName(tray.drink)}</span>
                  </div>
                )}

                {(['tahu', 'tempe', 'bakwan'] as GorenganType[]).map((g) =>
                  tray.gorengan[g] > 0 ? (
                    <div
                      key={g}
                      className="flex items-center justify-between bg-[#FFE082] border border-[#0B0908] px-2 py-0.5 font-vt text-base font-bold"
                    >
                      <span className="flex items-center gap-1.5">
                        <PixelGorenganIcon />
                        {GORENGAN_LABELS[g]}
                      </span>
                      <span>x{tray.gorengan[g]}</span>
                    </div>
                  ) : null
                )}

                {tray.nasiKucing > 0 && (
                  <div className="flex items-center justify-between bg-[#C8E6C9] border border-[#0B0908] px-2 py-0.5 font-vt text-base font-bold">
                    <span className="flex items-center gap-1.5">
                      <PixelNasiKucingIcon />
                      Nasi Kucing
                    </span>
                    <span>x{tray.nasiKucing}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          disabled={inventory.nasiKucing <= 0}
          onClick={onGrabNasiKucing}
          className="pixel-btn w-full py-2 px-2.5 bg-[#2E7D32] hover:bg-[#388E3C] disabled:bg-[#261714] disabled:text-[#6D4C41] text-[#EFEBE9] font-vt text-lg font-bold flex items-center justify-between cursor-pointer disabled:cursor-not-allowed"
        >
          <span className="flex items-center gap-1.5">
            <PixelNasiKucingIcon />+ Nasi Kucing
          </span>
          <span>Stok: {inventory.nasiKucing}</span>
        </button>
      </div>

      {/* 4. Stok Bahan & Belanja Darurat */}
      <div className="lg:col-span-2 pixel-wood p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1.5">
          <h2 className="font-pixel text-[9px] text-[#EFEBE9]">STOK BAHAN</h2>
          <span className="font-vt text-sm text-[#FFCC80]">Darurat</span>
        </div>

        <div className="space-y-1 flex-1 flex flex-col justify-between">
          {INGREDIENT_ORDER.map((id) => {
            const meta = INGREDIENTS[id];
            const count = inventory[id];
            const low = count <= 3;
            const canBuy = cash >= meta.emergencyPrice && count < meta.maxStock;

            return (
              <div
                key={id}
                className={`flex items-center justify-between gap-1 px-2 py-0.5 border-2 border-[#0B0908] font-vt text-base ${low
                    ? 'bg-[#B71C1C] text-[#EFEBE9]'
                    : 'bg-[#14110F] text-[#D7CCC8]'
                  }`}
              >
                <span className="truncate">{meta.shortName}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="font-bold text-[#EFEBE9]">{count}</span>
                  <button
                    type="button"
                    disabled={!canBuy}
                    onClick={() => onEmergencyRestock(id)}
                    title={`Beli darurat +${meta.emergencyQty} (${formatRupiah(
                      meta.emergencyPrice
                    )})`}
                    className="pixel-btn px-1.5 bg-[#FFB300] disabled:bg-[#261714] disabled:text-[#6D4C41] text-[#14110F] font-pixel text-[8px] cursor-pointer disabled:cursor-not-allowed"
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
