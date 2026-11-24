import React from 'react';
import {
  ArrowRight,
  Award,
  Package,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Wrench,
} from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-[#120F0D]/90 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="wood-panel max-w-4xl w-full rounded-2xl border border-amber-700/40 p-5 sm:p-6 shadow-2xl my-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#3E312B]">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-400">
              Shift Pukul 05:00 WIB Selesai
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#F3EFEA]">
              Laporan Warung — Hari {day}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#181512] border border-[#3E312B] rounded-xl px-3.5 py-2 text-right">
              <div className="text-[10px] text-[#A89F91]">Saldo Kas</div>
              <div className="font-mono-num text-base font-bold text-emerald-300">
                {formatRupiah(cash)}
              </div>
            </div>
            <div className="bg-[#181512] border border-[#3E312B] rounded-xl px-3.5 py-2 text-right">
              <div className="text-[10px] text-[#A89F91]">Reputasi</div>
              <div className="font-mono-num text-base font-bold text-amber-300">
                {reputation}%
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
          <div className="rounded-xl bg-[#181512]/85 border border-[#3E312B] p-3">
            <div className="text-[11px] text-[#A89F91]">Omzet Shift</div>
            <div className="font-mono-num text-sm sm:text-base font-bold text-emerald-300">
              {formatRupiah(stats.revenueEarned)}
            </div>
          </div>
          <div className="rounded-xl bg-[#181512]/85 border border-[#3E312B] p-3">
            <div className="text-[11px] text-[#A89F91]">Pelanggan Puas</div>
            <div className="font-mono-num text-sm sm:text-base font-bold text-[#F3EFEA]">
              {stats.customersServed} orang
            </div>
          </div>
          <div className="rounded-xl bg-[#181512]/85 border border-[#3E312B] p-3">
            <div className="text-[11px] text-[#A89F91]">Tip Kecepatan</div>
            <div className="font-mono-num text-sm sm:text-base font-bold text-amber-300">
              {formatRupiah(stats.speedTipsEarned)}
            </div>
          </div>
          <div className="rounded-xl bg-[#181512]/85 border border-[#3E312B] p-3">
            <div className="text-[11px] text-[#A89F91]">Kabur / Gosong</div>
            <div className="font-mono-num text-sm sm:text-base font-bold text-red-300">
              {stats.customersLost} / {stats.burnedCount}
            </div>
          </div>
        </div>

        {/* Two Columns: Upgrades & Wholesale Restock */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4">
          {/* Upgrades */}
          <div className="bg-[#181512]/70 border border-[#3E312B] rounded-xl p-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5 mb-3">
              <Wrench className="w-3.5 h-3.5" />
              Upgrade Peralatan Warung
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
                    className="rounded-xl bg-[#241C18] border border-[#3E312B] p-3 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-[#F3EFEA]">
                          {cfg.name}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 font-mono-num text-[10px] font-semibold">
                          Lv {lvl}/{cfg.maxLevel}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#A89F91] mt-0.5">
                        {isMax
                          ? 'Sudah mencapai level maksimal!'
                          : cfg.description(lvl)}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={!canAfford}
                      onClick={() => onBuyUpgrade(cfg.key)}
                      className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:bg-[#2E2520] disabled:text-[#6B6158] text-[#181512] font-bold text-xs transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isMax ? (
                        <span className="flex items-center gap-1">
                          <Award className="w-3.5 h-3.5" /> Maks
                        </span>
                      ) : (
                        formatRupiah(cost)
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Wholesale Restock */}
          <div className="bg-[#181512]/70 border border-[#3E312B] rounded-xl p-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5 mb-3">
              <ShoppingBag className="w-3.5 h-3.5" />
              Kulakan Bahan Baku (Harga Grosir)
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
                    className="rounded-lg bg-[#241C18] border border-[#3E312B] px-2.5 py-2 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[#F3EFEA] truncate">
                        {meta.name}
                      </div>
                      <div className="text-[10px] text-[#A89F91] flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        <span className="font-mono-num">
                          {stock}/{meta.maxStock}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={!canAfford}
                      onClick={() => onBuyWholesale(id)}
                      className="shrink-0 px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:bg-[#2E2520] disabled:text-[#6B6158] text-white font-semibold text-[11px] transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isFull
                        ? 'Penuh'
                        : `+${meta.wholesaleQty} • ${formatRupiah(
                            meta.wholesalePrice
                          )}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#3E312B]">
          <button
            type="button"
            onClick={onBackToMenu}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#2C221E] hover:bg-[#3A2D28] border border-[#493A32] text-xs font-semibold text-[#D6CEC2] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Ke Menu Utama
          </button>

          <button
            type="button"
            onClick={onNextDay}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#181512] font-bold text-sm transition-colors cursor-pointer shadow-lg shadow-amber-900/30"
          >
            <Sparkles className="w-4 h-4" />
            Lanjut Shift Hari {day + 1}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
