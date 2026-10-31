import React, { useState } from 'react';
import { Star, CheckCircle2, Plus, MessageSquare } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CustomerReviewsSection: React.FC = () => {
  const { reviews, addReview, products } = useShop();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [productName, setProductName] = useState(products[0]?.name || 'VOID CORE HOODIE');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) return;
    addReview({
      name,
      location: location || 'India',
      rating,
      productName,
      comment
    });
    setName('');
    setLocation('');
    setComment('');
    setIsModalOpen(false);
  };

  return (
    <section className="py-24 sm:py-32 bg-[#080808] text-white border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 border-b border-[#1C1C1C] pb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs tracking-[0.3em] text-[#D4AF37] uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <span>TESTIMONIAL ARCHIVE</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-[0.16em] uppercase text-white">
              THE VOID COMMUNITY
            </h2>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 sm:mt-0 px-5 py-2.5 bg-[#121212] border border-[#2E2E2E] hover:border-[#D4AF37] text-white hover:text-[#D4AF37] text-xs font-mono tracking-widest uppercase transition-colors rounded-xs flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>WRITE A REVIEW</span>
          </button>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 sm:p-8 bg-[#0D0D0D] border border-[#1C1C1C] hover:border-[#D4AF37]/50 transition-colors rounded-sm flex flex-col justify-between"
            >
              <div>
                {/* Star Rating & Verified */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-[#D4AF37]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-[#333333]'}`}
                      />
                    ))}
                  </div>
                  {rev.verified && (
                    <span className="flex items-center gap-1 font-mono text-[9px] text-[#777777] uppercase tracking-wider">
                      <CheckCircle2 className="w-3 h-3 text-[#D4AF37]" />
                      <span>VERIFIED</span>
                    </span>
                  )}
                </div>

                {/* Product Name Mention */}
                {rev.productName && (
                  <div className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase mb-2">
                    {rev.productName}
                  </div>
                )}

                {/* Comment Body */}
                <p className="text-xs sm:text-sm text-[#CCCCCC] font-light leading-relaxed mb-6">
                  “{rev.comment}”
                </p>
              </div>

              {/* Author & City */}
              <div className="pt-4 border-t border-[#181818] flex items-center justify-between font-mono text-xs">
                <div>
                  <div className="font-bold text-white uppercase tracking-wider">{rev.name}</div>
                  <div className="text-[10px] text-[#666666]">{rev.location}</div>
                </div>
                <span className="text-[10px] text-[#555555]">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Write a Review */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fadeIn"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="bg-[#101010] border border-[#2B2B2B] max-w-lg w-full p-6 sm:p-8 rounded-sm shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-display font-extrabold text-xl tracking-[0.15em] uppercase text-white mb-2">
                SUBMIT YOUR REVIEW
              </h3>
              <p className="text-xs text-[#888888] font-mono uppercase mb-6">
                Share your styling experience with the VOID community.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-[#999999] uppercase mb-1">Your Full Name:</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Siddharth Rao"
                    className="w-full bg-[#161616] border border-[#282828] text-white p-3 rounded-xs outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#999999] uppercase mb-1">City / Location:</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Mumbai / Delhi / Varanasi"
                    className="w-full bg-[#161616] border border-[#282828] text-white p-3 rounded-xs outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#999999] uppercase mb-1">Product Purchased:</label>
                  <select
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full bg-[#161616] border border-[#282828] text-white p-3 rounded-xs outline-none focus:border-[#D4AF37]"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#999999] uppercase mb-1">Rating (Stars):</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${star <= rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-[#444444]'}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[#999999] uppercase mb-1">Your Review:</label>
                  <textarea
                    rows={4}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share how the fabric feels, fit notes, and styling comments..."
                    className="w-full bg-[#161616] border border-[#282828] text-white p-3 rounded-xs outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-1/2 py-3 bg-[#1C1C1C] text-[#888888] hover:text-white uppercase font-bold rounded-xs cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-3 bg-[#D4AF37] text-black hover:bg-white transition-colors font-display font-bold uppercase rounded-xs cursor-pointer"
                  >
                    PUBLISH REVIEW
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
