import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Droplets, Plus, Minus, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const MetaAgua = () => {
  const navigate = useNavigate();
  const [copos, setCopos] = useState(0);
  const [peso, setPeso] = useState<number | null>(null);
  const [pesoInput, setPesoInput] = useState("");
  const [alertaAtivo, setAlertaAtivo] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const metaMl = peso ? Math.round(peso * 35) : 2000;
  const meta = Math.round(metaMl / 250);
  const progresso = Math.min((copos / meta) * 100, 100);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      setUserId(data.user.id);

      const savedPeso = localStorage.getItem("nutrivision_peso");
      if (savedPeso) setPeso(Number(savedPeso));

      const today = new Date().toISOString().split("T")[0];
      const { data: log } = await supabase
        .from("water_logs")
        .select("*")
        .eq("user_id", data.user.id)
        .eq("date", today)
        .maybeSingle();
      if (log) setCopos(log.cups);
    };
    init();
  }, []);

  const saveLog = useCallback(async (newCopos: number) => {
    if (!userId) return;
    const today = new Date().toISOString().split("T")[0];
    await supabase
      .from("water_logs")
      .upsert({ user_id: userId, date: today, cups: newCopos, goal_ml: metaMl }, { onConflict: "user_id,date" });
  }, [userId, metaMl]);

  const updateCopos = (val: number) => {
    const next = Math.max(0, val);
    setCopos(next);
    saveLog(next);
  };

  const salvarPeso = () => {
    const p = Number(pesoInput);
    if (p > 0) {
      setPeso(p);
      localStorage.setItem("nutrivision_peso", String(p));
      toast({ title: "Peso salvo!", description: `Meta: ${Math.round(p * 35)}ml (${Math.round((p * 35) / 250)} copos)` });
    }
  };

  const falarAlerta = useCallback(() => {
    if (!alertaAtivo || copos >= meta) return;
    const msg = new SpeechSynthesisUtterance(
      `Você ainda não cumpriu sua meta de água de hoje. Sua meta definida é de ${(metaMl / 1000).toFixed(1)} litros.`
    );
    msg.lang = "pt-BR";
    msg.rate = 0.9;
    speechSynthesis.speak(msg);
  }, [alertaAtivo, copos, meta, metaMl]);

  useEffect(() => {
    if (!alertaAtivo) return;
    const interval = setInterval(falarAlerta, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [alertaAtivo, falarAlerta]);

  if (!peso) {
    return (
      <div className="min-h-screen bg-background">
        <div className="gradient-primary px-5 pb-6 pt-5">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-primary-foreground">
            <ArrowLeft className="h-6 w-6" />
            <span className="text-lg font-semibold">Meta de Água</span>
          </button>
        </div>
        <div className="mx-auto max-w-lg px-5 py-6">
          <Card>
            <CardContent className="p-8 space-y-6 text-center">
              <Droplets className="mx-auto h-16 w-16" style={{ color: "hsl(195, 80%, 50%)" }} />
              <h2 className="text-xl font-bold text-foreground">Informe seu peso</h2>
              <p className="text-muted-foreground">Vamos calcular sua meta diária de água (35ml por kg)</p>
              <div className="space-y-2">
                <Label className="text-lg">Peso (kg)</Label>
                <Input
                  type="number"
                  placeholder="Ex: 70"
                  value={pesoInput}
                  onChange={(e) => setPesoInput(e.target.value)}
                  className="h-14 text-center text-2xl"
                />
              </div>
              <Button onClick={salvarPeso} className="h-14 w-full gradient-primary text-lg text-primary-foreground">
                Calcular Meta
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-primary px-5 pb-6 pt-5">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-primary-foreground">
          <ArrowLeft className="h-6 w-6" />
          <span className="text-lg font-semibold">Meta de Água</span>
        </button>
      </div>

      <div className="mx-auto max-w-lg px-5 py-6 space-y-6">
        <Card>
          <CardContent className="p-8 text-center space-y-6">
            <div className="relative mx-auto h-40 w-40">
              <svg className="h-40 w-40 -rotate-90" viewBox="0 0 36 36">
                <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(140, 20%, 90%)" strokeWidth="3" />
                <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(195, 80%, 50%)" strokeWidth="3" strokeDasharray={`${progresso}, 100`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Droplets className="h-8 w-8" style={{ color: "hsl(195, 80%, 50%)" }} />
                <p className="mt-1 text-3xl font-bold text-foreground">{copos}/{meta}</p>
                <p className="text-sm text-muted-foreground">copos</p>
              </div>
            </div>

            <div>
              <p className="text-lg text-muted-foreground">
                {copos >= meta ? "🎉 Parabéns! Meta atingida!" : `Faltam ${meta - copos} copos`}
              </p>
              <p className="text-sm text-muted-foreground">Meta: {(metaMl / 1000).toFixed(1)}L ({metaMl}ml)</p>
            </div>

            <div className="flex items-center justify-center gap-6">
              <Button onClick={() => updateCopos(copos - 1)} variant="outline" className="h-16 w-16 rounded-full text-2xl">
                <Minus className="h-6 w-6" />
              </Button>
              <Button onClick={() => updateCopos(copos + 1)} className="h-16 w-16 rounded-full gradient-primary text-2xl text-primary-foreground">
                <Plus className="h-6 w-6" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Cada copo = 250ml</p>

            <Button
              variant={alertaAtivo ? "default" : "outline"}
              onClick={() => {
                setAlertaAtivo(!alertaAtivo);
                if (!alertaAtivo) {
                  toast({ title: "Lembrete ativado", description: "Você receberá alertas sonoros a cada hora." });
                }
              }}
              className="w-full"
            >
              {alertaAtivo ? <Volume2 className="mr-2 h-5 w-5" /> : <VolumeX className="mr-2 h-5 w-5" />}
              {alertaAtivo ? "Desativar lembrete" : "Ativar lembrete sonoro"}
            </Button>

            <Button variant="ghost" size="sm" onClick={() => { setPeso(null); localStorage.removeItem("nutrivision_peso"); }}>
              Alterar peso
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MetaAgua;
