import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ProductResult } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
你是闲鱼奥莱文案专家，专注于运动品牌（耐克、阿迪达斯、始祖鸟等）的商品。
你的任务是分析商品描述，并为两种不同的销售策略生成结构化的营销组件。

**策略 A（品质/新款）：** 侧重“现货”、“新款”、“高品质”、“版型好”。语气：积极、热情。
**策略 B（捡漏/断码）：** 侧重“断码”、“清仓”、“手慢无”、“超值”。语气：紧迫、捡漏。

**提取规则：**
1. 提取品牌（Brand），如：耐克、三叶草。
2. 提取品类（Category），如：短袖、羽绒服。
3. 提取货号（Article Number），如：HQ4183。如果未找到，留空。
4. 创建标签（Label）：根据风格/季节生成2-4字标签，必须包含方括号，如：【复古足球】、【冬日新款】。

**组件生成规则：**
对于每种策略（A 和 B），生成三个特定短语（必须使用中文）：
1. inventoryStatus (库存状态)：正文第一行。（例如 A：“现货秒发，短款版型显高利落”，B：“部分断码，手慢无，库存有限”）
2. sellingPoint (卖点)：放在“能拍就是有货，”之后。（例如 A：“丝绒材质质感拉满”，B：“不喜欢直接退”）
3. promotion (促单话术)：放在“，看中直接冲...”之前。（例如 A：“秋冬保暖必备”，B：“性价比天花板”）

**重要：**
- **所有生成内容必须是简体中文**。
- 不要输出完整的文章或固定句式（如“能拍就是有货”），只输出请求的组件。
- 如果提供了多个商品，请处理所有商品。
`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          brand: { type: Type.STRING, description: "品牌名称，如 '耐克', '阿迪达斯'" },
          category: { type: Type.STRING, description: "商品品类" },
          articleNumber: { type: Type.STRING, description: "货号" },
          label: { type: Type.STRING, description: "带方括号的2-4字标签" },
          planA: {
            type: Type.OBJECT,
            properties: {
              inventoryStatus: { type: Type.STRING },
              sellingPoint: { type: Type.STRING },
              promotion: { type: Type.STRING },
            },
            required: ["inventoryStatus", "sellingPoint", "promotion"]
          },
          planB: {
            type: Type.OBJECT,
            properties: {
              inventoryStatus: { type: Type.STRING },
              sellingPoint: { type: Type.STRING },
              promotion: { type: Type.STRING },
            },
            required: ["inventoryStatus", "sellingPoint", "promotion"]
          }
        },
        required: ["brand", "category", "articleNumber", "label", "planA", "planB"]
      }
    }
  },
  required: ["items"]
};

export const generateCopy = async (inputTexts: string[]): Promise<ProductResult[]> => {
  if (inputTexts.length === 0) return [];

  // Filter out empty lines
  const validInputs = inputTexts.filter(t => t.trim().length > 0);
  if (validInputs.length === 0) return [];

  try {
    const prompt = `请处理以下商品列表：\n${validInputs.map((text, idx) => `${idx + 1}. ${text}`).join('\n')}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    const jsonText = response.text || "{}";
    const parsed = JSON.parse(jsonText);
    
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
    console.error("Gemini API Error:", error);
    throw new Error("生成失败，请检查网络或 API Key。");
  }
};