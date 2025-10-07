import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search as SearchIcon, Filter, BookOpen, User, Hash } from "lucide-react";
import Navigation from "@/components/Navigation";
import BookCard from "@/components/BookCard";
import { booksAPI } from "@/lib/api";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [searchType, setSearchType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
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
  
  // Advanced search filters
  const filteredBooks = useMemo(() => {
    if (!searchResults.length) return [];
    
    let results = searchResults;
    
    // Filter by search type
    if (searchType !== "all" && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter((book: any) => {
        switch (searchType) {
          case "title":
            return book.title?.toLowerCase().includes(query);
          case "author":
            return book.author?.toLowerCase().includes(query);
          case "issn":
            return book.issn?.toLowerCase().includes(query);
          default:
            return true;
        }
      });
    }
    
    // Filter by category
    if (selectedCategory !== "all") {
      results = results.filter((book: any) => book.category === selectedCategory);
    }
    
    return results;
  }, [searchResults, searchType, selectedCategory, searchQuery]);
  
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    setLoading(true);
    try {
      const response = await booksAPI.getAll({
        search: searchQuery,
        limit: 100 // Get more results for client-side filtering
      });
      
      if (response.success) {
        setSearchResults(response.data.books || []);
      }
    } catch (error) {
      console.error('Error searching books:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Perform search when query param changes
  useEffect(() => {
    const q = searchParams.get("q");
    if (q && q !== searchQuery) {
      setSearchQuery(q);
    }
  }, [searchParams]);
  
  // Auto-search when searchQuery changes
  useEffect(() => {
    if (searchQuery.trim()) {
      const debounce = setTimeout(() => {
        handleSearch();
      }, 500);
      
      return () => clearTimeout(debounce);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);
  
  // Update URL when search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
    } else {
      setSearchParams({});
    }
  }, [searchQuery, setSearchParams]);
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <section className="bg-gradient-card py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Pencarian Buku
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Cari buku berdasarkan judul, penulis, ISSN, atau deskripsi dengan filter lanjutan
            </p>
          </div>
          
          {/* Advanced Search Form */}
          <Card className="max-w-4xl mx-auto shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center">
                <SearchIcon className="h-5 w-5 mr-2 text-accent" />
                Pencarian Lanjutan
              </CardTitle>
              <CardDescription>
                Gunakan filter untuk mempersempit hasil pencarian
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSearch}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Search Query */}
                  <div className="md:col-span-6">
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Kata Kunci
                    </label>
                    <Input
                      placeholder="Masukkan kata kunci pencarian..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Search Type */}
                  <div className="md:col-span-3">
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Cari di
                    </label>
                    <Select value={searchType} onValueChange={setSearchType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Field</SelectItem>
                        <SelectItem value="title">Judul Buku</SelectItem>
                        <SelectItem value="author">Penulis</SelectItem>
                        <SelectItem value="issn">ISSN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Category Filter */}
                  <div className="md:col-span-3">
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Kategori
                    </label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue />
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
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Button type="submit" className="bg-gradient-accent hover:shadow-glow transition-all">
                    <SearchIcon className="h-4 w-4 mr-2" />
                    Cari Buku
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchType("all");
                      setSelectedCategory("all");
                      setSearchParams({});
                      setSearchResults([]);
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Search Tips */}
      <section className="py-8 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-accent/20">
              <CardContent className="p-4 text-center">
                <BookOpen className="h-8 w-8 text-accent mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Cari Judul</h3>
                <p className="text-sm text-muted-foreground">
                  Gunakan kata kunci dari judul buku
                </p>
              </CardContent>
            </Card>
            <Card className="border-accent/20">
              <CardContent className="p-4 text-center">
                <User className="h-8 w-8 text-accent mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Cari Penulis</h3>
                <p className="text-sm text-muted-foreground">
                  Masukkan nama penulis atau pengarang
                </p>
              </CardContent>
            </Card>
            <Card className="border-accent/20">
              <CardContent className="p-4 text-center">
                <Hash className="h-8 w-8 text-accent mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Cari ISSN</h3>
                <p className="text-sm text-muted-foreground">
                  Gunakan nomor ISSN untuk pencarian spesifik
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Results */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {searchQuery.trim() ? (
            <>
              {/* Results Info */}
              <div className="flex flex-wrap items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Hasil Pencarian
                  </h2>
                  <p className="text-muted-foreground">
                    {loading ? "Mencari..." : `${filteredBooks.length} buku ditemukan untuk "${searchQuery}"`}
                  </p>
                </div>
                
                {/* Active Filters */}
                <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                  {searchType !== "all" && (
                    <Badge variant="secondary">
                      <Filter className="h-3 w-3 mr-1" />
                      {searchType === "title" ? "Judul" : 
                       searchType === "author" ? "Penulis" : "ISSN"}
                    </Badge>
                  )}
                  {selectedCategory !== "all" && (
                    <Badge variant="secondary">
                      Kategori: {selectedCategory}
                    </Badge>
                  )}
                </div>
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
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Tidak ada hasil ditemukan
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Coba gunakan kata kunci yang berbeda atau ubah filter pencarian Anda
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery("");
                      setSearchType("all");
                      setSelectedCategory("all");
                      setSearchResults([]);
                    }}
                  >
                    Reset Pencarian
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Mulai Pencarian
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Masukkan kata kunci untuk mencari buku dalam katalog kami
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Search;