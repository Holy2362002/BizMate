import { Product, Sale } from '../types';

// Keys for local storage
const PRODUCTS_KEY = 'bizmate_products';
const SALES_KEY = 'bizmate_sales';

// Seed data to make the app look good initially
const SEED_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Organic Almond Milk',
    category: 'Groceries',
    retailPrice: 5.50,
    wholesalePrice: 3.80,
    stock: 45,
    reorderPoint: 20,
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Sourdough Bread',
    category: 'Groceries',
    retailPrice: 6.00,
    wholesalePrice: 4.00,
    stock: 12,
    reorderPoint: 15, // Low stock example
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Retinol Face Serum',
    category: 'Beauty',
    retailPrice: 24.99,
    wholesalePrice: 15.00,
    stock: 8,
    reorderPoint: 10, // Low stock example
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Moisturizing Cream',
    category: 'Beauty',
    retailPrice: 18.50,
    wholesalePrice: 11.25,
    stock: 50,
    reorderPoint: 10,
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Jasmine Rice (5kg)',
    category: 'Groceries',
    retailPrice: 12.00,
    wholesalePrice: 9.50,
    stock: 100,
    reorderPoint: 20,
    updatedAt: new Date().toISOString()
  }
];

export const storageService = {
  getProducts: (): Product[] => {
    const stored = localStorage.getItem(PRODUCTS_KEY);
    if (!stored) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(SEED_PRODUCTS));
      return SEED_PRODUCTS;
    }
    return JSON.parse(stored);
  },

  saveProduct: (product: Product): void => {
    const products = storageService.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.push(product);
    }
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },

  deleteProduct: (id: string): void => {
    const products = storageService.getProducts().filter(p => p.id !== id);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },

  updateStock: (items: { productId: string; quantity: number }[]): void => {
    const products = storageService.getProducts();
    items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
      }
    });
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },

  getSales: (): Sale[] => {
    const stored = localStorage.getItem(SALES_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  recordSale: (sale: Sale): void => {
    const sales = storageService.getSales();
    sales.push(sale);
    localStorage.setItem(SALES_KEY, JSON.stringify(sales));
    
    // Also update stock
    storageService.updateStock(sale.items);
  }
};
