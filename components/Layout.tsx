import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, ShoppingCart, Package } from 'lucide-react';

interface LayoutProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, onNavigate, children }) => {
  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-20 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent">
            BizMate
            </h1>
        </div>
        <div className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full border border-slate-200">
            {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-5xl mx-auto p-4 md:p-6">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-30 pb-safe">
        <div className="flex justify-around items-center max-w-md mx-auto h-16">
          <button
            onClick={() => onNavigate('DASHBOARD')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              currentView === 'DASHBOARD' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <LayoutDashboard size={20} strokeWidth={currentView === 'DASHBOARD' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Dashboard</span>
          </button>
          
          <button
            onClick={() => onNavigate('POS')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              currentView === 'POS' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <ShoppingCart size={20} strokeWidth={currentView === 'POS' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">POS</span>
          </button>
          
          <button
            onClick={() => onNavigate('INVENTORY')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              currentView === 'INVENTORY' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Package size={20} strokeWidth={currentView === 'INVENTORY' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Inventory</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
