// Mock data untuk development - nanti akan diganti dengan API Supabase

export interface Book {
  id: number;
  title: string;
  author: string;
  issn: string;
  published_year: number;
  category: string;
  description: string;
  pages: number;
  cover?: string;
}

export const mockBooks: Book[] = [
  {
    id: 1,
    title: "Metodologi Penelitian Kualitatif",
    author: "Dr. Sugiyono",
    issn: "978-602-1234-567-8",
    published_year: 2023,
    category: "Metodologi",
    description: "Buku ini membahas secara mendalam tentang metodologi penelitian kualitatif yang dapat diterapkan dalam berbagai bidang ilmu. Disertai dengan contoh-contoh praktis dan panduan langkah demi langkah.",
    pages: 324
  },
  {
    id: 2,
    title: "Pendidikan Karakter di Era Digital",
    author: "Prof. Dr. Sartono Kartodirdjo",
    issn: "978-602-1234-568-5",
    published_year: 2023,
    category: "Pendidikan",
    description: "Mengupas tuntas tentang pentingnya pendidikan karakter dalam menghadapi tantangan era digital. Buku ini memberikan solusi praktis untuk pendidik dan orang tua.",
    pages: 256
  },
  {
    id: 3,
    title: "Teori Ekonomi Makro Modern",
    author: "Dr. Mulyadi Subri",
    issn: "978-602-1234-569-2",
    published_year: 2022,
    category: "Ekonomi",
    description: "Analisis komprehensif tentang teori ekonomi makro kontemporer dengan pendekatan yang mudah dipahami. Dilengkapi dengan studi kasus ekonomi Indonesia.",
    pages: 412
  },
  {
    id: 4,
    title: "Psikologi Perkembangan Anak",
    author: "Dr. Rita Eka Izzaty",
    issn: "978-602-1234-570-8",
    published_year: 2023,
    category: "Psikologi",
    description: "Membahas tahapan perkembangan anak dari berbagai aspek psikologis. Buku ini penting bagi mahasiswa psikologi, guru, dan orang tua.",
    pages: 298
  },
  {
    id: 5,
    title: "Teknologi Informasi dalam Pembelajaran",
    author: "Dr. Bambang Warsita",
    issn: "978-602-1234-571-5",
    published_year: 2023,
    category: "Teknologi",
    description: "Panduan lengkap pemanfaatan teknologi informasi untuk meningkatkan kualitas pembelajaran di era digital.",
    pages: 356
  },
  {
    id: 6,
    title: "Filsafat Ilmu Pengetahuan",
    author: "Prof. Dr. Jujun S. Suriasumantri",
    issn: "978-602-1234-572-2",
    published_year: 2022,
    category: "Filsafat",
    description: "Menguraikan dasar-dasar filosofis dalam pengembangan ilmu pengetahuan. Buku wajib untuk mahasiswa tingkat lanjut.",
    pages: 378
  }
];