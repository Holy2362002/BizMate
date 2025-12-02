import React, { useState } from 'react';
import { Sale } from '../types';
import { History as HistoryIcon, Calendar, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';

interface HistoryProps {
  sales: Sale[];
}

export const History: React.FC<HistoryProps> = ({ sales }) => {
  // Sort sales by newest first
  const sortedSales = [...sales].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col animate-in fade-in duration-500">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-bold text-slate-800">Sales History</h2>
        <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-0.5 rounded-full border border-slate-200">
            {sales.length}
        </span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 overflow-hidden flex flex-col">
        {sortedSales.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
            <HistoryIcon size={48} className="opacity-20 mb-3" />
            <p>No sales records found.</p>
          </div>
        ) : (
          <div className="overflow-y-auto divide-y divide-slate-100 p-0">
            {sortedSales.map((sale) => (
              <HistoryItem key={sale.id} sale={sale} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const HistoryItem: React.FC<{ sale: Sale }> = ({ sale }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const date = new Date(sale.timestamp);

  return (
    <div className="hover:bg-slate-50 transition-colors">
      <div 
        className="p-4 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${sale.type === 'Retail' ? 'bg-indigo-100 text-indigo-600' : 'bg-purple-100 text-purple-600'}`}>
                <ShoppingBag size={18} />
            </div>
            <div>
                <div className="font-semibold text-slate-800 text-sm">
                    {sale.type} Sale
                </div>
                <div className="flex items-center text-xs text-slate-400 gap-1 mt-0.5">
                    <Calendar size={12} />
                    {date.toLocaleDateString()} • {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
            </div>
        </div>

        <div className="flex items-center gap-4">
            <div className="text-right">
                <div className="font-bold text-slate-800">MMK {sale.total.toFixed(2)}</div>
                <div className="text-xs text-slate-500">{sale.items.length} items</div>
            </div>
            {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </div>
      </div>

      {isExpanded && (
        <div className="bg-slate-50 px-4 pb-4 pt-1 border-t border-slate-100">
            <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Items Purchased</div>
            <div className="space-y-2">
                {sale.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm bg-white p-2 rounded border border-slate-200">
                        <div>
                            <span className="font-medium text-slate-700">{item.name}</span>
                            <div className="text-xs text-slate-400">Qty: {item.quantity} × MMK {item.price.toFixed(2)}</div>
                        </div>
                        <div className="font-semibold text-slate-700">
                            MMK {(item.price * item.quantity).toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};