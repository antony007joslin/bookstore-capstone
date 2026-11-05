import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { orderApi } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  Clock, 
  RotateCcw, 
  ShoppingBag, 
  Truck, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Package,
  Calendar,
  ChevronRight,
  RefreshCw,
  Award
} from 'lucide-react';

const OrderHistoryPage = () => {
  const { user, refreshProfile } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [notification, setNotification] = useState(null);

  const fetchOrders = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await orderApi.getUserOrders(user.id);
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching order history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  // Check if order is within 48 hours of creation
  const isCancellable = (order) => {
    if (order.orderStatus === 'CANCELLED' || order.orderStatus === 'DELIVERED') {
      return false;
    }
    const orderDate = new Date(order.createdAt);
    const now = new Date();
    const diffHours = (now - orderDate) / (1000 * 60 * 60);
    return diffHours <= 48;
  };

  const getRemainingHours = (createdAt) => {
    const orderDate = new Date(createdAt);
    const now = new Date();
    const diffHours = 48 - (now - orderDate) / (1000 * 60 * 60);
    return Math.max(0, Math.floor(diffHours));
  };

  const handleCancelOrder = async (orderId) => {
    try {
      setCancellingOrderId(orderId);
      await orderApi.cancelOrder(orderId, user.id);
      setNotification({
        type: 'success',
        message: `Order #${orderId} was successfully cancelled. Any redeemed gift points have been refunded.`
      });
      await fetchOrders();
      await refreshProfile();
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Could not cancel order.'
      });
    } finally {
      setCancellingOrderId(null);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleBuyAgain = (item) => {
    addToCart(item.book, item.quantity);
    setNotification({
      type: 'success',
      message: `Added "${item.book.title}" to your basket!`
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleReorderAll = (order) => {
    order.items.forEach(item => {
      addToCart(item.book, item.quantity);
    });
    navigate('/cart');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return (
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full flex items-center space-x-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Delivered</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-2.5 py-1 bg-red-100 text-red-800 text-[11px] font-bold rounded-full flex items-center space-x-1">
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] font-bold rounded-full flex items-center space-x-1">
            <Truck className="w-3.5 h-3.5" />
            <span>In Transit</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[11px] font-bold rounded-full flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Processing</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">My Order History</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track past orders, use "Buy It Again", and manage cancellations within 48 hours.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-sky-600 hover:text-sky-700 bg-sky-50 px-3 py-2 rounded-xl"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Orders</span>
        </button>
      </div>

      {notification && (
        <div className={`p-4 rounded-2xl text-xs flex items-center space-x-2.5 animate-in fade-in ${
          notification.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="h-48 bg-slate-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 p-8 space-y-4">
          <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Orders Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't placed any book orders yet. Browse our catalogue and place your first order today!
          </p>
          <Link
            to="/catalogue"
            className="inline-block px-5 py-2.5 bg-sky-600 text-white rounded-xl text-xs font-bold hover:bg-sky-700 transition-colors"
          >
            Explore Catalogue
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const canCancel = isCancellable(order);
            const remainingHours = getRemainingHours(order.createdAt);

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden hover:border-slate-300 transition-all"
              >
                {/* Order Top Bar */}
                <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Order Placed</span>
                      <span className="font-semibold text-slate-800">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Amount</span>
                      <span className="font-bold text-slate-900">${order.finalAmount}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Ship To</span>
                      <span className="font-medium text-slate-800">
                        {order.address?.recipientName || 'John Doe'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-slate-500 font-bold">Order #{order.id}</span>
                    {getStatusBadge(order.orderStatus)}
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-6 space-y-6">
                  {/* Cancellation Alert Banner if within 48h (Slide 3 Requirement) */}
                  {canCancel && (
                    <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center space-x-2 text-amber-900">
                        <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <span>
                          <strong>48-Hour Cancellation Active:</strong> You have approximately <strong>{remainingHours} hours left</strong> to cancel this order for a full refund.
                        </span>
                      </div>

                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancellingOrderId === order.id}
                        className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm disabled:opacity-50 flex items-center space-x-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel Order'}</span>
                      </button>
                    </div>
                  )}

                  {/* Items list with "Buy It Again" */}
                  <div className="space-y-4">
                    {order.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.book?.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=150&q=80'}
                            alt={item.book?.title}
                            className="w-14 h-20 object-cover rounded-xl border border-slate-100 shadow-sm"
                          />
                          <div className="space-y-1">
                            <Link
                              to={`/books/${item.book?.id}`}
                              className="text-sm font-bold text-slate-900 hover:text-sky-600 transition-colors line-clamp-1"
                            >
                              {item.book?.title}
                            </Link>
                            <p className="text-xs text-slate-500">by {item.book?.author}</p>
                            <div className="text-xs text-slate-600 font-medium">
                              Qty: {item.quantity} × ${item.unitPrice} = <strong className="text-slate-900">${item.subtotal}</strong>
                            </div>
                          </div>
                        </div>

                        {/* Buy It Again Button (Slide 3 & 6 Requirement) */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleBuyAgain(item)}
                            className="px-4 py-2 bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white text-xs font-bold rounded-xl border border-sky-100 transition-colors flex items-center space-x-1.5 shadow-sm"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Buy It Again</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer Actions */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="text-xs text-slate-500 flex items-center space-x-4">
                      <span>Payment: <strong>{order.paymentMethod}</strong></span>
                      {order.giftPointsRedeemed > 0 && (
                        <span className="text-amber-700 font-semibold">
                          ★ {order.giftPointsRedeemed} Gift Points Redeemed
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleReorderAll(order)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Reorder All Items</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
