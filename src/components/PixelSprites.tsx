import React from 'react';
import { CustomerArchetypeId } from '../types/game';

interface CustomerSpriteProps {
  archetype: CustomerArchetypeId;
  impatient?: boolean;
}

export const PixelCustomerSprite: React.FC<CustomerSpriteProps> = ({
  archetype,
  impatient = false,
}) => {
  return (
    <div className="relative w-12 h-12 shrink-0 animate-pixel-bob">
      <svg
        viewBox="0 0 16 16"
        className="w-full h-full"
        shapeRendering="crispEdges"
      >
        {/* Outline & Shadow */}
        {archetype === 'ojol' && (
          <>
            {/* Green Helmet */}
            <rect x="4" y="1" width="8" height="2" fill="#0B0908" />
            <rect x="3" y="3" width="10" height="4" fill="#0B0908" />
            <rect x="4" y="2" width="8" height="2" fill="#2E7D32" />
            <rect x="5" y="2" width="6" height="1" fill="#4CAF50" />
            {/* Helmet Visor */}
            <rect x="4" y="4" width="8" height="2" fill="#1B5E20" />
            <rect x="5" y="4" width="6" height="1" fill="#81C784" />
            {/* Face */}
            <rect x="4" y="6" width="8" height="3" fill="#E0AC69" />
            <rect x="5" y="7" width="1" height="1" fill="#0B0908" />
            <rect x="9" y="7" width="1" height="1" fill="#0B0908" />
            {/* Green Ojol Jacket */}
            <rect x="2" y="9" width="12" height="6" fill="#0B0908" />
            <rect x="3" y="10" width="10" height="5" fill="#2E7D32" />
            <rect x="6" y="10" width="4" height="5" fill="#1B5E20" />
            <rect x="3" y="11" width="2" height="1" fill="#A5D6A7" />
            {/* Checking Phone */}
            <rect x="10" y="11" width="3" height="3" fill="#0B0908" />
            <rect x="11" y="11" width="2" height="2" fill="#80DEEA" />
          </>
        )}

        {archetype === 'mahasiswa' && (
          <>
            {/* Messy Hair */}
            <rect x="3" y="1" width="10" height="5" fill="#0B0908" />
            <rect x="4" y="2" width="8" height="2" fill="#2B1D16" />
            <rect x="3" y="3" width="2" height="2" fill="#2B1D16" />
            <rect x="11" y="2" width="2" height="2" fill="#2B1D16" />
            {/* Face */}
            <rect x="4" y="4" width="8" height="5" fill="#F1C27D" />
            <rect x="5" y="6" width="1" height="1" fill="#0B0908" />
            <rect x="10" y="6" width="1" height="1" fill="#0B0908" />
            {/* Tired under-eye */}
            <rect x="5" y="7" width="1" height="1" fill="#C68642" />
            <rect x="10" y="7" width="1" height="1" fill="#C68642" />
            {/* Cozy Hoodie */}
            <rect x="2" y="9" width="12" height="6" fill="#0B0908" />
            <rect x="3" y="10" width="10" height="5" fill="#8D3B2A" />
            <rect x="5" y="10" width="6" height="2" fill="#A84C38" />
            {/* Hoodie strings */}
            <rect x="6" y="11" width="1" height="3" fill="#EFEBE9" />
            <rect x="9" y="11" width="1" height="3" fill="#EFEBE9" />
          </>
        )}

        {archetype === 'pekerja' && (
          <>
            {/* Neat Cap / Hair */}
            <rect x="4" y="1" width="8" height="4" fill="#0B0908" />
            <rect x="4" y="2" width="8" height="2" fill="#37474F" />
            <rect x="3" y="4" width="10" height="1" fill="#263238" />
            {/* Face */}
            <rect x="4" y="5" width="8" height="4" fill="#D2996C" />
            <rect x="5" y="6" width="1" height="1" fill="#0B0908" />
            <rect x="10" y="6" width="1" height="1" fill="#0B0908" />
            {/* Mustache */}
            <rect x="6" y="8" width="4" height="1" fill="#2B1D16" />
            {/* Worn Collar Shirt */}
            <rect x="2" y="9" width="12" height="6" fill="#0B0908" />
            <rect x="3" y="10" width="10" height="5" fill="#546E7A" />
            {/* Collar */}
            <rect x="5" y="10" width="2" height="2" fill="#CFD8DC" />
            <rect x="9" y="10" width="2" height="2" fill="#CFD8DC" />
            <rect x="7" y="11" width="2" height="4" fill="#37474F" />
          </>
        )}
      </svg>

      {/* Sweat drop when impatient */}
      {impatient && (
        <svg
          viewBox="0 0 8 8"
          className="w-4 h-4 absolute -top-1 -right-1 animate-pixel-sweat"
          shapeRendering="crispEdges"
        >
          <rect x="3" y="1" width="2" height="2" fill="#29B6F6" />
          <rect x="2" y="3" width="4" height="3" fill="#29B6F6" />
          <rect x="3" y="3" width="1" height="2" fill="#E1F5FE" />
        </svg>
      )}
    </div>
  );
};

