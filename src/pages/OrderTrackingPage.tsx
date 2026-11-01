import React, { useState } from 'react';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  ShieldCheck,
  AlertCircle,
  MessageSquare,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { BRAND_INFO } from '../data/products';
import { formatPriceINR } from '../utils/productUtils';

const TIMELINE_STAGES = [
  { key: 'CONFIRMED', label: 'ORDER CONFIRMED', icon: CheckCircle2 },
  { key: 'PROCESSING', label: 'ATELIER PROCESSING', icon: Clock },
  { key: 'PRINTING', label: 'QIKINK PRINTING', icon: Printer },
  { key: 'PACKED', label: 'PACKED & SEALED', icon: Package },
  { key: 'SHIPPED', label: 'IN TRANSIT // AIR', icon: Truck },
  { key: 'DELIVERED', label: 'DELIVERED', icon: ShieldCheck }
];

export const OrderTrackingPage: React.FC = () => {
  const { trackOrder, openWhatsAppSupport, navigate } = useShop();

  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackedOrder, setTrackedOrder] = useState<any | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await trackOrder(searchInput.trim());
      setTrackedOrder(data);
    } catch (err: any) {
      setError(err.message || 'No active order matching this ID or phone number.');
      setTrackedOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getStageIndex = (status: string) => {
    const norm = status?.toUpperCase() || '';
    if (norm === 'DELIVERED') return 5;
    if (norm === 'SHIPPED' || norm === 'DISPATCHED') return 4;
    if (norm === 'PACKED') return 3;
    if (norm === 'PRINTING' || norm === 'SENT_TO_QIKINK') return 2;
    if (norm === 'PROCESSING' || norm === 'PREPARING') return 1;
    return 0; // CONFIRMED or PAID
  };

  const activeStage = trackedOrder ? getStageIndex(trackedOrder.status) : 0;

  return (
    <div className="pt-24 pb-32 bg-[#050505] text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumbs */}
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-[#777777] uppercase mb-4">
          <button onClick={() => navigate('/')} className="hover:text-white cursor-pointer">
            HOME
          </button>
          <span>/</span>
          <span className="text-[#D4AF37]">TRACK YOUR ORDER</span>
        </div>

        {/* Section Header */}
        <div className="border-b border-[#1A1A1A] pb-8 mb-10">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl tracking-[0.14em] uppercase text-white mb-2">
            CONCIERGE ORDER TRACKING
          </h1>
          <p className="font-luxury text-xs sm:text-sm tracking-[0.25em] text-[#888888] uppercase">
            LIVE ATELIER & QIKINK DISPATCH STATUS
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-[#0A0A0A] border border-[#222222] p-6 sm:p-8 rounded-sm mb-10 shadow-2xl">
          <form onSubmit={handleSearch} className="space-y-4">
            <label className="block text-xs font-mono font-bold tracking-widest text-[#D4AF37] uppercase">
              ENTER VOID WEAR ORDER ID (E.G. VW-104928) OR MOBILE NUMBER:
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  required
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="VW-123456 or 9876543210"
                  className="w-full bg-[#121212] border border-[#2E2E2E] focus:border-[#D4AF37] p-3 pl-10 text-sm font-mono text-white placeholder-[#555555] rounded-xs uppercase outline-hidden"
                />
                <Search className="w-4 h-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-[#D4AF37] text-black hover:bg-white transition-colors text-xs font-mono font-bold tracking-widest uppercase rounded-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'LOCATING...' : 'TRACK ORDER'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] font-mono text-[#666666]">
              Your Order ID was provided on your confirmation screen and via SMS/WhatsApp.
            </p>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs font-mono rounded-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Tracked Order Result Container */}
        {trackedOrder && (
          <div className="bg-[#0B0B0B] border border-[#222222] rounded-sm p-6 sm:p-8 space-y-8 animate-fadeIn shadow-2xl">
            {/* Top Order Summary Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1C1C1C]">
              <div>
                <span className="text-[10px] font-mono text-[#777777] uppercase block">
                  ORDER REFERENCE
                </span>
                <h2 className="text-xl font-mono font-bold text-white tracking-wider">
                  {trackedOrder.orderId}
                </h2>
                <span className="text-xs font-mono text-[#888888]">
                  Placed on {trackedOrder.createdAt}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-[#D4AF37]/15 border border-[#D4AF37]/50 text-[#D4AF37] font-mono font-bold text-xs uppercase tracking-wider rounded-xs">
                  {trackedOrder.status}
                </span>
                <span className="text-sm font-mono font-bold text-white">
                  {formatPriceINR(trackedOrder.total)}
                </span>
              </div>
            </div>

            {/* Visual 6-Stage Timeline */}
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase block mb-6">
                DISPATCH PROGRESSION
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {TIMELINE_STAGES.map((stage, idx) => {
                  const Icon = stage.icon;
                  const isCompleted = idx <= activeStage;
                  const isCurrent = idx === activeStage;

                  return (
                    <div
                      key={stage.key}
                      className={`p-3 rounded-xs border text-center transition-all ${
                        isCurrent
                          ? 'bg-[#181818] border-[#D4AF37] ring-1 ring-[#D4AF37]'
                          : isCompleted
                          ? 'bg-[#121212] border-[#2C2C2C] text-white'
                          : 'bg-[#0E0E0E] border-[#1A1A1A] text-[#555555]'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                          isCompleted
                            ? 'bg-[#D4AF37] text-black font-bold'
                            : 'bg-[#181818] text-[#555555]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono font-bold block uppercase leading-tight">
                        {stage.label}
                      </span>
                      {isCurrent && (
                        <span className="text-[8px] font-mono text-[#D4AF37] tracking-wider block mt-1">
                          ● CURRENT
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Courier & Tracking Number Badge */}
            {(trackedOrder.trackingNumber || trackedOrder.courier) && (
              <div className="p-4 bg-[#121212] border border-[#2B2B2B] rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-black rounded-xs border border-[#333333]">
                    <Truck className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#777777] uppercase block">
                      AIRWAY BILL // COURIER
                    </span>
                    <span className="font-mono text-sm text-white font-bold">
                      {trackedOrder.courier || 'Delhivery Express'} — {trackedOrder.trackingNumber}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    window.open(
                      `https://www.delhivery.com/track/package/${trackedOrder.trackingNumber}`,
                      '_blank'
                    )
                  }
                  className="px-3.5 py-2 bg-[#1C1C1C] hover:bg-[#D4AF37] hover:text-black border border-[#333333] hover:border-[#D4AF37] text-xs font-mono font-bold uppercase tracking-wider text-white rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>LIVE COURIER TRACK</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Order Items Preview */}
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#777777] uppercase block mb-3">
                PIECES IN THIS PACKAGE ({trackedOrder.itemsCount})
              </span>
              <div className="divide-y divide-[#181818] border border-[#1A1A1A] rounded-xs bg-[#090909]">
                {trackedOrder.items.map((item: any, i: number) => (
                  <div key={i} className="p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-12 object-cover rounded-2xs border border-[#222222]"
                        />
                      )}
                      <div>
                        <h4 className="text-xs font-display font-bold uppercase text-white">
                          {item.name}
                        </h4>
                        <span className="text-[10px] font-mono text-[#888888] uppercase">
                          {item.color} // SIZE {item.size} // QTY: {item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Concierge */}
            <div className="pt-4 border-t border-[#1C1C1C] flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
              <span className="text-[#888888]">
                Need immediate status updates from our Varanasi atelier concierge?
              </span>
              <button
                type="button"
                onClick={() =>
                  openWhatsAppSupport(
                    `Hello VOID WEAR concierge, I am inquiring about order ${trackedOrder.orderId}.`
                  )
                }
                className="text-[#D4AF37] hover:text-white flex items-center gap-1.5 font-bold cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#25D366]" />
                <span>CHAT ON WHATSAPP (+91 8114150537)</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
