import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Calendar, Hash, User, FileText } from "lucide-react";
import Navigation from "@/components/Navigation";
import { booksAPI } from "@/lib/api";

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const response = await booksAPI.getById(id);
        if (response.success) {
          setBook(response.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching book:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBook();
  }, [id]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Memuat detail buku...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !book) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📖</div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Buku tidak ditemukan</h1>
            <p className="text-muted-foreground mb-6">
              Buku yang Anda cari mungkin tidak ada atau telah dipindahkan.
            </p>
            <Link to="/catalog">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Katalog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Breadcrumb */}
      <div className="bg-gradient-card py-4 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <span>/</span>
            <Link to="/catalog" className="hover:text-accent transition-colors">Catalog</Link>
            <span>/</span>
            <span className="text-foreground">{book.title}</span>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Book Cover */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="overflow-hidden shadow-book">
                <div className="aspect-[3/4] bg-gradient-accent flex items-center justify-center p-8">
                  {book.cover ? (
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center text-accent-foreground">
                      <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-80" />
                      <h3 className="font-bold text-lg">{book.title}</h3>
                    </div>
                  )}
                </div>
              </Card>
              
              {/* Quick Actions */}
              <div className="mt-6 space-y-3">
                <Button size="lg" className="w-full bg-gradient-accent hover:shadow-glow transition-all">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Baca Preview
                </Button>
                <Button variant="outline" size="lg" className="w-full">
                  <FileText className="h-5 w-5 mr-2" />
                  Download Katalog
                </Button>
              </div>
            </div>
          </div>
          
          {/* Book Details */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {/* Header */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge variant="secondary" className="text-sm">
                    {book.category}
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    {book.published_year}
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                  {book.title}
                </h1>
                <p className="text-xl text-muted-foreground mb-6">
                  by <span className="text-accent font-semibold">{book.author}</span>
                </p>
              </div>
              
              {/* Book Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Hash className="h-5 w-5 mr-2 text-accent" />
                      ISSN
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-mono text-lg">{book.issn}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-accent" />
                      Tahun Terbit
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg">{book.published_year}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <User className="h-5 w-5 mr-2 text-accent" />
                      Penulis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg">{book.author}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-accent" />
                      Jumlah Halaman
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg">{book.pages} halaman</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Deskripsi Buku</CardTitle>
                  <CardDescription>
                    Ringkasan dan gambaran umum buku
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed text-lg">
                    {book.description}
                  </p>
                </CardContent>
              </Card>
              
              {/* Publisher Info */}
              <Card className="bg-gradient-card">
                <CardHeader>
                  <CardTitle className="text-xl">Tentang Penerbit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <BookOpen className="h-8 w-8 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Penerbit Akademia</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Penerbit terpercaya dengan pengalaman lebih dari 25 tahun dalam menerbitkan 
                        buku-buku akademik berkualitas tinggi untuk mendukung kemajuan pendidikan Indonesia.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Back to Catalog */}
        <div className="mt-12 text-center">
          <Link to="/catalog">
            <Button variant="outline" size="lg">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Kembali ke Katalog
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;