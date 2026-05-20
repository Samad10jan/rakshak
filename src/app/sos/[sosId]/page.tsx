"use client";

import Error from "@/components/Error";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sos } from "@/lib/types";
import { Fullscreen, MapPin, X as XIcon } from "lucide-react";
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
  const [message, setMessage] = useState<string | null>(null);
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    if (!sosId) return;

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

    setLoading(true);
    getSos();
  }, [sosId]);

  useEffect(() => {
    if (sos?.status !== "active") return;

    const intervalId = setInterval(async () => {
      try {
        const res = await fetch(`/api/sos-alert/${sos.id}`, { cache: "no-store" });
        const data = await res.json();
        if (res.ok) {
          setSos(data.sos);
        }
      } catch (err: any) {
        console.error(err.message || "Polling error");
      }
    }, 20000);

    return () => clearInterval(intervalId);
  }, [sos]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFullScreenImage(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const getStatusLabel = (status: string) =>
    status === "active" ? "bg-rose-500/90" : "bg-slate-600/90";

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
        setMessage(data.message || "Unable to update alert.");
        return;
      }
      setSos(data.sos);
      setMessage("Alert resolved successfully.");
    } catch (err: any) {
      setMessage(err.message || "Something went wrong.");
    } finally {
      setResolving(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (!sos) return null;

  return (
    <div className="min-h-screen bg-slate-950/95 px-4 py-8 sm:px-6 lg:px-10">
      {fullScreenImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
          <div className="relative mx-auto h-[80vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-slate-900 shadow-2xl">
            <Image src={fullScreenImage} alt="Fullscreen media" fill className="object-contain" sizes="100vw" priority />
          </div>
          <button title="btn" className="absolute right-5 top-5 rounded-full bg-white/10 px-3 py-2 text-white transition hover:bg-white/20" onClick={() => setFullScreenImage(null)}>
            <XIcon size={20} />
          </button>
        </div>
      )}

      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-pink-300">SOS Alert</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Alert ID {sos.id}</h1>
              <p className="mt-2 text-sm text-slate-400">Raised on {new Date(sos.timestamp).toLocaleString()}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => copyToClipboard(sos.id)}>
                {copiedId ? "Copied" : "Copy Alert ID"}
              </Button>
              {sos.status === "active" ? (
                <Button onClick={resolveAlert} disabled={resolving}>
                  {resolving ? "Resolving..." : "Mark as Resolved"}
                </Button>
              ) : (
                <span className="rounded-full bg-slate-700 px-4 py-2 text-sm text-slate-200">Resolved</span>
              )}
            </div>
          </div>

          {message && <p className="mt-4 rounded-3xl bg-white/10 px-4 py-3 text-sm text-slate-100">{message}</p>}

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <Card className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
              <CardContent className="p-0">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-white">Status and location</h2>
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold text-white ${getStatusLabel(sos.status)}`}>
                    {sos.status.toUpperCase()}
                  </span>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Latitude</p>
                    <p className="mt-2 text-base text-slate-200">{sos.location?.lat ?? "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Longitude</p>
                    <p className="mt-2 text-base text-slate-200">{sos.location?.lng ?? "N/A"}</p>
                  </div>
                </div>
                {sos.location && (
                  <div className="mt-5 flex flex-wrap gap-3">
                    <a
                      href={`https://www.google.com/maps?q=${sos.location.lat},${sos.location.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-pink-600/90"
                    >
                      <MapPin size={16} /> Open in Google Maps
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
              <CardContent className="p-0">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-white">User emergency info</h2>
                </div>
                <div className="mt-5 space-y-3 text-sm text-slate-300">
                  <p>
                    <span className="font-semibold text-white">Code word:</span>{' '}
                    {(sos as any).userDetails?.codeWord ?? "Not available"}
                  </p>
                  <p>
                    <span className="font-semibold text-white">Alert message:</span>{' '}
                    {(sos as any).userDetails?.message ?? "Not available"}
                  </p>
                  <p>
                    <span className="font-semibold text-white">Saved address:</span>{' '}
                    {(sos as any).userDetails?.permanentAddress ? `${(sos as any).userDetails.permanentAddress.lat}, ${(sos as any).userDetails.permanentAddress.lng}` : "None"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {sos.location && (
            <Card className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
              <CardContent className="p-0">
                <h2 className="text-lg font-semibold text-white">Map preview</h2>
                <div className="mt-5 overflow-hidden rounded-3xl border border-white/10">
                  <iframe
                    title="SOS Alert Location Map"
                    width="100%"
                    height="340"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${sos.location.lng - 0.011}%2C${sos.location.lat - 0.011}%2C${sos.location.lng + 0.011}%2C${sos.location.lat + 0.011}&layer=mapnik&marker=${sos.location.lat}%2C${sos.location.lng}`}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
            <CardContent className="p-0">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-white">SOS Media</h2>
                <span className="text-sm text-slate-400">{sos.media.length} items</span>
              </div>
              <div className="mt-5 grid gap-4">
                {sos.media.length === 0 ? (
                  <div className="rounded-3xl bg-slate-900/80 p-8 text-center text-slate-500">No media attached to this alert.</div>
                ) : (
                  sos.media.slice().map((m) => (
                    <div key={m.id} className="rounded-3xl border border-white/10 bg-slate-900/80 p-4">
                      {m.type === "photo" ? (
                        <div className="group relative aspect-[16/10] overflow-hidden rounded-3xl bg-slate-800">
                          <Image src={m.url} alt="SOS photo" fill className="object-cover transition duration-300 group-hover:scale-105" sizes="100vw" />
                          <button title="btn" className="absolute right-3 top-3 rounded-full bg-white/10 px-3 py-2 text-white shadow-lg" onClick={() => setFullScreenImage(m.url)}>
                            <Fullscreen size={18} />
                          </button>
                        </div>
                      ) : (
                        <audio src={m.url} controls className="w-full rounded-3xl bg-slate-950/80 p-3" />
                      )}
                      <p className="mt-3 text-sm text-slate-400">Type: {m.type}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
