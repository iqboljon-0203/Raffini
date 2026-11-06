import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FBF8F3] text-[#1A1F33] flex flex-col items-center justify-center p-6 text-center select-none font-sans">
      <h2 className="text-5xl font-serif font-bold text-[#1A1F33] mb-2">404</h2>
      <p className="text-sm text-[#1A1F33]/70 mb-6">Kechirasiz, sahifa topilmadi</p>
      <Link
        href="/"
        className="px-6 py-3 rounded-full bg-[#1A1F33] text-[#FAE9D7] text-xs font-bold uppercase tracking-wider shadow-sm hover:opacity-95 transition"
      >
        Bosh sahifaga qaytish
      </Link>
    </div>
  );
}
