import { Book, History } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Header(){
    return(
         <nav className="w-full border-b border-pink-500/30 bg- sticky top-0 z-50 bg-gradient-to-br from-[#2b0f3a] via-[#1f082a] to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

         
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-5 h-5 sm:w-10 sm:h-10">
              <Image
                src="/rakshak.png"
                alt="Rakshak Logo"
                fill
                className="object-cover rounded"
                loading="lazy"
              />
            </div>
            <h1 className="text-sm sm:text-xl md:text-2xl font-bold text-pink-500">
              Rakshak
            </h1>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm md:text-base">

            <Link
              href="/sos"
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 hover:text-pink-500 transition"
            >
              <History size={22} color="white" />
            </Link>

            <Link
              href="/documentation"
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 hover:text-pink-500 transition"
            >
              <Book size={22} color="white" />
            </Link>

          </div>
        </div>
      </nav>
    )
}