import React from 'react';
import {
  Clock,
  Flame,
  Pause,
  Play,
  Star,
  Volume2,
  VolumeX,
  Wallet,
} from 'lucide-react';
import { formatRupiah } from '../constants/gameData';
import {
  formatCountdown,
  getShiftClockString,
  isPeakHour,
} from '../utils/gameLogic';

interface TopHudProps {
  day: number;
  elapsedSeconds: number;
  remainingSeconds: number;
  cash: number;
  reputation: number;
  isMuted: boolean;
  isPaused: boolean;
  onToggleMute: () => void;
  onTogglePause: () => void;
}

export const TopHud: React.FC<TopHudProps> = ({
  day,
  elapsedSeconds,
  remainingSeconds,
  cash,
  reputation,
  isMuted,
  isPaused,
  onToggleMute,
  onTogglePause,
}) => {
  const shiftClock = getShiftClockString(elapsedSeconds);
  const peak = isPeakHour(elapsedSeconds);

  return (
    <header className="wood-panel border-b border-amber-900/40 px-3 py-2 sm:px-5 sm:py-2.5 flex flex-wrap items-center justify-between gap-2 shrink-0">
      {/* Left: Brand & Day */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/35 flex items-center justify-center animate-lantern">
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 text-amber-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M9 3h6M10 3v2h4V3M7 8a5 5 0 0 1 10 0v5a5 5 0 0 1-10 0V8Z" />
            <path d="M12 8v5M8 18h8M10 21h4" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-sm sm:text-base font-bold tracking-tight text-[#F3EFEA]">
              Warung Tycoon
            </h1>
            <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Hari {day}
            </span>
          </div>
          <p className="text-[11px] text-[#A89F91] hidden sm:block">
            Midnight Shift • Angkringan &amp; Kopi Jalanan
          </p>
        </div>
      </div>

      {/* Center: Shift Clock & Countdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2 bg-[#181512]/80 border border-[#3E312B] rounded-lg px-2.5 py-1">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono-num text-sm sm:text-base font-bold text-amber-300">
              {shiftClock}
            </span>
            <span className="text-[10px] text-[#A89F91]">WIB</span>
          </div>
          <span className="text-[#4E3E36]">|</span>
          <span className="font-mono-num text-xs text-[#D6CEC2]">
            Sisa {formatCountdown(remainingSeconds)}
          </span>
        </div>

        {peak && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-950/70 border border-orange-500/40 text-orange-300 text-[11px] font-semibold animate-pulse">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden md:inline">JAM RAMAI</span>
          </div>
        )}
      </div>

      {/* Right: Cash, Reputation, Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1.5 bg-[#181512]/80 border border-[#3E312B] rounded-lg px-2.5 py-1">
          <Wallet className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono-num text-xs sm:text-sm font-bold text-emerald-300">
            {formatRupiah(cash)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-[#181512]/80 border border-[#3E312B] rounded-lg px-2.5 py-1">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="font-mono-num text-xs sm:text-sm font-bold text-[#F3EFEA]">
            {reputation}%
          </span>
        </div>

        <button
          onClick={onToggleMute}
          title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
          className="p-1.5 rounded-lg bg-[#2C221E] hover:bg-[#3A2D28] border border-[#493A32] text-[#D6CEC2] transition-colors cursor-pointer"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-stone-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-amber-400" />
          )}
        </button>

        <button
          onClick={onTogglePause}
          title={isPaused ? 'Lanjutkan' : 'Jeda'}
          className="p-1.5 rounded-lg bg-[#2C221E] hover:bg-[#3A2D28] border border-[#493A32] text-[#D6CEC2] transition-colors cursor-pointer"
        >
          {isPaused ? (
            <Play className="w-4 h-4 text-emerald-400" />
          ) : (
            <Pause className="w-4 h-4 text-amber-300" />
          )}
        </button>
      </div>
    </header>
  );
};
