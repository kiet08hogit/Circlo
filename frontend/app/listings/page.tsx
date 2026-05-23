'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Loader2, Search, Filter, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Seller {
  id: string;
  name?: string;
  username?: string;
  avatarUrl?: string;
}

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  seller: Seller;
  createdAt: string;
}

const CATEGORIES = [
  { id: 'HOUSING', label: 'DORM' },
  { id: 'CLOTHES', label: 'CLOTHES' },
  { id: 'SCHOOL', label: 'SCHOOL' },
  { id: 'LEISURE', label: 'LEISURE' },
  { id: 'ALL', label: 'ALL PRODUCTS' },
];

export default function ListingsGridPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || 'ALL';
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      if (!isLoaded || !isSignedIn) return;
      setIsLoading(true);
      try {
        const token = await getToken();
        // If 'ALL' is selected, don't pass the category query parameter
        const url = activeCategory === 'ALL' 
          ? 'http://localhost:3000/listings/all' 
          : `http://localhost:3000/listings/all?category=${activeCategory}`;
          
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setListings(data);
        }
      } catch (err) {
        console.error('Failed to fetch listings', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchListings();
  }, [isLoaded, isSignedIn, getToken, activeCategory]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-[#DC2626]" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white flex flex-col font-sans">
      
      {/* Main Content Grid */}

      {/* Main Content Grid */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
        
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#DC2626]" />
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <motion.div 
                key={listing.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group cursor-pointer bg-white border border-zinc-100 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Image Placeholder */}
                <div className="aspect-square bg-zinc-50 relative flex items-center justify-center overflow-hidden border-b border-zinc-100">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent z-10" />
                  <Sparkles className="h-10 w-10 text-zinc-200" />
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-lg text-black">${listing.price}</span>
                    <span className="text-[10px] font-bold px-2 py-1 bg-zinc-100 text-zinc-600 rounded uppercase tracking-widest">
                      {listing.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-zinc-800 line-clamp-1 group-hover:text-[#3252DF] transition-colors">
                    {listing.title}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1.5 font-medium">
                    <span className="w-4 h-4 bg-zinc-200 rounded-full flex items-center justify-center font-bold text-[8px] text-zinc-500">
                      {listing.seller?.name?.[0] || 'U'}
                    </span>
                    {listing.seller?.name || 'UIC Student'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="h-20 w-20 bg-zinc-50 border border-zinc-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <Filter className="h-8 w-8 text-zinc-300" />
            </div>
            <h3 className="text-xl font-bold text-black mb-2">No listings found</h3>
            <p className="text-zinc-500 font-medium max-w-sm">
              There are currently no items available in <span className="font-bold text-black">{CATEGORIES.find(c => c.id === activeCategory)?.label}</span>. 
            </p>
            <Link href="/add-product" className="mt-8 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-red-500/20 transition-all hover:-translate-y-0.5">
              Be the first to list one!
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
