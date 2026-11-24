import React from 'react';
import { CheckCircle2, Coffee, Flame, Utensils } from 'lucide-react';
import {
  CUSTOMER_ARCHETYPES,
  formatDrinkName,
  formatOrderSummary,
  formatRupiah,
  GORENGAN_LABELS,
  MAX_CUSTOMER_SLOTS,
} from '../constants/gameData';
import { Customer, FloatingPopup, TrayState } from '../types/game';
import { doesTrayMatchOrder, isTrayEmpty } from '../utils/gameLogic';

interface CustomerCounterProps {
  customers: Array<Customer | null>;
  tray: TrayState;
  popups: FloatingPopup[];
  shakingSlot: number | null;
  onServeCustomer: (slotIndex: number) => void;
}

export const CustomerCounter: React.FC<CustomerCounterProps> = ({
  customers,
  tray,
  popups,
  shakingSlot,
  onServeCustomer,
}) => {
  const trayHasItems = !isTrayEmpty(tray);

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A89F91]">
          Meja Pelanggan (Klik untuk Sajikan)
        </span>
        <span className="text-[11px] text-[#A89F91]">
          {customers.filter(Boolean).length}/{MAX_CUSTOMER_SLOTS} Kursi Terisi
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {Array.from({ length: MAX_CUSTOMER_SLOTS }).map((_, slotIdx) => {
          const customer = customers[slotIdx] ?? null;
          const slotPopups = popups.filter((p) => p.slotIndex === slotIdx);

          if (!customer) {
            return (
              <div
                key={slotIdx}
                className="relative h-[168px] sm:h-[182px] rounded-xl border border-dashed border-[#3B2F29] bg-[#1E1916]/60 flex flex-col items-center justify-center text-center p-3"
              >
                <div className="w-9 h-9 rounded-full bg-[#29211D] border border-[#3D302A] flex items-center justify-center mb-1.5 text-[#7A6F64]">
                  <Coffee className="w-4 h-4 opacity-50" />
                </div>
                <span className="text-xs text-[#7A6F64] font-medium">
                  Bangku Kosong
                </span>
                <span className="text-[10px] text-[#5C534A]">
                  Menunggu pelanggan...
                </span>

                {slotPopups.map((popup) => (
                  <PopupBadge key={popup.id} popup={popup} />
                ))}
              </div>
            );
          }

          const arch = CUSTOMER_ARCHETYPES[customer.archetype];
          const pct = Math.max(
            0,
            Math.min(100, (customer.patience / customer.maxPatience) * 100)
          );
          const isMatch = trayHasItems && doesTrayMatchOrder(tray, customer.order);
          const isShaking = shakingSlot === slotIdx;

          let barColor = 'bg-emerald-500';
          if (pct < 30) barColor = 'bg-red-500';
          else if (pct < 60) barColor = 'bg-amber-500';

          return (
            <button
              key={customer.id}
              type="button"
              onClick={() => onServeCustomer(slotIdx)}
              className={`relative text-left h-[168px] sm:h-[182px] rounded-xl p-2.5 sm:p-3 transition-all flex flex-col justify-between cursor-pointer animate-customer-enter ${
                isShaking ? 'animate-shake' : ''
              } ${
                isMatch
                  ? 'wood-panel border-2 border-amber-400 ring-2 ring-amber-400/25 shadow-lg shadow-amber-900/30'
                  : 'wood-panel border border-[#463730] hover:border-amber-600/60'
              }`}
            >
              {/* Header: Name + Archetype */}
              <div className="flex items-start justify-between gap-1.5">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-bold text-[#F3EFEA] truncate">
                      {customer.name}
                    </span>
                  </div>
                  <span
                    className={`inline-block mt-0.5 px-1.5 py-0.5 text-[10px] font-medium rounded border ${arch.badgeColor}`}
                  >
                    {arch.label}
                  </span>
                </div>

                <span className="font-mono-num text-[11px] font-bold text-amber-300 shrink-0">
                  {formatRupiah(customer.order.basePrice)}
                </span>
              </div>

              {/* Speech Bubble: Order Details */}
              <div className="my-1.5 bg-[#181512]/90 border border-[#3E312B] rounded-lg px-2.5 py-2 flex-1 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  {customer.order.drink && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-200 text-[10px] font-medium">
                      <Coffee className="w-3 h-3 text-amber-400" />
                      {formatDrinkName(customer.order.drink)}
                    </span>
                  )}
                  {(['tahu', 'tempe', 'bakwan'] as const).map((g) =>
                    customer.order.gorengan[g] > 0 ? (
                      <span
                        key={g}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-orange-500/15 text-orange-200 text-[10px] font-medium"
                      >
                        <Flame className="w-3 h-3 text-orange-400" />
                        {customer.order.gorengan[g]} {GORENGAN_LABELS[g]}
                      </span>
                    ) : null
                  )}
                  {customer.order.nasiKucing > 0 && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-stone-700/60 text-stone-200 text-[10px] font-medium">
                      <Utensils className="w-3 h-3 text-stone-300" />
                      {customer.order.nasiKucing} Nasi Kucing
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-[#A89F91] line-clamp-1">
                  {formatOrderSummary(customer.order)}
                </p>
              </div>

              {/* Footer: Patience Bar or Match CTA */}
              <div>
                {isMatch ? (
                  <div className="flex items-center justify-center gap-1.5 py-1 rounded-md bg-amber-500 text-[#181512] font-bold text-xs shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Sajikan Sekarang!
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-[#A89F91]">
                      <span>Kesabaran</span>
                      <span className="font-mono-num">{Math.ceil(customer.patience)}d</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-[#14110F] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-150 ${barColor}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {slotPopups.map((popup) => (
                <PopupBadge key={popup.id} popup={popup} />
              ))}
            </button>
          );
        })}
      </div>
    </section>
  );
};

const PopupBadge: React.FC<{ popup: FloatingPopup }> = ({ popup }) => {
  const colorClass =
    popup.tone === 'angry'
      ? 'bg-red-950/95 border-red-500/60 text-red-200'
      : popup.tone === 'tip'
      ? 'bg-amber-950/95 border-amber-400/70 text-amber-200'
      : 'bg-emerald-950/95 border-emerald-500/60 text-emerald-200';

  return (
    <div
      className={`pointer-events-none absolute left-1/2 top-4 z-20 px-2.5 py-1 rounded-full border text-xs font-bold shadow-lg whitespace-nowrap animate-float-cash ${colorClass}`}
    >
      <div>{popup.text}</div>
      {popup.subtext && (
        <div className="text-[10px] font-medium opacity-90 text-center">
          {popup.subtext}
        </div>
      )}
    </div>
  );
};
