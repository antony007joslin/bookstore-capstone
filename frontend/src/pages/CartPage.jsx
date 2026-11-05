import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { bookApi } from '../api/apiClient';
import BookCard from '../components/BookCard';
import { 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  RotateCcw,
  Plus,
  Minus
} from 'lucide-react';

const CartPage = () => {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal, totalItemsCount } = useCart();
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const userId = user?.id || 1;
        const res = await bookApi.getRecommendations(userId);
        // Exclude items already in cart
        const cartBookIds = new Set(items.map(i => i.book.id));
        const filtered = res.data.filter(b => !cartBookIds.has(b.id)).slice(0, 4);
        setRecommendations(filtered);
      } catch (err) {
        console.error('Failed to load cart recommendations:', err);
      }
    };
    fetchRecommendations();
  }, [user, items]);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md mx-auto text-center bg-white rounded-3xl border border-slate-200/80 p-10 shadow-sm space-y-5">
          <div className="w-20 h-20 mx-auto bg-sky-50 text-sky-600 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Your Basket is Empty</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Looks like you haven't added any books to your cart yet. Explore our curated catalogue to find your next favorite title.
          </p>
          <Link
            to="/catalogue"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl shadow-md transition-all"
          >
            <span>Browse Bookstore</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Recommends items even on empty cart */}
        {recommendations.length > 0 && (
          <div className="mt-16 space-y-6">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-sky-600" />
              <h3 className="text-xl font-extrabold text-slate-900">Recommended for You</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Shopping Basket</h1>
          <p className="text-xs text-slate-500 mt-1">Review your items before proceeding to checkout</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-slate-400 hover:text-red-600 transition-colors"
        >
          Clear Basket
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map(({ book, quantity }) => {
            const price = book.discountPrice || book.price;
            const lineTotal = (price * quantity).toFixed(2);

            return (
              <div
                key={book.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-center gap-5"
              >
                {/* Book Thumbnail */}
                <Link to={`/books/${book.id}`} className="w-20 h-28 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center p-2 border border-slate-100">
                  <img
                    src={book.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=200&q=80'}
                    alt={book.title}
                    className="max-h-full max-w-full object-cover rounded shadow-sm"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 text-center sm:text-left space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                    {book.category?.name || 'Book'}
                  </span>
                  <Link to={`/books/${book.id}`} className="block">
                    <h3 className="text-sm font-bold text-slate-900 hover:text-sky-600 transition-colors line-clamp-1">
                      {book.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-500">
                    by <span className="font-medium text-slate-700">{book.author}</span>
                  </p>
                  <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start space-x-1">
                    <Truck className="w-3 h-3 text-sky-500" />
                    <span>Tentative delivery: {book.tentativeDeliveryDays || 3} business days</span>
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                    <button
                      onClick={() => updateQuantity(book.id, quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
                      title="Decrease"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-900">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(book.id, quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
                      title="Increase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[70px]">
                    <div className="text-sm font-extrabold text-slate-900">${lineTotal}</div>
                    <div className="text-[11px] text-slate-400">${price} each</div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(book.id)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary & Checkout Card */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6 sticky top-24">
            <h2 className="text-lg font-extrabold text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal ({totalItemsCount} units)</span>
                <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping & Handling</span>
                <span className="font-semibold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax</span>
                <span className="font-semibold text-slate-900">$0.00</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Total Amount</span>
                <span className="text-2xl font-black text-sky-700">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center space-x-2 hover:scale-[1.01]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Feature Guarantees */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-3.5 h-3.5 text-sky-600" />
                <span>Cancel easily within 48 hours</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Safe & Secure SSL Mock Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommends items based on Order History (Slide 7 Wireframe Requirement) */}
      {recommendations.length > 0 && (
        <div className="pt-10 border-t border-slate-200 space-y-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Recommended For You
              </h2>
              <p className="text-xs text-slate-500">Based on your past orders and interest categories</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
