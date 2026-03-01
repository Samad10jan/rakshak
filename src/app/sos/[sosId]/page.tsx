"use client";

import Error from "@/components/Error";
import Loading from "@/components/Loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, XIcon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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

  // const isMounted = useRef(true);

  /* ---------------- FETCH + POLLING ---------------- */

  useEffect(() => {
    if (!sosId) return;

    // isMounted.current = true;
    setLoading(true);

    const getSos = async () => {
      try {
        const res = await fetch(`/api/sos-alert/${sosId}`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {

          setError(data.message || "Failed to fetch SOS");
          setSos(null);

          return;
        }

        // if (!isMounted.current) return;
        setSos(data.sos);
        // if (data.sos.status) {
        //   setSos(data.sos);
        //   setError(null);
        // } else {
        //   setSos(null);
        //   setError("This SOS alert is no longer active");
        // }
      } catch (err: any) {

        setError(err.message || "Something went wrong");
        setSos(null);

      } finally {

        setLoading(false);

      }
    };

    getSos();

    const intervalId = setInterval(getSos, 30000);

    return () => {
      // isMounted.current = false;
      clearInterval(intervalId);
    };
  }, [sosId]);

  /* ---------------- ESC CLOSE ---------------- */

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFullScreenImage(null);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  /* ---------------- STATUS COLOR ---------------- */

  const getStatusColor = (status: string) =>
    status === "active"
      ? "bg-red-500 animate-pulse"
      : "bg-gray-500";

  /* ---------------- COPY ---------------- */

  const copyToClipboard = async (text: string) => {
    try {

      await navigator.clipboard.writeText(text);

      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } catch {
      console.error("Failed to copy");
    }
  };


  if (loading) return <Loading />;

  if (error) return <Error error={error} />;

  if (!sos) return null;


  return (
    <>
      {fullScreenImage && (
        <div
          className="fixed inset-0 z-55 bg-black/70 flex items-center justify-center p-3 sm:p-6"
          onClick={() => setFullScreenImage(null)}
        >
          <div
            className="relative w-full max-w-xl h-[75vh] sm:h-[85vh] bg-neutral-700"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={fullScreenImage}
              alt="Fullscreen image"
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
          <Button onClick={() => setFullScreenImage(null)} className="rounded-full hover:bg-red-500 text-white absolute top-0 right-0 m-5 text-center ring-2 active:bg-red-500 ring-red-500 transtion-all duration-300"><XIcon /></Button>

        </div>
      )}

      <div className="min-h-screen p-6 bg-amber-100">
        <div className="max-w-5xl mx-auto">
          <Card>
            <CardContent className="p-6 space-y-6">

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
                {sos.status === "active" && <Badge className="bg-white text-red-600">URGENT</Badge>}
              </div>

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
                    title="SOS Alert Location Map"
                    width="100%"
                    height="300"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${sos.location.lng - 0.01
                      }%2C${sos.location.lat - 0.01}%2C${sos.location.lng + 0.01
                      }%2C${sos.location.lat + 0.01
                      }&layer=mapnik&marker=${sos.location.lat}%2C${sos.location.lng
                      }`}
                  />
                  {sos.status !== "active" &&  
                  <a href={`https://www.google.com/maps?q=${sos.location.lat},${sos.location.lng}`}
                    target="_blank">

                    <Button size="sm" variant="outline">
                      <MapPin size={14} /> Open in GoogleMaps
                    </Button>
                  </a>}

                 
                  {/* <div className="bg-linaer text-clip">AA</div> */}
                </div>
              )}

              {sos.media.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Media</h3>

                  <ScrollArea className="w-full">
                    <div className="flex gap-4 flex-wrap">
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
      </div >
    </>
  );
}