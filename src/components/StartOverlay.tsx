import React from 'react';
import { Coffee, Flame, Play, RotateCcw, Sparkles, Trophy } from 'lucide-react';
import { formatRupiah } from '../constants/gameData';
import { SavedProgress } from '../types/game';

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
    <div className="fixed inset-0 z-50 bg-[#120F0D]/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="wood-panel max-w-lg w-full rounded-2xl border border-amber-700/40 p-6 sm:p-7 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center animate-lantern">
            <Coffee className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-400">
              Angkringan Midnight Sim
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F3EFEA]">
              Warung Tycoon
            </h1>
          </div>
        </div>

        <p className="text-sm text-[#D6CEC2] leading-relaxed mb-5">
          Kelola warung kopi &amp; angkringan tengah malam dari pukul{' '}
          <span className="text-amber-300 font-semibold">00:00 hingga 05:00</span>{' '}
          (5 menit waktu nyata). Racik minuman hangat, goreng tahu/tempe/bakwan
          tanpa gosong, dan layani pelanggan sebelum kesabaran mereka habis!
        </p>

        <div className="grid grid-cols-3 gap-2.5 mb-5">
          <div className="rounded-xl bg-[#181512]/90 border border-[#3E312B] p-3 text-center">
            <Coffee className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <div className="text-xs font-semibold text-[#F3EFEA]">1. Racik</div>
            <div className="text-[10px] text-[#A89F91]">
              Rebus air &amp; seduh kopi/teh/jahe
            </div>
          </div>
          <div className="rounded-xl bg-[#181512]/90 border border-[#3E312B] p-3 text-center">
            <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1" />
            <div className="text-xs font-semibold text-[#F3EFEA]">2. Goreng</div>
            <div className="text-[10px] text-[#A89F91]">
              Angkat pas matang, jangan gosong
            </div>
          </div>
          <div className="rounded-xl bg-[#181512]/90 border border-[#3E312B] p-3 text-center">
            <Sparkles className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <div className="text-xs font-semibold text-[#F3EFEA]">3. Sajikan</div>
            <div className="text-[10px] text-[#A89F91]">
              Cocokkan nampan &amp; raih tip kilat
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-[#181512]/80 border border-[#3E312B] px-4 py-2.5 mb-5 text-xs">
          <div className="flex items-center gap-2 text-[#D6CEC2]">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Rekor Kas:</span>
            <strong className="font-mono-num text-emerald-300">
              {formatRupiah(progress.highScoreCash)}
            </strong>
          </div>
          <div className="text-[#A89F91]">
            Hari Terbuka:{' '}
            <strong className="text-amber-300">Hari {progress.unlockedDay}</strong>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onStartDay}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#181512] font-bold text-sm transition-colors cursor-pointer shadow-lg shadow-amber-900/30"
          >
            <Play className="w-4 h-4 fill-current" />
            Buka Warung — Hari {progress.unlockedDay}
          </button>

          {progress.unlockedDay > 1 && (
            <button
              type="button"
              onClick={onResetSave}
              title="Reset progres ke Hari 1"
              className="p-3 rounded-xl bg-[#2C221E] hover:bg-[#3A2D28] border border-[#4D3D35] text-[#D6CEC2] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