export const PixelLantern: React.FC = () => (
  <div className="relative flex flex-col items-center pointer-events-none select-none animate-lantern-sway">
    <svg
      viewBox="0 0 16 20"
      className="w-8 h-10"
      shapeRendering="crispEdges"
    >
      {/* Hanging chain */}
      <rect x="7" y="0" width="2" height="3" fill="#0B0908" />
      <rect x="7" y="1" width="1" height="2" fill="#8D6E63" />
      {/* Top cap */}
      <rect x="4" y="3" width="8" height="2" fill="#0B0908" />
      <rect x="5" y="3" width="6" height="1" fill="#5D4037" />
      {/* Glass & Flame */}
      <rect x="4" y="5" width="8" height="9" fill="#0B0908" />
      <rect x="5" y="6" width="6" height="7" fill="#4E342E" />
      <rect x="6" y="7" width="4" height="5" fill="#FFB300" />
      <rect x="7" y="8" width="2" height="3" fill="#FFF8E1" />
      {/* Base */}
      <rect x="3" y="14" width="10" height="3" fill="#0B0908" />
      <rect x="4" y="15" width="8" height="1" fill="#6D4C41" />
    </svg>
  </div>
);

export const PixelDrinkIcon: React.FC<{ iced?: boolean; steaming?: boolean }> = ({
  iced = false,
  steaming = true,
}) => (
  <div className="relative w-5 h-5 inline-flex items-center justify-center shrink-0">
    {steaming && !iced && (
      <svg
        viewBox="0 0 8 6"
        className="w-3 h-2.5 absolute -top-2 left-1 animate-pixel-steam"
        shapeRendering="crispEdges"
      >
        <rect x="1" y="2" width="1" height="3" fill="#EFEBE9" />
        <rect x="4" y="1" width="1" height="4" fill="#EFEBE9" />
      </svg>
    )}
    <svg viewBox="0 0 12 12" className="w-5 h-5" shapeRendering="crispEdges">
      <rect x="2" y="3" width="7" height="8" fill="#0B0908" />
      <rect x="9" y="5" width="2" height="4" fill="#0B0908" />
      <rect x="9" y="6" width="1" height="2" fill="#D7CCC8" />
      <rect x="3" y="4" width="5" height="6" fill={iced ? '#4FC3F7' : '#EFEBE9'} />
      <rect x="3" y="5" width="5" height="4" fill={iced ? '#0288D1' : '#5D4037'} />
      {iced && <rect x="4" y="4" width="2" height="2" fill="#E1F5FE" />}
    </svg>
  </div>
);

export const PixelGorenganIcon: React.FC = () => (
  <svg viewBox="0 0 12 12" className="w-4 h-4 shrink-0" shapeRendering="crispEdges">
    <rect x="2" y="3" width="8" height="6" fill="#0B0908" />
    <rect x="3" y="4" width="6" height="4" fill="#FFB300" />
    <rect x="4" y="5" width="4" height="2" fill="#F57C00" />
    <rect x="4" y="4" width="2" height="1" fill="#FFE082" />
  </svg>
);

export const PixelNasiKucingIcon: React.FC = () => (
  <svg viewBox="0 0 12 12" className="w-4 h-4 shrink-0" shapeRendering="crispEdges">
    <rect x="2" y="4" width="8" height="6" fill="#0B0908" />
    <rect x="4" y="2" width="4" height="2" fill="#0B0908" />
    <rect x="3" y="5" width="6" height="4" fill="#2E7D32" />
    <rect x="5" y="3" width="2" height="2" fill="#43A047" />
    <rect x="3" y="6" width="6" height="1" fill="#D32F2F" />
  </svg>
);

export const PixelCoinIcon: React.FC = () => (
  <svg viewBox="0 0 12 12" className="w-4 h-4 shrink-0" shapeRendering="crispEdges">
    <rect x="2" y="1" width="8" height="10" fill="#0B0908" />
    <rect x="3" y="2" width="6" height="8" fill="#FFB300" />
    <rect x="4" y="3" width="4" height="6" fill="#FFD54F" />
    <rect x="5" y="4" width="2" height="4" fill="#F57F17" />
  </svg>
);

