import React, { useState } from 'react';
import { Product, Category } from '../types';
import { Edit2, Trash2, Plus, X, Search } from 'lucide-react';

interface InventoryProps {
  products: Product[];
  onSave: (product: Product) => void;
  onDelete: (id: string) => void;
}

const EmptyProduct: Product = {
  id: '',
  name: '',
  category: 'Groceries',
  retailPrice: 0,
  wholesalePrice: 0,
  stock: 0,
  reorderPoint: 0,
  updatedAt: ''
};

export const Inventory: React.FC<InventoryProps> = ({ products, onSave, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product>(EmptyProduct);
  const [search, setSearch] = useState('');

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct({ ...EmptyProduct, id: crypto.randomUUID(), updatedAt: new Date().toISOString() });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...editingProduct, updatedAt: new Date().toISOString() });
    setIsModalOpen(false);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Inventory</h2>
        <button
          onClick={handleAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Search inventory..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
        </div>

        {/* List Header */}
        <div className="grid grid-cols-12 gap-2 bg-slate-50 p-3 text-xs font-semibold text-slate-500 border-b border-slate-100">
          <div className="col-span-4 pl-2">Product</div>
          <div className="col-span-2 text-right">Stock</div>
          <div className="col-span-2 text-right">Retail</div>
          <div className="col-span-2 text-right">Wholesale</div>
          <div className="col-span-2 text-center">Actions</div>
        </div>

        {/* List Body */}
        <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
          {filteredProducts.map(product => (
            <div key={product.id} className="grid grid-cols-12 gap-2 p-3 items-center hover:bg-slate-50 transition-colors group">
              <div className="col-span-4 pl-2">
                <div className="font-medium text-slate-800 text-sm truncate">{product.name}</div>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${product.category === 'Groceries' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                    <span className="text-[10px] text-slate-400">{product.category}</span>
                </div>
              </div>
              <div className="col-span-2 text-right">
                <span className={`text-sm font-medium ${product.stock <= product.reorderPoint ? 'text-amber-600' : 'text-slate-600'}`}>
                  {product.stock}
                </span>
              </div>
              <div className="col-span-2 text-right text-sm text-slate-600">${product.retailPrice}</div>
              <div className="col-span-2 text-right text-sm text-slate-600">${product.wholesalePrice}</div>
              <div className="col-span-2 flex justify-center gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => {
                    if(confirm('Are you sure you want to delete this product?')) {
                        onDelete(product.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-sm">No products found.</div>
          )}
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-800">
                {editingProduct.id === '' ? 'New Product' : 'Edit Product'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Product Name</label>
                <input
                  required
                  type="text"
                  value={editingProduct.name}
                  onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  placeholder="e.g. Aloe Vera Gel"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Category</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['Groceries', 'Beauty'] as Category[]).map(cat => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setEditingProduct({...editingProduct, category: cat})}
                      className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                        editingProduct.category === cat 
                          ? 'bg-slate-800 text-white border-slate-800' 
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Retail Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                    <input
                        required
                        type="number"
                        min="0"
                        step="0.01"
                        value={editingProduct.retailPrice || ''}
                        onChange={e => setEditingProduct({...editingProduct, retailPrice: parseFloat(e.target.value)})}
                        className="w-full pl-6 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Wholesale Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                    <input
                        required
                        type="number"
                        min="0"
                        step="0.01"
                        value={editingProduct.wholesalePrice || ''}
                        onChange={e => setEditingProduct({...editingProduct, wholesalePrice: parseFloat(e.target.value)})}
                        className="w-full pl-6 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Current Stock</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={editingProduct.stock || ''}
                    onChange={e => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Reorder Point</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={editingProduct.reorderPoint || ''}
                    onChange={e => setEditingProduct({...editingProduct, reorderPoint: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all mt-4"
              >
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
