import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Star, ShoppingBag, Check, Truck } from 'lucide-react';

const BookCard = ({ book }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(book, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const calculateDeliveryEstimate = (days = 3) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-sky-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Tentative Delivery Badge */}
      <div className="absolute top-3 left-3 z-10 bg-slate-900/80 backdrop-blur text-white text-[10px] font-medium px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-sm">
        <Truck className="w-3 h-3 text-sky-400" />
        <span>Arrives by {calculateDeliveryEstimate(book.tentativeDeliveryDays)}</span>
      </div>

      {/* Book Image */}
      <Link to={`/books/${book.id}`} className="relative h-60 bg-slate-100 overflow-hidden flex items-center justify-center p-4">
        <img
          src={book.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
          alt={book.title}
          className="h-full object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {book.featured && (
          <span className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
            Featured
          </span>
        )}
      </Link>

      {/* Book Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Publisher */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="font-semibold text-sky-600 truncate max-w-[120px]">
              {book.category?.name || 'General'}
            </span>
            <span className="truncate max-w-[120px] text-slate-400">
              {book.publisher?.name || 'Publisher'}
            </span>
          </div>

          {/* Title */}
          <Link to={`/books/${book.id}`} className="block">
            <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-sky-600 transition-colors leading-snug">
              {book.title}
            </h3>
          </Link>

          {/* Author */}
          <p className="text-xs text-slate-500 mt-1 truncate">
            by <span className="font-medium text-slate-700">{book.author}</span>
          </p>

          {/* Rating */}
          <div className="flex items-center space-x-1 mt-2">
            <div className="flex text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-bold text-slate-800">{book.rating || 4.5}</span>
            <span className="text-[11px] text-slate-400">({book.reviewsCount || 50})</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-base font-extrabold text-slate-900">
                ${book.discountPrice || book.price}
              </span>
              {book.discountPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ${book.price}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className={`p-2.5 rounded-xl font-medium text-xs flex items-center space-x-1.5 transition-all shadow-sm ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white'
            }`}
            title="Add to Basket"
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
