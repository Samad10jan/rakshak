"use client";

import { useEffect, useState } from "react";
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

export default function SosAlertPage({
  params,
}: {
  params: Promise<{ sosId: string }>;
}) {
  const [sos, setSos] = useState<Sos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    async function getSos() {
      try {
        const { sosId } = await params;
        const res = await fetch(`/api/sos-alert/${sosId}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch SOS");
          return;
        }

        // Only show alert if status is active
        if (data.sos.status === "active") {
          setSos(data.sos);
        } else {
          setError("This SOS alert is no longer active");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    getSos();
  }, [params]);

  // Handle escape key to close fullscreen image
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && fullScreenImage) {
        setFullScreenImage(null);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [fullScreenImage]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-red-500 animate-pulse";
      case "inactive":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  // Loading state
  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <div className="text-center">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent mb-4"></div>
          <p className="text-lg font-semibold text-gray-700 animate-pulse">
            Loading SOS alert...
          </p>
        </div>
      </div>
    );

  // Error state
  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <Card className="w-full max-w-md shadow-2xl border-2 border-red-200">
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
              Error
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );

  if (!sos) return null;

  return (
    <>
      {/* Fullscreen Image Modal */}
      {fullScreenImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setFullScreenImage(null)}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white text-4xl sm:text-5xl hover:text-gray-300 transition-colors z-10 w-12 h-12 flex items-center justify-center"
            onClick={() => setFullScreenImage(null)}
            aria-label="Close fullscreen"
          >
            ×
          </button>

          {/* Download button */}
          <a
            href={fullScreenImage}
            download
            className="absolute top-4 right-20 text-white text-2xl sm:text-3xl hover:text-gray-300 transition-colors z-10 w-12 h-12 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            aria-label="Download image"
          >
            ⬇️
          </a>

          {/* Instructions */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm sm:text-base text-center bg-black bg-opacity-50 px-4 py-2 rounded-lg">
            Click anywhere or press ESC to close
          </div>

          {/* Image */}
          <img
            src={fullScreenImage}
            alt="Fullscreen view"
            className="max-w-full max-h-full object-contain cursor-zoom-out"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Alert Header */}
          <div className="mb-6 sm:mb-8 text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="text-5xl sm:text-3xl animate-pulse transition-all ">🔴</span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-red-600">
                Emergency Alert
              </h1>
            </div>
            <p className="text-gray-600 text-sm sm:text-base">
              Active SOS alert requires immediate attention
            </p>
          </div>

          <Card className="shadow-2xl border-2 border-red-200">
            <CardContent className="p-6 sm:p-8">
              {/* Status Banner */}
              <div
                className={`${getStatusColor(
                  sos.status
                )} text-white px-4 py-3 rounded-lg mb-6 flex items-center justify-between`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔴</span>
                  <div>
                    <p className="font-bold text-lg">
                      {sos.status.toUpperCase()} ALERT
                    </p>
                    <p className="text-sm opacity-90">
                      {getTimeAgo(sos.timestamp)}
                    </p>
                  </div>
                </div>
                <Badge className="bg-white text-red-600 hover:bg-gray-100 font-bold">
                  URGENT
                </Badge>
              </div>

              {/* Alert Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* ID Card */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-500 mb-1 font-medium">
                        Alert ID
                      </p>
                      <p className="font-mono text-sm sm:text-base text-gray-800 break-all">
                        {sos.id}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(sos.id)}
                      className="flex-shrink-0"
                    >
                      {copiedId ? "✓" : "📋"}
                    </Button>
                  </div>
                </div>

                {/* Timestamp Card */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-xs sm:text-sm text-gray-500 mb-1 font-medium">
                    Alert Time
                  </p>
                  <p className="text-sm sm:text-base text-gray-800 font-semibold">
                    {new Date(sos.timestamp).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>

              {/* Location Section */}
              {sos.location && (
                <div className="bg-blue-50 rounded-lg p-4 sm:p-6 mb-6 border border-blue-200">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">📍</span>
                    <h3 className="font-bold text-lg sm:text-xl text-gray-800">
                      Location Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white rounded p-3">
                      <p className="text-xs text-gray-500 mb-1">Latitude</p>
                      <p className="font-mono text-sm font-semibold text-gray-800">
                        {sos.location.lat.toFixed(6)}
                      </p>
                    </div>
                    <div className="bg-white rounded p-3">
                      <p className="text-xs text-gray-500 mb-1">Longitude</p>
                      <p className="font-mono text-sm font-semibold text-gray-800">
                        {sos.location.lng.toFixed(6)}
                      </p>
                    </div>
                  </div>

                  {/* Map */}
                  <div className="w-full h-64 sm:h-80 lg:h-96 mb-4 rounded-lg overflow-hidden border-2 border-blue-300 shadow-md">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                        sos.location.lng - 0.01
                      }%2C${sos.location.lat - 0.01}%2C${
                        sos.location.lng + 0.01
                      }%2C${
                        sos.location.lat + 0.01
                      }&layer=mapnik&marker=${sos.location.lat}%2C${
                        sos.location.lng
                      }`}
                    ></iframe>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={() =>
                        window.open(
                          `https://www.google.com/maps/search/?api=1&query=${sos.location?.lat},${sos.location?.lng}`,
                          "_blank"
                        )
                      }
                    >
                      🗺️ Open in Google Maps
                    </Button>
                    <Button
                      className="flex-1"
                      variant="outline"
                      onClick={() =>
                        copyToClipboard(
                          `${sos.location?.lat}, ${sos.location?.lng}`
                        )
                      }
                    >
                      📋 Copy Coordinates
                    </Button>
                  </div>
                </div>
              )}

              {/* Media Section */}
              {sos.media.length > 0 && (
                <div className="bg-purple-50 rounded-lg p-4 sm:p-6 border border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📎</span>
                      <h3 className="font-bold text-lg sm:text-xl text-gray-800">
                        Media Attachments
                      </h3>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      {sos.media.length} file{sos.media.length > 1 ? "s" : ""}
                    </Badge>
                  </div>

                  <ScrollArea className="w-full">
                    <div className="flex gap-4 pb-4 overflow-x-auto">
                      {sos.media.map((m) => (
                        <Card
                          key={m.id}
                          className="flex-shrink-0 w-64 hover:shadow-lg transition-shadow"
                        >
                          <CardContent className="p-4">
                            {m.type === "photo" && (
                              <div className="relative group">
                                <img
                                  src={m.url}
                                  alt="SOS media"
                                  className="w-full h-40 object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() => setFullScreenImage(m.url)}
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded pointer-events-none">
                                  <span className="text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity">
                                    🔍
                                  </span>
                                </div>
                              </div>
                            )}
                            {m.type === "video" && (
                              <video
                                controls
                                className="w-full h-40 rounded bg-black"
                              >
                                <source
                                  src={m.url}
                                  type={`video/${m.format}`}
                                />
                              </video>
                            )}
                            {m.type === "audio" && (
                              <div className="w-full h-40 bg-gradient-to-br from-purple-100 to-pink-100 rounded flex flex-col items-center justify-center">
                                <span className="text-5xl mb-3">🎵</span>
                                <audio controls className="w-full px-2">
                                  <source
                                    src={m.url}
                                    type={`audio/${m.format}`}
                                  />
                                </audio>
                              </div>
                            )}

                            {/* Media Info */}
                            <div className="mt-3 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-700 capitalize">
                                  {m.type}
                                </span>
                                <span className="text-xs text-gray-500 uppercase">
                                  {m.format}
                                </span>
                              </div>
                              {m.duration && (
                                <p className="text-xs text-purple-600 font-medium">
                                  ⏱️ Duration: {m.duration}s
                                </p>
                              )}
                              {m.width && m.height && (
                                <p className="text-xs text-gray-500">
                                  📐 {m.width} × {m.height}
                                </p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-lg py-6"
                    onClick={() => {
                      // Handle emergency response
                      alert("Emergency response initiated");
                    }}
                  >
                    ✓ Respond to Emergency
                  </Button>
                  <Button
                    className="flex-1"
                    variant="outline"
                    onClick={() => window.print()}
                  >
                    🖨️ Print Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Info */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              Emergency services have been notified. Help is on the way.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}