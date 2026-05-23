import type { Metadata } from "next";
import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton, SignOutButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Search } from "lucide-react";
import { ClientNav } from "./ClientNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlamesPorium | Verified UIC Student Marketplace",
  description: "Buy, sell, and swap items safely with verified @uic.edu student profiles.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;
  const isUic = email ? email.endsWith("@uic.edu") : true;

  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 antialiased">
        <ClerkProvider>
          {/* Clean White Header */}
          <header className="sticky top-0 z-50 w-full bg-white border-b border-zinc-200 shadow-sm">
            <div className="flex h-16 w-full items-center justify-between px-4 sm:px-8 lg:px-10 gap-4">
              {/* Logo */}
              <div className="flex items-center shrink-0">
                <Link href="/listings" className="text-xl sm:text-2xl font-black tracking-tighter text-[#3252DF]">
                  FlamesPorium
                </Link>
              </div>

              {/* Middle Section (Categories, Search, Create) */}
              <Show when="signed-in">
                <ClientNav />
              </Show>

              {/* Right Side Actions */}
              <nav className="flex items-center gap-4 shrink-0">
                <Show when="signed-out">
                  <SignUpButton mode="modal">
                    <button className="cursor-pointer rounded-full bg-[#3252DF] px-6 py-2 text-sm font-bold text-white transition-all hover:bg-[#2842B3] active:scale-95 shadow-sm">
                      Sign Up
                    </button>
                  </SignUpButton>
                  <SignInButton mode="modal">
                    <button className="cursor-pointer rounded-full bg-[#3252DF] px-6 py-2 text-sm font-bold text-white transition-all hover:bg-[#2842B3] active:scale-95 shadow-sm">
                      Log In
                    </button>
                  </SignInButton>
                </Show>
                <Show when="signed-in">
                  <div className="flex items-center gap-4">
                    {isUic && (
                      <span className="hidden lg:inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 shadow-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        UIC Verified
                      </span>
                    )}
                    <UserButton />
                  </div>
                </Show>
              </nav>
            </div>
          </header>

          <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
            {isUic ? (
              <div className="w-full">{children}</div>
            ) : (
              <div className="relative w-full max-w-md rounded-3xl border border-red-500/20 bg-white/80 dark:bg-zinc-900/80 p-8 shadow-2xl backdrop-blur-xl text-center space-y-6 overflow-hidden mx-4 my-8">
                {/* Background red glows */}
                <div className="absolute -top-24 -left-24 -z-10 h-48 w-48 rounded-full bg-red-600/10 blur-2xl" />
                <div className="absolute -bottom-24 -right-24 -z-10 h-48 w-48 rounded-full bg-rose-600/10 blur-2xl" />

                <div className="flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-900/30 animate-pulse">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-extrabold tracking-tight">Access Restricted</h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    FlamesPorium is a verified marketplace exclusively for UIC students. Only email addresses ending with <strong className="text-red-600 dark:text-red-400">@uic.edu</strong> are permitted to enter.
                  </p>
                </div>

                <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-950 p-4 border border-zinc-200/60 dark:border-zinc-800/65 text-xs text-zinc-500 space-y-1">
                  <p>You are signed in as:</p>
                  <p className="font-mono font-bold text-zinc-800 dark:text-zinc-200 text-sm truncate">{email}</p>
                </div>

                <SignOutButton redirectUrl="/">
                  <button className="cursor-pointer w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-full font-semibold text-sm transition-all duration-200 shadow-lg shadow-red-600/25">
                    Sign Out & Try Again
                  </button>
                </SignOutButton>
              </div>
            )}
          </main>
        </ClerkProvider>
      </body>
    </html>
  );
}

