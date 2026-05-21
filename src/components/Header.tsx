import { getUserIdFromCookie } from "@/lib/context";
import { Book, History, LogIn, PlusCircle, User2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Header() {
  const user = await getUserIdFromCookie();

  return (
    <nav className="w-full border-b border-pink-500/20 sticky top-0 z-50 bg-gradient-to-r from-[#2b0f3a] via-[#1f082a] to-[#0d0014] backdrop-blur-xl shadow-[0_2px_20px_rgba(236,72,153,0.15)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-pink-500/50 shadow-[0_0_12px_rgba(236,72,153,0.3)] group-hover:shadow-[0_0_18px_rgba(236,72,153,0.5)] transition-shadow duration-300">
              <Image
                src="/rakshak.png"
                alt="Rakshak Logo"
                fill
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div className="leading-tight">
              <p className="text-sm sm:text-base md:text-lg font-semibold text-pink-400 group-hover:text-pink-300 transition-colors duration-200">
                Rakshak
              </p>
              <p className="hidden xs:block text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-white/50">
                Safety alerts made simple
              </p>
            </div>
          </Link>

          {/* Nav Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <NavLink href="/sos" icon={<History size={15} />} label="Alerts" />
            <NavLink href="/documentation" icon={<Book size={15} />} label="Docs" />

            {user ? (
              <NavLink
                href={`/profile/${user}`}
                icon={<User2Icon size={15} />}
                label="Profile"
              />
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 rounded-full bg-green-600/90 hover:bg-green-500 px-3 sm:px-3.5 py-1.5 sm:py-2 text-white text-xs sm:text-sm font-medium shadow-[0_0_12px_rgba(34,197,94,0.25)] hover:shadow-[0_0_18px_rgba(34,197,94,0.4)] transition-all duration-200 active:scale-95"
                >
                  <LogIn size={14} />
                  <span className="hidden sm:inline">Login</span>
                </Link>
                <NavLink href="/signup" icon={<PlusCircle size={15} />} label="Sign Up" />
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}

// Reusable nav button component
function NavLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-pink-600/80 hover:border-pink-500/40 px-2 py-1.5 sm:py-2 text-white/80 hover:text-white text-xs sm:text-sm font-medium transition-all duration-200 active:scale-95 hover:shadow-[0_0_12px_rgba(236,72,153,0.2)]"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}