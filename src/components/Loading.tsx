export default function Loading() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-950 via-[#120519] to-black">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-white border-r-transparent"></div>
          <p className="mt-4 text-lg text-slate-300">Loading...</p>
        </div>
      </div>
    )
}