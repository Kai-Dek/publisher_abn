import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, User } from "lucide-react";

interface BookCardProps {
  book: {
    _id?: string;
    id?: number;
    title: string;
    author: string;
    category: string;
    published_year: number;
    issn?: string;
    cover?: string;
    description?: string;
  };
}

const BookCard = ({ book }: BookCardProps) => {
  // Use _id from MongoDB or id from mockData
  const bookId = book._id || book.id;
  
  return (
    <Link to={`/book/${bookId}`} className="block group">
      <Card className="h-full overflow-hidden transition-all hover:shadow-elegant hover:-translate-y-1">
        {/* Book Cover */}
        <div className="aspect-[3/4] bg-gradient-accent relative overflow-hidden">
          {book.cover ? (
            <img
              src={book.cover}
              alt={book.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full p-6 text-accent-foreground">
              <div className="text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-80" />
                <p className="font-semibold text-sm line-clamp-3">{book.title}</p>
              </div>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
              {book.category}
            </Badge>
          </div>
        </div>
        
        {/* Book Info */}
        <CardHeader className="pb-3">
          <CardTitle className="text-lg line-clamp-2 group-hover:text-accent transition-colors">
            {book.title}
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <User className="h-3 w-3" />
            <span className="line-clamp-1">{book.author}</span>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{book.published_year}</span>
            </div>
            {book.issn && (
              <div className="font-mono text-xs">
                {book.issn}
              </div>
            )}
          </div>
          
          {book.description && (
            <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
              {book.description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default BookCard;