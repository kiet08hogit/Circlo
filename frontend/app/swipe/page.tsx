'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X, Heart, Loader2, Frown, Sparkles, PlusCircle } from 'lucide-react';
import Link from 'next/link';

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
}

export default function SwipePage() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the feed
  useEffect(() => {
    const fetchFeed = async () => {
      if (!isLoaded || !isSignedIn) return;
      try {
        const token = await getToken();
        const res = await fetch('http://localhost:3000/listings', {
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
    fetchFeed();
  }, [isLoaded, isSignedIn, getToken]);

  const activeListing = listings[0];

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (!activeListing) return;

    const interactionType = direction === 'right' ? 'LIKE' : 'SKIP';
    
    // Optimistic UI update: Remove the swiped card from the array immediately
    setListings((prev) => prev.slice(1));

    try {
      const token = await getToken();
      await fetch(`http://localhost:3000/listings/${activeListing.id}/swipe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ type: interactionType })
      });
    } catch (err) {
      console.error('Failed to record swipe', err);
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    // If dragged far enough or fast enough, register the swipe
    if (offset > 100 || velocity > 500) {
      handleSwipe('right');
    } else if (offset < -100 || velocity < -500) {
      handleSwipe('left');
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="h-10 w-10 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden bg-zinc-50 dark:bg-zinc-950 px-4">
      
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-red-600/10 blur-[100px]" />
      <div className="absolute bottom-0 left-0 -z-10 h-96 w-96 rounded-full bg-rose-500/10 blur-[100px]" />

      <div className="absolute top-6 right-6 z-50">
        <Link href="/add-product" className="flex items-center gap-2 rounded-full bg-white dark:bg-zinc-900 px-5 py-2.5 font-bold text-zinc-800 dark:text-zinc-200 shadow-lg border border-zinc-200 dark:border-zinc-800 hover:scale-105 active:scale-95 transition-all">
          <PlusCircle className="h-5 w-5 text-red-500" /> List an Item
        </Link>
      </div>

      <div className="relative h-[550px] w-full max-w-sm mt-8">
        <AnimatePresence>
          {activeListing ? (
            <motion.div
              key={activeListing.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ 
                x: 0, 
                opacity: 0, 
                scale: 0.9, 
                transition: { duration: 0.2 } 
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 z-10 flex cursor-grab active:cursor-grabbing flex-col overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-zinc-800 to-zinc-950 shadow-2xl border-4 border-zinc-800"
            >
              <div className="flex flex-1 flex-col justify-end p-8 text-white relative h-full">
                
                {/* Fallback pattern for when images are missing */}
                <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                  <Sparkles className="h-48 w-48 text-white" />
                </div>
                
                <div className="relative z-20 space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                      {activeListing.category}
                    </span>
                    <span className="text-3xl font-extrabold text-white drop-shadow-md bg-white/10 px-3 py-1 rounded-2xl backdrop-blur-sm">
                      ${activeListing.price}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl font-bold leading-tight mt-2">{activeListing.title}</h2>
                  <p className="text-sm text-zinc-300 line-clamp-3">{activeListing.description}</p>
                  
                  <div className="flex items-center gap-3 pt-4 mt-2 border-t border-white/20">
                    <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center font-bold text-sm shadow-inner">
                      {activeListing.seller?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="text-sm font-medium">
                      Sold by {activeListing.seller?.name || 'Unknown Student'}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm text-zinc-500 shadow-inner">
              <div className="rounded-full bg-zinc-200 dark:bg-zinc-800 p-4 mb-4">
                <Frown className="h-10 w-10 text-zinc-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-700 dark:text-zinc-300">You're all caught up!</h3>
              <p className="mt-2 text-center text-sm px-6 max-w-xs">Check back later for more listings from UIC students.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Swipe Controls */}
      <div className="mt-10 flex items-center justify-center gap-6 z-20">
        <button
          onClick={() => handleSwipe('left')}
          disabled={!activeListing}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-rose-500 shadow-xl transition-all hover:scale-110 hover:shadow-rose-500/20 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          <X className="h-8 w-8 stroke-[3]" />
        </button>
        <button
          onClick={() => handleSwipe('right')}
          disabled={!activeListing}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-emerald-500 shadow-xl transition-all hover:scale-110 hover:shadow-emerald-500/20 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          <Heart className="h-8 w-8 stroke-[3] fill-emerald-500/20" />
        </button>
      </div>
    </div>
  );
}
