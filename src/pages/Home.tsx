import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, BookOpen, Users, Award } from "lucide-react";
import Navigation from "@/components/Navigation";
import BookCard from "@/components/BookCard";
import { booksAPI } from "@/lib/api";
import heroImage from "@/assets/hero-publisher.jpg";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        const response = await booksAPI.getFeatured();
        if (response.success) {
          setFeaturedBooks(response.data.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching featured books:', error);
        // Fallback: fetch first 3 books from regular endpoint
        try {
          const fallback = await booksAPI.getAll({ limit: 3 });
          if (fallback.success) {
            setFeaturedBooks(fallback.data.books || []);
          }
        } catch (err) {
          console.error('Error fetching books:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedBooks();
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-primary-foreground py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={heroImage} 
            alt="Publisher books" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Adilla Bangun Negeri
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 max-w-3xl mx-auto">
              Menerbitkan karya berkualitas untuk kemajuan pendidikan dan ilmu pengetahuan Indonesia
            </p>
            
            {/* Main Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="flex gap-2 bg-background/10 backdrop-blur-sm rounded-xl p-2">
                <Input
                  type="text"
                  placeholder="Cari berdasarkan judul, penulis, atau ISSN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-background text-foreground border-0 focus-visible:ring-2 focus-visible:ring-accent"
                />
                <Button type="submit" size="lg" variant="secondary" className="px-8">
                  <Search className="h-5 w-5 mr-2" />
                  Cari
                </Button>
              </div>
            </form>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/catalog">
                <Button variant="outline" size="lg" className="bg-background/20 text-primary-foreground border-primary-foreground/30 hover:bg-background/30">
                  Lihat Katalog
                </Button>
              </Link>
              <Link to="/search">
                <Button variant="secondary" size="lg">
                  Pencarian Lanjutan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section
      <section className="py-16 bg-publisher-cream/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-accent">2+</div>
              <div className="text-muted-foreground">Buku Diterbitkan</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-accent">1+</div>
              <div className="text-muted-foreground">Penulis Terpercaya</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-accent">1+</div>
              <div className="text-muted-foreground">Tahun Berpengalaman</div>
            </div>
          </div>
        </div>
      </section> */}
      
      {/* Featured Books */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Buku Terbaru & Terpopuler
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Temukan koleksi buku akademik terbaru dan terpopuler dari penulis-penulis terpercaya
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-muted"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featuredBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredBooks.map((book) => (
                <BookCard key={book._id || book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Belum ada buku featured</p>
            </div>
          )}
          
          <div className="text-center">
            <Link to="/catalog">
              <Button size="lg" className="bg-gradient-accent text-accent-foreground hover:shadow-glow transition-all">
                Lihat Semua Buku
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section className="py-16 bg-gradient-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Tentang Adilla Bangun Negeri
              </h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                Adilla Bangun Negeri berkomitmen menerbitkan buku-buku berkualitas yang menjadi pilar bagi pendidikan, pengetahuan, dan kecerdasan bangsa. 
              </p>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Setiap karya yang diterbitkan tidak hanya ditujukan untuk memperkaya wawasan, tetapi juga untuk menanamkan nilai-nilai kebangsaan, memperkuat literasi, serta mendukung pembangunan manusia Indonesia yang unggul.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <BookOpen className="h-8 w-8 text-accent mx-auto mb-2" />
                  <div className="font-semibold">Kualitas Terjamin</div>
                </div>
                <div className="text-center">
                  <Users className="h-8 w-8 text-accent mx-auto mb-2" />
                  <div className="font-semibold">Penulis Profesional</div>
                </div>
                <div className="text-center">
                  <Award className="h-8 w-8 text-accent mx-auto mb-2" />
                  <div className="font-semibold">Standar Internasional</div>
                </div>
              </div>
            </div>
            
            <div className="lg:pl-8">
              <Card className="border-border/50 shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-accent">Bidang Spesialisasi</CardTitle>
                  <CardDescription>
                    Area fokus penerbitan kami
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    "Islami",
                    "Umum"
                  ].map((field) => (
                    <div key={field} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span className="text-foreground">{field}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6 text-accent" />
                <span className="text-xl font-bold">Adilla Bangun Negeri</span>
              </div>
              <p className="text-primary-foreground/80 mb-4">
                Penerbit yang berkomitmen menghadirkan buku-buku berkualitas sebagai 
                sarana mencerdaskan kehidupan bangsa. Dengan mengusung semangat literasi dan pendidikan, kami menerbitkan 
                karya yang relevan, inspiratif, dan bermanfaat bagi pembaca dari berbagai kalangan. 
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><Link to="/catalog" className="hover:text-accent transition-colors">Katalog</Link></li>
                <li><Link to="/search" className="hover:text-accent transition-colors">Pencarian</Link></li>
                <li><Link to="/login" className="hover:text-accent transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Kontak</h3>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>Email: adillamedia@gmail.com</li>
                <li>Telepon: +62 812-7635-5543</li>
                <li>Pasir Putih, Tabing, Padang, Sumbar, Indonesia.</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
            <p>&copy; 2025 Adilla Bangun Negeri. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;