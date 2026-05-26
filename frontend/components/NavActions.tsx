import Link from "next/link";
import { Heart } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import { ChatBadge } from "./ChatBadge";

export async function NavActions() {
  const { userId, getToken } = await auth();

  if (!userId) return null;

  let unreadCount = 0;
  try {
    const token = await getToken();
    if (token) {
      const res = await axios.get("http://localhost:3000/chat/unread-count", {
        headers: { Authorization: `Bearer ${token}` }
      });
      unreadCount = res.data.count || 0;
    }
  } catch (err) {
    console.error("Failed to fetch unread count (SSR):", err);
  }

  return (
    <div className="flex items-center gap-4">
      {/* Wishlist Link */}
      <Link href={`/profile/${userId}?tab=wishlist`} className="text-zinc-500 hover:text-white transition-colors">
        <Heart className="h-5 w-5" />
      </Link>

      {/* Chat Link with Badge */}
      <Link href="/chat" className="relative text-zinc-500 hover:text-white transition-colors">
        <ChatBadge initialCount={unreadCount} />
      </Link>
    </div>
  );
}
