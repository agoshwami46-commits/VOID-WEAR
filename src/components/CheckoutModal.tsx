import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  QrCode,
  Truck,
  ArrowRight,
  MessageSquare,
  Lock,
  Printer
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { OrderDetails } from '../types';
import { BRAND_INFO } from '../data/products';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    subtotal,
    discountAmount,
    shippingFee,
    cartTotal,
    createOrder,
    openWhatsAppSupport
  } = useShop();

  const [customer, setCustomer] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Uttar Pradesh',
    pinCode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI' | 'CARD'>('UPI');
  const [confirmedOrder, setConfirmedOrder] = useState<OrderDetails | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCheckoutOpen) return null;

  const indianStates = [
    'Uttar Pradesh',
    'Delhi NCR',
    'Maharashtra',
    'Karnataka',
    'Tamil Nadu',
    'Gujarat',
    'West Bengal',
    'Telangana',
    'Rajasthan',
    'Punjab',
    'Haryana',
    'Kerala',
    'Madhya Pradesh',
    'Bihar',
    'Assam',
    'Goa',
    'Other'
  ];

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.fullName || !customer.phone || !customer.address || !customer.pinCode) {
      alert('Please fill out all mandatory shipping details.');
      return;
    }

    setIsProcessing(true);

    try {
      const order = await createOrder({
        items: cart,
        subtotal,
        discount: discountAmount,
        shipping: shippingFee,
        total: cartTotal,
        customer,
        paymentMethod
      });
      setConfirmedOrder(order);
    } catch (err: any) {
      alert('Failed to place order: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendOrderToWhatsApp = () => {
    if (!confirmedOrder) return;
    const itemsSummary = confirmedOrder.items
      .map(
        (i) =>
          `• ${i.product.name} (Size: ${i.selectedSize}, Color: ${i.selectedColor.name}, Qty: ${i.quantity}) - ₹${(i.product.price * i.quantity).toLocaleString('en-IN')}`
      )
      .join('\n');

    const msg = encodeURIComponent(
      `Hello VOID WEAR!\nI have placed an order on your website:\n\n*Order ID: ${confirmedOrder.orderId}*\n*Name:* ${confirmedOrder.customer.fullName}\n*Phone:* ${confirmedOrder.customer.phone}\n*Address:* ${confirmedOrder.customer.address}, ${confirmedOrder.customer.city}, ${confirmedOrder.customer.state} - ${confirmedOrder.customer.pinCode}\n\n*Items:*\n${itemsSummary}\n\n*Total:* ₹${confirmedOrder.total.toLocaleString('en-IN')} (${confirmedOrder.paymentMethod})\n\nPlease confirm dispatch from Pandeypur, Varanasi.`
    );

    window.open(`https://wa.me/918114150537?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-fadeIn"
      onClick={() => {
        if (!confirmedOrder) setIsCheckoutOpen(false);
      }}
    >
      <div
        className="bg-[#0A0A0A] border border-[#222222] max-w-3xl w-full rounded-sm overflow-hidden relative shadow-2xl my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#1C1C1C] flex items-center justify-between bg-[#0E0E0E]">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="font-display font-extrabold text-sm sm:text-base tracking-[0.2em] uppercase text-white">
              {confirmedOrder ? 'ORDER CONFIRMATION' : 'SECURE CHECKOUT'}
            </h3>
          </div>
          <button
            onClick={() => {
              setIsCheckoutOpen(false);
              setConfirmedOrder(null);
            }}
            className="p-1.5 text-[#777777] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {confirmedOrder ? (
            /* Order Success View */
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-[#121212] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] mx-auto mb-4 shadow-[0_0_25px_rgba(212,175,55,0.3)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <span className="font-mono text-xs tracking-[0.3em] text-[#D4AF37] uppercase block mb-1">
                TRANSACTION CONFIRMED
              </span>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl tracking-[0.15em] uppercase text-white mb-2">
                ORDER #{confirmedOrder.orderId}
              </h3>
              <p className="text-xs text-[#888888] font-light max-w-md mx-auto mb-8">
                Thank you, {confirmedOrder.customer.fullName}. Your exclusive VOID streetwear is being prepared for dispatch from our Varanasi atelier.
              </p>

              {/* Order Receipt Details */}
              <div className="bg-[#101010] border border-[#202020] rounded-sm p-6 text-left font-mono text-xs max-w-lg mx-auto mb-8 space-y-3">
                <div className="flex justify-between text-[#888888] pb-2 border-b border-[#1C1C1C]">
                  <span>DATE & TIME</span>
                  <span className="text-white">{confirmedOrder.createdAt}</span>
                </div>
                <div className="flex justify-between text-[#888888]">
                  <span>PAYMENT METHOD</span>
                  <span className="text-[#D4AF37] uppercase font-bold">{confirmedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-[#888888]">
                  <span>DELIVERY ADDRESS</span>
                  <span className="text-white text-right truncate max-w-[200px]">
                    {confirmedOrder.customer.address}, {confirmedOrder.customer.city}
                  </span>
                </div>
                <div className="flex justify-between text-[#888888] pt-2 border-t border-[#1C1C1C]">
                  <span>ITEMS ({confirmedOrder.items.length})</span>
                  <span className="text-white">₹{confirmedOrder.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {confirmedOrder.discount > 0 && (
                  <div className="flex justify-between text-[#D4AF37]">
                    <span>DISCOUNT</span>
                    <span>-₹{confirmedOrder.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#888888]">
                  <span>SHIPPING</span>
                  <span>{confirmedOrder.shipping === 0 ? 'FREE' : `₹${confirmedOrder.shipping}`}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-[#1C1C1C]">
                  <span>TOTAL PAID / DUE</span>
                  <span className="text-[#D4AF37]">₹{confirmedOrder.total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <button
                  onClick={handleSendOrderToWhatsApp}
                  className="w-full py-3.5 bg-[#D4AF37] text-black font-display font-bold text-xs tracking-[0.2em] uppercase rounded-xs hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>SEND RECEIPT TO WHATSAPP</span>
                </button>
                <button
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setConfirmedOrder(null);
                  }}
                  className="w-full py-3.5 bg-[#161616] border border-[#2B2B2B] text-white hover:text-[#D4AF37] font-display font-bold text-xs tracking-[0.2em] uppercase rounded-xs transition-colors cursor-pointer"
                >
                  CONTINUE BROWSING
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              {/* Order Summary Strip */}
              <div className="p-4 bg-[#111111] border border-[#222222] rounded-xs flex items-center justify-between font-mono text-xs">
                <div>
                  <span className="text-[#888888]">BAG TOTAL ({cart.length} PIECES): </span>
                  <strong className="text-white">₹{cartTotal.toLocaleString('en-IN')}</strong>
                </div>
                <span className="text-[#D4AF37] uppercase text-[10px]">
                  {shippingFee === 0 ? 'COMPLIMENTARY SHIPPING' : '+ ₹149 SHIPPING'}
                </span>
              </div>

              {/* Step 1: Customer Details */}
              <div>
                <h4 className="font-display font-bold text-xs tracking-[0.2em] uppercase text-[#D4AF37] mb-3">
                  1. SHIPPING & DELIVERY ADDRESS
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-[#888888] uppercase mb-1">
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.fullName}
                      onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                      placeholder="e.g. Akash"
                      className="w-full bg-[#121212] border border-[#242424] focus:border-[#D4AF37] p-2.5 text-xs text-white uppercase rounded-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#888888] uppercase mb-1">
                      WHATSAPP / PHONE NUMBER *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      placeholder="+91 8114150537"
                      className="w-full bg-[#121212] border border-[#242424] focus:border-[#D4AF37] p-2.5 text-xs text-white uppercase rounded-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#888888] uppercase mb-1">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      required
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      placeholder="name@domain.com"
                      className="w-full bg-[#121212] border border-[#242424] focus:border-[#D4AF37] p-2.5 text-xs text-white uppercase rounded-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#888888] uppercase mb-1">
                      PIN CODE *
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.pinCode}
                      onChange={(e) => setCustomer({ ...customer, pinCode: e.target.value })}
                      placeholder="e.g. 221002"
                      className="w-full bg-[#121212] border border-[#242424] focus:border-[#D4AF37] p-2.5 text-xs text-white font-mono uppercase rounded-xs outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-mono text-[#888888] uppercase mb-1">
                      STREET ADDRESS (HOUSE / FLAT NO., STREET, LANDMARK) *
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      placeholder="e.g. Plot 14, Pandeypur Main Road"
                      className="w-full bg-[#121212] border border-[#242424] focus:border-[#D4AF37] p-2.5 text-xs text-white uppercase rounded-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#888888] uppercase mb-1">
                      CITY *
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      placeholder="e.g. Varanasi"
                      className="w-full bg-[#121212] border border-[#242424] focus:border-[#D4AF37] p-2.5 text-xs text-white uppercase rounded-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#888888] uppercase mb-1">
                      STATE *
                    </label>
                    <select
                      value={customer.state}
                      onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                      className="w-full bg-[#121212] border border-[#242424] focus:border-[#D4AF37] p-2.5 text-xs text-white uppercase rounded-xs outline-none"
                    >
                      {indianStates.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Method */}
              <div className="pt-4 border-t border-[#1C1C1C]">
                <h4 className="font-display font-bold text-xs tracking-[0.2em] uppercase text-[#D4AF37] mb-3">
                  2. SELECT PAYMENT METHOD
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  {/* UPI */}
                  <label
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-4 border rounded-xs cursor-pointer flex flex-col justify-between transition-colors ${
                      paymentMethod === 'UPI'
                        ? 'border-[#D4AF37] bg-[#141414]'
                        : 'border-[#222222] bg-[#0E0E0E] hover:border-[#444444]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <QrCode className="w-5 h-5 text-[#D4AF37]" />
                      <input
                        type="radio"
                        checked={paymentMethod === 'UPI'}
                        onChange={() => setPaymentMethod('UPI')}
                        className="accent-[#D4AF37]"
                      />
                    </div>
                    <span className="font-display font-bold text-xs uppercase text-white">
                      UPI / QR CODE
                    </span>
                    <span className="text-[10px] text-[#777777] font-mono mt-0.5">
                      GPay, PhonePe, Paytm
                    </span>
                  </label>

                  {/* COD */}
                  <label
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-4 border rounded-xs cursor-pointer flex flex-col justify-between transition-colors ${
                      paymentMethod === 'COD'
                        ? 'border-[#D4AF37] bg-[#141414]'
                        : 'border-[#222222] bg-[#0E0E0E] hover:border-[#444444]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Truck className="w-5 h-5 text-[#D4AF37]" />
                      <input
                        type="radio"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                        className="accent-[#D4AF37]"
                      />
                    </div>
                    <span className="font-display font-bold text-xs uppercase text-white">
                      CASH ON DELIVERY
                    </span>
                    <span className="text-[10px] text-[#777777] font-mono mt-0.5">
                      Pay upon delivery
                    </span>
                  </label>

                  {/* Card */}
                  <label
                    onClick={() => setPaymentMethod('CARD')}
                    className={`p-4 border rounded-xs cursor-pointer flex flex-col justify-between transition-colors ${
                      paymentMethod === 'CARD'
                        ? 'border-[#D4AF37] bg-[#141414]'
                        : 'border-[#222222] bg-[#0E0E0E] hover:border-[#444444]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <CreditCard className="w-5 h-5 text-[#D4AF37]" />
                      <input
                        type="radio"
                        checked={paymentMethod === 'CARD'}
                        onChange={() => setPaymentMethod('CARD')}
                        className="accent-[#D4AF37]"
                      />
                    </div>
                    <span className="font-display font-bold text-xs uppercase text-white">
                      CARD / NET BANKING
                    </span>
                    <span className="text-[10px] text-[#777777] font-mono mt-0.5">
                      Visa, RuPay, Master
                    </span>
                  </label>
                </div>

                {/* Sub-details for selected payment */}
                {paymentMethod === 'UPI' && (
                  <div className="p-4 bg-[#121212] border border-[#242424] rounded-xs flex flex-col sm:flex-row items-center gap-4 text-xs font-mono">
                    <div className="w-20 h-20 bg-white p-2 rounded-xs shrink-0 flex items-center justify-center">
                      <QrCode className="w-16 h-16 text-black" />
                    </div>
                    <div className="text-left space-y-1">
                      <span className="text-[#D4AF37] font-bold">UPI ID: voidwear@upi</span>
                      <p className="text-[11px] text-[#888888]">
                        Scan with Google Pay, PhonePe, Paytm, or BHIM. Instant order confirmation generated automatically.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-[#D4AF37] text-black font-display font-bold text-xs tracking-[0.25em] uppercase hover:bg-white transition-colors cursor-pointer rounded-xs flex items-center justify-center gap-2 shadow-xl"
              >
                {isProcessing ? (
                  <span>TRANSMITTING ORDER...</span>
                ) : (
                  <>
                    <span>CONFIRM & PLACE ORDER (₹{cartTotal.toLocaleString('en-IN')})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
