import React from 'react';
import {
  formatRupiah,
  INGREDIENT_ORDER,
  INGREDIENTS,
  UPGRADE_CONFIGS,
} from '../constants/gameData';
import {
  IngredientId,
  Inventory,
  ShiftStats,
  UpgradesState,
} from '../types/game';
import { PixelCoinIcon } from './PixelSprites';

interface ShiftEndModalProps {
  day: number;
  cash: number;
  reputation: number;
  stats: ShiftStats;
  inventory: Inventory;
  upgrades: UpgradesState;
  onBuyUpgrade: (key: keyof UpgradesState) => void;
  onBuyWholesale: (id: IngredientId) => void;
  onNextDay: () => void;
  onBackToMenu: () => void;
}

export const ShiftEndModal: React.FC<ShiftEndModalProps> = ({
  day,
  cash,
  reputation,
  stats,
  inventory,
  upgrades,
  onBuyUpgrade,
  onBuyWholesale,
  onNextDay,
  onBackToMenu,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#14110F]/92 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="pixel-chalkboard max-w-4xl w-full p-5 sm:p-6 my-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-[#3E4C42]">
          <div>
            <div className="font-pixel text-[9px] text-[#FFB300] mb-1">
              SHIFT 05:00 WIB SELESAI
            </div>
            <h2 className="font-pixel text-sm sm:text-base text-[#EFEBE9]">
              LAPORAN WARUNG — HARI {day}
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="bg-[#14110F] border-2 border-[#0B0908] px-3 py-1.5 flex items-center gap-2">
              <PixelCoinIcon />
              <div>
                <div className="font-vt text-xs text-[#A1887F] leading-none">
                  KAS WARUNG
                </div>
                <div className="font-pixel text-[10px] text-[#FFB300]">
                  {formatRupiah(cash)}
                </div>
              </div>
            </div>
            <div className="bg-[#14110F] border-2 border-[#0B0908] px-3 py-1.5">
              <div className="font-vt text-xs text-[#A1887F] leading-none">
                REPUTASI
              </div>
              <div className="font-pixel text-[10px] text-[#A5D6A7]">
                ★ {reputation}%
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
          <div className="pixel-paper p-2.5">
            <div className="font-vt text-sm text-[#5D4037]">Omzet Shift</div>
            <div className="font-pixel text-[10px] text-[#2E7D32]">
              {formatRupiah(stats.revenueEarned)}
            </div>
          </div>
          <div className="pixel-paper p-2.5">
            <div className="font-vt text-sm text-[#5D4037]">Pelanggan Puas</div>
            <div className="font-pixel text-[10px] text-[#14110F]">
              {stats.customersServed} ORANG
            </div>
          </div>
          <div className="pixel-paper p-2.5">
            <div className="font-vt text-sm text-[#5D4037]">Tip Kecepatan</div>
            <div className="font-pixel text-[10px] text-[#E65100]">
              {formatRupiah(stats.speedTipsEarned)}
            </div>
          </div>
          <div className="pixel-paper p-2.5">
            <div className="font-vt text-sm text-[#5D4037]">Kabur / Gosong</div>
            <div className="font-pixel text-[10px] text-[#D32F2F]">
              {stats.customersLost} / {stats.burnedCount}
            </div>
          </div>
        </div>

        {/* Upgrades & Wholesale */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4">
          <div className="bg-[#14110F] border-2 border-[#0B0908] p-3">
            <h3 className="font-pixel text-[10px] text-[#FFB300] mb-3">
              UPGRADE PERALATAN
            </h3>
            <div className="space-y-2.5">
              {UPGRADE_CONFIGS.map((cfg) => {
                const lvl = upgrades[cfg.key];
                const isMax = lvl >= cfg.maxLevel;
                const cost = isMax ? 0 : cfg.costs[lvl];
                const canAfford = !isMax && cash >= cost;

                return (
                  <div
                    key={cfg.key}
                    className="bg-[#261714] border-2 border-[#0B0908] p-2.5 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="font-vt text-lg font-bold text-[#EFEBE9] leading-none">
                        {cfg.name}{' '}
                        <span className="text-[#FFB300]">
                          (Lv {lvl}/{cfg.maxLevel})
                        </span>
                      </div>
                      <p className="font-vt text-sm text-[#D7CCC8] leading-tight mt-0.5">
                        {isMax ? 'Level Maksimal!' : cfg.description(lvl)}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={!canAfford}
                      onClick={() => onBuyUpgrade(cfg.key)}
                      className="pixel-btn shrink-0 px-2.5 py-1.5 bg-[#FFB300] disabled:bg-[#3E2723] disabled:text-[#8D6E63] text-[#14110F] font-pixel text-[9px] cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isMax ? 'MAKS' : formatRupiah(cost)}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#14110F] border-2 border-[#0B0908] p-3">
            <h3 className="font-pixel text-[10px] text-[#A5D6A7] mb-3">
              KULAKAN BAHAN (GROSIR)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {INGREDIENT_ORDER.map((id) => {
                const meta = INGREDIENTS[id];
                const stock = inventory[id];
                const isFull = stock >= meta.maxStock;
                const canAfford = !isFull && cash >= meta.wholesalePrice;

                return (
                  <div
                    key={id}
                    className="bg-[#261714] border-2 border-[#0B0908] px-2.5 py-1.5 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="font-vt text-base font-bold text-[#EFEBE9] truncate leading-none">
                        {meta.name}
                      </div>
                      <div className="font-vt text-sm text-[#A1887F]">
                        Stok: {stock}/{meta.maxStock}
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={!canAfford}
                      onClick={() => onBuyWholesale(id)}
                      className="pixel-btn shrink-0 px-2 py-1 bg-[#2E7D32] disabled:bg-[#3E2723] disabled:text-[#8D6E63] text-[#EFEBE9] font-vt text-sm font-bold cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isFull
                        ? 'Penuh'
                        : `+${meta.wholesaleQty} (${formatRupiah(
                            meta.wholesalePrice
                          )})`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t-2 border-[#3E4C42]">
          <button
            type="button"
            onClick={onBackToMenu}
            className="pixel-btn px-3.5 py-2 bg-[#3E2723] text-[#EFEBE9] font-pixel text-[9px] cursor-pointer"
          >
            MENU UTAMA
          </button>

          <button
            type="button"
            onClick={onNextDay}
            className="pixel-btn px-5 py-2.5 bg-[#FFB300] hover:bg-[#FFC107] text-[#14110F] font-pixel text-[10px] cursor-pointer"
          >
            LANJUT HARI {day + 1} &gt;&gt;
          </button>
        </div>
      </div>
    </div>
  );
};
