import React, { useState, useMemo } from 'react';
import { Product, CartItem, Sale } from '../types';
import { Search, Plus, Minus, Trash2, ShoppingBag, CreditCard } from 'lucide-react';

interface POSProps {
  products: Product[];
  onRecordSale: (sale: Sale) => void;
}

export const POS: React.FC<POSProps> = ({ products, onRecordSale }) => {
  const [mode, setMode] = useState<'Retail' | 'Wholesale'>('Retail');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Groceries' | 'Beauty'>('All');

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  const addToCart = (product: Product) => {
    if (product.stock === 0) return;

    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        // Check stock limit
        if (existing.quantity >= product.stock) return prev;
        
        return prev.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        quantity: 1,
        price: mode === 'Retail' ? product.retailPrice : product.wholesalePrice
      }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.productId !== productId) return item;
        
        const product = products.find(p => p.id === productId);
        if (!product) return item;

        const newQuantity = item.quantity + delta;
        if (newQuantity <= 0) return item; // Don't remove, just stop at 1
        if (newQuantity > product.stock) return item; // Don't exceed stock
        
        return { ...item, quantity: newQuantity };
      });
    });
  };

  // Recalculate prices if mode changes
  React.useEffect(() => {
    setCart(prev => prev.map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return item;
      return {
        ...item,
        price: mode === 'Retail' ? product.retailPrice : product.wholesalePrice
      };
    }));
  }, [mode, products]);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    const sale: Sale = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      type: mode,
      items: [...cart],
      total
    };

    onRecordSale(sale);
    setCart([]);
    alert('Sale recorded successfully!');
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-6">
      {/* Product Catalog */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Controls */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-4 space-y-4">
          <div className="flex justify-between items-center bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setMode('Retail')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'Retail' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              Retail
            </button>
            <button
              onClick={() => setMode('Wholesale')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'Wholesale' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              Wholesale
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
             {['All', 'Groceries', 'Beauty'].map(cat => (
                 <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat as any)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border ${
                        selectedCategory === cat 
                        ? 'bg-slate-800 text-white border-slate-800' 
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                 >
                    {cat}
                 </button>
             ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
                className={`p-3 rounded-xl border text-left transition-all ${
                    product.stock === 0 
                    ? 'bg-slate-50 border-slate-100 opacity-60' 
                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md active:scale-95'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                    <span className={`w-2 h-2 rounded-full ${product.category === 'Groceries' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${product.stock <= product.reorderPoint ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                        {product.stock} left
                    </span>
                </div>
                <h3 className="font-medium text-slate-800 text-sm line-clamp-2 min-h-[40px] mb-2">{product.name}</h3>
                <div className="text-indigo-600 font-bold">
                  MMK {(mode === 'Retail' ? product.retailPrice : product.wholesalePrice).toLocaleString()}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-full lg:w-96 bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col h-[400px] lg:h-auto">
        <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-2xl flex justify-between items-center">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <ShoppingBag size={20} />
            Current Sale
          </h2>
          <span className="text-xs font-mono bg-white px-2 py-1 rounded border border-slate-200 text-slate-500">
            {mode.toUpperCase()}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
              <ShoppingBag size={48} className="opacity-20" />
              <p className="text-sm">Cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.productId} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-900 line-clamp-1">{item.name}</div>
                  <div className="text-xs text-slate-500">MMK {item.price.toLocaleString()} / unit</div>
                </div>
                
                <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                  <button 
                    onClick={() => updateQuantity(item.productId, -1)}
                    className="p-1 hover:bg-white rounded-md transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.productId, 1)}
                    className="p-1 hover:bg-white rounded-md transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                
                <button 
                    onClick={() => removeFromCart(item.productId)}
                    className="text-slate-400 hover:text-rose-500"
                >
                    <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
          <div className="flex justify-between items-end mb-4">
            <span className="text-slate-500 text-sm">Total Amount</span>
            <span className="text-2xl font-bold text-slate-900">MMK {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <CreditCard size={20} />
            Complete Sale
          </button>
        </div>
      </div>
    </div>
  );
};