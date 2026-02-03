"use client";
import React from "react";
import Link from "next/link"; // Import Link untuk navigasi

export default function RehabilitasiPage() {
  const layananRehab = [
    {
      title: "Rehabilitasi Daerah Aliran Sungai (DAS)",
      desc: "Layanan teknis perencanaan dan penanaman kembali kawasan hutan untuk pemulihan fungsi hidrologis dan ekosistem.",
      features: ["Survei Awal", "Penyusunan Rancangan Teknis (Rantek)", "Pelaksanaan Penanaman", "Pemeliharaan Tahun 1-3"]
    },
    {
      title: "Penyediaan Bibit Kehutanan & Pertanian",
      desc: "Pengadaan bibit berkualitas tinggi untuk proyek rehabilitasi maupun komoditas mandiri.",
      features: ["Bibit Unggul/Bersertifikat", "Kapasitas Skala Besar"]
    }
  ];

  return (
    <main className="min-h-screen bg-white font-sans">
      {/* TOMBOL KEMBALI KE BERANDA */}
      <div className="fixed top-6 left-6 z-[60]">
        <Link 
          href="/" 
          className="bg-white/90 backdrop-blur-sm text-green-800 font-bold px-5 py-2 rounded-full shadow-lg border border-green-100 hover:bg-green-600 hover:text-white transition-all flex items-center gap-2"
        >
          <span>←</span> Kembali ke Beranda
        </Link>
      </div>

      {/* HEADER HERO */}
      <section className="bg-green-900 text-white py-24 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 uppercase tracking-wider">
          Jasa Rehabilitasi Hutan
        </h1>
        <p className="text-green-500 max-w-2xl mx-auto italic">
          Mendukung kelestarian ekosistem Hutan melalui teknik penanaman yang presisi dan bibit unggul.
        </p>
      </section>

      {/* DETAIL LAYANAN */}
      <section className="max-w-7xl mx-auto py-20 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {layananRehab.map((item, index) => (
            <div key={index} className="border-l-4 border-green-600 pl-8 py-4 bg-slate-50 rounded-r-3xl shadow-sm hover:shadow-md transition">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">{item.title}</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">{item.desc}</p>
              <ul className="space-y-2">
                {item.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <span className="text-green-600 text-lg">✔</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* SEKSI PENGAJUAN / CTA */}
      <section className="bg-slate-100 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-6">Butuh Konsultasi Proyek Rehabilitasi?</h3>
          <p className="text-slate-600 mb-8">
            Tim CV. Hijauin Bumi Agritech siap membantu mulai dari survei lapangan hingga penyediaan bibit bersertifikat.
          </p>
          <a 
            href="https://wa.me/6285390910860?text=Halo%20CV.%20Hijauin%20Bumi%2C%20saya%20ingin%20konsultasi%20jasa%20rehabilitasi"
            className="inline-block bg-green-600 text-white font-bold px-10 py-4 rounded-full hover:bg-green-700 transition shadow-lg"
          >
            Hubungi Tenaga Ahli Kami
          </a>
        </div>
      </section>
    </main>
  );
}