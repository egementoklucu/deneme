
import { GoogleGenAI, Type } from "@google/genai";
import { SimulationResult } from "../types";

const MATCH_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    homeTeam: { type: Type.STRING },
    awayTeam: { type: Type.STRING },
    matchDate: { type: Type.STRING },
    homeScore: { type: Type.INTEGER },
    awayScore: { type: Type.INTEGER },
    summary: { type: Type.STRING, description: "Maçın genel özeti (Türkçe)" },
    stoppageTime1: { type: Type.INTEGER },
    stoppageTime2: { type: Type.INTEGER },
    homeLineup: {
      type: Type.OBJECT,
      properties: {
        formation: { type: Type.STRING },
        startingXI: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              position: { type: Type.STRING },
              rating: { type: Type.NUMBER },
              statusNotes: { type: Type.STRING, description: "Oyuncunun güncel durumu, sakatlık veya moral notu (Türkçe)" }
            },
            required: ["name", "position", "rating"]
          }
        }
      },
      required: ["formation", "startingXI"]
    },
    awayLineup: {
      type: Type.OBJECT,
      properties: {
        formation: { type: Type.STRING },
        startingXI: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              position: { type: Type.STRING },
              rating: { type: Type.NUMBER },
              statusNotes: { type: Type.STRING, description: "Oyuncunun güncel durumu, sakatlık veya moral notu (Türkçe)" }
            },
            required: ["name", "position", "rating"]
          }
        }
      },
      required: ["formation", "startingXI"]
    },
    timeline: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          minute: { type: Type.INTEGER },
          extraMinute: { type: Type.INTEGER },
          type: { type: Type.STRING },
          team: { type: Type.STRING },
          player: { type: Type.STRING },
          description: { type: Type.STRING, description: "Olayın Türkçe detaylı anlatımı" }
        },
        required: ["minute", "type", "team", "description"]
      }
    },
    stats: {
      type: Type.OBJECT,
      properties: {
        possession: { type: Type.ARRAY, items: { type: Type.NUMBER } },
        shots: { type: Type.ARRAY, items: { type: Type.NUMBER } },
        shotsOnTarget: { type: Type.ARRAY, items: { type: Type.NUMBER } },
        corners: { type: Type.ARRAY, items: { type: Type.NUMBER } },
        fouls: { type: Type.ARRAY, items: { type: Type.NUMBER } }
      },
      required: ["possession", "shots", "shotsOnTarget", "corners", "fouls"]
    }
  },
  required: [
    "homeTeam", "awayTeam", "homeScore", "awayScore", "summary", 
    "homeLineup", "awayLineup", "timeline", "stats"
  ]
};

export const simulateMatch = async (home: string, away: string, date: string): Promise<SimulationResult> => {
  const startTime = performance.now();
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Sen uzman bir futbol veri analisti ve simülasyon mühendisisin.
    Görev: ${home} ve ${away} arasındaki maçı ${date} tarihi itibariyle GÜNCEL VERİLERLE simüle et.
    
    KRİTİK TALİMATLAR:
    1. GERÇEK ZAMANLI ARAMA: Google Search kullanarak HER İKİ TAKIMIN EN GÜNCEL (Bugünün tarihi: ${new Date().toLocaleDateString()}) kadrolarını, sakatlarını, cezalılarını ve kiralık gönderilen oyuncularını bul. (Örn: Bir oyuncu başka takıma transfer olduysa veya kiralıksa kesinlikle kadroda yer almamalı).
    2. HABER ANALİZİ: Oyuncuların moral durumlarını, sosyal medya paylaşımlarını, disiplin sorunlarını ve maç önü açıklamalarını tara.
    3. TÜRKÇE ANLATIM: Tüm çıktı (summary, description, statusNotes) tamamen AKICI VE DOĞAL BİR TÜRKÇE ile yazılmalıdır. Futbol terminolojisine (ofsayt, VAR incelemesi, köşe vuruşu vb.) hakim bir dil kullan.
    4. SİMÜLASYON DETAYI: Dakika dakika önemli anları (direkten dönen toplar, tartışmalar, VAR kararları) simüle et. Stoppage time'ı gerçekçi hesapla.
    
    Çıktıyı kesinlikle belirtilen JSON formatında ver.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: MATCH_SCHEMA as any,
    },
  });

  const endTime = performance.now();
  const rawData = JSON.parse(response.text || "{}");
  
  return {
    ...rawData,
    simulationProcessTimeMs: Math.round(endTime - startTime),
  };
};
