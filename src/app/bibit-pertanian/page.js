"use client";
import { useState, useEffect } from "react";
import { db } from "../lib-firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import Link from "next/link";

export default function BibitPertanian() {
  const [items, setItems] = useState([]);

  // Link Foto Default yang sama dengan halaman lainnya
  const fotoDefault = "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=500&auto=format&fit=crop";

  useEffect(() => {
    // Filter khusus kategori Pertanian (Bawang Dayak, Nilam, dll)
    const q = query(collection(db, "produk"), where("kategori", "==", "Pertanian"));
    const unsub = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      
      {/* NAVIGASI HEADER: Tombol di Kanan agar tidak Tumpang Tindih */}
      <nav className="sticky top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Sisi Kiri: Identitas Bisnis CV. Hijauin Bumi Agritech */}
          <div className="flex flex-col">
            <h2 className="text-sm font-black text-green-800 leading-none tracking-tight">
              CV. HIJAUIN BUMI AGRITECH
            </h2>
            <p className="text-[9px] uppercase tracking-widest text-slate-400 mt-1">
              Unit Bisnis Pertanian & Kehutanan
            </p>
          </div>

          {/* Sisi Kanan: Tombol Kembali ke Beranda */}
          <Link 
            href="/" 
            className="flex items-center gap-2 bg-slate-900 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-green-700 transition-all shadow-md text-sm group"
          >
            <span>Kembali ke Beranda</span>
            <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
          </Link>

        </div>
      </nav>

      {/* ISI KONTEN UTAMA */}
      <div className="max-w-7xl mx-auto p-8 md:p-12">
        
        {/* Header Katalog Pertanian */}
        <header className="mb-16 border-l-8 border-orange-500 pl-8">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">
            Katalog Bibit Pertanian
          </h1>
          <p className="text-lg text-slate-500 mt-4 max-w-3xl leading-relaxed italic">
            Menyediakan bibit komoditas unggulan dan tanaman bernilai ekonomi tinggi untuk Ketahanan Pangan dan Energi.
          </p>
        </header>

        {/* Grid Produk Bibit Pertanian */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-slate-100 p-8 hover:shadow-2xl transition-all group">
              <div className="overflow-hidden rounded-[32px] mb-6">
                <img 
                  src={item.imageUrl || item.fotoUrl || fotoDefault} 
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500" 
                  alt={item.nama} 
                  onError={(e) => { e.target.src = fotoDefault; }}
                />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">{item.nama}</h2>
              <p className="text-orange-600 font-black text-2xl mt-2">
                Rp {Number(item.harga || 0).toLocaleString('id-ID')}
              </p>
              
              <div className="bg-orange-50 p-5 rounded-3xl my-6 text-sm text-slate-700 space-y-2 border border-orange-100">
                <p><strong>Spesifikasi:</strong> {item.spesifikasi || "Siap Tanam"}</p>
                <p><strong>Stok:</strong> {Number(item.jumlah || 0).toLocaleString('id-ID')} Paket/Batang</p>
              </div>

              <a 
                href={`https://wa.me/6285390910860?text=Halo%20CV.%20Hijauin%20Bumi%2C%20saya%20ingin%20memesan%20Bibit%20Pertanian%20${item.nama}`} 
                target="_blank"
                className="block text-center bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-orange-600 transition-colors shadow-lg"
              >
                Pesan via WhatsApp
              </a>
            </div>
          ))}

          {/* Tampilan jika data masih kosong */}
          {items.length === 0 && (
            <div className="col-span-3 py-20 text-center border-2 border-dashed border-slate-200 rounded-[40px]">
              <p className="text-slate-400 italic">Belum ada data bibit pertanian. Silakan input melalui Firebase dengan kategori "Pertanian".</p>
            </div>
          )}
        </div>
      </div>

      <footer className="py-12 bg-slate-50 border-t border-slate-100 text-center">
        <p className="text-[10px] text-slate-400 tracking-[0.3em] uppercase">
          © 2026 CV. Hijauin Bumi Agritech | Kalimantan Tengah
        </p>
      </footer>
    </div>
  );
}