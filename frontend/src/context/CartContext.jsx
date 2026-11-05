import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('bookstore_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('bookstore_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (book, quantity = 1) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(item => item.book.id === book.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevItems, { book, quantity }];
      }
    });
  };

  const updateQuantity = (bookId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.book.id === bookId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (bookId) => {
    setItems((prevItems) => prevItems.filter(item => item.book.id !== bookId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const buyAgain = (orderItems) => {
    orderItems.forEach(item => {
      addToCart(item.book, item.quantity);
    });
  };

  const subtotal = items.reduce((sum, item) => {
    const price = item.book.discountPrice || item.book.price;
    return sum + (price * item.quantity);
  }, 0);

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        buyAgain,
        subtotal,
        totalItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
