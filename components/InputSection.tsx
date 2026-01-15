import React, { useState } from 'react';

interface InputSectionProps {
  onGenerate: (text: string[]) => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onGenerate, isLoading }) => {
  const [inputText, setInputText] = useState('');

  const handleGenerate = () => {
    if (!inputText.trim()) return;
    const lines = inputText.split('\n').filter(line => line.trim() !== '');
    onGenerate(lines);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        商品输入
      </h2>
      <p className="text-sm text-slate-500 mb-3">
        每行输入一个商品描述。例如：“三叶草复古翻领运动短袖 (HQ4183)”
      </p>
      <textarea
        className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none resize-none text-slate-700 placeholder-slate-400 font-mono text-sm transition-all"
        placeholder={`耐克黑色连帽保暖羽绒服 (FB8178-010)\n三叶草女子皮衣阔腿裤套装 (JX9225)`}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        disabled={isLoading}
      />
      
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleGenerate}
          disabled={isLoading || !inputText.trim()}
          className={`
            px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-yellow-500/20 transition-all flex items-center gap-2
            ${isLoading || !inputText.trim() 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
              : 'bg-[#ffda00] text-slate-900 hover:bg-[#f0cd00] hover:-translate-y-0.5 active:translate-y-0'
            }
          `}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              生成中...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              生成文案
            </>
          )}
        </button>
      </div>
    </div>
  );
};