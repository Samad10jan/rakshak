"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

type Sos = {
  id: string;
  status: "active" | "inactive";
  location?: { lat: number; lng: number } | null;
  timestamp: string;
  media: {
    id: string;
    url: string;
    type: "photo" | "video" | "audio";
    format: string;
    duration?: number;
    width?: number;
    height?: number;
  }[];
};

export default function SosAlertPage() {
  const params = useParams();
  const sosId = params?.sosId as string;

  const [sos, setSos] = useState<Sos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    if (!sosId) return;

    let intervalId: NodeJS.Timeout;

    const getSos = async () => {
      try {
        const res = await fetch(`/api/sos-alert/${sosId}`, {
          cache: "no-store", // VERY IMPORTANT (prevents caching)
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch SOS");
          return;
        }

        if (data.sos.status === "active") {
          setSos(data.sos);
          setError(null);
        } else {
          setSos(null);
          setError("This SOS alert is no longer active");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    getSos();

    // Poll every 30 seconds
    intervalId = setInterval(() => {
      getSos();
    }, 30000);

    // Cleanup
    return () => clearInterval(intervalId);
  }, [sosId]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFullScreenImage(null);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const getStatusColor = (status: string) =>
    status === "active"
      ? "bg-red-500 animate-pulse"
      : "bg-gray-500";

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading SOS alert...
      </div>
    );

  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center">
        {error}
      </div>
    );

  if (!sos) return null;

  return (
    <>
      {/* Fullscreen Image */}
      {fullScreenImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
          onClick={() => setFullScreenImage(null)}
        >
          <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
            <Image
              src={fullScreenImage}
              alt="Fullscreen"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      <div className="min-h-screen p-6 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <div className="max-w-5xl mx-auto">
          <Card>
            <CardContent className="p-6 space-y-6">

              {/* Status */}
              <div
                className={`${getStatusColor(
                  sos.status
                )} text-white p-4 rounded-lg flex justify-between`}
              >
                <div>
                  <p className="font-bold text-lg">
                    {sos.status.toUpperCase()} ALERT
                  </p>
                  <p className="text-sm">
                    {new Date(sos.timestamp).toLocaleString()}
                  </p>
                </div>
                <Badge className="bg-white text-red-600">
                  URGENT
                </Badge>
              </div>

              {/* ID */}
              <div>
                <p className="text-sm text-gray-500">Alert ID</p>
                <p className="font-mono break-all">{sos.id}</p>
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(sos.id)}
                >
                  {copiedId ? "Copied" : "Copy"}
                </Button>
              </div>

              {/* Location */}
              {sos.location && (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Location</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs">Latitude</p>
                      <p>{sos.location.lat}</p>
                    </div>
                    <div>
                      <p className="text-xs">Longitude</p>
                      <p>{sos.location.lng}</p>
                    </div>
                  </div>

                  <iframe
                    width="100%"
                    height="300"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${sos.location.lng - 0.01
                      }%2C${sos.location.lat - 0.01}%2C${sos.location.lng + 0.01
                      }%2C${sos.location.lat + 0.01
                      }&layer=mapnik&marker=${sos.location.lat}%2C${sos.location.lng
                      }`}
                  />
                </div>
              )}

              {/* Media */}
              {sos.media.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Media</h3>

                  <ScrollArea className="w-full">
                    <div className="flex gap-4">
                      {sos.media.map((m) => (
                        <Card key={m.id} className="w-64 flex-shrink-0">
                          <CardContent className="p-4 space-y-2">

                            {m.type === "photo" && (
                              <div
                                className="relative w-full h-40 cursor-pointer"
                                onClick={() =>
                                  setFullScreenImage(m.url)
                                }
                              >
                                <Image
                                  src={m.url}
                                  alt="SOS media"
                                  fill
                                  className="object-cover rounded"
                                />
                              </div>
                            )}

                            {m.type === "audio" && (
                              <audio controls className="w-full">
                                <source
                                  src={m.url}
                                  type={`audio/${m.format}`}
                                />
                              </audio>
                            )}

                            <div className="text-sm">
                              {m.type} ({m.format})
                            </div>

                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}