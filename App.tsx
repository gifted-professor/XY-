import React, { useState, useEffect } from 'react';
import { InputSection } from './components/InputSection';
import { ResultCard } from './components/ResultCard';
import { HistoryPanel } from './components/HistoryPanel';
import { generateCopy } from './services/geminiService';
import { ProductResult } from './types';

const STORAGE_KEY = 'xianyu_copywriter_history';

function App() {
  const [history, setHistory] = useState<ProductResult[]>([]);
  const [currentResults, setCurrentResults] = useState<ProductResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Save history on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const handleGenerate = async (texts: string[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await generateCopy(texts);
      setCurrentResults(results);
      // Add to history (prevent duplicates by simple logic or just prepend)
      setHistory(prev => [...results, ...prev].slice(0, 50)); // Keep last 50
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteResult = (id: string) => {
    setCurrentResults(prev => prev.filter(item => item.id !== id));
  };
  
  const handleClearHistory = () => {
    if (confirm("确定要清空所有历史记录吗？")) {
      setHistory([]);
    }
  };

  // When clicking a history item, make it the "current" view so user can copy it again
  const handleSelectHistory = (item: ProductResult) => {
    // If already in current results, scroll to it?
    // For simplicity, we just add it to the top of the current results view if not there
    if (!currentResults.find(r => r.id === item.id)) {
        setCurrentResults(prev => [item, ...prev]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header / Nav */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#ffda00] rounded-lg flex items-center justify-center text-slate-900 font-bold text-lg">
              闲
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              闲鱼文案生成器
            </h1>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            v1.0 • Gemini 3 Flash
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input and Results */}
          <div className="lg:col-span-8 space-y-8">
            <InputSection onGenerate={handleGenerate} isLoading={isLoading} />

            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {currentResults.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-800">生成结果</h2>
                  <button 
                    onClick={() => setCurrentResults([])}
                    className="text-sm text-slate-500 hover:text-slate-800"
                  >
                    清空当前
                  </button>
                </div>
                <div className="grid gap-6">
                  {currentResults.map(result => (
                    <ResultCard 
                      key={result.id} 
                      result={result} 
                      onDelete={handleDeleteResult}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {!isLoading && currentResults.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                    <p>暂无结果，请在上方输入商品信息开始生成。</p>
                </div>
            )}
          </div>

          {/* Right Column: History */}
          <div className="lg:col-span-4 hidden lg:block">
            <HistoryPanel 
              history={history} 
              onSelect={handleSelectHistory} 
              onClear={handleClearHistory}
            />
          </div>
          
          {/* Mobile History (Bottom of page if needed, but for now hidden on small screens is fine or can be added) */}
          <div className="lg:hidden block">
             <HistoryPanel 
              history={history} 
              onSelect={handleSelectHistory} 
              onClear={handleClearHistory}
            />
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;