"use client";
import { useState, useEffect } from "react";
import { db } from "../lib-firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import Link from "next/link";

export default function BibitKehutanan() {
  const [items, setItems] = useState([]);
  const whatsappNumber = "6285390910860"; // Nomor WA CV. Hijauin Bumi Agritech

  // Variabel pendukung sinkronisasi foto
  const fotoDefault = "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=500&auto=format&fit=crop";

  useEffect(() => {
    // Filter kategori Kehutanan
    const q = query(collection(db, "produk"), where("kategori", "==", "Kehutanan"));
    const unsub = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      
      {/* NAVIGASI HEADER */}
      <nav className="sticky top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex flex-col">
            <h2 className="text-sm font-black text-green-800 leading-none tracking-tight">
              CV. HIJAUIN BUMI AGRITECH
            </h2>
            <p className="text-[9px] uppercase tracking-widest text-slate-400 mt-1">
              Unit Bisnis Pertanian & Kehutanan
            </p>
          </div>

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
        
        <header className="mb-16 border-l-8 border-green-700 pl-8">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">
            Katalog Bibit Kehutanan
          </h1>
          <p className="text-lg text-slate-500 mt-4 max-w-3xl leading-relaxed italic">
            Menyediakan bibit kehutanan berkualitas untuk mendukung program rehabilitasi hutan dan Rehabilitasi Daerah Aliran Sungai.
          </p>
        </header>

        {/* Grid Produk Bibit Kehutanan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-slate-100 p-8 hover:shadow-2xl transition-all group">
              <div className="overflow-hidden rounded-[32px] mb-6 bg-green-50">
                <img 
                  src={item.imageUrl || fotoDefault} 
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500" 
                  alt={item.nama} 
                  onError={(e) => { e.target.src = fotoDefault; }}
                />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">{item.nama}</h2>
              <p className="text-green-700 font-black text-2xl mt-2">
                Rp {Number(item.harga || 0).toLocaleString('id-ID')}
              </p>
              
              <div className="bg-green-50 p-5 rounded-3xl my-6 text-sm text-slate-700 space-y-2 border border-green-100">
                <p><strong>Spesifikasi:</strong> {item.spesifikasi || "Bibit Unggul"}</p>
                {/* Menambahkan toLocaleString untuk separator titik di Stok */}
                <p><strong>Stok Tersedia:</strong> {Number(item.jumlah || 0).toLocaleString('id-ID')} Batang</p>
              </div>

              <a 
                href={`https://wa.me/${whatsappNumber}?text=Halo%20CV.%20Hijauin%20Bumi%2C%20saya%20ingin%20memesan%20Bibit%20Kehutanan%20${item.nama}`} 
                target="_blank"
                className="block text-center bg-green-900 text-white py-4 rounded-2xl font-bold hover:bg-green-700 transition-colors shadow-lg uppercase text-xs tracking-widest"
              >
                Pesan via WhatsApp
              </a>
            </div>
          ))}

          {/* Fallback jika data kosong */}
          {items.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-[40px]">
              <p className="text-slate-400 font-medium italic">Belum ada stok bibit kehutanan yang terdaftar.</p>
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