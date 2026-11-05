import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookApi } from '../api/apiClient';
import { useCart } from '../context/CartContext';
import BookCard from '../components/BookCard';
import { 
  Star, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Award, 
  Check, 
  Building, 
  Layers, 
  Calendar,
  Sparkles
} from 'lucide-react';

const BookDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true);
        const [bookRes, relatedRes] = await Promise.all([
          bookApi.getBookById(id),
          bookApi.getRelatedBooks(id)
        ]);
        setBook(bookRes.data);
        setRelatedBooks(relatedRes.data);
        setQuantity(1);
      } catch (err) {
        console.error('Error fetching book details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (!book) return;
    addToCart(book, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const calculateDeliveryDate = (days = 3) => {
    const target = new Date();
    target.setDate(target.getDate() + days);
    return target.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="animate-pulse flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-1/3 h-96 bg-slate-200 rounded-3xl" />
          <div className="w-full md:w-2/3 space-y-4">
            <div className="h-8 bg-slate-200 rounded-xl w-3/4" />
            <div className="h-4 bg-slate-200 rounded-lg w-1/2" />
            <div className="h-24 bg-slate-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Book Not Found</h2>
        <Link to="/catalogue" className="mt-4 inline-block px-4 py-2 bg-sky-600 text-white rounded-xl text-sm font-semibold">
          Back to Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Product Hero */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Cover Image */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-sm h-[420px] bg-slate-50 rounded-2xl p-6 flex items-center justify-center border border-slate-100 shadow-inner relative">
            <img
              src={book.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
              alt={book.title}
              className="max-h-full max-w-full object-cover rounded-xl shadow-xl hover:scale-105 transition-transform duration-300"
            />
            {book.featured && (
              <span className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category & Publisher Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to={`/catalogue?categoryId=${book.category?.id}`}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-100 transition-colors"
              >
                {book.category?.name}
              </Link>
              <Link
                to={`/catalogue?publisherId=${book.publisher?.id}`}
                className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors flex items-center space-x-1"
              >
                <Building className="w-3 h-3 text-slate-500" />
                <span>{book.publisher?.name}</span>
              </Link>
            </div>

            {/* Title & Author */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {book.title}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Written by <span className="font-semibold text-slate-800">{book.author}</span>
              </p>
            </div>

            {/* Rating & Reviews */}
            <div className="flex items-center space-x-3 pb-2 border-b border-slate-100">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-900">{book.rating || 4.5}</span>
              <span className="text-xs text-slate-400">({book.reviewsCount || 120} Customer Reviews)</span>
              <span className="text-xs text-slate-300">|</span>
              <span className="text-xs text-slate-500 font-mono">ISBN: {book.isbn}</span>
            </div>

            {/* Tentative Delivery Date Banner (Slide 3 & 6 requirement) */}
            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-start space-x-3.5">
              <div className="p-2 bg-sky-600 text-white rounded-xl shadow-sm">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-sky-950 uppercase tracking-wide">Tentative Delivery</p>
                <p className="text-sm font-bold text-sky-700">
                  Estimated Arrival: {calculateDeliveryDate(book.tentativeDeliveryDays)}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Order now to get priority dispatch in {book.tentativeDeliveryDays} business days.
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Book Summary</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {book.description || 'No summary available for this title.'}
              </p>
            </div>
          </div>

          {/* Price, Quantity & Add to Cart */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-black text-slate-900">
                ${book.discountPrice || book.price}
              </span>
              {book.discountPrice && (
                <>
                  <span className="text-base text-slate-400 line-through">
                    ${book.price}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    Save ${(book.price - book.discountPrice).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* Quantity selector */}
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold text-sm shadow-sm"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-slate-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold text-sm shadow-sm"
                >
                  +
                </button>
              </div>

              {/* Add to basket button */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md ${
                  added
                    ? 'bg-emerald-600 text-white shadow-emerald-500/25'
                    : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-500/25 hover:scale-[1.01]'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added {quantity} to Basket!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add to Basket (${((book.discountPrice || book.price) * quantity).toFixed(2)})</span>
                  </>
                )}
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-500">
              <div className="flex items-center space-x-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-indigo-500" />
                <span>48-Hour Free Cancellation</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Earn 1 Reward Point per $10</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Appear for Selection (Slide 6 Wireframe Requirement) */}
      {relatedBooks.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-sky-600" />
            <h2 className="text-xl font-extrabold text-slate-900">
              Related Books from <span className="text-sky-600">{book.category?.name}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedBooks.map((relBook) => (
              <BookCard key={relBook.id} book={relBook} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetailPage;
