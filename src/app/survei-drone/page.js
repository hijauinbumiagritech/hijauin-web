"use client";
import React from "react";
import Link from "next/link";

export default function SurveiDrone() {
  // Data hasil kegiatan survei lapangan dan drone
  const kegiatan = [
    { 
      id: 1, 
      foto: "/drone-bg.png", // Ganti dengan foto hasil drone asli Bapak
      judul: "Pemetaan Area DAS", 
      deskripsi: "Pemetaan udara presisi tinggi untuk rehabilitasi daerah aliran sungai." 
    },
    { 
      id: 2, 
      foto: "/gee-bg.png", 
      judul: "Monitoring Vegetasi GEE", 
      deskripsi: "Analisis spasial menggunakan Google Earth Engine untuk pantauan hutan." 
    },
    { 
      id: 3, 
      foto: "/identifikasi-bg.png", 
      judul: "Identifikasi Lahan,Penataan Areal Kerja, Geotagging dan Timbber Cruising", 
      deskripsi: "Identifikasi lahan memastikan kondisi dan status area. Penataan areal kerja mengatur pembagian wilayah agar operasional efisien. Geotagging mencatat lokasi objek secara akurat. Timber cruising menginventarisasi potensi dan volume kayu." 
    },
  ];

  return (
    <main className="min-h-screen bg-slate-900 text-white font-sans overflow-x-hidden">
      
      {/* TOMBOL KEMBALI KE BERANDA (MELAYANG) */}
      <div className="fixed top-6 left-6 z-50">
        <Link 
          href="/" 
          className="bg-white/10 backdrop-blur-md text-white font-bold px-6 py-3 rounded-full shadow-2xl border border-white/20 hover:bg-green-600 hover:border-green-600 transition-all flex items-center gap-2 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Kembali ke Beranda
        </Link>
      </div>

      {/* HEADER HERO SURVEI & DRONE */}
      <section className="relative py-32 md:py-48 px-6 text-center border-b border-white/10">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-8xl font-black mb-8 uppercase tracking-tighter drop-shadow-2xl">
            Survei & <span className="text-green-500">Drone</span>
          </h1>
          <p className="text-xl md:text-3xl font-bold text-slate-300 max-w-3xl mx-auto leading-tight italic">
            Integrasi teknologi pemetaan udara presisi dan analisis spasial canggih.
          </p>
        </div>
      </section>

      {/* KOLASE FOTO HASIL KEGIATAN */}
      <section className="max-w-7xl mx-auto py-24 px-6">
        <h2 className="text-2xl font-bold mb-12 border-l-4 border-green-500 pl-4">Portofolio Lapangan</h2>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {kegiatan.map((img) => (
            <div key={img.id} className="relative group rounded-3xl overflow-hidden shadow-2xl border border-white/10 break-inside-avoid transition-all hover:scale-[1.02]">
              <img 
                src={img.foto} 
                className="w-full h-auto object-cover" 
                alt={img.judul} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
                <h3 className="font-bold text-xl text-green-400">{img.judul}</h3>
                <p className="text-sm text-slate-300 mt-2">{img.deskripsi}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER MINI */}
      <footer className="py-12 text-center text-slate-500 text-xs border-t border-white/5">
        <p>© 2026 CV. Hijauin Bumi Agritech | Kalimantan Tengah</p>
      </footer>
    </main>
  );
}