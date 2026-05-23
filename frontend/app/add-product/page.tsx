'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Tag, AlignLeft, DollarSign, ListPlus, Loader2, Sparkles, ImagePlus } from 'lucide-react';
import Link from 'next/link';

export default function AddProductPage() {
  const { getToken } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'SCHOOL',
  });

  const categories = ['SCHOOL', 'CLOTHES', 'HOUSING', 'LEISURE'];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = await getToken();
      
      const response = await fetch('http://localhost:3000/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create listing. Please check your inputs.');
      }

      // Automatically redirect to the marketplace/swipe page on success
      router.push('/listings');
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the listing.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white py-12 px-4 sm:px-6 relative overflow-hidden font-sans">
      
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-red-600/5 blur-[100px]" />
      <div className="absolute bottom-0 left-0 -z-10 h-96 w-96 rounded-full bg-orange-500/5 blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        {/* Back Button */}
        <Link href="/listings" className="inline-flex items-center gap-2 text-zinc-500 hover:text-black transition-colors mb-8 font-medium">
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </Link>

        {/* Header */}
        <div className="space-y-2 mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-black flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-[#DC2626]" />
            Create a Listing
          </h1>
          <p className="text-zinc-500 text-lg font-medium">
            Share what you're offering with the UIC community.
          </p>
        </div>

        {/* Premium Form Card */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-xl shadow-zinc-200/50 relative">
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-[#DC2626] text-sm font-bold rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-black flex items-center gap-2">
                <Tag className="h-4 w-4 text-zinc-400" />
                Title
              </label>
              <input
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. TI-84 Plus CE Calculator"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-black focus:outline-none focus:ring-2 focus:ring-[#3252DF]/50 transition-all placeholder:text-zinc-400 font-medium"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-black flex items-center gap-2">
                <AlignLeft className="h-4 w-4 text-zinc-400" />
                Description
              </label>
              <textarea
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the condition, location to meet up, etc."
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-black focus:outline-none focus:ring-2 focus:ring-[#3252DF]/50 transition-all placeholder:text-zinc-400 resize-none font-medium"
              />
            </div>

            {/* Image Upload UI */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-black flex items-center gap-2">
                <ImagePlus className="h-4 w-4 text-zinc-400" />
                Upload Picture
              </label>
              
              <div className="relative group border-2 border-dashed border-zinc-300 hover:border-[#3252DF]/50 rounded-2xl p-6 transition-all text-center overflow-hidden cursor-pointer bg-zinc-50">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                
                {imagePreview ? (
                  <div className="relative h-48 w-full rounded-xl overflow-hidden shadow-inner">
                    <img src={imagePreview} alt="Preview" className="object-cover w-full h-full" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold backdrop-blur-sm">
                      Click to change image
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-3 py-4 text-zinc-500">
                    <div className="h-14 w-14 rounded-full bg-[#3252DF]/10 text-[#3252DF] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#3252DF]/20 transition-all duration-300 shadow-sm">
                      <ImagePlus className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="font-bold text-black">Click or drag a picture to upload</p>
                      <p className="text-xs mt-1 font-medium text-zinc-400">PNG, JPG, or WEBP (Max 5MB)</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-black flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-zinc-400" />
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">$</span>
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-8 pr-4 py-3.5 text-black focus:outline-none focus:ring-2 focus:ring-[#3252DF]/50 transition-all placeholder:text-zinc-400 font-medium"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-black flex items-center gap-2">
                  <ListPlus className="h-4 w-4 text-zinc-400" />
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-black focus:outline-none focus:ring-2 focus:ring-[#3252DF]/50 transition-all appearance-none cursor-pointer font-medium"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0) + cat.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full cursor-pointer flex items-center justify-center gap-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-red-600/20 transition-all hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating Listing...
                  </>
                ) : (
                  'Publish Listing'
                )}
              </button>
            </div>

          </form>
        </div>
      </motion.div>
    </div>
  );
}
