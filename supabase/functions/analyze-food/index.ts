import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const jsonSchemaPrompt = `Você é um nutricionista. Identifique o alimento na imagem ou pelo nome fornecido e retorne SOMENTE JSON válido, sem markdown, com o formato:
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

async function callOpenAI(apiKey: string, imageDataUrl: string | null, foodName: string | null) {
  const content: any[] = [{ type: "text", text: foodName ? `Alimento: ${foodName}` : "Identifique este alimento." }];
  if (imageDataUrl) content.push({ type: "image_url", image_url: { url: imageDataUrl } });
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: jsonSchemaPrompt },
        { role: "user", content },
      ],
      max_tokens: 400,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "Falha OpenAI");
  return JSON.parse(data.choices[0].message.content);
}

async function callGemini(apiKey: string, imageDataUrl: string | null, foodName: string | null) {
  const parts: any[] = [{ text: `${jsonSchemaPrompt}\n\n${foodName ? "Alimento: " + foodName : "Identifique este alimento."}` }];
  if (imageDataUrl) {
    const [meta, b64] = imageDataUrl.split(",");
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

async function callGrok(apiKey: string, imageDataUrl: string | null, foodName: string | null) {
  const content: any[] = [{ type: "text", text: foodName ? `Alimento: ${foodName}` : "Identifique este alimento." }];
  if (imageDataUrl) content.push({ type: "image_url", image_url: { url: imageDataUrl } });
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: imageDataUrl ? "grok-2-vision-latest" : "grok-2-latest",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: jsonSchemaPrompt },
        { role: "user", content },
      ],
      max_tokens: 400,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "Falha Grok");
  return JSON.parse(data.choices[0].message.content);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader) return new Response(JSON.stringify({ error: "Não autenticado" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const userClient = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: authHeader } } });
    const { data: userData, error: userErr } = await userClient.auth.getUser(authHeader.replace("Bearer ", ""));
    if (userErr || !userData?.user) return new Response(JSON.stringify({ error: "Sessão inválida" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const body = await req.json().catch(() => ({}));
    const { image, food_name, test_provider, test_api_key } = body ?? {};

    let provider: string;
    let apiKey: string;

    if (test_provider && test_api_key) {
      // Test mode: only admin
      const admin = createClient(SUPABASE_URL, SERVICE_KEY);
      const { data: role } = await admin.from("user_roles").select("role").eq("user_id", userData.user.id).eq("role", "admin").maybeSingle();
      if (!role) return new Response(JSON.stringify({ error: "Acesso negado" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      provider = test_provider;
      apiKey = test_api_key;
    } else {
      const admin = createClient(SUPABASE_URL, SERVICE_KEY);
      const { data: cfg } = await admin.from("ai_config").select("provider, api_key, is_active").limit(1).maybeSingle();
      if (!cfg || !cfg.is_active || !cfg.api_key) {
        return new Response(JSON.stringify({ error: "IA não configurada. Peça ao admin para ativar." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      provider = cfg.provider;
      apiKey = cfg.api_key;
    }

    if (!image && !food_name) {
      return new Response(JSON.stringify({ error: "Envie uma imagem ou o nome do alimento" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    let result;
    if (provider === "openai") result = await callOpenAI(apiKey, image ?? null, food_name ?? null);
    else if (provider === "gemini") result = await callGemini(apiKey, image ?? null, food_name ?? null);
    else if (provider === "grok") result = await callGrok(apiKey, image ?? null, food_name ?? null);
    else throw new Error("Provedor desconhecido: " + provider);

    return new Response(JSON.stringify({ ok: true, result }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});