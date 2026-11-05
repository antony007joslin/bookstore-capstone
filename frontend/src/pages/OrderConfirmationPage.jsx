import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderApi } from '../api/apiClient';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  ArrowRight, 
  RotateCcw, 
  CreditCard, 
  Award,
  BookOpen
} from 'lucide-react';

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await orderApi.getOrderById(id);
        setOrder(res.data);
      } catch (err) {
        console.error('Failed to load order confirmation:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '3-5 business days';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="animate-pulse space-y-4">
          <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto" />
          <div className="h-8 bg-slate-200 rounded-xl w-64 mx-auto" />
          <div className="h-4 bg-slate-200 rounded-lg w-48 mx-auto" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Order not found</h2>
        <Link to="/" className="text-sky-600 hover:underline text-sm font-semibold">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Purchase Completion Header (Slide 10 Requirement) */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 rounded-3xl p-8 sm:p-12 border border-emerald-100 shadow-sm text-center space-y-4 relative overflow-hidden">
        <div className="w-20 h-20 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-600/30">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-200/60 px-3 py-1 rounded-full">
            Payment & Purchase Confirmed
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-3">Thank You for Your Order!</h1>
          <p className="text-sm text-slate-600 mt-1 max-w-lg mx-auto">
            Your order <span className="font-mono font-bold text-slate-900">#{order.id}</span> has been confirmed and is being processed.
          </p>
        </div>

        {/* Tentative Delivery Estimate */}
        <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur px-5 py-2.5 rounded-2xl shadow-sm border border-emerald-200/60 text-xs text-slate-800">
          <Truck className="w-4 h-4 text-emerald-600" />
          <span>Tentative Delivery Estimate: <strong className="text-emerald-800">{formatDate(order.deliveryEstimateDate)}</strong></span>
        </div>
      </div>

      {/* 48-Hour Free Cancellation Notice (Slide 3 & Slide 10 requirement) */}
      <div className="bg-indigo-50 border border-indigo-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-sm">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-indigo-950">48-Hour Order Cancellation Window</h4>
            <p className="text-xs text-indigo-700 mt-0.5">
              Change your mind? You can cancel this order and receive a full refund directly from your Order History within 48 hours.
            </p>
          </div>
        </div>

        <Link
          to="/orders"
          className="whitespace-nowrap px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center space-x-1.5"
        >
          <span>View Order History</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Order Details & Summary Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Purchased Items List */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <Package className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-extrabold text-slate-900">Purchased Items</h3>
          </div>

          <div className="space-y-4">
            {order.items?.map((item) => (
              <div key={item.id} className="flex items-center space-x-4">
                <img
                  src={item.book?.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=120&q=80'}
                  alt={item.book?.title}
                  className="w-12 h-16 object-cover rounded-lg border border-slate-100 shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{item.book?.title}</h4>
                  <p className="text-[11px] text-slate-500">by {item.book?.author}</p>
                  <p className="text-[11px] text-slate-400">Qty: {item.quantity} × ${item.unitPrice}</p>
                </div>
                <div className="text-xs font-bold text-slate-900">
                  ${item.subtotal}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery & Payment Information */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
          <div>
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100 mb-3">
              <MapPin className="w-4 h-4 text-sky-600" />
              <h3 className="text-sm font-extrabold text-slate-900">Shipping Address</h3>
            </div>
            {order.address ? (
              <div className="text-xs text-slate-600 space-y-0.5">
                <p className="font-bold text-slate-900">{order.address.recipientName}</p>
                <p>{order.address.streetAddress}</p>
                <p>{order.address.city}, {order.address.state} {order.address.postalCode}</p>
                <p>{order.address.country}</p>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Default Shipping Address</p>
            )}
          </div>

          <div>
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100 mb-3">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-extrabold text-slate-900">Payment Summary</h3>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span className="font-semibold text-slate-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${order.totalAmount}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-amber-700">
                  <span>Gift Points Redeemed ({order.giftPointsRedeemed} pts)</span>
                  <span>-${order.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-100">
                <span>Final Total Paid</span>
                <span className="text-sm text-sky-700">${order.finalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
        <Link
          to="/catalogue"
          className="w-full sm:w-auto px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2"
        >
          <BookOpen className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
        <Link
          to="/orders"
          className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center space-x-2"
        >
          <span>View All Orders</span>
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
