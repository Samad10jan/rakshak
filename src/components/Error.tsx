import { AlertTriangle } from "lucide-react";

export default function Error({ error }: { error: any }) {
  const message =
    typeof error === "string"
      ? error
      : error?.message || "Something went wrong. Please try again.";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#1a0623] via-slate-950 to-black px-4">
      <div className="w-full max-w-md rounded-2xl border border-rose-500/20 bg-slate-900/80 p-6 shadow-2xl shadow-black/40 sm:p-8">

        {/* Icon */}
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 ring-1 ring-rose-500/20">
          <AlertTriangle size={22} className="text-rose-400" />
        </div>

        {/* Title */}
        <p className="text-[10px] uppercase tracking-[0.3em] text-rose-400 font-medium">
          Error
        </p>
        <h1 className="mt-1.5 text-xl font-bold tracking-tight text-white sm:text-2xl">
          Something went wrong
        </h1>

        {/* Message */}
        <p className="mt-3 text-sm leading-relaxed text-slate-400">{message}</p>

        {/* Divider */}
        <div className="my-5 h-px bg-white/8" />

        {/* Action */}
        <button
          onClick={() => window.location.reload()}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-500/90 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 transition hover:bg-rose-500 active:scale-[0.98]"
        >
          Try again
        </button>
      </div>
    </div>
  );
}