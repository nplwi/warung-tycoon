import React from 'react';
import { formatRupiah } from '../constants/gameData';
import { SavedProgress } from '../types/game';
import {
  PixelCoinIcon,
  PixelCustomerSprite,
  PixelLantern,
} from './PixelSprites';

interface StartOverlayProps {
  progress: SavedProgress;
  onStartDay: () => void;
  onResetSave: () => void;
}

export const StartOverlay: React.FC<StartOverlayProps> = ({
  progress,
  onStartDay,
  onResetSave,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#14110F]/92 flex items-center justify-center p-4">
      <div className="pixel-chalkboard max-w-xl w-full p-5 sm:p-7">
        <div className="flex items-center justify-between gap-3 border-b-2 border-[#3E4C42] pb-4 mb-4">
          <div>
            <div className="font-pixel text-[10px] text-[#FFB300] mb-1.5">
              ANGKRINGAN MIDNIGHT SIM
            </div>
            <h1 className="font-pixel text-lg sm:text-xl text-[#EFEBE9] leading-snug">
              WARUNG TYCOON
            </h1>
            <div className="font-vt text-xl text-[#A5D6A7]">
              Shift Tengah Malam (00:00 - 05:00 WIB)
            </div>
          </div>
          <PixelLantern />
        </div>

        {/* Pixel Cast Preview */}
        <div className="flex items-center justify-around bg-[#14110F] border-2 border-[#0B0908] py-3 px-2 mb-4">
          <div className="flex flex-col items-center gap-1">
            <PixelCustomerSprite archetype="ojol" />
            <span className="font-vt text-sm text-[#81C784]">Ojol Malam</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <PixelCustomerSprite archetype="mahasiswa" />
            <span className="font-vt text-sm text-[#FFAB91]">Mahasiswa</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <PixelCustomerSprite archetype="pekerja" />
            <span className="font-vt text-sm text-[#B0BEC5]">Pekerja Shift</span>
          </div>
        </div>

        <div className="pixel-paper p-3 mb-4 font-vt text-lg leading-snug">
          <div>1. Rebus air di teko &amp; racik kopi, teh, atau susu jahe.</div>
          <div>2. Goreng tahu, tempe, bakwan — angkat sebelum gosong!</div>
          <div>3. Cocokkan nampan saji &amp; klik pelanggan untuk melayani.</div>
        </div>

        <div className="flex items-center justify-between bg-[#14110F] border-2 border-[#0B0908] px-3 py-2 mb-5">
          <div className="flex items-center gap-2">
            <PixelCoinIcon />
            <span className="font-vt text-lg text-[#D7CCC8]">Rekor Kas:</span>
            <span className="font-pixel text-[10px] text-[#FFB300]">
              {formatRupiah(progress.highScoreCash)}
            </span>
          </div>
          <span className="font-pixel text-[10px] text-[#A5D6A7]">
            HARI {progress.unlockedDay}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onStartDay}
            className="pixel-btn flex-1 py-3 px-4 bg-[#FFB300] hover:bg-[#FFC107] text-[#14110F] font-pixel text-xs cursor-pointer"
          >
            BUKA WARUNG (HARI {progress.unlockedDay})
          </button>

          {progress.unlockedDay > 1 && (
            <button
              type="button"
              onClick={onResetSave}
              className="pixel-btn py-3 px-3 bg-[#3E2723] text-[#EFEBE9] font-pixel text-[10px] cursor-pointer"
              title="Reset progres ke Hari 1"
            >
              RESET
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
