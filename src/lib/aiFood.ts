import { supabase } from "@/integrations/supabase/client";

export type FoodResult = {
  nome: string;
  porcao: string;
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
  fibras: number;
  confianca?: number;
  erro?: string;
};

const prompt = `Você é um nutricionista. Identifique o alimento na imagem ou pelo nome fornecido e retorne SOMENTE JSON válido (sem markdown), com:
{
  "nome": "nome em português",
  "porcao": "descrição da porção (ex: 1 unidade 100g)",
  "calorias": número (kcal),
  "proteinas": número (g),
  "carboidratos": número (g),
  "gorduras": número (g),
  "fibras": número (g),
  "confianca": número de 0 a 100
}
Se não identificar, retorne {"erro":"não identificado"}.`;

async function callOpenAI(apiKey: string, image: string | null, foodName: string | null): Promise<FoodResult> {
  const content: any[] = [{ type: "text", text: foodName ? `Alimento: ${foodName}` : "Identifique este alimento." }];
  if (image) content.push({ type: "image_url", image_url: { url: image } });
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [{ role: "system", content: prompt }, { role: "user", content }],
      max_tokens: 400,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "Falha OpenAI");
  return JSON.parse(data.choices[0].message.content);
}

async function callGemini(apiKey: string, image: string | null, foodName: string | null): Promise<FoodResult> {
  const parts: any[] = [{ text: `${prompt}\n\n${foodName ? "Alimento: " + foodName : "Identifique este alimento."}` }];
  if (image) {
    const [meta, b64] = image.split(",");
    const mime = meta.match(/data:(.*?);base64/)?.[1] ?? "image/jpeg";
    parts.push({ inline_data: { mime_type: mime, data: b64 } });
  }
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
      }),
    },
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "Falha Gemini");
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
  return JSON.parse(text);
}

async function callGrok(apiKey: string, image: string | null, foodName: string | null): Promise<FoodResult> {
  const content: any[] = [{ type: "text", text: foodName ? `Alimento: ${foodName}` : "Identifique este alimento." }];
  if (image) content.push({ type: "image_url", image_url: { url: image } });
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: image ? "grok-2-vision-latest" : "grok-2-latest",
      response_format: { type: "json_object" },
      messages: [{ role: "system", content: prompt }, { role: "user", content }],
      max_tokens: 400,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "Falha Grok");
  return JSON.parse(data.choices[0].message.content);
}

export async function analyzeFoodDirect(opts: {
  image?: string | null;
  foodName?: string | null;
  overrideProvider?: string;
  overrideKey?: string;
}): Promise<FoodResult> {
  let provider = opts.overrideProvider;
  let apiKey = opts.overrideKey;

  if (!provider || !apiKey) {
    const { data, error } = await supabase.from("ai_config" as any).select("provider, api_key, is_active").limit(1).maybeSingle();
    if (error) throw new Error("Sem permissão para ler configuração da IA");
    if (!data || !(data as any).is_active || !(data as any).api_key) {
      throw new Error("IA não configurada. Peça ao admin para ativar.");
    }
    provider = (data as any).provider;
    apiKey = (data as any).api_key;
  }

  const img = opts.image ?? null;
  const name = opts.foodName ?? null;
  if (!img && !name) throw new Error("Envie imagem ou nome do alimento");

  if (provider === "openai") return callOpenAI(apiKey!, img, name);
  if (provider === "gemini") return callGemini(apiKey!, img, name);
  if (provider === "grok") return callGrok(apiKey!, img, name);
  throw new Error("Provedor desconhecido: " + provider);
}