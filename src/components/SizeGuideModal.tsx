import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useShop();
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');
  const [garmentType, setGarmentType] = useState<'TEES' | 'HOODIES' | 'PANTS'>('TEES');

  if (!isSizeGuideOpen) return null;

  const teeSizes = [
    { size: 'S', chestIn: '42', chestCm: '107', lengthIn: '29', lengthCm: '74', shoulderIn: '21', shoulderCm: '53' },
    { size: 'M', chestIn: '44', chestCm: '112', lengthIn: '30', lengthCm: '76', shoulderIn: '22', shoulderCm: '56' },
    { size: 'L', chestIn: '46', chestCm: '117', lengthIn: '31', lengthCm: '79', shoulderIn: '23', shoulderCm: '58' },
    { size: 'XL', chestIn: '48', chestCm: '122', lengthIn: '32', lengthCm: '81', shoulderIn: '24', shoulderCm: '61' },
    { size: 'XXL', chestIn: '50', chestCm: '127', lengthIn: '33', lengthCm: '84', shoulderIn: '25', shoulderCm: '64' }
  ];

  const hoodieSizes = [
    { size: 'S', chestIn: '46', chestCm: '117', lengthIn: '27.5', lengthCm: '70', shoulderIn: '23', shoulderCm: '58' },
    { size: 'M', chestIn: '48', chestCm: '122', lengthIn: '28.5', lengthCm: '72', shoulderIn: '24', shoulderCm: '61' },
    { size: 'L', chestIn: '50', chestCm: '127', lengthIn: '29.5', lengthCm: '75', shoulderIn: '25', shoulderCm: '63' },
    { size: 'XL', chestIn: '52', chestCm: '132', lengthIn: '30.5', lengthCm: '77', shoulderIn: '26', shoulderCm: '66' },
    { size: 'XXL', chestIn: '54', chestCm: '137', lengthIn: '31.5', lengthCm: '80', shoulderIn: '27', shoulderCm: '68' }
  ];

  const pantSizes = [
    { size: 'S', waistIn: '28-30', waistCm: '71-76', lengthIn: '40', lengthCm: '101', inseamIn: '29', inseamCm: '73' },
    { size: 'M', waistIn: '31-33', waistCm: '78-84', lengthIn: '41', lengthCm: '104', inseamIn: '30', inseamCm: '76' },
    { size: 'L', waistIn: '34-36', waistCm: '86-91', lengthIn: '42', lengthCm: '107', inseamIn: '30.5', inseamCm: '77' },
    { size: 'XL', waistIn: '37-39', waistCm: '94-99', lengthIn: '43', lengthCm: '109', inseamIn: '31', inseamCm: '79' },
    { size: 'XXL', waistIn: '40-42', waistCm: '101-107', lengthIn: '44', lengthCm: '112', inseamIn: '31.5', inseamCm: '80' }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn"
      onClick={() => setIsSizeGuideOpen(false)}
    >
      <div
        className="bg-[#0D0D0D] border border-[#262626] max-w-2xl w-full rounded-sm p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#222222] pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <span>STREETWEAR SPECIFICATION</span>
            </div>
            <h3 className="font-display font-extrabold text-xl sm:text-2xl tracking-[0.15em] uppercase text-white mt-1">
              SIZE & MEASUREMENT GUIDE
            </h3>
          </div>
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="p-2 text-[#777777] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fit Philosophy Note */}
        <div className="p-4 bg-[#141414] border border-[#222222] rounded-xs mb-6 text-xs text-[#A0A0A0] leading-relaxed">
          <p className="font-semibold text-white uppercase tracking-wider mb-1">
            Note on VOID Silhouette:
          </p>
          VOID WEAR garments are intentionally engineered with an <span className="text-[#D4AF37]">oversized, boxy dropped-shoulder fit</span>. For standard oversized styling, select your true size. For a more conventional/fitted look, size down one step.
        </div>

        {/* Selectors: Garment Type & Unit */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          {/* Garment Tabs */}
          <div className="flex bg-[#161616] p-1 rounded-xs border border-[#242424]">
            {(['TEES', 'HOODIES', 'PANTS'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setGarmentType(t)}
                className={`px-4 py-1.5 text-[11px] font-mono tracking-widest uppercase transition-colors rounded-xs cursor-pointer ${
                  garmentType === t
                    ? 'bg-[#D4AF37] text-black font-bold'
                    : 'text-[#888888] hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Unit Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#777777] uppercase font-mono">Unit:</span>
            <div className="flex bg-[#161616] p-1 rounded-xs border border-[#242424]">
              <button
                onClick={() => setUnit('inches')}
                className={`px-3 py-1 text-[11px] font-mono uppercase cursor-pointer rounded-xs ${
                  unit === 'inches' ? 'bg-white text-black font-bold' : 'text-[#888888]'
                }`}
              >
                INCHES (IN)
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 text-[11px] font-mono uppercase cursor-pointer rounded-xs ${
                  unit === 'cm' ? 'bg-white text-black font-bold' : 'text-[#888888]'
                }`}
              >
                CENTIMETERS (CM)
              </button>
            </div>
          </div>
        </div>

        {/* Measurement Table */}
        <div className="overflow-x-auto border border-[#222222] rounded-xs mb-6">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#141414] text-[#D4AF37] uppercase border-b border-[#222222]">
              <tr>
                <th className="p-3">SIZE</th>
                {garmentType === 'PANTS' ? (
                  <>
                    <th className="p-3">WAIST</th>
                    <th className="p-3">OUTSEAM</th>
                    <th className="p-3">INSEAM</th>
                  </>
                ) : (
                  <>
                    <th className="p-3">CHEST (PIT-TO-PIT)</th>
                    <th className="p-3">BODY LENGTH</th>
                    <th className="p-3">SHOULDER WIDTH</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A] text-white">
              {(garmentType === 'PANTS' ? pantSizes : garmentType === 'HOODIES' ? hoodieSizes : teeSizes).map(
                (row: any) => (
                  <tr key={row.size} className="hover:bg-[#161616] transition-colors">
                    <td className="p-3 font-bold text-[#D4AF37]">{row.size}</td>
                    {garmentType === 'PANTS' ? (
                      <>
                        <td className="p-3">{unit === 'inches' ? `${row.waistIn}"` : `${row.waistCm} cm`}</td>
                        <td className="p-3">{unit === 'inches' ? `${row.lengthIn}"` : `${row.lengthCm} cm`}</td>
                        <td className="p-3">{unit === 'inches' ? `${row.inseamIn}"` : `${row.inseamCm} cm`}</td>
                      </>
                    ) : (
                      <>
                        <td className="p-3">{unit === 'inches' ? `${row.chestIn}"` : `${row.chestCm} cm`}</td>
                        <td className="p-3">{unit === 'inches' ? `${row.lengthIn}"` : `${row.lengthCm} cm`}</td>
                        <td className="p-3">{unit === 'inches' ? `${row.shoulderIn}"` : `${row.shoulderCm} cm`}</td>
                      </>
                    )}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#777777] gap-3">
          <span>Need custom tailoring advice? Chat with our stylist on WhatsApp.</span>
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="w-full sm:w-auto px-6 py-2 bg-[#222222] text-white font-semibold uppercase rounded-xs hover:bg-white hover:text-black transition-colors cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
