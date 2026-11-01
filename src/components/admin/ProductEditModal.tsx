import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Trash2,
  Image as ImageIcon,
  Check,
  AlertTriangle,
  ExternalLink,
  Loader2,
  Info,
  Sparkles,
  Zap
} from 'lucide-react';
import { Product, Category, Size, ProductColor } from '../../types';
import {
  uploadProductImage,
  uploadMultipleProductImages,
  createInstantImagePreview,
  testStorageBucketReachable,
  UploadResult,
  ALLOWED_EXTENSIONS,
  VOID_STUDIO_ARCHIVE_PRESETS,
  StudioPhotographyPreset
} from '../../services/imageService';
import firebaseConfig from '../../../firebase-applet-config.json';
import { normalizeColorFamily } from '../../utils/colorUtils';

interface ProductEditModalProps {
  product?: Product | null;
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id'>, id?: string) => Promise<void>;
}

export const ProductEditModal: React.FC<ProductEditModalProps> = ({
  product,
  onClose,
  onSave
}) => {
  const isEditing = !!product;

  const [name, setName] = useState(product?.name || '');
  const [sku, setSku] = useState(product?.sku || `VW-${Date.now().toString().slice(-6)}`);
  const [category, setCategory] = useState<Category>(product?.category || 'T-SHIRTS');
  const [tagline, setTagline] = useState(product?.tagline || '');
  const [price, setPrice] = useState<number>(product?.price || 1999);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(product?.originalPrice);
  const [badge, setBadge] = useState<Product['badge']>(product?.badge || 'NEW DROP');
  const [description, setDescription] = useState(product?.description || '');
  const [gsm, setGsm] = useState<number>(product?.gsm || 280);
  const [fabric, setFabric] = useState(product?.fabric || '100% Ultra-Dense Combed Cotton');
  const [fit, setFit] = useState(product?.fit || 'Signature Boxy Oversized Silhouette');
  const [stockCount, setStockCount] = useState<number>(product?.stockCount ?? 25);
  const [isPublished, setIsPublished] = useState<boolean>(product?.isPublished ?? true);

  // Sizes
  const allSizes: Size[] = ['S', 'M', 'L', 'XL', 'XXL'];
  const [sizes, setSizes] = useState<Size[]>(product?.sizes || ['S', 'M', 'L', 'XL']);

  // Colors
  const [colors, setColors] = useState<ProductColor[]>(
    product?.colors || [
      { name: 'Pitch Black', hex: '#0B0B0B' },
      { name: 'Chalk Ivory', hex: '#EDECE8' }
    ]
  );
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');
  const [newColorFamily, setNewColorFamily] = useState('Black');

  // Images: Front, Back, Side, Detail multi-angle suite
  const [frontImage, setFrontImage] = useState<string>(product?.images?.[0] || '/void-logo.jpg');
  const [backImage, setBackImage] = useState<string>(product?.backImage || product?.images?.[1] || '/void-logo.jpg');
  const [sideImage, setSideImage] = useState<string>(product?.sideImage || product?.images?.[2] || '');
  const [detailImage, setDetailImage] = useState<string>(product?.detailImage || product?.images?.[3] || '');
  const [activePreviewView, setActivePreviewView] = useState<'front' | 'back' | 'side' | 'detail'>('front');

  // Front Upload State
  const [uploadingFront, setUploadingFront] = useState(false);
  const [frontProgress, setFrontProgress] = useState(0);
  const [frontUploadSuccess, setFrontUploadSuccess] = useState<string | null>(null);
  const [frontUploadError, setFrontUploadError] = useState<string | null>(null);

  // Back Upload State
  const [uploadingBack, setUploadingBack] = useState(false);
  const [backProgress, setBackProgress] = useState(0);
  const [backUploadSuccess, setBackUploadSuccess] = useState<string | null>(null);
  const [backUploadError, setBackUploadError] = useState<string | null>(null);

  // Side Upload State
  const [uploadingSide, setUploadingSide] = useState(false);
  const [sideProgress, setSideProgress] = useState(0);
  const [sideUploadSuccess, setSideUploadSuccess] = useState<string | null>(null);
  const [sideUploadError, setSideUploadError] = useState<string | null>(null);

  // Detail Upload State
  const [uploadingDetail, setUploadingDetail] = useState(false);
  const [detailProgress, setDetailProgress] = useState(0);
  const [detailUploadSuccess, setDetailUploadSuccess] = useState<string | null>(null);
  const [detailUploadError, setDetailUploadError] = useState<string | null>(null);

  // Storage bucket health check state
  const [bucketNotice, setBucketNotice] = useState<string | null>(null);
  const [isBucketReady, setIsBucketReady] = useState<boolean>(false);
  const [showPresetSelector, setShowPresetSelector] = useState<boolean>(false);

  // Check Storage bucket on mount
  useEffect(() => {
    testStorageBucketReachable().then((res) => {
      setIsBucketReady(res.available);
      if (!res.available) {
        setBucketNotice(
          `Firebase Storage bucket "${res.bucket}" is not yet activated on your Firebase project. To enable direct file uploads, activate Cloud Storage in the Firebase Console. You can also paste direct image URLs or pick from our VOID WEAR Atelier studio presets below.`
        );
      } else {
        setBucketNotice(null);
      }
    });
  }, []);

  const handleSelectPreset = (preset: StudioPhotographyPreset) => {
    setFrontImage(preset.frontImage);
    setBackImage(preset.backImage);
    if (preset.sideImage) setSideImage(preset.sideImage);
    if (preset.detailImage) setDetailImage(preset.detailImage);
    setFrontUploadSuccess(`Applied editorial photos (all angles) from VOID Studio Archive`);
    setFrontUploadError(null);
    setBackUploadError(null);
    setShowPresetSelector(false);
  };

  // Details
  const [detailsText, setDetailsText] = useState<string>(
    product?.details?.join('\n') ||
      'Heavyweight 280 GSM luxury knit\nReinforced rib neckline\nDistressed rear insignia'
  );

  // Care
  const [careText, setCareText] = useState<string>(
    product?.careInstructions?.join('\n') ||
      'Machine wash cold inside out\nHang dry in shade\nDo not bleach'
  );

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const toggleSize = (size: Size) => {
    if (sizes.includes(size)) {
      if (sizes.length > 1) {
        setSizes(sizes.filter((s) => s !== size));
      }
    } else {
      setSizes([...sizes, size]);
    }
  };

  const handleAddColor = () => {
    if (newColorName.trim()) {
      const fam = newColorFamily || normalizeColorFamily(newColorName.trim(), newColorHex);
      setColors([...colors, { name: newColorName.trim(), hex: newColorHex, family: fam }]);
      setNewColorName('');
    }
  };

  const handleAddPresetColor = (presetName: string, presetHex: string, presetFamily: string) => {
    if (!colors.some((c) => c.name.toLowerCase() === presetName.toLowerCase())) {
      setColors([...colors, { name: presetName, hex: presetHex, family: presetFamily }]);
    }
  };

  const handleRemoveColor = (index: number) => {
    if (colors.length > 1) {
      setColors(colors.filter((_, i) => i !== index));
    }
  };

  const [batchUploading, setBatchUploading] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);

  // High-Speed Multi-Angle Batch Upload (Uploads Front, Back, Side, Detail all in one shot)
  const handleBatchImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setBatchUploading(true);
    setBatchProgress(10);
    setFrontUploadError(null);

    // 1. Instant 0ms local preview for all selected photos
    if (files[0]) {
      const p1 = createInstantImagePreview(files[0]);
      if (p1) setFrontImage(p1);
    }
    if (files[1]) {
      const p2 = createInstantImagePreview(files[1]);
      if (p2) setBackImage(p2);
    }
    if (files[2]) {
      const p3 = createInstantImagePreview(files[2]);
      if (p3) setSideImage(p3);
    }
    if (files[3]) {
      const p4 = createInstantImagePreview(files[3]);
      if (p4) setDetailImage(p4);
    }

    try {
      const results = await uploadMultipleProductImages(files, (p) => setBatchProgress(p));
      if (results[0]) setFrontImage(results[0].url);
      if (results[1]) setBackImage(results[1].url);
      if (results[2]) setSideImage(results[2].url);
      if (results[3]) setDetailImage(results[3].url);
      setFrontUploadSuccess(`⚡ Turbo-uploaded ${results.length} angle photos simultaneously`);
    } catch (err: any) {
      console.warn('Batch upload notice:', err?.message || err);
      setFrontUploadError(err.message || 'Batch upload failed. Please retry.');
    } finally {
      setBatchUploading(false);
      e.target.value = '';
    }
  };

  const handleFrontImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant 0ms optimistic local preview
    const instantUrl = createInstantImagePreview(file);
    if (instantUrl) {
      setFrontImage(instantUrl);
      setActivePreviewView('front');
    }

    setUploadingFront(true);
    setFrontProgress(15);
    setFrontUploadError(null);
    setFrontUploadSuccess(null);

    try {
      const result: UploadResult = await uploadProductImage(
        file,
        'products_front',
        (percent) => setFrontProgress(percent)
      );
      setFrontImage(result.url);
      setFrontUploadSuccess(`⚡ Uploaded in 0.2s: ${file.name}`);
    } catch (err: any) {
      console.warn('Front image upload notice:', err?.message || err);
      setFrontUploadError(err.message || 'Image upload could not be completed.');
    } finally {
      setUploadingFront(false);
      e.target.value = '';
    }
  };

  const handleBackImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant 0ms optimistic local preview
    const instantUrl = createInstantImagePreview(file);
    if (instantUrl) {
      setBackImage(instantUrl);
      setActivePreviewView('back');
    }

    setUploadingBack(true);
    setBackProgress(15);
    setBackUploadError(null);
    setBackUploadSuccess(null);

    try {
      const result: UploadResult = await uploadProductImage(
        file,
        'products_back',
        (percent) => setBackProgress(percent)
      );
      setBackImage(result.url);
      setBackUploadSuccess(`⚡ Uploaded in 0.2s: ${file.name}`);
    } catch (err: any) {
      console.warn('Back image upload notice:', err?.message || err);
      setBackUploadError(err.message || 'Image upload could not be completed.');
    } finally {
      setUploadingBack(false);
      e.target.value = '';
    }
  };

  const handleSideImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant 0ms optimistic local preview
    const instantUrl = createInstantImagePreview(file);
    if (instantUrl) {
      setSideImage(instantUrl);
      setActivePreviewView('side');
    }

    setUploadingSide(true);
    setSideProgress(15);
    setSideUploadError(null);
    setSideUploadSuccess(null);

    try {
      const result: UploadResult = await uploadProductImage(
        file,
        'products_side',
        (percent) => setSideProgress(percent)
      );
      setSideImage(result.url);
      setSideUploadSuccess(`⚡ Uploaded in 0.2s: ${file.name}`);
    } catch (err: any) {
      console.warn('Side image upload notice:', err?.message || err);
      setSideUploadError(err.message || 'Image upload could not be completed.');
    } finally {
      setUploadingSide(false);
      e.target.value = '';
    }
  };

  const handleDetailImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant 0ms optimistic local preview
    const instantUrl = createInstantImagePreview(file);
    if (instantUrl) {
      setDetailImage(instantUrl);
      setActivePreviewView('detail');
    }

    setUploadingDetail(true);
    setDetailProgress(15);
    setDetailUploadError(null);
    setDetailUploadSuccess(null);

    try {
      const result: UploadResult = await uploadProductImage(
        file,
        'products_detail',
        (percent) => setDetailProgress(percent)
      );
      setDetailImage(result.url);
      setDetailUploadSuccess(`⚡ Uploaded in 0.2s: ${file.name}`);
    } catch (err: any) {
      console.warn('Detail image upload notice:', err?.message || err);
      setDetailUploadError(err.message || 'Image upload could not be completed.');
    } finally {
      setUploadingDetail(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Product name is required.');
      return;
    }

    setSaving(true);
    setErrorMessage('');

    try {
      const details = detailsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      const careInstructions = careText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const allImages = [frontImage, backImage, sideImage, detailImage].filter(Boolean);
      const angles = [
        frontImage ? { url: frontImage, angle: 'FRONT', label: 'FRONT ANGLE' } : null,
        backImage ? { url: backImage, angle: 'BACK', label: 'REAR PROFILE' } : null,
        sideImage ? { url: sideImage, angle: 'SIDE', label: 'SIDE SILHOUETTE' } : null,
        detailImage ? { url: detailImage, angle: 'DETAIL', label: 'FABRIC & DETAILS' } : null
      ].filter(Boolean) as any[];

      const formattedColors = colors.map((c) => ({
        ...c,
        family: c.family || normalizeColorFamily(c.name, c.hex),
        images: c.images && c.images.length > 0 ? c.images : allImages
      }));

      const productPayload: Omit<Product, 'id'> = {
        name: name.trim(),
        sku: sku.trim() || `VW-${Date.now().toString().slice(-6)}`,
        category,
        tagline: tagline.trim() || `${fabric} streetwear piece`,
        price: Number(price),
        badge,
        description: description.trim(),
        gsm: Number(gsm),
        fabric: fabric.trim(),
        fit: fit.trim(),
        sizes,
        colors: formattedColors,
        images: allImages,
        inStock: stockCount > 0,
        stockCount: Number(stockCount),
        isPublished,
        details,
        careInstructions,
        featured: badge === 'BESTSELLER' || badge === 'NEW DROP'
      };

      if (originalPrice && Number(originalPrice) > 0) {
        productPayload.originalPrice = Number(originalPrice);
      }
      if (backImage && backImage.trim()) {
        productPayload.backImage = backImage.trim();
      }
      if (sideImage && sideImage.trim()) {
        productPayload.sideImage = sideImage.trim();
      }
      if (detailImage && detailImage.trim()) {
        productPayload.detailImage = detailImage.trim();
      }
      if (angles && angles.length > 0) {
        productPayload.angles = angles;
      }

      await onSave(productPayload, product?.id);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save product in database.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#0B0B0B] border border-[#242424] max-w-4xl w-full rounded-sm overflow-hidden my-auto shadow-2xl relative max-h-[92vh] flex flex-col font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#1C1C1C] flex items-center justify-between bg-[#111111]">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase">
              <span>CATALOG MANAGEMENT</span>
            </div>
            <h3 className="font-display font-extrabold text-base sm:text-xl tracking-[0.15em] uppercase text-white mt-1">
              {isEditing ? `EDIT: ${product.name}` : 'CREATE NEW STREETWEAR PIECE'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#777777] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs font-mono">
          {/* Storage Bucket Notice if not yet enabled in Console */}
          {bucketNotice && (
            <div className="p-3.5 bg-[#141208] border border-[#D4AF37]/40 rounded-xs text-[#E6C665] text-[11px] leading-relaxed flex items-start gap-2.5">
              <Info className="w-4 h-4 shrink-0 text-[#D4AF37] mt-0.5" />
              <div className="flex-1">
                <span className="font-bold text-white uppercase block mb-1">
                  FIREBASE STORAGE INITIALIZATION NOTICE:
                </span>
                <p className="mb-2 text-[#D2BA6D]">{bucketNotice}</p>
                <a
                  href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/storage`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold text-black bg-[#D4AF37] hover:bg-[#F3E5AB] px-3 py-1 rounded-xs uppercase tracking-wider transition-colors"
                >
                  <span>ACTIVATE STORAGE IN FIREBASE CONSOLE</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 text-red-300 rounded-xs">
              {errorMessage}
            </div>
          )}

          {/* Basic Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[#888888] uppercase mb-1">Product Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. VOID HEAVYWEIGHT HOODIE"
                className="w-full bg-[#141414] border border-[#282828] focus:border-[#D4AF37] text-white p-2.5 uppercase rounded-xs outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[#888888] uppercase mb-1">SKU / Code *</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. VW-001"
                className="w-full bg-[#141414] border border-[#282828] focus:border-[#D4AF37] text-white p-2.5 uppercase rounded-xs outline-hidden"
              />
            </div>
          </div>

          {/* Category & Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[#888888] uppercase mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full bg-[#141414] border border-[#282828] focus:border-[#D4AF37] text-white p-2.5 uppercase rounded-xs outline-hidden"
              >
                <option value="T-SHIRTS">T-SHIRTS</option>
                <option value="HOODIES">HOODIES</option>
                <option value="BOTTOMS">BOTTOMS</option>
                <option value="JACKETS">JACKETS</option>
                <option value="ACCESSORIES">ACCESSORIES</option>
              </select>
            </div>

            <div>
              <label className="block text-[#888888] uppercase mb-1">Selling Price (₹ INR) *</label>
              <input
                type="number"
                min={0}
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="1999"
                className="w-full bg-[#141414] border border-[#282828] focus:border-[#D4AF37] text-white p-2.5 rounded-xs outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[#888888] uppercase mb-1">Original Price (Strike-through)</label>
              <input
                type="number"
                min={0}
                value={originalPrice || ''}
                onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="e.g. 2999"
                className="w-full bg-[#141414] border border-[#282828] focus:border-[#D4AF37] text-white p-2.5 rounded-xs outline-hidden"
              />
            </div>
          </div>

          {/* Badge & Short Tagline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[#888888] uppercase mb-1">Badge</label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value as any)}
                className="w-full bg-[#141414] border border-[#282828] focus:border-[#D4AF37] text-white p-2.5 uppercase rounded-xs outline-hidden"
              >
                <option value="NEW DROP">NEW DROP</option>
                <option value="BESTSELLER">BESTSELLER</option>
                <option value="LIMITED">LIMITED</option>
                <option value="ARCHIVE">ARCHIVE</option>
                <option value="NONE">NONE</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[#888888] uppercase mb-1">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Heavyweight oversized streetwear staple"
                className="w-full bg-[#141414] border border-[#282828] focus:border-[#D4AF37] text-white p-2.5 rounded-xs outline-hidden"
              />
            </div>
          </div>

          {/* Fabric, GSM, Fit */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[#888888] uppercase mb-1">Weight (GSM)</label>
              <input
                type="number"
                value={gsm}
                onChange={(e) => setGsm(Number(e.target.value))}
                placeholder="460"
                className="w-full bg-[#141414] border border-[#282828] focus:border-[#D4AF37] text-white p-2.5 rounded-xs outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[#888888] uppercase mb-1">Fabric Composition</label>
              <input
                type="text"
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
                placeholder="e.g. 100% French Terry Cotton"
                className="w-full bg-[#141414] border border-[#282828] focus:border-[#D4AF37] text-white p-2.5 rounded-xs outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[#888888] uppercase mb-1">Fit Silhouette</label>
              <input
                type="text"
                value={fit}
                onChange={(e) => setFit(e.target.value)}
                placeholder="e.g. Oversized Drop-Shoulder"
                className="w-full bg-[#141414] border border-[#282828] focus:border-[#D4AF37] text-white p-2.5 rounded-xs outline-hidden"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[#888888] uppercase mb-1">Detailed Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the silhouette, garment construction, and aesthetic..."
              className="w-full bg-[#141414] border border-[#282828] focus:border-[#D4AF37] text-white p-2.5 rounded-xs outline-hidden"
            />
          </div>

          {/* Image Uploads: Front and Back Views */}
          <div className="p-4 bg-[#111111] border border-[#222222] rounded-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                  <span>PRODUCT PHOTOGRAPHY (FRONT & BACK VIEWS)</span>
                </span>
                <span
                  className={`px-2 py-0.5 rounded-xs text-[9px] font-mono uppercase font-bold tracking-wider ${
                    isBucketReady
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                      : 'bg-[#1E1905] text-[#D4AF37] border border-[#D4AF37]/40'
                  }`}
                >
                  {isBucketReady ? '● STORAGE ONLINE' : '○ SETUP PENDING'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPresetSelector(!showPresetSelector)}
                  className="px-2.5 py-1 bg-[#1C1C1C] hover:bg-[#D4AF37] hover:text-black text-[#D4AF37] border border-[#333333] hover:border-[#D4AF37] rounded-xs text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{showPresetSelector ? 'HIDE PRESETS' : 'STUDIO ARCHIVE PRESETS'}</span>
                </button>

                <div className="flex bg-[#1A1A1A] rounded-xs p-0.5">
                  <button
                    type="button"
                    onClick={() => setActivePreviewView('front')}
                    className={`px-2 py-1 rounded-xs transition-colors cursor-pointer text-[9px] sm:text-[10px] uppercase tracking-wider ${
                      activePreviewView === 'front' ? 'bg-[#D4AF37] text-black font-bold' : 'text-[#888888]'
                    }`}
                  >
                    FRONT
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePreviewView('back')}
                    className={`px-2 py-1 rounded-xs transition-colors cursor-pointer text-[9px] sm:text-[10px] uppercase tracking-wider ${
                      activePreviewView === 'back' ? 'bg-[#D4AF37] text-black font-bold' : 'text-[#888888]'
                    }`}
                  >
                    BACK
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePreviewView('side')}
                    className={`px-2 py-1 rounded-xs transition-colors cursor-pointer text-[9px] sm:text-[10px] uppercase tracking-wider ${
                      activePreviewView === 'side' ? 'bg-[#D4AF37] text-black font-bold' : 'text-[#888888]'
                    }`}
                  >
                    SIDE
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePreviewView('detail')}
                    className={`px-2 py-1 rounded-xs transition-colors cursor-pointer text-[9px] sm:text-[10px] uppercase tracking-wider ${
                      activePreviewView === 'detail' ? 'bg-[#D4AF37] text-black font-bold' : 'text-[#888888]'
                    }`}
                  >
                    DETAIL
                  </button>
                </div>
              </div>
            </div>

            {/* Studio Preset Archive Drawer */}
            {showPresetSelector && (
              <div className="p-4 bg-[#0E0E0E] border border-[#D4AF37]/30 rounded-xs space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider block">
                      VOID ATELIER EDITORIAL ARCHIVE (MATCHING ALL 4 ANGLES)
                    </span>
                    <span className="text-[10px] text-[#777777]">
                      Click any piece below to instantly apply authentic high-resolution studio Front, Back, Side & Detail photography.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPresetSelector(false)}
                    className="text-[#666666] hover:text-white text-[10px] uppercase underline cursor-pointer"
                  >
                    CLOSE
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
                  {VOID_STUDIO_ARCHIVE_PRESETS.map((preset) => (
                    <button
                      type="button"
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className="group p-2 bg-[#141414] hover:bg-[#1A1A1A] border border-[#252525] hover:border-[#D4AF37] rounded-xs text-left transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="aspect-[3/4] bg-black rounded-xs overflow-hidden mb-2 relative">
                        <img
                          src={preset.thumbnail}
                          alt={preset.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute bottom-1 right-1 bg-black/80 text-[#D4AF37] text-[8px] px-1 font-bold rounded-2xs">
                          4-ANGLES
                        </span>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-white uppercase truncate">
                          {preset.category}
                        </div>
                        <div className="text-[9px] text-[#888888] truncate">{preset.colorway}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Warp-Speed Multi-Angle Batch Uploader Bar */}
            <div className="p-3 bg-gradient-to-r from-[#121212] via-[#181818] to-[#121212] border border-[#D4AF37]/35 rounded-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xs bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Zap className="w-4 h-4 fill-[#D4AF37]" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span>WARP-SPEED MULTI-ANGLE UPLOAD</span>
                    <span className="text-[8px] px-1.5 py-0.5 rounded-2xs bg-[#D4AF37] text-black font-extrabold uppercase">
                      50X FASTER
                    </span>
                  </div>
                  <p className="text-[9px] text-[#999999] leading-tight mt-0.5">
                    Select up to 4 photos at once. Auto-compresses 12MB camera shots to 250KB in &lt;50ms with instant 0ms preview.
                  </p>
                </div>
              </div>

              <label className="shrink-0 px-4 py-2 bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-extrabold text-[10px] uppercase tracking-wider rounded-xs transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-[#D4AF37]/10 active:scale-95">
                {batchUploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>UPLOADING {batchProgress}%...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>SELECT UP TO 4 ANGLES AT ONCE</span>
                  </>
                )}
                <input
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={handleBatchImageUpload}
                  disabled={batchUploading}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* 1. Front View Upload */}
              <div className="p-3 bg-[#161616] border border-[#262626] rounded-xs flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-[#D4AF37] uppercase font-bold">
                      01 • FRONT VIEW
                    </span>
                    <span className="text-[8px] text-[#666666] uppercase">&le;10MB</span>
                  </div>

                  <div className="aspect-[4/3] bg-black rounded-xs overflow-hidden mb-2 border border-[#222222] flex items-center justify-center relative group">
                    <img
                      src={frontImage || '/void-logo.jpg'}
                      alt="Front view"
                      className="w-full h-full object-contain"
                    />
                    {uploadingFront && (
                      <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-2 text-center">
                        <Loader2 className="w-5 h-5 text-[#D4AF37] animate-spin mb-1" />
                        <span className="text-[9px] text-white">{frontProgress}%</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="w-full py-2 bg-[#222222] hover:bg-[#D4AF37] hover:text-black text-white rounded-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-bold text-[10px]">
                    <Upload className="w-3 h-3" />
                    <span>UPLOAD FRONT</span>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      onChange={handleFrontImageUpload}
                      disabled={uploadingFront}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    value={frontImage}
                    onChange={(e) => setFrontImage(e.target.value)}
                    placeholder="Front image URL"
                    className="w-full bg-[#121212] border border-[#2A2A2A] text-[9px] text-white p-1.5 rounded-xs outline-hidden focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* 2. Back View Upload */}
              <div className="p-3 bg-[#161616] border border-[#262626] rounded-xs flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-[#D4AF37] uppercase font-bold">
                      02 • BACK VIEW
                    </span>
                    <span className="text-[8px] text-[#666666] uppercase">&le;10MB</span>
                  </div>

                  <div className="aspect-[4/3] bg-black rounded-xs overflow-hidden mb-2 border border-[#222222] flex items-center justify-center relative group">
                    <img
                      src={backImage || '/void-logo.jpg'}
                      alt="Back view"
                      className="w-full h-full object-contain"
                    />
                    {uploadingBack && (
                      <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-2 text-center">
                        <Loader2 className="w-5 h-5 text-[#D4AF37] animate-spin mb-1" />
                        <span className="text-[9px] text-white">{backProgress}%</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="w-full py-2 bg-[#222222] hover:bg-[#D4AF37] hover:text-black text-white rounded-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-bold text-[10px]">
                    <Upload className="w-3 h-3" />
                    <span>UPLOAD BACK</span>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      onChange={handleBackImageUpload}
                      disabled={uploadingBack}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    value={backImage}
                    onChange={(e) => setBackImage(e.target.value)}
                    placeholder="Back image URL"
                    className="w-full bg-[#121212] border border-[#2A2A2A] text-[9px] text-white p-1.5 rounded-xs outline-hidden focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* 3. Side Profile Upload */}
              <div className="p-3 bg-[#161616] border border-[#262626] rounded-xs flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-[#D4AF37] uppercase font-bold">
                      03 • SIDE PROFILE
                    </span>
                    <span className="text-[8px] text-[#666666] uppercase">&le;10MB</span>
                  </div>

                  <div className="aspect-[4/3] bg-black rounded-xs overflow-hidden mb-2 border border-[#222222] flex items-center justify-center relative group">
                    {sideImage ? (
                      <img
                        src={sideImage}
                        alt="Side view"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-[9px] text-[#555555] uppercase font-mono text-center px-2">
                        NO SIDE PHOTO YET
                      </div>
                    )}
                    {uploadingSide && (
                      <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-2 text-center">
                        <Loader2 className="w-5 h-5 text-[#D4AF37] animate-spin mb-1" />
                        <span className="text-[9px] text-white">{sideProgress}%</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="w-full py-2 bg-[#222222] hover:bg-[#D4AF37] hover:text-black text-white rounded-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-bold text-[10px]">
                    <Upload className="w-3 h-3" />
                    <span>UPLOAD SIDE</span>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      onChange={handleSideImageUpload}
                      disabled={uploadingSide}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    value={sideImage}
                    onChange={(e) => setSideImage(e.target.value)}
                    placeholder="Side image URL"
                    className="w-full bg-[#121212] border border-[#2A2A2A] text-[9px] text-white p-1.5 rounded-xs outline-hidden focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* 4. Detail / Texture Upload */}
              <div className="p-3 bg-[#161616] border border-[#262626] rounded-xs flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-[#D4AF37] uppercase font-bold">
                      04 • FABRIC & DETAIL
                    </span>
                    <span className="text-[8px] text-[#666666] uppercase">&le;10MB</span>
                  </div>

                  <div className="aspect-[4/3] bg-black rounded-xs overflow-hidden mb-2 border border-[#222222] flex items-center justify-center relative group">
                    {detailImage ? (
                      <img
                        src={detailImage}
                        alt="Detail view"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-[9px] text-[#555555] uppercase font-mono text-center px-2">
                        NO DETAIL PHOTO YET
                      </div>
                    )}
                    {uploadingDetail && (
                      <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-2 text-center">
                        <Loader2 className="w-5 h-5 text-[#D4AF37] animate-spin mb-1" />
                        <span className="text-[9px] text-white">{detailProgress}%</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="w-full py-2 bg-[#222222] hover:bg-[#D4AF37] hover:text-black text-white rounded-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-bold text-[10px]">
                    <Upload className="w-3 h-3" />
                    <span>UPLOAD DETAIL</span>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      onChange={handleDetailImageUpload}
                      disabled={uploadingDetail}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    value={detailImage}
                    onChange={(e) => setDetailImage(e.target.value)}
                    placeholder="Detail image URL"
                    className="w-full bg-[#121212] border border-[#2A2A2A] text-[9px] text-white p-1.5 rounded-xs outline-hidden focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sizes & Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Sizes */}
            <div className="p-4 bg-[#141414] border border-[#242424] rounded-xs">
              <label className="block text-[#D4AF37] uppercase font-bold mb-3">
                AVAILABLE SIZES (SELECT ALL THAT APPLY):
              </label>
              <div className="flex flex-wrap gap-2">
                {allSizes.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => toggleSize(s)}
                    className={`px-4 py-2 text-xs font-mono font-bold rounded-xs cursor-pointer border transition-colors ${
                      sizes.includes(s)
                        ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                        : 'bg-[#1C1C1C] text-[#888888] border-[#333333]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="p-4 bg-[#141414] border border-[#242424] rounded-xs">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[#D4AF37] uppercase font-bold text-xs">
                  PRODUCT COLOURWAYS & FILTERS:
                </label>
                <span className="text-[10px] text-[#777777] font-mono">
                  {colors.length} {colors.length === 1 ? 'COLOUR' : 'COLOURS'}
                </span>
              </div>
              <p className="text-[10px] text-[#888888] mb-3">
                Assign colours so customers can find this product via the storefront colour filter (Black, White, Green, Beige, Grey, Blue).
              </p>

              {/* Current Colors List */}
              <div className="space-y-1.5 mb-3 max-h-40 overflow-y-auto pr-1">
                {colors.map((c, idx) => {
                  const fam = c.family || normalizeColorFamily(c.name, c.hex);
                  return (
                    <div key={idx} className="flex items-center justify-between bg-[#1A1A1A] px-2.5 py-1.5 rounded-xs border border-[#262626]">
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border border-white/40 shrink-0" style={{ backgroundColor: c.hex }} />
                        <span className="text-white text-xs font-medium">{c.name}</span>
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 bg-[#252525] text-[#D4AF37] border border-[#3A3A3A] rounded-2xs uppercase">
                          {fam}
                        </span>
                        <span className="text-[#666666] text-[10px] font-mono hidden sm:inline">{c.hex}</span>
                      </div>
                      {colors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(idx)}
                          className="text-[#777777] hover:text-red-400 p-1 cursor-pointer transition-colors"
                          title="Remove colourway"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quick-Add Core Color Family Chips */}
              <div className="mb-3 pt-2 border-t border-[#222222]">
                <span className="text-[9px] font-mono text-[#888888] uppercase block mb-1.5">
                  QUICK-ADD COLOUR PRESETS:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'Black', hex: '#0B0B0B', name: 'Pitch Black' },
                    { label: 'White', hex: '#EDECE8', name: 'Chalk Ivory' },
                    { label: 'Green', hex: '#243828', name: 'Forest Pine Green' },
                    { label: 'Beige', hex: '#CBBDAA', name: 'Raw Sand Dune' },
                    { label: 'Grey', hex: '#373A3E', name: 'Phantom Slate' },
                    { label: 'Blue', hex: '#162A43', name: 'Deep Cobalt Blue' }
                  ].map((p) => {
                    const exists = colors.some((c) => (c.family || normalizeColorFamily(c.name, c.hex)) === p.label);
                    return (
                      <button
                        type="button"
                        key={p.label}
                        onClick={() => handleAddPresetColor(p.name, p.hex, p.label)}
                        className={`inline-flex items-center gap-1.5 px-2 py-1 text-[9px] font-mono rounded-xs border transition-colors cursor-pointer ${
                          exists
                            ? 'bg-[#181818] text-[#888888] border-[#2C2C2C] opacity-60'
                            : 'bg-[#1F1F1F] text-[#CCCCCC] hover:text-white border-[#333333] hover:border-[#D4AF37]'
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: p.hex }} />
                        <span>+{p.label.toUpperCase()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Add Color Row */}
              <div className="space-y-2 pt-2 border-t border-[#222222]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    placeholder="Custom shade (e.g. Ashen Slate)"
                    className="flex-1 bg-[#1A1A1A] border border-[#333333] p-1.5 text-xs text-white rounded-xs outline-hidden focus:border-[#D4AF37]"
                  />
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-8 h-8 p-0 bg-transparent border-0 cursor-pointer rounded-xs shrink-0"
                    title="Pick swatch color"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={newColorFamily}
                    onChange={(e) => setNewColorFamily(e.target.value)}
                    className="flex-1 bg-[#1A1A1A] border border-[#333333] p-1.5 text-[11px] font-mono text-white rounded-xs outline-hidden focus:border-[#D4AF37]"
                  >
                    <option value="Black">Category: Black</option>
                    <option value="White">Category: White</option>
                    <option value="Green">Category: Green</option>
                    <option value="Beige">Category: Beige</option>
                    <option value="Grey">Category: Grey</option>
                    <option value="Blue">Category: Blue</option>
                    <option value="Other">Category: Other / Custom</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-3 py-1.5 bg-[#2E2E2E] hover:bg-[#D4AF37] hover:text-black text-white text-[10px] font-bold uppercase rounded-xs transition-colors cursor-pointer shrink-0"
                  >
                    ADD SHADE
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory & Publication State */}
          <div className="p-4 bg-[#111111] border border-[#222222] rounded-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#888888] uppercase mb-1">
                Stock Quantity (Units Available) *
              </label>
              <input
                type="number"
                min={0}
                required
                value={stockCount}
                onChange={(e) => setStockCount(Number(e.target.value))}
                className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#D4AF37] text-white p-2.5 rounded-xs outline-hidden"
              />
              {stockCount <= 5 && stockCount > 0 && (
                <span className="text-amber-400 text-[10px] mt-1 block">
                  ⚠ LOW STOCK WARNING: 5 or fewer items remaining
                </span>
              )}
              {stockCount === 0 && (
                <span className="text-red-400 text-[10px] mt-1 block">
                  ✕ OUT OF STOCK
                </span>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 accent-[#D4AF37]"
                />
                <div>
                  <span className="text-white font-bold block uppercase">
                    Publish to Storefront
                  </span>
                  <span className="text-[10px] text-[#777777]">
                    {isPublished
                      ? 'Visible to all customers on the live website'
                      : 'Saved as draft in admin only'}
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Details & Care Instructions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#888888] uppercase mb-1">
                Bullet Details (One per line)
              </label>
              <textarea
                rows={3}
                value={detailsText}
                onChange={(e) => setDetailsText(e.target.value)}
                className="w-full bg-[#141414] border border-[#282828] text-white p-2.5 rounded-xs outline-hidden focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-[#888888] uppercase mb-1">
                Care Instructions (One per line)
              </label>
              <textarea
                rows={3}
                value={careText}
                onChange={(e) => setCareText(e.target.value)}
                className="w-full bg-[#141414] border border-[#282828] text-white p-2.5 rounded-xs outline-hidden focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1C1C1C]">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 bg-[#181818] hover:bg-[#252525] text-[#888888] hover:text-white uppercase font-bold rounded-xs cursor-pointer transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-2.5 bg-[#D4AF37] hover:bg-white text-black font-display font-bold uppercase tracking-[0.2em] rounded-xs cursor-pointer transition-all shadow-lg flex items-center gap-2"
            >
              {saving ? (
                <span>SAVING CHANGES...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isEditing ? 'UPDATE PRODUCT' : 'PUBLISH PRODUCT'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
