import React, { useState } from 'react';
import { X, Settings, DollarSign, Calendar, RefreshCw, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const AdminEditModal: React.FC = () => {
  const {
    isAdminEditOpen,
    setIsAdminEditOpen,
    products,
    updateProductPrice,
    dropDate,
    setDropDate,
    showToast
  } = useShop();

  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [newPrice, setNewPrice] = useState<number>(1899);
  const [customDate, setCustomDate] = useState('');

  if (!isAdminEditOpen) return null;

  const handlePriceUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProductId && newPrice > 0) {
      updateProductPrice(selectedProductId, newPrice);
    }
  };

  const handleDateUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (customDate) {
      setDropDate(new Date(customDate).toISOString());
      showToast('Drop timer updated successfully', 'gold');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn"
      onClick={() => setIsAdminEditOpen(false)}
    >
      <div
        className="bg-[#0D0D0D] border border-[#242424] max-w-lg w-full rounded-sm overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#1C1C1C] flex items-center justify-between bg-[#111111]">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="font-display font-extrabold text-sm tracking-[0.2em] uppercase text-white">
              OWNER PORTAL // AKASH GOSHWAMI
            </h3>
          </div>
          <button
            onClick={() => setIsAdminEditOpen(false)}
            className="p-1.5 text-[#777777] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs font-mono">
          <p className="text-[#888888] leading-relaxed">
            Welcome, Akash. Manage product pricing and drop countdown targets live without altering code. Changes persist instantly in browser storage.
          </p>

          {/* Price Editor */}
          <form onSubmit={handlePriceUpdate} className="p-4 bg-[#141414] border border-[#222222] rounded-xs space-y-3">
            <h4 className="font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#D4AF37]" />
              <span>EDIT PRODUCT PRICE</span>
            </h4>

            <div>
              <label className="block text-[10px] text-[#888888] uppercase mb-1">Select Garment:</label>
              <select
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(e.target.value);
                  const p = products.find((x) => x.id === e.target.value);
                  if (p) setNewPrice(p.price);
                }}
                className="w-full bg-[#1A1A1A] border border-[#2E2E2E] text-white p-2 rounded-xs outline-none focus:border-[#D4AF37]"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Current: ₹{p.price})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-[#888888] uppercase mb-1">New Price (INR ₹):</label>
              <input
                type="number"
                min={100}
                step={50}
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
                className="w-full bg-[#1A1A1A] border border-[#2E2E2E] text-white p-2 rounded-xs outline-none focus:border-[#D4AF37]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#D4AF37] text-black font-display font-bold uppercase tracking-wider hover:bg-white transition-colors cursor-pointer rounded-xs"
            >
              SAVE NEW PRICE
            </button>
          </form>

          {/* Countdown Date Editor */}
          <form onSubmit={handleDateUpdate} className="p-4 bg-[#141414] border border-[#222222] rounded-xs space-y-3">
            <h4 className="font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              <span>EDIT NEXT DROP LAUNCH DATE</span>
            </h4>

            <div>
              <label className="block text-[10px] text-[#888888] uppercase mb-1">
                Current Target: {new Date(dropDate).toLocaleString('en-IN')}
              </label>
              <input
                type="datetime-local"
                onChange={(e) => setCustomDate(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#2E2E2E] text-white p-2 rounded-xs outline-none focus:border-[#D4AF37]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#222222] hover:bg-[#D4AF37] hover:text-black text-white font-display font-bold uppercase tracking-wider transition-colors cursor-pointer rounded-xs"
            >
              UPDATE LAUNCH DATE
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              onClick={() => setIsAdminEditOpen(false)}
              className="text-[#666666] hover:text-white uppercase tracking-widest text-[10px]"
            >
              CLOSE OWNER PORTAL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
