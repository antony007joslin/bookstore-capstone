import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { addressApi, orderApi } from '../api/apiClient';
import { 
  MapPin, 
  CreditCard, 
  Award, 
  CheckCircle, 
  ShieldCheck, 
  Truck, 
  AlertCircle,
  Plus,
  Lock
} from 'lucide-react';

const CheckoutPage = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();

  // Addresses
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    recipientName: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  });

  // Gift Points Redemption (Slide 8 requirement)
  const [useGiftPoints, setUseGiftPoints] = useState(false);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);

  // Payment Options (Slide 8 & Slide 9 requirement)
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD'); // 'CREDIT_CARD', 'DEBIT_CARD'
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    const fetchAddresses = async () => {
      try {
        const userId = user?.id || 1;
        const res = await addressApi.getUserAddresses(userId);
        setAddresses(res.data);
        if (res.data.length > 0) {
          const defaultAddr = res.data.find(a => a.isDefault) || res.data[0];
          setSelectedAddressId(defaultAddr.id);
        } else {
          setIsAddingNewAddress(true);
        }
      } catch (err) {
        console.error('Error fetching addresses:', err);
      }
    };
    fetchAddresses();
  }, [user, items, navigate]);

  // Handle gift point calculations
  const maxAvailablePoints = user?.giftPoints || 0;
  // Maximum discount cannot exceed subtotal (10 points = $1)
  const maxPointsApplicable = Math.min(maxAvailablePoints, Math.floor(subtotal * 10));
  const giftDiscount = useGiftPoints ? (pointsToRedeem / 10) : 0;
  const finalAmount = Math.max(0, subtotal - giftDiscount);

  const handleToggleGiftPoints = (e) => {
    const checked = e.target.checked;
    setUseGiftPoints(checked);
    if (checked) {
      setPointsToRedeem(maxPointsApplicable);
    } else {
      setPointsToRedeem(0);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const orderData = {
        userId: user?.id || 1,
        addressId: isAddingNewAddress ? null : selectedAddressId,
        paymentMethod: paymentMethod,
        giftPointsToRedeem: useGiftPoints ? pointsToRedeem : 0,
        items: items.map(item => ({
          bookId: item.book.id,
          quantity: item.quantity,
        })),
        ...(isAddingNewAddress ? {
          recipientName: newAddress.recipientName || user?.fullName || 'John Doe',
          streetAddress: newAddress.streetAddress,
          city: newAddress.city,
          state: newAddress.state,
          postalCode: newAddress.postalCode,
          country: newAddress.country,
        } : {})
      };

      const res = await orderApi.createOrder(orderData);
      clearCart();
      await refreshProfile();
      navigate(`/order-confirmation/${res.data.id}`);
    } catch (err) {
      console.error('Order placement failed:', err);
      setError(err.response?.data?.message || 'Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-3xl font-extrabold text-slate-900">Checkout & Payment</h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete delivery address and payment details to place your order
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Delivery Address & Payment Form */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* 1. Select Delivery Address (Slide 8 Wireframe Requirement) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h2 className="text-lg font-extrabold text-slate-900">Delivery Address</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingNewAddress(!isAddingNewAddress)}
                className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingNewAddress ? 'Use Saved Address' : 'Add New Address'}</span>
              </button>
            </div>

            {!isAddingNewAddress ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? 'border-sky-600 bg-sky-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryAddress"
                      value={addr.id}
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="sr-only"
                    />
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-sm text-slate-900">{addr.recipientName}</span>
                          {addr.isDefault && (
                            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded">Default</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600">{addr.streetAddress}</p>
                        <p className="text-xs text-slate-500">{addr.city}, {addr.state} {addr.postalCode}</p>
                      </div>
                      {selectedAddressId === addr.id && (
                        <CheckCircle className="w-5 h-5 text-sky-600 flex-shrink-0" />
                      )}
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">New Address Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Recipient Name</label>
                    <input
                      type="text"
                      required={isAddingNewAddress}
                      value={newAddress.recipientName}
                      onChange={(e) => setNewAddress({ ...newAddress, recipientName: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Street Address</label>
                    <input
                      type="text"
                      required={isAddingNewAddress}
                      value={newAddress.streetAddress}
                      onChange={(e) => setNewAddress({ ...newAddress, streetAddress: e.target.value })}
                      placeholder="e.g. 742 Evergreen Terrace"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">City</label>
                    <input
                      type="text"
                      required={isAddingNewAddress}
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      placeholder="Springfield"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">State</label>
                      <input
                        type="text"
                        required={isAddingNewAddress}
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        placeholder="OR"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">ZIP Code</label>
                      <input
                        type="text"
                        required={isAddingNewAddress}
                        value={newAddress.postalCode}
                        onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                        placeholder="97477"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Redeem Gift Points (Slide 8 Wireframe Requirement) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Redeem Gift Points</h2>
                <p className="text-xs text-slate-500">Every 10 points = $1.00 instant checkout discount</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-sm">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Available Balance: <span className="text-amber-700">{maxAvailablePoints} Points</span>
                  </p>
                  <p className="text-xs text-slate-600">
                    You can redeem up to {maxPointsApplicable} points (${(maxPointsApplicable / 10).toFixed(2)} off) on this order
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useGiftPoints}
                  onChange={handleToggleGiftPoints}
                  disabled={maxPointsApplicable === 0}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-amber-600"></div>
                <span className="ml-2 text-xs font-bold text-slate-900">Apply Points</span>
              </label>
            </div>

            {useGiftPoints && (
              <div className="flex items-center space-x-4 pt-2">
                <span className="text-xs text-slate-600 font-medium">Points to Redeem:</span>
                <input
                  type="range"
                  min="10"
                  max={maxPointsApplicable}
                  step="10"
                  value={pointsToRedeem}
                  onChange={(e) => setPointsToRedeem(Number(e.target.value))}
                  className="w-48 accent-amber-600"
                />
                <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-lg">
                  {pointsToRedeem} pts (-${(pointsToRedeem / 10).toFixed(2)})
                </span>
              </div>
            )}
          </div>

          {/* 3. Initiate Payment with Right Option (Slide 8 & 9 Wireframe Requirement) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h2 className="text-lg font-extrabold text-slate-900">Payment Screen</h2>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('CREDIT_CARD')}
                className={`p-4 rounded-2xl border-2 flex items-center space-x-3 transition-all ${
                  paymentMethod === 'CREDIT_CARD'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm text-indigo-950 font-bold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <span className="text-xs">Credit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('DEBIT_CARD')}
                className={`p-4 rounded-2xl border-2 flex items-center space-x-3 transition-all ${
                  paymentMethod === 'DEBIT_CARD'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm text-indigo-950 font-bold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <span className="text-xs">Debit Card</span>
              </button>
            </div>

            {/* Mock Card Form */}
            <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
                    placeholder="4242 4242 4242 4242"
                  />
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Expiration Date</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Security Code (CVV)</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
                      placeholder="123"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Complete Payment */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6 sticky top-24">
            <h2 className="text-lg font-extrabold text-slate-900 pb-3 border-b border-slate-100">
              Payment Summary
            </h2>

            {/* Items Breakdown */}
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {items.map(({ book, quantity }) => (
                <div key={book.id} className="flex justify-between items-center text-xs">
                  <div className="truncate max-w-[180px]">
                    <span className="font-semibold text-slate-900">{book.title}</span>
                    <span className="text-slate-400 block text-[10px]">Qty: {quantity}</span>
                  </div>
                  <span className="font-bold text-slate-800">
                    ${((book.discountPrice || book.price) * quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Standard Delivery</span>
                <span className="text-emerald-600 font-semibold">FREE</span>
              </div>
              {useGiftPoints && giftDiscount > 0 && (
                <div className="flex justify-between text-amber-700 font-semibold">
                  <span>Gift Points Discount ({pointsToRedeem} pts)</span>
                  <span>-${giftDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Final Payable</span>
                <span className="text-2xl font-black text-indigo-700">${finalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Complete Payment Button (Slide 9 requirement) */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 hover:scale-[1.01]"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? 'Processing Payment...' : `Complete Payment ($${finalAmount.toFixed(2)})`}</span>
            </button>

            <div className="text-center pt-2">
              <p className="text-[11px] text-slate-400">
                By placing your order, you agree to BookHaven's terms and 48-hour return/cancellation policy.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
