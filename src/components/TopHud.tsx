import React from 'react';
import { formatRupiah } from '../constants/gameData';
import {
  formatCountdown,
  getShiftClockString,
  isPeakHour,
} from '../utils/gameLogic';
import {
  PixelCassetteIcon,
  PixelClockIcon,
  PixelCoinIcon,
  PixelLantern,
} from './PixelSprites';

interface TopHudProps {
  day: number;
  elapsedSeconds: number;
  remainingSeconds: number;
  cash: number;
  reputation: number;
  isMuted: boolean;
  bgmEnabled: boolean;
  isPaused: boolean;
  onToggleMute: () => void;
  onToggleBgm: () => void;
  onTogglePause: () => void;
}

export const TopHud: React.FC<TopHudProps> = ({
  day,
  elapsedSeconds,
  remainingSeconds,
  cash,
  reputation,
  isMuted,
  bgmEnabled,
  isPaused,
  onToggleMute,
  onToggleBgm,
  onTogglePause,
}) => {
  const shiftClock = getShiftClockString(elapsedSeconds);
  const peak = isPeakHour(elapsedSeconds);

  return (
    <header className="relative pixel-wood px-3 py-2 sm:px-4 flex flex-wrap items-center justify-between gap-2 shrink-0">
      {/* Hanging Kerosene Lantern at Top-Center */}
      <div className="hidden xl:block absolute left-1/2 -translate-x-1/2 -bottom-9 z-20">
        <PixelLantern />
      </div>

      {/* Left: Title & Day */}
      <div className="flex items-center gap-2.5">
        <div className="bg-[#14110F] border-2 border-[#0B0908] px-2 py-1">
          <span className="font-pixel text-[10px] sm:text-xs text-[#FFB300]">
            WARUNG TYCOON
          </span>
        </div>
        <span className="font-pixel text-[9px] sm:text-[10px] px-2 py-1 bg-[#2E7D32] text-[#EFEBE9] border-2 border-[#0B0908]">
          HARI {day}
        </span>
      </div>

      {/* Center: Clock & Countdown */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 bg-[#14110F] border-2 border-[#0B0908] px-2.5 py-1">
          <PixelClockIcon />
          <span className="font-pixel text-[11px] text-[#FFB300]">
            {shiftClock}
          </span>
          <span className="font-vt text-base text-[#D7CCC8]">
            (SISA {formatCountdown(remainingSeconds)})
          </span>
        </div>

        {peak && (
          <div className="px-2 py-1 bg-[#D32F2F] border-2 border-[#0B0908] font-pixel text-[9px] text-[#EFEBE9] animate-pulse">
            JAM RAMAI!
          </div>
        )}
      </div>

      {/* Right: Cash, Rep, Cassette BGM & Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 bg-[#14110F] border-2 border-[#0B0908] px-2 py-1">
          <PixelCoinIcon />
          <span className="font-pixel text-[10px] sm:text-[11px] text-[#FFB300]">
            {formatRupiah(cash)}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-[#14110F] border-2 border-[#0B0908] px-2 py-1">
          <span className="text-xs">★</span>
          <span className="font-pixel text-[10px] text-[#EFEBE9]">
            {reputation}%
          </span>
        </div>

        {/* Nostalgic Cassette Player BGM Toggle */}
        <button
          type="button"
          onClick={onToggleBgm}
          title="BGM On/Off (Animal Crossing Style Synth)"
          className={`pixel-btn flex items-center gap-1.5 px-2 py-1 cursor-pointer ${
            bgmEnabled
              ? 'bg-[#2E7D32] text-[#EFEBE9]'
              : 'bg-[#261714] text-[#A1887F]'
          }`}
        >
          <PixelCassetteIcon active={bgmEnabled} />
          <span className="font-vt text-sm sm:text-base leading-none">
            🎵 BGM {bgmEnabled ? 'On' : 'Off'} (Animal Crossing Style Synth)
          </span>
        </button>

        <button
          type="button"
          onClick={onToggleMute}
          title={isMuted ? 'Nyalakan SFX' : 'Matikan SFX'}
          className="pixel-btn px-2 py-1 bg-[#261714] text-[#EFEBE9] font-pixel text-[9px] cursor-pointer"
        >
          {isMuted ? 'SFX:OFF' : 'SFX:ON'}
        </button>

        <button
          type="button"
          onClick={onTogglePause}
          className="pixel-btn px-2 py-1 bg-[#FFB300] text-[#14110F] font-pixel text-[9px] cursor-pointer"
        >
          {isPaused ? 'LANJUT' : 'JEDA'}
        </button>
      </div>
    </header>
  );
};
