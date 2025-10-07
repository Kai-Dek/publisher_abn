import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import Navigation from "@/components/Navigation";
import BookCard from "@/components/BookCard";
import { booksAPI } from "@/lib/api";

const Catalog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalBooks, setTotalBooks] = useState(0);
  const booksPerPage = 9;
  
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await booksAPI.getCategories();
        if (response.success) {
          setCategories(response.data || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Fetch books with filters
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const params: any = {
          page: currentPage,
          limit: booksPerPage,
        };
        
        if (searchQuery) params.search = searchQuery;
        if (selectedCategory !== "all") params.category = selectedCategory;
        
        const response = await booksAPI.getAll(params);
        
        if (response.success) {
          setBooks(response.data.books || []);
          setTotalBooks(response.data.total || 0);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, [currentPage, searchQuery, selectedCategory]);
  
  // Get unique years from books
  const years = useMemo(() => {
    const yrs = [...new Set(books.map((book: any) => book.published_year))];
    return yrs.sort((a, b) => b - a);
  }, [books]);
  
  // Filter books by year (client-side)
  const filteredBooks = useMemo(() => {
    if (selectedYear === "all") return books;
    return books.filter((book: any) => book.published_year.toString() === selectedYear);
  }, [books, selectedYear]);
  
  const totalPages = Math.ceil(totalBooks / booksPerPage);
  
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedYear("all");
    setCurrentPage(1);
  };
  
  const activeFiltersCount = [searchQuery, selectedCategory !== "all", selectedYear !== "all"].filter(Boolean).length;
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <section className="bg-gradient-card py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Katalog Buku
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Jelajahi koleksi lengkap buku akademik berkualitas dari Penerbit Akademia
            </p>
          </div>
        </div>
      </section>
      
      {/* Filters */}
      <section className="py-8 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* Search */}
            <div className="md:col-span-5">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Pencarian
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari judul, penulis, atau ISSN..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="md:col-span-3">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Kategori
              </label>
              <Select value={selectedCategory} onValueChange={(val) => {
                setSelectedCategory(val);
                setCurrentPage(1);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((category: string) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Year Filter */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Tahun
              </label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Tahun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tahun</SelectItem>
                  {years.map((year: number) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Clear Filters */}
            <div className="md:col-span-2">
              {activeFiltersCount > 0 && (
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>
          
          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground flex items-center">
                <Filter className="h-3 w-3 mr-1" />
                Filter aktif:
              </span>
              {searchQuery && (
                <Badge variant="secondary" className="text-xs">
                  Pencarian: "{searchQuery}"
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  Kategori: {selectedCategory}
                </Badge>
              )}
              {selectedYear !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  Tahun: {selectedYear}
                </Badge>
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* Results */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Info */}
          <div className="flex justify-between items-center mb-8">
            <p className="text-muted-foreground">
              {loading ? "Memuat..." : `Menampilkan ${filteredBooks.length} buku`}
              {searchQuery && ` untuk "${searchQuery}"`}
            </p>
            <p className="text-sm text-muted-foreground">
              Halaman {currentPage} dari {totalPages || 1}
            </p>
          </div>
          
          {/* Books Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-muted rounded-lg mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBooks.map((book: any) => (
                <BookCard key={book._id || book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4"></div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Tidak ada buku ditemukan
              </h3>
              <p className="text-muted-foreground mb-6">
                Coba ubah kriteria pencarian atau filter Anda
              </p>
              <Button onClick={clearFilters} variant="outline">
                Reset Pencarian
              </Button>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && !loading && (
            <div className="mt-12 flex justify-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Sebelumnya
              </Button>
              
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-10"
                  >
                    {pageNum}
                  </Button>
                );
              })}
              
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Selanjutnya
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Catalog;