"use client";
import { useState, useEffect } from "react";
import { db } from "./lib-firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import Link from "next/link";

export default function Home() {
  const [produk, setProduk] = useState([]);
  
  const whatsappNumber = "6285390910860"; 
  const message = "Halo CV. Hijauin Bumi Agritech, saya tertarik dengan layanan Anda.";
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  // Variabel Foto Cadangan (Default)
  const fotoDefault = "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=500&auto=format&fit=crop";

  useEffect(() => {
    const q = query(collection(db, "produk"), orderBy("waktu", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setProduk(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
    return () => unsub();
  }, []);

  return (
    <main className="min-h-screen bg-white font-sans text-gray-900 scroll-smooth">
      
      {/* 1. NAVIGATION BAR */}
      <nav className="fixed w-full z-50 bg-green-900/90 backdrop-blur-sm p-4 text-white shadow-md flex justify-between items-center px-6 md:px-12">
        <div>
          <h1 className="text-xl font-bold tracking-tight">CV. Hijauin Bumi Agritech</h1>
          <p className="text-[10px] italic text-green-200 uppercase tracking-widest">Solusi Berkelanjutan untuk Kehutanan, Lingkungan dan Pertanian</p>
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-medium text-white">
          <a href="#beranda" className="hover:text-green-300 transition">Beranda</a>
          <a href="#layanan" className="hover:text-green-300 transition">Layanan</a>
          <a href="#katalog" className="hover:text-green-300 transition">Katalog</a>
          <a href="#tentang" className="hover:text-green-300 transition">Tentang Kami</a>
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="bg-green-600 px-4 py-2 rounded-md hover:bg-green-500 transition shadow-md">
            Hubungi Kami
          </a>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <header id="beranda" className="relative h-screen flex items-center justify-center text-center text-white bg-gray-900">
        <img 
          src="/hero-bg.png" 
          alt="Hutan Kalimantan" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 z-0" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent z-10"></div>
        
        <div className="relative z-20 px-6">
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-2xl text-white">
            Mitra Terpercaya dalam <br/> Rehabilitasi Hutan & Lahan, Survei, GIS, Teknologi Drone dan Pertanian Berkelanjutan
          </h2>
          <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-gray-100 drop-shadow-md">
            Mengintegrasikan teknologi drone, survei presisi, sistem GIS, dan solusi pertanian berkelanjutan untuk mendukung pemulihan ekosistem, pengelolaan sumber daya hutan, serta pengadaan bibit berkualitas di Indonesia.
          </p>
          <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center font-bold">
            <a href="#layanan" className="bg-green-600 hover:bg-green-700 text-white py-4 px-10 rounded-full transition-all shadow-lg hover:scale-105">Lihat Layanan</a>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white py-4 px-10 rounded-full border border-white/50 transition-all">Konsultasi Sekarang</a>
          </div>
        </div>
      </header>

      {/* 3. LAYANAN */}
      <section id="layanan" className="max-w-7xl mx-auto py-24 px-6">
        <div className="text-center mb-16">
          <h3 className="text-sm font-bold text-green-700 uppercase tracking-[0.2em] mb-2">Layanan Kami</h3>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">Solusi Kehutanan & Pertanian Terpadu</h2>
          <div className="w-20 h-1 bg-green-600 mx-auto mt-6"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Link href="/rehabilitasi">
            <ServiceCard icon="🌳" title="Rehabilitasi Hutan & Lahan" desc="Layanan Rantek dan pemulihan DAS berbasis ekosistem berkelanjutan." />
          </Link>
          <Link href="/survei-drone">
            <ServiceCard icon="🗺️🌐" title="Survei Lapangan & Drone" desc="Pemetaan udara presisi tinggi dan analisis data spasial kehutanan." />
          </Link>
          <Link href="/bibit-kehutanan">
            <ServiceCard icon="🌱" title="Bibit Kehutanan" desc="Pengadaan bibit unggul/bersertifikat." />
          </Link>
          <Link href="/bibit-pertanian">
            <ServiceCard icon="🪴" title="Bibit Pertanian" desc="Penyediaan bibit komoditas Pertanian bernilai tinggi." />
          </Link>
        </div>
      </section>

      {/* 4. KATALOG DINAMIS */}
      <section id="katalog" className="py-24 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-tighter">Stok Produk & Jasa Terbaru</h2>
          <p className="text-gray-600 mt-4 font-medium">Data diperbarui secara realtime dari sistem manajemen internal.</p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {produk.length > 0 ? (
            produk.map((item) => (
              <div key={item.id} className="group bg-white rounded-[32px] shadow-sm border border-green-100 hover:shadow-xl transition-all overflow-hidden flex flex-col">
                <div className="relative h-64 w-full overflow-hidden bg-green-50">
                  {/* PENYEMPURNAAN GAMBAR DENGAN ONERROR */}
                  <img 
                    src={item.imageUrl || fotoDefault} 
                    alt={item.nama}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { e.target.src = fotoDefault; }}
                  />
                  {item.kategori && (
                    <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-1 rounded-full text-[10px] font-bold shadow-lg uppercase tracking-wider">
                      {item.kategori}
                    </div>
                  )}
                </div>

                <div className="p-8">
                  <h4 className="text-xl font-bold text-green-900 mb-2 uppercase">{item.nama}</h4>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Sisa Stok</p>
                        <p className="text-gray-900 font-black italic">
                          {Number(item.jumlah || 0).toLocaleString('id-ID')} <span className="text-[10px] text-gray-500 not-italic">BTG</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Harga</p>
                        <p className="text-green-700 font-black text-lg">
                          Rp {Number(item.harga).toLocaleString('id-ID')}
                        </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-6 line-clamp-2 border-l-2 border-green-200 pl-3 italic">
                    {item.spesifikasi || "Spesifikasi lengkap hubungi admin."}
                  </p>
                  <a 
                    href={`https://wa.me/${whatsappNumber}?text=Halo CV. Hijauin Bumi Agritech, saya tertarik dengan produk: ${item.nama}`} 
                    target="_blank" 
                    className="block text-center bg-green-800 text-white font-bold py-3 rounded-2xl hover:bg-green-900 transition shadow-lg uppercase text-xs tracking-widest"
                  >
                    Pesan via WhatsApp
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-green-100">
                <p className="text-gray-400 italic font-medium">Mohon maaf, saat ini belum ada stok bibit yang ditampilkan.</p>
            </div>
          )}
        </div>
      </section>

      {/* 5. TENTANG KAMI + VISI MISI */}
      <section id="tentang" className="py-24 bg-green-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full bg-green-200 rounded-3xl -z-10"></div>
              <img src="/Profile-P.jpg" alt="Tim Hijauin Bumi Agritech" className="rounded-3xl shadow-2xl object-cover aspect-square" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-green-700 uppercase tracking-widest mb-2">Profil Perusahaan</h3>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Keahlian Profesional untuk Kelestarian Hutan</h2>
              <p className="text-gray-700 leading-relaxed mb-6 italic">
                CV. Hijauin Bumi Agritech didukung oleh tenaga profesional di bidang kehutanan, pertanian, dan teknologi drone.
              </p>
              <div className="space-y-6">
                <FeatureItem num="1" title="Analisis Spasial & Remote Sensing" desc="Optimasi monitoring vegetasi menggunakan algoritma Google Earth Engine (GEE) dan pemetaan udara presisi tinggi." />
                <FeatureItem num="2" title="Pengalaman Lapangan" desc="Berpengalaman dalam Survei Lapangan, verifikasi pengelolaan hutan, Rehabilitasi Hutan dan Lahan Serta rehabilitasi daerah aliran sungai (DAS)." />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-green-100">
              <h4 className="text-2xl font-black text-green-800 uppercase tracking-tighter mb-4 flex items-center gap-3">
                <span className="text-3xl">🎯</span> Visi Kami
              </h4>
              <p className="text-gray-600 leading-relaxed font-medium italic">
                "Menjadi mitra utama yang inovatif dan terpercaya dalam mewujudkan kelestarian ekosistem hutan serta kemandirian sektor pertanian berbasis teknologi di Indonesia."
              </p>
            </div>
            <div className="bg-green-800 p-10 rounded-[40px] shadow-xl text-white">
              <h4 className="text-2xl font-black uppercase tracking-tighter mb-4 flex items-center gap-3">
                <span className="text-3xl">🚀</span> Misi Kami
              </h4>
              <ul className="space-y-3 text-sm text-green-50/90">
                <li className="flex gap-2"><span>•</span> Mengoptimalkan pemanfaatan teknologi Drone Mapping, Remote Sensing, dan Sistem Geotagging Presisi untuk menjamin akurasi data spasial yang transparan dan dapat divalidasi.</li>
                <li className="flex gap-2"><span>•</span> Menyediakan solusi strategis dalam rehabilitasi hutan dan pengelolaan Daerah Aliran Sungai (DAS) yang berbasis pada pemulihan keanekaragaman hayati.</li>
                <li className="flex gap-2"><span>•</span> Menyediakan bibit unggul berkualitas tinggi untuk mendukung ekonomi hijau.</li>
                <li className="flex gap-2"><span>•</span> Membangun kemitraan kolaboratif yang inklusif untuk menciptakan dampak positif bagi kelestarian lingkungan dan kesejahteraan masyarakat lokal.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer id="kontak" className="bg-gray-900 text-white pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-gray-800 pb-16">
          <div>
            <h4 className="text-2xl font-bold mb-4 text-green-500">CV. Hijauin Bumi Agritech</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Membangun sinergi antara teknologi dan kelestarian alam untuk masa depan lingkungan yang lebih baik.
            </p>
          </div>
          <div>
            <h5 className="font-bold mb-4 uppercase text-xs tracking-widest text-green-500">Layanan</h5>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>Rehabilitasi Hutan & Lahan</li>
              <li>Survei & Pemetaan Drone</li>
              <li>Analisis Spasial GEE</li>
              <li>Pengadaan Bibit Kehutanan dan Pertanian</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4 uppercase text-xs tracking-widest text-green-500">Alamat</h5>
            <p className="text-gray-400 text-sm mb-2">📍 Kab. Katingan, Kalimantan Tengah</p>
            <p className="text-gray-400 text-sm">📧 hijauinbumiagritech@gmail.com</p>
          </div>
        </div>
        
        <div className="mt-10 flex flex-col items-center">
          <p className="text-center text-gray-600 text-xs tracking-widest uppercase">
            © 2026 CV. Hijauin Bumi Agritech | Kalimantan Tengah
          </p>
          <button 
            onClick={() => { window.location.href = "/admin"; }}
            className="mt-6 text-[9px] text-gray-800 hover:text-green-700 transition-colors uppercase tracking-[0.5em] font-bold"
          >
            Manajemen Sistem
          </button>
        </div>
      </footer>
    </main>
  );
}

function ServiceCard({ icon, title, desc }) {
  return (
    <div className="group p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 text-center cursor-pointer">
      <div className="text-4xl mb-6">{icon}</div>
      <h4 className="text-xl font-bold mb-3 group-hover:text-green-700 text-gray-800">{title}</h4>
      <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function FeatureItem({ num, title, desc }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">{num}</div>
      <div>
        <h4 className="font-bold text-gray-800">{title}</h4>
        <p className="text-sm text-gray-600">{desc}</p>
      </div>
    </div>
  );
}