export const PixelClockIcon: React.FC = () => (
  <svg viewBox="0 0 12 12" className="w-4 h-4 shrink-0" shapeRendering="crispEdges">
    <rect x="2" y="1" width="8" height="10" fill="#0B0908" />
    <rect x="3" y="2" width="6" height="8" fill="#EFEBE9" />
    <rect x="5" y="3" width="1" height="3" fill="#0B0908" />
    <rect x="6" y="6" width="2" height="1" fill="#D32F2F" />
  </svg>
);

export const PixelCassetteIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg viewBox="0 0 16 12" className="w-5 h-4 shrink-0" shapeRendering="crispEdges">
    <rect x="1" y="1" width="14" height="10" fill="#0B0908" />
    <rect x="2" y="2" width="12" height="8" fill={active ? '#FFB300' : '#5D4037'} />
    <rect x="3" y="3" width="10" height="4" fill="#EFEBE9" />
    <rect x="4" y="4" width="2" height="2" fill="#0B0908" />
    <rect x="10" y="4" width="2" height="2" fill="#0B0908" />
    <rect x="6" y="4" width="4" height="2" fill="#3E2723" />
    <rect x="4" y="8" width="8" height="2" fill="#261714" />
  </svg>
);

export const PixelCounterPropsBar: React.FC = () => (
  <div className="hidden sm:flex items-center justify-between px-3 py-1.5 bg-[#261714] border-2 border-[#0B0908] text-[11px] font-vt text-[#D7CCC8]">
    {/* Glass display case with stacked gorengan */}
    <div className="flex items-center gap-2">
      <svg viewBox="0 0 24 14" className="w-9 h-5" shapeRendering="crispEdges">
        <rect x="0" y="0" width="24" height="14" fill="#0B0908" />
        <rect x="1" y="1" width="22" height="12" fill="#4E342E" />
        <rect x="2" y="2" width="20" height="9" fill="#80CBC4" fillOpacity="0.25" />
        {/* Gorengan stacks */}
        <rect x="3" y="7" width="4" height="3" fill="#FFB300" />
        <rect x="4" y="5" width="4" height="3" fill="#F57C00" />
        <rect x="10" y="7" width="4" height="3" fill="#FFB300" />
        <rect x="11" y="5" width="4" height="3" fill="#FFE082" />
        <rect x="17" y="7" width="4" height="3" fill="#F57C00" />
      </svg>
      <span>Etalase Gorengan</span>
    </div>

    {/* Skewer racks (Sate usus & sate puyuh) */}
    <div className="flex items-center gap-2">
      <svg viewBox="0 0 24 14" className="w-9 h-5" shapeRendering="crispEdges">
        <rect x="1" y="10" width="22" height="3" fill="#0B0908" />
        <rect x="2" y="11" width="20" height="1" fill="#8D6E63" />
        {/* Skewers */}
        <rect x="4" y="2" width="1" height="9" fill="#EFEBE9" />
        <rect x="3" y="3" width="3" height="2" fill="#A1887F" />
        <rect x="3" y="6" width="3" height="2" fill="#8D6E63" />
        <rect x="11" y="2" width="1" height="9" fill="#EFEBE9" />
        <rect x="10" y="3" width="3" height="2" fill="#FFB300" />
        <rect x="10" y="6" width="3" height="2" fill="#F57C00" />
        <rect x="18" y="2" width="1" height="9" fill="#EFEBE9" />
        <rect x="17" y="3" width="3" height="2" fill="#A1887F" />
        <rect x="17" y="6" width="3" height="2" fill="#6D4C41" />
      </svg>
      <span>Sate Usus &amp; Puyuh</span>
    </div>

    {/* Ingredient Jars */}
    <div className="flex items-center gap-2">
      <svg viewBox="0 0 24 14" className="w-9 h-5" shapeRendering="crispEdges">
        <rect x="1" y="3" width="6" height="10" fill="#0B0908" />
        <rect x="2" y="5" width="4" height="7" fill="#3E2723" />
        <rect x="2" y="2" width="4" height="2" fill="#D7CCC8" />
        <rect x="9" y="3" width="6" height="10" fill="#0B0908" />
        <rect x="10" y="5" width="4" height="7" fill="#FFB300" />
        <rect x="10" y="2" width="4" height="2" fill="#D7CCC8" />
        <rect x="17" y="3" width="6" height="10" fill="#0B0908" />
        <rect x="18" y="5" width="4" height="7" fill="#EFEBE9" />
        <rect x="18" y="2" width="4" height="2" fill="#D7CCC8" />
      </svg>
      <span>Toples Kopi, Jahe, Gula</span>
    </div>
  </div>
);
