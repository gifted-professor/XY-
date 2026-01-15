/*
 * @Author: gifted-professor 1044396185@qq.com
 * @Date: 2026-01-15 17:47:07
 * @LastEditors: gifted-professor 1044396185@qq.com
 * @LastEditTime: 2026-01-15 17:47:33
 * @FilePath: /闲鱼文案生成器/services/geminiService.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ProductResult } from "../types";

export const generateCopy = async (inputTexts: string[]): Promise<ProductResult[]> => {
  if (inputTexts.length === 0) return [];

  // Filter out empty lines
  const validInputs = inputTexts.filter(t => t.trim().length > 0);
  if (validInputs.length === 0) return [];

  try {
    const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputTexts: validInputs }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `请求失败: ${response.status}`);
    }

    const parsed = await response.json();
    
    // Map back to our application type, adding IDs and original text
    const results: ProductResult[] = parsed.items.map((item: any, index: number) => ({
      id: crypto.randomUUID(),
      originalInput: validInputs[index] || "未知商品",
      timestamp: Date.now(),
      brand: item.brand,
      category: item.category,
      articleNumber: item.articleNumber,
      label: item.label,
      planA: item.planA,
      planB: item.planB
    }));

    return results;

  } catch (error) {
    console.error("Generate API Error:", error);
    throw new Error(error instanceof Error ? error.message : "生成失败，请检查网络。");
  }
};
