import React, { useState, useRef } from 'react';
import { X, Upload, Check, AlertCircle, RefreshCw, User, Image as ImageIcon } from 'lucide-react';
import { LeaderProfile } from '../types';
import { uploadProductImage, validateProductImageFile } from '../services/imageService';
import { INITIAL_LEADERS } from '../data/leadership';

interface EditLeadershipModalProps {
  leader: LeaderProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedLeader: LeaderProfile) => void;
}

export const EditLeadershipModal: React.FC<EditLeadershipModalProps> = ({
  leader,
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen || !leader) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(leader.name);
  const [designation, setDesignation] = useState(leader.designation);
  const [photoUrl, setPhotoUrl] = useState(leader.photoUrl);
  const [phone, setPhone] = useState(leader.phone || '');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Handle local file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    const validation = validateProductImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file format.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(10);
      const res = await uploadProductImage(file, 'leadership', (progress) => {
        setUploadProgress(progress);
      });
      setPhotoUrl(res.url);
      setUploadProgress(null);
    } catch (err: any) {
      setUploadError(err.message || 'Image upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleResetToDefault = () => {
    const defaultData = INITIAL_LEADERS.find((l) => l.id === leader.id);
    if (defaultData) {
      setName(defaultData.name);
      setDesignation(defaultData.designation);
      setPhotoUrl(defaultData.photoUrl);
      setPhone(defaultData.phone || '');
      setUploadError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setUploadError('Name cannot be empty.');
      return;
    }
    if (!photoUrl.trim()) {
      setUploadError('Profile photo URL or image upload is required.');
      return;
    }

    const cleanPhone = phone.trim();
    const phoneDisplay = cleanPhone
      ? cleanPhone.startsWith('+')
        ? cleanPhone
        : `+91 ${cleanPhone.replace(/^0+/, '')}`
      : undefined;

    onSave({
      ...leader,
      name: name.trim(),
      designation: designation.trim(),
      photoUrl: photoUrl.trim(),
      phone: cleanPhone || undefined,
      phoneDisplay
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#0B0B0B] border border-[#222222] max-w-lg w-full rounded-xs overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 border-b border-[#1A1A1A] flex items-center justify-between bg-[#0F0F0F]">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="font-display font-extrabold text-sm tracking-[0.2em] uppercase text-white">
              EDIT LEADERSHIP PROFILE // {leader.id === 'akash-goshwami' ? 'FOUNDER' : 'CO-FOUNDER'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#777777] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs font-mono">
          
          {/* Live Preview & Upload Area */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-[#111111] border border-[#1E1E1E] rounded-xs">
            <div className="relative w-28 h-36 bg-black border border-[#2B2B2B] rounded-xs overflow-hidden shrink-0 shadow-lg group">
              <img
                src={photoUrl}
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/void-logo.jpg';
                }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 bg-[#D4AF37] text-black rounded-full"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex-1 w-full space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-[#888888] block">
                PROFILE PHOTOGRAPH
              </span>
              <p className="text-[11px] text-[#AAAAAA] font-sans">
                Upload a high-resolution portrait or paste a hosted URL. Accepts JPG, JPEG, PNG, or WebP.
              </p>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-3 py-1.5 bg-[#1C1C1C] hover:bg-[#D4AF37] hover:text-black border border-[#2E2E2E] text-white text-[10px] uppercase font-bold tracking-wider rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3 h-3" />
                  <span>{isUploading ? 'UPLOADING...' : 'UPLOAD NEW PHOTO'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="px-2.5 py-1.5 bg-[#141414] hover:bg-[#202020] text-[#777777] hover:text-[#D4AF37] border border-[#222222] text-[10px] uppercase rounded-xs transition-colors flex items-center gap-1 cursor-pointer"
                  title="Reset to original photo & name"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>RESET</span>
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />

              {uploadProgress !== null && (
                <div className="w-full bg-[#1A1A1A] h-1 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-[#D4AF37] h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          {uploadError && (
            <div className="p-3 bg-red-950/60 border border-red-900/60 rounded-xs text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Leader Name Input */}
          <div>
            <label className="block text-[10px] text-[#888888] uppercase tracking-wider mb-1">
              FULL NAME:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Akash Goshwami / Shivam Giri"
              required
              className="w-full bg-[#141414] border border-[#262626] text-white px-3 py-2 rounded-xs outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>

          {/* Leader Designation Input */}
          <div>
            <label className="block text-[10px] text-[#888888] uppercase tracking-wider mb-1">
              OFFICIAL DESIGNATION:
            </label>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="e.g. Co-Founder & Managing Director"
              required
              className="w-full bg-[#141414] border border-[#262626] text-white px-3 py-2 rounded-xs outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>

          {/* Leader Phone Input */}
          <div>
            <label className="block text-[10px] text-[#888888] uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>DIRECT CONTACT PHONE NUMBER:</span>
              <span className="text-[#555555] text-[9px]">MOBILE / WHATSAPP</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 7985986280"
              className="w-full bg-[#141414] border border-[#262626] text-white px-3 py-2 rounded-xs outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>

          {/* Photo URL Direct Input */}
          <div>
            <label className="block text-[10px] text-[#888888] uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>PHOTO URL (OR UPLOAD ABOVE):</span>
              <span className="text-[#555555] text-[9px]">LOCAL OR REMOTE URL</span>
            </label>
            <input
              type="text"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="/assets/aistudio/... or https://..."
              className="w-full bg-[#141414] border border-[#262626] text-white px-3 py-2 rounded-xs outline-none focus:border-[#D4AF37] transition-colors text-[11px]"
            />
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1C1C1C]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#161616] hover:bg-[#202020] text-[#999999] hover:text-white uppercase font-bold rounded-xs cursor-pointer transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-5 py-2 bg-[#D4AF37] hover:bg-white text-black font-display font-bold uppercase rounded-xs cursor-pointer transition-colors flex items-center gap-2"
            >
              <Check className="w-3.5 h-3.5" />
              <span>SAVE PROFILE</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
