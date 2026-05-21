'use client';

import { useState } from "react";
import { SignUpButton, Show } from "@clerk/nextjs";
import Link from "next/link";

interface Product {
  id: number;
  title: string;
  price: number;
  condition: string;
  description: string;
  seller: string;
  major: string;
  year: string;
  gradient: string;
  emoji: string;
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    title: "UIC Crimson Hoodie",
    price: 25,
    condition: "Like New",
    description: "Super cozy, worn twice. Perfect for showing off school spirit at the Credit Union 1 Arena!",
    seller: "Emily S.",
    major: "Computer Science",
    year: "Junior",
    gradient: "from-red-500 to-rose-600",
    emoji: "🧥",
  },
  {
    id: 2,
    title: "TI-84 Plus CE Calculator",
    price: 70,
    condition: "Good",
    description: "Survived MATH 180 (Calculus I) and 181. Battery lasts forever, charger included.",
    seller: "Marcus K.",
    major: "Mechanical Engineering",
    year: "Sophomore",
    gradient: "from-slate-700 to-slate-900",
    emoji: "📟",
  },
  {
    id: 3,
    title: "Schwinn Cruiser Bike",
    price: 110,
    condition: "Used",
    description: "Great for riding between East and West campuses. Comes with a heavy-duty U-Lock.",
    seller: "Sarah L.",
    major: "Kinesiology",
    year: "Senior",
    gradient: "from-amber-500 to-orange-600",
    emoji: "🚲",
  },
  {
    id: 4,
    title: "iPad Air (4th Gen) 64GB",
    price: 280,
    condition: "Excellent",
    description: "No scratches. Perfect for digital note-taking during lectures. Selling since I upgraded.",
    seller: "Devon M.",
    major: "Biomedical Sciences",
    year: "Senior",
    gradient: "from-blue-500 to-indigo-600",
    emoji: "📱",
  },
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [isMatch, setIsMatch] = useState(false);
  const [recentMatchSeller, setRecentMatchSeller] = useState("");

  const currentProduct = MOCK_PRODUCTS[currentIndex];

  const handleSwipe = (direction: "left" | "right") => {
    if (swipeDirection) return; // Prevent double clicks
    setSwipeDirection(direction);

    // Simulate match on "like" (right swipe) - 50% chance
    if (direction === "right" && Math.random() > 0.5) {
      setTimeout(() => {
        setRecentMatchSeller(currentProduct.seller);
        setIsMatch(true);
      }, 250);
    }

    setTimeout(() => {
      setSwipeDirection(null);
      setCurrentIndex((prev) => (prev + 1) % MOCK_PRODUCTS.length);
    }, 350);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-red-600/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Hero Text */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-200/60 bg-red-50/50 px-3 py-1 text-sm font-semibold text-red-600 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
              <svg className="h-4 w-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Exclusively for @uic.edu Emails
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Discover UIC Campus Treasures. <br />
              <span className="bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">
                Swipe to Buy & Sell.
              </span>
            </h1>

            <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              FlamesPorium brings a Tinder-style swiping interface to your campus marketplace. 
              Find textbooks, housing, electronics, and apparel. No external spam, no sketchy meetups—just verified UIC students.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Show when="signed-out">
                <SignUpButton mode="modal">
                  <button className="cursor-pointer inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-red-600/20 hover:bg-red-500 hover:shadow-red-500/30 transition-all duration-200">
                    Get Started with @uic.edu
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <Link href="/swipe">
                  <span className="cursor-pointer inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-red-600/20 hover:bg-red-500 hover:shadow-red-500/30 transition-all duration-200">
                    Start Swiping Now
                  </span>
                </Link>
              </Show>
              <a 
                href="#how-it-works"
                className="cursor-pointer inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-6 py-3 text-base font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/80 transition-colors"
              >
                Learn More
              </a>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-zinc-200 dark:border-zinc-850">
              <div>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">1,200+</p>
                <p className="text-sm text-zinc-500">Active Students</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">4,800+</p>
                <p className="text-sm text-zinc-500">Deal Matches</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">100%</p>
                <p className="text-sm text-zinc-500">UIC Verified</p>
              </div>
            </div>
          </div>

          {/* Right Column: Swipe Simulator */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="text-center mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Interactive Concept Preview
              </span>
            </div>

            {/* Phone Container */}
            <div className="relative w-[340px] h-[520px] rounded-[40px] border-[8px] border-zinc-900 bg-zinc-900 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col justify-between">
              
              {/* Phone Camera Notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-4 rounded-full bg-zinc-900 dark:bg-zinc-800 z-30" />

              {/* Card Container */}
              <div className="relative flex-1 w-full p-4 pt-8 flex items-center justify-center">
                {currentProduct ? (
                  <div
                    className={`relative w-full h-[380px] rounded-3xl overflow-hidden shadow-xl transition-all duration-300 bg-gradient-to-br ${
                      currentProduct.gradient
                    } flex flex-col justify-between p-6 text-white ${
                      swipeDirection === "left"
                        ? "-translate-x-full rotate-[-12deg] opacity-0"
                        : swipeDirection === "right"
                        ? "translate-x-full rotate-[12deg] opacity-0"
                        : "translate-x-0 rotate-0 opacity-100"
                    }`}
                  >
                    {/* Top Tag & Price */}
                    <div className="flex justify-between items-start">
                      <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-bold uppercase tracking-wider">
                        {currentProduct.condition}
                      </span>
                      <span className="text-2xl font-extrabold bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-2xl">
                        ${currentProduct.price}
                      </span>
                    </div>

                    {/* Emoji / Core Display */}
                    <div className="flex items-center justify-center text-7xl select-none my-4">
                      {currentProduct.emoji}
                    </div>

                    {/* Details Overlay */}
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold tracking-tight">{currentProduct.title}</h3>
                      <p className="text-xs text-white/80 line-clamp-2">{currentProduct.description}</p>
                      
                      {/* Seller Tag */}
                      <div className="flex items-center gap-2 pt-2 border-t border-white/20 text-xs">
                        <div className="h-6 w-6 rounded-full bg-white/30 flex items-center justify-center font-bold">
                          {currentProduct.seller[0]}
                        </div>
                        <div>
                          <p className="font-semibold">{currentProduct.seller}</p>
                          <p className="text-[10px] text-white/70">{currentProduct.major} • {currentProduct.year}</p>
                        </div>
                      </div>
                    </div>

                    {/* Swipe Visual Indicators */}
                    {swipeDirection === "right" && (
                      <div className="absolute top-12 left-6 border-4 border-emerald-500 text-emerald-500 font-extrabold text-2xl px-4 py-1 rounded-lg rotate-[-12deg] tracking-widest uppercase">
                        LIKE
                      </div>
                    )}
                    {swipeDirection === "left" && (
                      <div className="absolute top-12 right-6 border-4 border-rose-500 text-rose-500 font-extrabold text-2xl px-4 py-1 rounded-lg rotate-[12deg] tracking-widest uppercase">
                        PASS
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-zinc-500 text-sm">No products left!</div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="h-20 bg-zinc-950 px-8 flex justify-around items-center border-t border-zinc-800">
                <button
                  onClick={() => handleSwipe("left")}
                  className="h-12 w-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:scale-105 hover:bg-zinc-800 transition-all text-rose-500 shadow-md shadow-rose-500/5 cursor-pointer"
                  aria-label="Pass"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <button
                  onClick={() => handleSwipe("right")}
                  className="h-12 w-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:scale-105 hover:bg-zinc-800 transition-all text-emerald-500 shadow-md shadow-emerald-500/5 cursor-pointer"
                  aria-label="Like"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              {/* Match Overlay */}
              {isMatch && (
                <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 space-y-4 animate-fade-in z-50">
                  <div className="text-5xl animate-bounce">🔥</div>
                  <h4 className="text-2xl font-extrabold text-white">It's a Match!</h4>
                  <p className="text-sm text-zinc-300">
                    {recentMatchSeller} likes your swipe. You can now chat to finalize the deal!
                  </p>
                  <div className="space-y-2 w-full pt-4">
                    <button
                      onClick={() => setIsMatch(false)}
                      className="cursor-pointer w-full py-2.5 bg-red-600 text-white rounded-full font-semibold text-sm hover:bg-red-500 transition-colors shadow-lg shadow-red-600/30"
                    >
                      Keep Swiping
                    </button>
                    <button
                      onClick={() => setIsMatch(false)}
                      className="cursor-pointer w-full py-2.5 bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-full font-semibold text-sm hover:bg-zinc-700 transition-colors"
                    >
                      View Matches
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Feature section */}
      <section id="how-it-works" className="py-20 border-t border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight">How FlamesPorium Works</h2>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
              Simple, fun, and extremely safe. Standard peer-to-peer campus shopping reimagined.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="relative rounded-2xl border border-zinc-200/50 bg-zinc-50/50 p-8 dark:border-zinc-800/40 dark:bg-zinc-900/40 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/10 text-red-600 font-bold text-lg">
                  1
                </span>
                <h3 className="text-xl font-bold">Sign Up & Verify</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                  Sign up with your <strong>@uic.edu</strong> email address. We verify your status to keep out scammers and ensure a safe, closed student environment.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-2xl border border-zinc-200/50 bg-zinc-50/50 p-8 dark:border-zinc-800/40 dark:bg-zinc-900/40 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/10 text-red-600 font-bold text-lg">
                  2
                </span>
                <h3 className="text-xl font-bold">Swipe to Match</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                  Browse products listed by other students. Swipe right if you are interested, left to skip. If the seller approves, it's a match!
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-2xl border border-zinc-200/50 bg-zinc-50/50 p-8 dark:border-zinc-800/40 dark:bg-zinc-900/40 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/10 text-red-600 font-bold text-lg">
                  3
                </span>
                <h3 className="text-xl font-bold">Chat & Exchange</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                  Once you match, a real-time chat unlocks. Agree on a meetup location on campus (like the UIC Quad or Student Center) to safely complete the swap.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

