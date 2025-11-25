import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-2.5-flash';

export const generatePMAdvice = async (
  prompt: string, 
  context: string = "general"
): Promise<string> => {
  if (!apiKey) {
    return "缺少 API 密钥。请检查您的配置。";
  }

  let systemInstruction = "你是一位资深产品经理导师。你的目标是教授初级产品经理最佳实践。请务必使用中文（简体）回答。";
  
  if (context === "requirements") {
    systemInstruction += " 专注于编写清晰的用户故事（User Stories）、验收标准（Acceptance Criteria）和产品需求文档（PRD）结构。结构要清晰、准确。";
  } else if (context === "data") {
    systemInstruction += " 专注于指标（DAU, MAU, 留存率, LTV）、A/B 测试方法论和数据驱动的决策。";
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    
    return response.text || "暂时无法生成回复。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "联系 AI 导师时发生错误，请重试。";
  }
};

export const chatWithMentor = async (
    history: {role: string, parts: {text: string}[]}[], 
    message: string,
    customInstruction?: string
) => {
    if (!apiKey) return "缺少 API 密钥";

    const defaultInstruction = "你是一位友善且鼓舞人心的产品管理教练。你帮助用户规划职业生涯，解决具体的产品问题，并理解复杂的概念，如敏捷（Agile）、Scrum、PM 用的 SQL 和设计思维。请全程使用中文（简体）进行对话。";

    try {
        const chat = ai.chats.create({
            model: MODEL_NAME,
            history: history,
            config: {
                systemInstruction: customInstruction || defaultInstruction,
            }
        });

        const response = await chat.sendMessage({ message });
        return response.text || "";
    } catch (error) {
        console.error("Chat Error:", error);
        return "抱歉，我现在连接有点问题。";
    }
}