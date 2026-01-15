import React from 'react';
import { ProductResult } from '../types';

interface HistoryPanelProps {
  history: ProductResult[];
  onSelect: (result: ProductResult) => void;
  onClear: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, onClear }) => {
  if (history.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          最近生成
        </h2>
        <button 
          onClick={onClear}
          className="text-xs text-slate-400 hover:text-red-500 font-medium transition-colors"
        >
          清空
        </button>
      </div>

      <div className="space-y-3">
        {history.map((item) => (
          <div 
            key={item.id}
            onClick={() => onSelect(item)}
            className="group cursor-pointer p-3 rounded-lg border border-slate-100 hover:border-yellow-300 hover:bg-yellow-50 transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-500 uppercase">{item.brand}</span>
              <span className="text-[10px] text-slate-400">{new Date(item.timestamp).toLocaleDateString()}</span>
            </div>
            <p className="text-sm text-slate-700 line-clamp-2 group-hover:text-slate-900 group-hover:font-medium">
              {item.originalInput}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};