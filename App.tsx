import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { POS } from './components/POS';
import { Inventory } from './components/Inventory';
import { ViewState, Product, Sale } from './types';
import { storageService } from './services/storageService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  // Load initial data
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setProducts(storageService.getProducts());
    setSales(storageService.getSales());
  };

  const handleRecordSale = (sale: Sale) => {
    storageService.recordSale(sale);
    refreshData();
  };

  const handleSaveProduct = (product: Product) => {
    storageService.saveProduct(product);
    refreshData();
  };

  const handleDeleteProduct = (id: string) => {
    storageService.deleteProduct(id);
    refreshData();
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {currentView === 'DASHBOARD' && (
        <Dashboard 
            products={products} 
            sales={sales} 
            onRestock={() => setCurrentView('INVENTORY')} 
        />
      )}
      {currentView === 'POS' && (
        <POS 
            products={products} 
            onRecordSale={handleRecordSale} 
        />
      )}
      {currentView === 'INVENTORY' && (
        <Inventory 
            products={products} 
            onSave={handleSaveProduct} 
            onDelete={handleDeleteProduct} 
        />
      )}
    </Layout>
  );
};

export default App;
