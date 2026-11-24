import React from 'react';
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
import {
  PixelCounterPropsBar,
  PixelCustomerSprite,
  PixelDrinkIcon,
  PixelGorenganIcon,
  PixelNasiKucingIcon,
} from './PixelSprites';

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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {Array.from({ length: MAX_CUSTOMER_SLOTS }).map((_, slotIdx) => {
          const customer = customers[slotIdx] ?? null;
          const slotPopups = popups.filter((p) => p.slotIndex === slotIdx);

          if (!customer) {
            return (
              <div
                key={slotIdx}
                className="relative h-[168px] pixel-wood-dark flex flex-col items-center justify-center text-center p-3"
              >
                <span className="font-pixel text-[9px] text-[#8D6E63] mb-1">
                  KURSI {slotIdx + 1}
                </span>
                <span className="font-vt text-lg text-[#6D4C41]">
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
          const isMatch =
            trayHasItems && doesTrayMatchOrder(tray, customer.order);
          const isShaking = shakingSlot === slotIdx;
          const isImpatient = pct < 40;

          let barColor = 'bg-[#2E7D32]';
          if (pct < 30) barColor = 'bg-[#D32F2F]';
          else if (pct < 60) barColor = 'bg-[#FFB300]';

          return (
            <button
              key={customer.id}
              type="button"
              onClick={() => onServeCustomer(slotIdx)}
              className={`relative text-left h-[168px] p-2.5 flex flex-col justify-between cursor-pointer ${
                isShaking ? 'animate-pixel-shake' : ''
              } ${
                isMatch
                  ? 'bg-[#4E342E] border-3 border-[#FFB300] shadow-[4px_4px_0_#0B0908]'
                  : 'pixel-wood hover:bg-[#492F2A]'
              }`}
            >
              {/* Top: Pixel Sprite + Name + Price */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <PixelCustomerSprite
                    archetype={customer.archetype}
                    impatient={isImpatient}
                  />
                  <div className="min-w-0">
                    <div className="font-pixel text-[10px] text-[#EFEBE9] truncate">
                      {customer.name}
                    </div>
                    <div className="font-vt text-sm text-[#FFCC80] leading-tight truncate">
                      {arch.label}
                    </div>
                  </div>
                </div>

                <span className="font-pixel text-[9px] text-[#FFB300] bg-[#14110F] border border-[#0B0908] px-1.5 py-0.5 shrink-0">
                  {formatRupiah(customer.order.basePrice)}
                </span>
              </div>

              {/* Pixel Speech Bubble (Vintage Warm Paper) */}
              <div className="pixel-paper px-2 py-1.5 my-1 flex-1 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-1.5">
                  {customer.order.drink && (
                    <span className="inline-flex items-center gap-1 font-vt text-base font-bold leading-none text-[#1A120E]">
                      <PixelDrinkIcon iced={customer.order.drink.iced} />
                      {formatDrinkName(customer.order.drink)}
                    </span>
                  )}
                  {(['tahu', 'tempe', 'bakwan'] as const).map((g) =>
                    customer.order.gorengan[g] > 0 ? (
                      <span
                        key={g}
                        className="inline-flex items-center gap-1 font-vt text-base font-bold leading-none text-[#3E2723]"
                      >
                        <PixelGorenganIcon />
                        {customer.order.gorengan[g]}x{' '}
                        {GORENGAN_LABELS[g].split(' ')[0]}
                      </span>
                    ) : null
                  )}
                  {customer.order.nasiKucing > 0 && (
                    <span className="inline-flex items-center gap-1 font-vt text-base font-bold leading-none text-[#1B5E20]">
                      <PixelNasiKucingIcon />
                      {customer.order.nasiKucing}x Nasi
                    </span>
                  )}
                </div>
                <div className="font-vt text-xs text-[#5D4037] truncate mt-0.5">
                  {formatOrderSummary(customer.order)}
                </div>
              </div>

              {/* Bottom: Patience Meter or Serve CTA */}
              {isMatch ? (
                <div className="w-full py-1 bg-[#FFB300] border-2 border-[#0B0908] text-[#14110F] font-pixel text-[9px] text-center">
                  KLIK: SAJIKAN!
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-3 bg-[#14110F] border-2 border-[#0B0908] p-[1px]">
                    <div
                      className={`h-full ${barColor} transition-all duration-150`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="font-pixel text-[9px] text-[#EFEBE9] w-7 text-right">
                    {Math.ceil(customer.patience)}s
                  </span>
                </div>
              )}

              {slotPopups.map((popup) => (
                <PopupBadge key={popup.id} popup={popup} />
              ))}
            </button>
          );
        })}
      </div>

      {/* Atmospheric Countertop Props Bar */}
      <PixelCounterPropsBar />
    </section>
  );
};

const PopupBadge: React.FC<{ popup: FloatingPopup }> = ({ popup }) => {
  const style =
    popup.tone === 'angry'
      ? 'bg-[#D32F2F] text-[#EFEBE9]'
      : popup.tone === 'tip'
      ? 'bg-[#FFB300] text-[#14110F]'
      : 'bg-[#2E7D32] text-[#EFEBE9]';

  return (
    <div
      className={`pointer-events-none absolute left-1/2 top-2 z-30 px-2 py-1 border-2 border-[#0B0908] shadow-[2px_2px_0_#0B0908] whitespace-nowrap animate-arcade-float ${style}`}
    >
      <div className="font-pixel text-[10px]">
        {popup.tone === 'angry' ? `💔 ${popup.text}` : popup.text}
      </div>
      {popup.subtext && (
        <div className="font-vt text-sm leading-none text-center">
          {popup.subtext}
        </div>
      )}
    </div>
  );
};
