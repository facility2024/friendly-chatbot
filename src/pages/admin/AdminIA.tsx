import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, Sparkles, CheckCircle2, XCircle, Eye, EyeOff, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Provider = "openai" | "gemini" | "grok";

const providers: { id: Provider; name: string; hint: string; docs: string; color: string }[] = [
  { id: "openai", name: "OpenAI (GPT-4o)", hint: "Precisão máxima na leitura visual", docs: "platform.openai.com/api-keys", color: "from-emerald-500 to-teal-600" },
  { id: "gemini", name: "Google Gemini", hint: "Rápido e econômico", docs: "aistudio.google.com/apikey", color: "from-blue-500 to-indigo-600" },
  { id: "grok", name: "Grok (xAI)", hint: "IA da xAI, ótima em imagens", docs: "console.x.ai", color: "from-slate-700 to-slate-900" },
];

const AdminIA = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [provider, setProvider] = useState<Provider>("openai");
  const [apiKey, setApiKey] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [hasSavedKey, setHasSavedKey] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("ai_config" as any).select("*").limit(1).maybeSingle();
      if (!error && data) {
        setProvider(((data as any).provider ?? "openai") as Provider);
        setIsActive(!!(data as any).is_active);
        setHasSavedKey(!!((data as any).api_key));
      }
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const { data: existing } = await supabase.from("ai_config" as any).select("id").limit(1).maybeSingle();
      const payload: any = { provider, is_active: isActive, updated_at: new Date().toISOString() };
      if (apiKey.trim()) payload.api_key = apiKey.trim();

      if (existing) {
        const { error } = await supabase.from("ai_config" as any).update(payload).eq("id", (existing as any).id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("ai_config" as any).insert({ ...payload, api_key: apiKey.trim() });
        if (error) throw error;
      }
      toast({ title: "Configuração salva", description: isActive ? "IA ativada com sucesso" : "IA salva (desativada)" });
      setApiKey("");
      setHasSavedKey(true);
    } catch (e) {
      toast({ title: "Erro ao salvar", description: (e as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const test = async () => {
    if (!apiKey.trim() && !hasSavedKey) {
      toast({ title: "Cole a chave primeiro", variant: "destructive" });
      return;
    }
    setTesting(true);
    try {
      const body: any = { food_name: "banana" };
      if (apiKey.trim()) {
        body.test_provider = provider;
        body.test_api_key = apiKey.trim();
      }
      const { data, error } = await supabase.functions.invoke("analyze-food", { body });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      const r = (data as any)?.result;
      toast({
        title: "Teste OK ✓",
        description: `Identificou: ${r?.nome ?? "?"} — ${r?.calorias ?? "?"} kcal`,
      });
    } catch (e) {
      toast({ title: "Falha no teste", description: (e as Error).message, variant: "destructive" });
    } finally {
      setTesting(false);
    }
  };

  if (loading)
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  const current = providers.find((p) => p.id === provider)!;

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 border">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-primary/10 p-3">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">Inteligência Artificial</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Ative a leitura precisa de alimentos por foto. Escolha o provedor, cole a chave e ligue.
            </p>
          </div>
          <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
            isActive && hasSavedKey ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
          }`}>
            {isActive && hasSavedKey ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
            {isActive && hasSavedKey ? "Ativa" : "Inativa"}
          </div>
        </div>
      </div>

      {/* Provider picker */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Escolha o provedor</Label>
        <div className="grid gap-3 sm:grid-cols-3">
          {providers.map((p) => (
            <button
              key={p.id}
              onClick={() => setProvider(p.id)}
              className={`text-left rounded-xl border-2 p-4 transition-all ${
                provider === p.id
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <div className={`mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${p.color}`}>
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <p className="font-semibold text-sm text-foreground">{p.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{p.hint}</p>
            </button>
          ))}
        </div>
      </div>

      {/* API key */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <div>
            <Label htmlFor="api-key" className="text-base font-semibold">
              Chave da API — {current.name}
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              Obtenha em: <span className="font-mono">{current.docs}</span>
            </p>
          </div>

          <div className="relative">
            <Input
              id="api-key"
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={hasSavedKey ? "•••••••••••• (chave salva — cole aqui para trocar)" : "Cole sua chave aqui"}
              className="h-12 pr-12 font-mono text-sm"
            />
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label className="text-sm font-medium">Ativar IA no app</Label>
              <p className="text-xs text-muted-foreground">
                Liberado para todos os usuários na tela de câmera.
              </p>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>

          <div className="flex gap-3">
            <Button onClick={save} disabled={saving} className="flex-1 h-12" size="lg">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Salvar
            </Button>
            <Button onClick={test} disabled={testing} variant="outline" className="flex-1 h-12" size="lg">
              {testing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
              Testar
            </Button>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center">
        🔒 A chave é armazenada de forma segura no banco e usada apenas pelo servidor.
      </p>
    </div>
  );
};

export default AdminIA;