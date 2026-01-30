"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const CAMPUS_CENTER: [number, number] = [9.5916, 76.5222];

export default function HeatmapPage() {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) return; // 🚫 prevent double init

    const map = L.map("heatmap-container", {
      center: CAMPUS_CENTER,
      zoom: 16,
    });

    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    const loadHeatmap = async () => {
      const snap = await getDocs(collection(db, "reports"));

      const heatPoints: [number, number, number][] = [];

      snap.forEach((doc) => {
        const data = doc.data();

        // ❗ only real coordinates
        if (data.latitude && data.longitude) {
          heatPoints.push([
            data.latitude,
            data.longitude,
            0.8,
          ]);

          // visible marker
          L.circleMarker([data.latitude, data.longitude], {
            radius: 5,
            fillColor: "#ef4444",
            color: "#fff",
            weight: 1,
            fillOpacity: 1,
          })
            .bindPopup(`
              <strong>${data.category}</strong><br/>
              ${data.location}<br/>
              Status: ${data.status}
            `)
            .addTo(map);
        }
      });

      if (heatPoints.length > 0) {
        // @ts-ignore
        L.heatLayer(heatPoints, {
          radius: 30,
          blur: 20,
          gradient: {
            0.2: "#60a5fa",
            0.5: "#facc15",
            1.0: "#ef4444",
          },
        }).addTo(map);
      }
    };

    loadHeatmap();

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const locateAdmin = () => {
    if (!navigator.geolocation || !mapRef.current) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      const coords: [number, number] = [
        pos.coords.latitude,
        pos.coords.longitude,
      ];

      L.circleMarker(coords, {
        radius: 8,
        fillColor: "#2563eb",
        color: "#fff",
        weight: 2,
        fillOpacity: 1,
      })
        .bindPopup("You are here")
        .addTo(mapRef.current!);

      mapRef.current!.setView(coords, 17);
    });
  };

  return (
    <div className="h-screen flex flex-col relative bg-muted/20">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto bg-background/80 backdrop-blur-md border rounded-xl px-4 py-3 shadow-sm flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="font-semibold text-sm">Campus Issue Heatmap</h1>
            <p className="text-xs text-muted-foreground">
              Real reported locations
            </p>
          </div>
        </div>

        <Button
          onClick={locateAdmin}
          className="pointer-events-auto"
          variant="outline"
        >
          <MapPin className="w-4 h-4 mr-2" />
          My Location
        </Button>
      </div>

      {/* Map */}
      <div id="heatmap-container" className="flex-1" />
    </div>
  );
}
