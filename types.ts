export type Category = 'Groceries' | 'Beauty';

export interface Product {
  id: string;
  name: string;
  category: Category;
  retailPrice: number;
  wholesalePrice: number;
  stock: number;
  reorderPoint: number;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Sale {
  id: string;
  timestamp: string;
  type: 'Retail' | 'Wholesale';
  items: CartItem[];
  total: number;
}

export type ViewState = 'DASHBOARD' | 'POS' | 'INVENTORY';
