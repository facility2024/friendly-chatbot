import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Footprints, Play, Pause, RotateCcw, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

const Caminhada = () => {
  const navigate = useNavigate();
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [steps, setSteps] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const { data: history = [], refetch } = useQuery({
    queryKey: ["walk_logs"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];
      const { data, error } = await supabase
        .from("walk_logs")
        .select("*")
        .eq("user_id", user.user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
        setSteps((s) => s + Math.floor(Math.random() * 3) + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const km = (steps * 0.00075).toFixed(2);
  const cal = Math.round(steps * 0.04);

  const saveSession = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user || steps === 0) return;
    await supabase.from("walk_logs").insert({
      user_id: data.user.id,
      steps,
      distance_km: Number(km),
      duration_seconds: seconds,
      calories: cal,
    });
    toast({ title: "Caminhada salva!" });
    refetch();
  };

  const handleReset = () => {
    if (steps > 0) saveSession();
    setRunning(false);
    setSeconds(0);
    setSteps(0);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-primary px-5 pb-6 pt-5">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-primary-foreground">
            <ArrowLeft className="h-6 w-6" />
            <span className="text-lg font-semibold">Medidor de Caminhada</span>
          </button>
          <button onClick={() => setShowHistory(!showHistory)} className="rounded-xl bg-white/20 p-2">
            <History className="h-5 w-5 text-primary-foreground" />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-5 py-6 space-y-6">
        {showHistory ? (
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-bold text-foreground">Histórico</h2>
              {history.length === 0 ? (
                <p className="text-muted-foreground">Nenhuma caminhada registrada.</p>
              ) : (
                history.map((h) => (
                  <div key={h.id} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <p className="font-medium text-foreground">{h.steps} passos</p>
                      <p className="text-sm text-muted-foreground">
                        {Number(h.distance_km).toFixed(2)} km • {h.calories} kcal • {formatTime(h.duration_seconds)}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(h.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-8 text-center space-y-6">
              <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-secondary">
                <Footprints className="h-16 w-16" style={{ color: "hsl(145, 63%, 42%)" }} />
              </div>
              <div>
                <p className="text-5xl font-bold text-gradient">{steps}</p>
                <p className="text-lg text-muted-foreground">passos</p>
              </div>
              <p className="text-3xl font-semibold text-foreground">{formatTime(seconds)}</p>
              <div className="flex justify-center gap-6">
                <div className="text-center">
                  <p className="text-xl font-bold text-foreground">{km}</p>
                  <p className="text-sm text-muted-foreground">km</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-foreground">{cal}</p>
                  <p className="text-sm text-muted-foreground">kcal</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Button onClick={() => setRunning(!running)} className="h-14 flex-1 gradient-primary text-lg text-primary-foreground">
                  {running ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                  {running ? "Pausar" : "Iniciar"}
                </Button>
                <Button onClick={handleReset} variant="outline" className="h-14 px-6">
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Caminhada;
