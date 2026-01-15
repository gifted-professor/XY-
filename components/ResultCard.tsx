import React, { useState } from 'react';
import { ProductResult, PlanType } from '../types';

interface ResultCardProps {
  result: ProductResult;
  onDelete: (id: string) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, onDelete }) => {
  const [activePlan, setActivePlan] = useState<PlanType>(PlanType.A);
  const [copied, setCopied] = useState(false);

  // Construct the final copy based on the fixed structure
  const constructCopy = (plan: PlanType): string => {
    const planData = plan === PlanType.A ? result.planA : result.planB;
    const { inventoryStatus, sellingPoint, promotion } = planData;
    
    // Logic to prioritize Article Number in the first 20 characters
    let titleText = result.originalInput;
    let articleNumDisplay = "";

    if (result.articleNumber && result.articleNumber.trim() !== "") {
      const artNum = result.articleNumber.trim();
      
      // Try to remove it from the original text to avoid duplication
      // Escape regex special characters just in case
      const escapedArtNum = artNum.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedArtNum, 'gi');
      
      // Remove article number and clean up extra spaces
      titleText = titleText.replace(regex, '').replace(/\s+/g, ' ').trim();
      articleNumDisplay = artNum;
    }

    // Construct Title: 【Label】 ArticleNumber RemainderText S~XXL
    // We add spaces between parts for readability, remove extra spaces, and trim.
    // Example: 【冬日新款】 HQ4183 耐克羽绒服黑色 S~XXL
    const title = `${result.label} ${articleNumDisplay} ${titleText} S~XXL`
      .replace(/\s+/g, ' ') 
      .trim();

    const line1 = inventoryStatus;
    const line2 = "全新带吊牌，签收7日内支持退换";
    const line3 = `能拍就是有货，${sellingPoint}`;
    const line4 = `${promotion}，看中直接冲，手慢真没！`;

    return `${title}\n${line1}\n${line2}\n${line3}\n${line4}`;
  };

  const currentCopy = constructCopy(activePlan);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
        <div>
          <span className="inline-block px-2 py-1 mb-2 text-xs font-semibold tracking-wide text-slate-800 bg-[#ffda00]/30 rounded-md uppercase">
            {result.brand}
          </span>
          <h3 className="text-slate-800 font-medium line-clamp-1" title={result.originalInput}>
            {result.originalInput}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {new Date(result.timestamp).toLocaleTimeString()}
          </p>
        </div>
        <button 
          onClick={() => onDelete(result.id)}
          className="text-slate-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
          title="删除"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100">
        <button
          onClick={() => setActivePlan(PlanType.A)}
          className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
            activePlan === PlanType.A
              ? 'border-[#ffda00] text-slate-900 bg-[#ffda00]/10'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          方案 A：品质新款
        </button>
        <button
          onClick={() => setActivePlan(PlanType.B)}
          className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
            activePlan === PlanType.B
              ? 'border-emerald-500 text-emerald-600 bg-emerald-50/10'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          方案 B：捡漏断码
        </button>
      </div>

      {/* Content Area */}
      <div className="p-6 relative group">
        <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
          {currentCopy}
        </pre>

        {/* Copy Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleCopy}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${copied 
                ? 'bg-green-100 text-green-700' 
                : 'bg-[#ffda00] text-slate-900 hover:bg-[#f0cd00] hover:shadow-lg hover:shadow-yellow-500/20 active:scale-95'
              }
            `}
          >
            {copied ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                已复制！
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
                复制文案
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};