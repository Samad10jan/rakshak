import { getUserIdFromCookie } from "@/lib/context";
import { Book, History, LogIn, PlusCircle, User2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Header() {
  const user = await getUserIdFromCookie();

  return (
    <nav className="w-full border-b border-pink-500/30 sticky top-0 z-50 bg-gradient-to-br from-[#2b0f3a] via-[#1f082a] to-black/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-pink-500/50 shadow-lg">
            <Image
              src="/rakshak.png"
              alt="Rakshak Logo"
              fill
              className="object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <p className="text-base sm:text-lg md:text-xl font-semibold text-pink-400">Rakshak</p>
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/70">Safety alerts made simple</p>
          </div>
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/sos"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-white transition hover:bg-pink-600/90"
          >
            <History size={18} />
            <span className="text-sm">Alerts</span>
          </Link>

          <Link
            href="/documentation"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-white transition hover:bg-pink-600/90"
          >
            <Book size={18} />
            <span className="text-sm">Docs</span>
          </Link>

          {user ? (
            <Link
              href={`/profile/${user}`}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-white transition hover:bg-pink-600/90"
            >
              <User2Icon size={18} />
              <span className="text-sm">Profile</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-full bg-green-600 px-3 py-2 text-white shadow-lg transition hover:bg-green-700"
            >
              <LogIn size={18} />
              <span className="text-sm">Login</span>
            </Link>
          )}

          {!user && (
            <Link
              href="/signup"
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-white transition hover:bg-pink-600/90"
            >
              <PlusCircle size={18} />
              <span className="text-sm">Sign Up</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
