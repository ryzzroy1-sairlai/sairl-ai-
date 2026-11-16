# SAIRL AI — OpenAI API backend

## Penting
- Jangan pernah menaruh API key di `public/index.html`.
- Jangan mengunggah file `.env` ke GitHub.
- Jangan memakai ulang API key yang pernah terlanjur dibagikan. Cabut/revoke key tersebut dan buat key baru dengan bantuan orang tua/wali.
- Penggunaan API dapat menimbulkan biaya. Minta bantuan orang tua/wali untuk akun, izin, dan pengaturan batas penggunaan.

## Struktur
- `public/index.html`: antarmuka Liquid Glass.
- `server.js`: backend Express yang memanggil OpenAI Responses API.
- `.env.example`: contoh nama variabel rahasia. Salin menjadi `.env` hanya di server lokal; pada hosting, masukkan sebagai Environment Variables.

## Menjalankan lokal
Memerlukan Node.js 20 atau lebih baru.
1. Salin `.env.example` menjadi `.env`.
2. Isi `OPENAI_API_KEY` dengan key baru di komputer/server tepercaya, bukan di HTML atau chat.
3. Jalankan `npm install`.
4. Jalankan `npm start`.
5. Buka `http://localhost:3000`.

## Acode Android
Acode adalah editor, bukan server publik. Untuk memakai dari HP, unggah project ini ke layanan hosting Node.js yang mendukung server Node dan Environment Variables. Masukkan `OPENAI_API_KEY` melalui menu Environment Variables/Secrets di dashboard hosting. Jangan masukkan key di file frontend.
Setelah deploy, buka URL HTTPS hasil hosting. File HTML otomatis memanggil `/api/chat` pada domain yang sama.

## Catatan
- Model default: `gpt-4.1-mini`; dapat diganti lewat `OPENAI_MODEL` jika model tersebut tersedia untuk project API.
- Rate limit contoh: 15 request per menit per IP.
- Riwayat chat disimpan sementara di browser, bukan database.
- Untuk aplikasi publik, tambahkan autentikasi, pembatasan biaya di akun API, dan kebijakan privasi.

Catatan teknis: Helmet tetap mengaktifkan header keamanan umum. CSP dinonaktifkan pada contoh ini karena antarmuka memakai CSS/JavaScript inline dalam satu file HTML; jika nanti dipisah ke file CSS/JS, aktifkan kembali CSP yang ketat.
