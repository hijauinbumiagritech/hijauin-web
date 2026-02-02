"use client";
import { useState, useEffect } from "react";
import { db } from "../lib-firebase";
import { 
  collection, addDoc, onSnapshot, deleteDoc, 
  doc, serverTimestamp, updateDoc, increment, query, orderBy, limit 
} from "firebase/firestore";
import Link from "next/link";

export default function AdminPage() {
  const [items, setItems] = useState([]);
  const [logs, setLogs] = useState([]); 
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [form, setForm] = useState({
    nama: "", kategori: "Kehutanan", harga: "", jumlah: "", spesifikasi: "", imageUrl: ""
  });
  
  const [masukQty, setMasukQty] = useState({});
  const [keluarQty, setKeluarQty] = useState({});

  const fotoDefault = "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=500&auto=format&fit=crop";

  // --- LOGIKA PERBAIKAN LINK DRIVE (Agar Gambar Muncul) ---
  const perbaikiLinkDrive = (url) => {
    if (!url) return "";
    // Menangkap ID file dari link Drive Bapak
    const match = url.match(/\/d\/([^/]+)/) || url.match(/id=([^&]+)/);
    if (match && match[1]) {
      const fileId = match[1];
      // Format link ini lebih stabil untuk menampilkan gambar langsung
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
    return url;
  };

  const formatRibuan = (angka) => {
    if (!angka) return "";
    const stringAngka = angka.toString().replace(/\D/g, ""); 
    return stringAngka.replace(/\B(?=(\d{3})+(?!\d))/g, "."); 
  };

  const bersihkanAngka = (teks) => {
    if (!teks) return 0;
    return Number(teks.toString().replace(/\./g, ""));
  };

  // --- FUNGSI EDIT HARGA (Tanpa Mengubah Stok) ---
  const handleEditHarga = async (id, nama, hargaLama) => {
    const inputBaru = prompt(`Edit Harga untuk ${nama}:`, hargaLama.toLocaleString('id-ID'));
    if (inputBaru === null) return; 

    const hargaBaru = bersihkanAngka(inputBaru);
    if (isNaN(hargaBaru) || hargaBaru <= 0) return alert("Harga tidak valid!");

    try {
      const docRef = doc(db, "produk", id);
      await updateDoc(docRef, { harga: hargaBaru });
      alert(`Harga ${nama} berhasil diubah!`);
    } catch (err) {
      alert("Gagal update harga: " + err.message);
    }
  };

  useEffect(() => {
    if (!isAuthorized) {
      const pin = prompt("Halaman Terkunci. Masukkan Sandi Manajemen:");
      if (pin === "2026") {
        setIsAuthorized(true);
      } else {
        alert("Sandi Salah!");
        window.location.href = "/";
      }
    }
  }, [isAuthorized]);

  useEffect(() => {
    if (isAuthorized) {
      const unsubProduk = onSnapshot(collection(db, "produk"), (snapshot) => {
        setItems(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      });

      const qLog = query(collection(db, "riwayat_stok"), orderBy("waktu", "desc"), limit(20));
      const unsubLog = onSnapshot(qLog, (snapshot) => {
        setLogs(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      });

      return () => { unsubProduk(); unsubLog(); };
    }
  }, [isAuthorized]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "produk"), {
        ...form,
        imageUrl: perbaikiLinkDrive(form.imageUrl), // Otomatis konversi link Drive saat simpan
        harga: bersihkanAngka(form.harga),
        jumlah: bersihkanAngka(form.jumlah),
        waktu: serverTimestamp()
      });
      alert("Produk Berhasil Ditambahkan!");
      setForm({ nama: "", kategori: "Kehutanan", harga: "", jumlah: "", spesifikasi: "", imageUrl: "" });
    } catch (err) { alert("Error: " + err.message); }
  };

  const updateStok = async (id, tipe, nama, spek) => {
    const rawQty = tipe === "MASUK" ? masukQty[id] : keluarQty[id];
    const qty = bersihkanAngka(rawQty);

    if (!qty || qty <= 0) return alert("Masukkan jumlah angka yang valid");
    const change = tipe === "MASUK" ? qty : -qty;

    try {
      const docRef = doc(db, "produk", id);
      await updateDoc(docRef, { jumlah: increment(change) });
      
      await addDoc(collection(db, "riwayat_stok"), {
        namaProduk: nama,
        spesifikasi: spek || "-",
        tipe: tipe,
        jumlah: qty,
        waktu: serverTimestamp()
      });
      
      if (tipe === "MASUK") setMasukQty({ ...masukQty, [id]: "" });
      else setKeluarQty({ ...keluarQty, [id]: "" });
      
      alert(`Berhasil! Stok ${nama} telah diperbarui.`);
    } catch (err) { alert("Gagal update: " + err.message); }
  };

  const handleDelete = async (id, nama) => {
    if (confirm(`Hapus ${nama} dari katalog?`)) {
      await deleteDoc(doc(db, "produk", id));
    }
  };

  if (!isAuthorized) return <div className="min-h-screen bg-green-50"></div>;

  return (
    <main className="min-h-screen bg-green-50/50 p-4 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-l-8 border-green-600 pl-6">
            <div>
                <h1 className="text-3xl font-black text-green-900 tracking-tighter uppercase">Manajemen Inventaris</h1>
                <p className="text-green-700 font-bold uppercase text-xs tracking-[0.3em]">CV. Hijauin Bumi Agritech</p>
            </div>
            <div className="flex gap-3">
               <Link href="/admin/converter" className="bg-orange-500 px-4 py-2 rounded-xl shadow-lg text-xs font-bold text-white hover:bg-orange-600 transition">Alat Converter Drive</Link>
               <Link href="/" className="bg-green-700 px-6 py-2 rounded-xl shadow-lg text-sm font-bold text-white hover:bg-green-800 transition">Beranda</Link>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            <div className="lg:col-span-1 bg-white rounded-[30px] shadow-xl p-6 border border-green-100 h-fit">
                <h2 className="text-lg font-bold mb-6 text-green-900 border-b pb-3">Daftar Bibit Baru</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Nama Bibit" className="w-full p-3 bg-green-50 rounded-xl outline-none text-sm" value={form.nama} onChange={(e) => setForm({...form, nama: e.target.value})} required />
                    
                    <select className="w-full p-3 bg-green-50 rounded-xl text-sm outline-none font-semibold text-green-800" value={form.kategori} onChange={(e) => setForm({...form, kategori: e.target.value})}>
                        <option value="Kehutanan">Kehutanan</option>
                        <option value="Pertanian">Pertanian</option>
                    </select>

                    <input type="text" placeholder="URL/Link Foto Bibit" className="w-full p-3 bg-green-50 rounded-xl outline-none text-sm" value={form.imageUrl} onChange={(e) => setForm({...form, imageUrl: e.target.value})} />

                    <div className="relative">
                      <span className="absolute left-3 top-3 text-[10px] text-green-700 font-bold">Rp</span>
                      <input type="text" inputMode="numeric" placeholder="Harga Jual" className="w-full p-3 pl-8 bg-green-50 rounded-xl outline-none text-sm font-bold" 
                        value={form.harga} onChange={(e) => setForm({...form, harga: formatRibuan(e.target.value)})} required />
                    </div>

                    <div className="relative">
                      <input type="text" inputMode="numeric" placeholder="Stok Awal" className="w-full p-3 bg-green-50 rounded-xl outline-none text-sm font-bold" 
                        value={form.jumlah} onChange={(e) => setForm({...form, jumlah: formatRibuan(e.target.value)})} required />
                      <span className="absolute right-3 top-3 text-[10px] text-gray-400 font-bold">BTG</span>
                    </div>

                    <textarea placeholder="Spesifikasi (Tinggi, Polybag, dll)" className="w-full p-3 bg-green-50 rounded-xl text-sm h-24 outline-none" value={form.spesifikasi} onChange={(e) => setForm({...form, spesifikasi: e.target.value})}></textarea>
                    <button type="submit" className="w-full bg-green-800 text-white font-bold py-3 rounded-xl hover:bg-green-900 transition-all uppercase text-xs tracking-widest shadow-lg">Simpan Katalog</button>
                </form>
            </div>

            <div className="lg:col-span-3 space-y-8">
                <div className="bg-white rounded-[30px] shadow-md border border-green-100 overflow-hidden">
                    <div className="p-5 bg-green-700 text-white font-bold text-sm tracking-widest uppercase flex items-center gap-3">
                        📦 Stok Bibit Saat Ini
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-green-50 text-green-800 text-[10px] uppercase font-bold">
                                <tr>
                                    <th className="p-5">Informasi Bibit</th>
                                    <th className="p-5 text-right">Harga (Rp)</th>
                                    <th className="p-5 text-center">Sisa Stok</th>
                                    <th className="p-5">Masuk/Keluar</th>
                                    <th className="p-5 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-green-50">
                                {items.map((item) => (
                                    <tr key={item.id} className="hover:bg-green-50/40 transition">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                              <img 
                                                src={item.imageUrl || fotoDefault} 
                                                alt="produk" 
                                                className="w-12 h-12 rounded-lg object-cover bg-green-100 shadow-sm"
                                                onError={(e) => { e.target.src = fotoDefault; }} 
                                              />
                                              <div>
                                                <p className="font-bold text-green-900 uppercase">{item.nama}</p>
                                                <p className="text-[10px] text-gray-400 italic">{item.kategori} | {item.spesifikasi || "-"}</p>
                                              </div>
                                            </div>
                                        </td>
                                        <td className="p-5 text-right font-bold text-green-700">
                                            <div className="flex items-center justify-end gap-2 group">
                                              {item.harga?.toLocaleString('id-ID')}
                                              <button 
                                                onClick={() => handleEditHarga(item.id, item.nama, item.harga)}
                                                className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-orange-500"
                                                title="Edit Harga"
                                              >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                              </button>
                                            </div>
                                        </td>
                                        <td className="p-5 text-center">
                                            <span className={`text-xl font-black ${item.jumlah < 20 ? 'text-red-500' : 'text-green-800'}`}>
                                                {item.jumlah?.toLocaleString('id-ID')}
                                            </span>
                                            <p className="text-[9px] text-gray-400 font-bold uppercase">Batang</p>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex gap-1">
                                                    <input type="text" inputMode="numeric" className="w-16 p-1 bg-green-50 rounded text-center text-xs font-bold border border-green-100 text-green-700" placeholder="+ Masuk" 
                                                      value={masukQty[item.id] || ""} onChange={(e) => setMasukQty({ ...masukQty, [item.id]: formatRibuan(e.target.value) })} />
                                                    <button onClick={() => updateStok(item.id, "MASUK", item.nama, item.spesifikasi)} className="bg-green-600 text-white px-2 rounded text-xs font-bold shadow-sm">+</button>
                                                </div>
                                                <div className="flex gap-1">
                                                    <input type="text" inputMode="numeric" className="w-16 p-1 bg-red-50 rounded text-center text-xs font-bold border border-red-100 text-red-600" placeholder="- Keluar" 
                                                      value={keluarQty[item.id] || ""} onChange={(e) => setKeluarQty({ ...keluarQty, [item.id]: formatRibuan(e.target.value) })} />
                                                    <button onClick={() => updateStok(item.id, "KELUAR", item.nama, item.spesifikasi)} className="bg-red-500 text-white px-2 rounded text-xs font-bold shadow-sm">-</button>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5 text-center">
                                            <button onClick={() => handleDelete(item.id, item.nama)} className="text-gray-300 hover:text-red-500 transition">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white rounded-[30px] shadow-md border border-green-100 overflow-hidden">
                    <div className="p-4 bg-green-800 text-white font-bold text-xs tracking-widest uppercase flex justify-between items-center">
                        <div className="flex items-center gap-2">📜 Rekap Riwayat Perubahan Stok</div>
                    </div>
                    <div className="overflow-x-auto max-h-80 overflow-y-auto">
                        <table className="w-full text-left text-[11px]">
                            <thead className="bg-green-50 text-green-700 uppercase font-bold sticky top-0 shadow-sm">
                                <tr>
                                    <th className="p-4">Waktu</th>
                                    <th className="p-4">Nama Bibit</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Jumlah (Btg)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-green-50">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-green-50/20 transition">
                                        <td className="p-4 text-gray-400">
                                            {log.waktu?.toDate().toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="p-4 font-bold text-green-900 uppercase">{log.namaProduk}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${log.tipe === 'MASUK' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {log.tipe}
                                            </span>
                                        </td>
                                        <td className={`p-4 text-right font-black text-sm ${log.tipe === 'MASUK' ? 'text-green-600' : 'text-red-600'}`}>
                                            {log.tipe === 'MASUK' ? '+' : '-'}{log.jumlah?.toLocaleString('id-ID')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </main>
  );
}