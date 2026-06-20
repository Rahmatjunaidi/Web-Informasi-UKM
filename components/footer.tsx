export default function Footer() {
  return (
    <footer className="mt-12 py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6">
          <h4 className="font-semibold">Komunitas Mahasiswa UPJ</h4>
          <p className="mt-2 text-sm text-slate-200/80">Kelola keanggotaan, ikuti kegiatan, dan dapatkan informasi terbaru dari UKM dalam satu platform terintegrasi.</p>
        </div>
        <div className="glass-panel p-6">
          <h4 className="font-semibold">Kontak</h4>
          <ul className="mt-2 text-sm text-slate-200/80 space-y-1">
            <li>Email: ukm@univ.ac.id</li>
            <li>WhatsApp: +62 812-3456-7890</li>
            <li>Lokasi: Kampus Utama</li>
          </ul>
        </div>
        <div className="glass-panel p-6 text-center md:text-right">
          <div className="font-semibold">UKM UPJ</div>
          <div className="mt-2 text-sm text-slate-200/80">Portal Unit Kegiatan Mahasiswa Universitas Pembangunan Jaya</div>
          <div className="mt-4 text-sm text-slate-200/80">© 2026 UKM UPJ — Universitas Pembangunan Jaya</div>
        </div>
      </div>
    </footer>
  );
}