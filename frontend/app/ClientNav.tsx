"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

const CATEGORIES = [
  { id: 'HOUSING', label: 'DORM' },
  { id: 'CLOTHES', label: 'CLOTHES' },
  { id: 'SCHOOL', label: 'SCHOOL' },
  { id: 'LEISURE', label: 'LEISURE' },
  { id: 'ALL', label: 'ALL PRODUCTS' },
];

export function ClientNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Try to get category from URL if we're on listings, else default to none
  const currentCategory = pathname === '/listings' 
    ? (searchParams.get('category') || 'ALL') 
    : '';

  // Only show the full navigation row if we are signed in and presumably on marketplace routes
  // But actually, we can show it globally since the layout dictates it.
  
  return (
    <div className="flex flex-1 items-center justify-between gap-6 px-8">
      
      {/* Categories */}
      <nav className="hidden lg:flex items-center gap-6">
        {CATEGORIES.map((cat) => {
          const isActive = currentCategory === cat.id;
          return (
            <Link
              key={cat.id}
              href={`/listings?category=${cat.id}`}
              className={`whitespace-nowrap font-bold text-[11px] tracking-widest transition-colors ${
                isActive 
                  ? 'text-[#DC2626]' 
                  : 'text-zinc-500 hover:text-black'
              }`}
            >
              {cat.label}
            </Link>
          );
        })}
      </nav>

      {/* Middle Search Bar */}
      <div className="flex-1 max-w-xl hidden md:block">
        <form action="/listings" className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input 
            type="text" 
            name="q"
            placeholder="Search Products..." 
            className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-2 pl-10 pr-4 text-xs text-zinc-900 focus:border-zinc-400 focus:outline-none font-medium transition-colors"
          />
        </form>
      </div>

      {/* Action Button */}
      <Link href="/add-product" className="hidden sm:flex text-xs font-bold text-white bg-[#272343] hover:bg-black px-4 py-2 rounded-md transition-colors items-center gap-2 whitespace-nowrap">
        + Create New Listing
      </Link>
    </div>
  );
}
