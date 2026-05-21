import type { Metadata } from "next";
import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton, SignOutButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
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
          {/* Modern translucent glass header */}
          <header className="sticky top-0 z-50 w-full border-b border-zinc-200/60 bg-white/80 backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-950/80">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white font-extrabold text-lg shadow-md shadow-red-600/20">
                  F
                </span>
                <span className="text-xl font-bold tracking-tight">
                  Flames<span className="bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">Porium</span>
                </span>
              </div>
              <nav className="flex items-center gap-4">
                <Show when="signed-out">
                  <div className="flex items-center gap-3">
                    <SignInButton mode="modal">
                      <button className="cursor-pointer text-sm font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="cursor-pointer rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 hover:shadow transition-all duration-200">
                        Sign Up
                      </button>
                    </SignUpButton>
                  </div>
                </Show>
                <Show when="signed-in">
                  <div className="flex items-center gap-4">
                    {isUic && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
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

