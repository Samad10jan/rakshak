"use client";

import Error from "@/components/Error";
import Loading from "@/components/Loading";
import { Card, CardContent } from "@/components/ui/card";
import { Sos } from "@/lib/types";
import {
  CheckCircle2,
  ClipboardCopy,
  ExternalLink,
  Fullscreen,
  MapPin,
  Mic,
  Volume2,
  X as XIcon,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SosAlertPage() {
  const params = useParams();
  const sosId = params?.sosId as string;

  const [sos, setSos] = useState<Sos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    if (!sosId) return;
    setLoading(true);
    const getSos = async () => {
      try {
        const res = await fetch(`/api/sos-alert/${sosId}`, { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Failed to fetch SOS");
          setSos(null);
          return;
        }
        setSos(data.sos);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
        setSos(null);
      } finally {
        setLoading(false);
      }
    };
    getSos();
  }, [sosId]);

  useEffect(() => {
    if (sos?.status !== "active") return;
    const id = setInterval(async () => {
      try {
        const res = await fetch(`/api/sos-alert/${sos.id}`, { cache: "no-store" });
        const data = await res.json();
        if (res.ok) setSos(data.sos);
      } catch (err: any) {
        console.error(err.message);
      }
    }, 20000);
    return () => clearInterval(id);
  }, [sos]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullScreenImage(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } catch {
      console.error("Failed to copy");
    }
  };

  const resolveAlert = async () => {
    if (!sos) return;
    setResolving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/sos-alert/${sos.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "inactive" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ text: data.message || "Unable to update alert.", ok: false });
        return;
      }
      setSos(data.sos);
      setMessage({ text: "Alert resolved successfully.", ok: true });
    } catch (err: any) {
      setMessage({ text: err.message || "Something went wrong.", ok: false });
    } finally {
      setResolving(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (!sos) return null;

  const isActive = sos.status === "active";
  const userDetails = (sos as any).userDetails;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0623] via-slate-950 to-black px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">

      {/* Fullscreen image overlay */}
      {fullScreenImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={() => setFullScreenImage(null)}
        >
          <div
            className="relative mx-auto h-[82vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-slate-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={fullScreenImage}
              alt="Fullscreen media"
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
          <button
            className="absolute right-4 top-4 sm:right-6 sm:top-6 flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-xs sm:text-sm text-white transition hover:bg-white/20"
            onClick={() => setFullScreenImage(null)}
          >
            <XIcon size={14} /> Close
          </button>
        </div>
      )}

      <div className="mx-auto max-w-5xl space-y-4 sm:space-y-5">

        {/* Header */}
        <section className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/80 p-4 sm:p-6 shadow-2xl shadow-black/40">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

            {/* Left: title + meta */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-pink-400 font-medium">
                  SOS Alert
                </p>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold tracking-wider text-white ${
                    isActive
                      ? "bg-rose-500/80 ring-1 ring-rose-400/40"
                      : "bg-slate-600/80 ring-1 ring-slate-500/30"
                  }`}
                >
                  {sos.status.toUpperCase()}
                </span>
                {isActive && (
                  <span className="flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[10px] text-rose-400 ring-1 ring-rose-500/20">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-400" />
                    Live
                  </span>
                )}
              </div>
              <h1 className="mt-2 break-all text-lg font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
                {sos.id}
              </h1>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Raised on{" "}
                {new Date(sos.timestamp).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>

            {/* Right: actions */}
            <div className="flex shrink-0 flex-row flex-wrap gap-2 sm:flex-col sm:items-end">
              <button
                onClick={() => copyToClipboard(sos.id)}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 transition hover:bg-white/10 active:scale-95 sm:px-4 sm:text-sm"
              >
                {copiedId ? (
                  <CheckCircle2 size={14} className="text-green-400" />
                ) : (
                  <ClipboardCopy size={14} />
                )}
                {copiedId ? "Copied!" : "Copy ID"}
              </button>

              {isActive ? (
                <button
                  onClick={resolveAlert}
                  disabled={resolving}
                  className="inline-flex items-center gap-1.5 rounded-full bg-pink-500 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-pink-600/25 transition hover:bg-pink-400 active:scale-95 disabled:opacity-60 sm:px-4 sm:text-sm"
                >
                  {resolving ? "Resolving…" : "Mark Resolved"}
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-700/60 px-3 py-2 text-xs text-slate-300 sm:px-4 sm:text-sm">
                  <CheckCircle2 size={13} className="text-green-400" /> Resolved
                </span>
              )}
            </div>
          </div>

          {/* Feedback message */}
          {message && (
            <div
              className={`mt-4 rounded-xl px-4 py-3 text-xs sm:text-sm ${
                message.ok
                  ? "bg-green-500/10 text-green-300 ring-1 ring-green-500/20"
                  : "bg-rose-500/10 text-rose-300 ring-1 ring-rose-500/20"
              }`}
            >
              {message.text}
            </div>
          )}
        </section>

        {/* Location + Emergency info */}
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">

          {/* Location */}
          <Card className="rounded-2xl border border-white/10 bg-slate-900/70 shadow-xl shadow-black/20 sm:rounded-3xl">
            <CardContent className="p-4 sm:p-6">
              <h2 className="text-sm font-semibold text-white sm:text-base">Location</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/8 bg-slate-950/60 px-3 py-3 sm:px-4">
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-600">
                    Latitude
                  </p>
                  <p className="mt-1.5 font-mono text-sm text-slate-200 sm:text-base">
                    {sos.location?.lat?.toFixed(6) ?? "N/A"}
                  </p>
                </div>
                <div className="rounded-xl border border-white/8 bg-slate-950/60 px-3 py-3 sm:px-4">
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-600">
                    Longitude
                  </p>
                  <p className="mt-1.5 font-mono text-sm text-slate-200 sm:text-base">
                    {sos.location?.lng?.toFixed(6) ?? "N/A"}
                  </p>
                </div>
              </div>
              {sos.location && (
                
                 <a href={`https://www.google.com/maps?q=${sos.location.lat},${sos.location.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/80 transition hover:bg-pink-600/80 hover:text-white active:scale-95 sm:text-sm"
                >
                  <MapPin size={14} /> Open in Maps{" "}
                  <ExternalLink size={12} className="text-white/40" />
                </a>
              )}
            </CardContent>
          </Card>

          {/* Emergency info */}
          <Card className="rounded-2xl border border-white/10 bg-slate-900/70 shadow-xl shadow-black/20 sm:rounded-3xl">
            <CardContent className="p-4 sm:p-6">
              <h2 className="text-sm font-semibold text-white sm:text-base">
                User emergency info
              </h2>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Code word", value: userDetails?.codeWord },
                  { label: "Alert message", value: userDetails?.message },
                 
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-white/8 bg-slate-950/60 px-3 py-3 sm:px-4"
                  >
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-600">
                      {label}
                    </p>
                    <p className="mt-1 text-xs text-slate-300 sm:text-sm">
                      {value ?? (
                        <span className="italic text-slate-600">Not available</span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map preview */}
        {sos.location && (
          <Card className="rounded-2xl border border-white/10 bg-slate-900/70 shadow-xl shadow-black/20 sm:rounded-3xl">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-white sm:text-base">Map preview</h2>
                
                  <a href={`https://www.google.com/maps?q=${sos.location.lat},${sos.location.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs text-pink-400/70 transition-colors hover:text-pink-400"
                >
                  Open full map <ExternalLink size={11} />
                </a>
              </div>
              <div className="mt-4 overflow-hidden rounded-xl border border-white/10 sm:rounded-2xl">
                <iframe
                  title="SOS Alert Location Map"
                  width="100%"
                  height="300"
                  className="block sm:h-[340px] lg:h-[380px]"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                    sos.location.lng - 0.011
                  }%2C${sos.location.lat - 0.011}%2C${
                    sos.location.lng + 0.011
                  }%2C${sos.location.lat + 0.011}&layer=mapnik&marker=${
                    sos.location.lat
                  }%2C${sos.location.lng}`}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Media */}
        <Card className="rounded-2xl border border-white/10 bg-slate-900/70 shadow-xl shadow-black/20 sm:rounded-3xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-white sm:text-base">SOS Media</h2>
              <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-400 ring-1 ring-white/10">
                {sos.media.length} item{sos.media.length !== 1 ? "s" : ""}
              </span>
            </div>

            {sos.media.length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-white/10 bg-slate-950/50 p-8 text-center sm:p-12">
                <Mic size={24} className="mx-auto mb-3 text-slate-700" />
                <p className="text-sm text-slate-500">No media attached to this alert.</p>
              </div>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4">
                {sos.media.map((m) => (
                  <div
                    key={m.id}
                    className="overflow-hidden rounded-xl border border-white/8 bg-slate-950/60 sm:rounded-2xl"
                  >
                    {m.type === "photo" ? (
                      <>
                        <div className="group relative aspect-[16/10] bg-slate-900">
                          <Image
                            src={m.url}
                            alt="SOS photo"
                            fill
                            className="object-cover transition duration-300 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, 50vw"
                          />
                          <button
                            title="View fullscreen"
                            className="absolute right-2.5 top-2.5 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition hover:bg-black/60 active:scale-95"
                            onClick={() => setFullScreenImage(m.url)}
                          >
                            <Fullscreen size={15} />
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-2.5 text-[11px] text-slate-500">
                          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wider">
                            Photo
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="p-3 sm:p-4">
                        <div className="mb-3 flex items-center gap-2">
                          <Volume2 size={14} className="text-pink-400" />
                          <span className="text-[11px] uppercase tracking-wider text-slate-500">
                            Audio
                          </span>
                        </div>
                        <audio src={m.url} controls className="w-full rounded-lg" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}