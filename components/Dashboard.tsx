import React, { useMemo } from 'react';
import { Product, Sale } from '../types';
import { AlertTriangle, TrendingUp, DollarSign, Package, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  products: Product[];
  sales: Sale[];
  onRestock: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ products, sales, onRestock }) => {
  const stats = useMemo(() => {
    const today = new Date().toDateString();
    
    // Low stock
    const lowStockItems = products.filter(p => p.stock <= p.reorderPoint);
    
    // Today's Sales
    const todaysSales = sales.filter(s => new Date(s.timestamp).toDateString() === today);
    const totalRevenue = todaysSales.reduce((sum, s) => sum + s.total, 0);
    const totalTransactions = todaysSales.length;

    // Sales by category (All time)
    const salesByCategory = sales.flatMap(s => s.items).reduce((acc, item) => {
        // Find product to get category (since item only has name/id)
        const product = products.find(p => p.id === item.productId);
        const cat = product?.category || 'Unknown';
        acc[cat] = (acc[cat] || 0) + (item.price * item.quantity);
        return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(salesByCategory).map(([name, value]) => ({ name, value }));

    return {
      lowStockItems,
      totalRevenue,
      totalTransactions,
      chartData
    };
  }, [products, sales]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Revenue Card */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <DollarSign size={80} />
          </div>
          <div className="relative z-10">
            <h3 className="text-slate-500 text-sm font-medium mb-1">Today's Revenue</h3>
            <div className="text-3xl font-bold text-slate-900">
              ${stats.totalRevenue.toFixed(2)}
            </div>
            <div className="flex items-center mt-2 text-emerald-600 text-sm font-medium">
              <TrendingUp size={16} className="mr-1" />
              <span>{stats.totalTransactions} transactions</span>
            </div>
          </div>
        </div>

        {/* Low Stock Alert Card */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
            <AlertTriangle size={80} className="text-amber-500" />
          </div>
          <div className="relative z-10">
            <h3 className="text-slate-500 text-sm font-medium mb-1">Attention Needed</h3>
            <div className="text-3xl font-bold text-slate-900">
              {stats.lowStockItems.length} <span className="text-lg font-normal text-slate-400">items</span>
            </div>
             <div className="flex items-center mt-2 text-amber-600 text-sm font-medium">
              <span>Low stock alerts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-slate-800 font-semibold mb-6 flex items-center">
            <ArrowUpRight className="mr-2 text-indigo-500" size={20}/>
            Sales Performance by Category
        </h3>
        <div className="h-64 w-full">
            {stats.chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.chartData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `$${value}`} />
                    <Tooltip 
                        cursor={{fill: '#f1f5f9'}}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                        {stats.chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.name === 'Groceries' ? '#10b981' : '#f43f5e'} />
                        ))}
                    </Bar>
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                    No sales data yet
                </div>
            )}
        </div>
      </div>

      {/* Low Stock List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800 flex items-center">
            <Package className="mr-2 text-amber-500" size={20} />
            Restock Recommendations
          </h3>
          <button 
            onClick={onRestock}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Manage Inventory
          </button>
        </div>
        
        <div className="divide-y divide-slate-100">
          {stats.lowStockItems.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              All stock levels are healthy.
            </div>
          ) : (
            stats.lowStockItems.map(item => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <div className="font-medium text-slate-800">{item.name}</div>
                  <div className="text-xs text-slate-500 flex items-center mt-1">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${item.category === 'Groceries' ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                    {item.category}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-amber-600">{item.stock} left</div>
                  <div className="text-xs text-slate-400">Reorder at {item.reorderPoint}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
