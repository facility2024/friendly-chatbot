import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Droplets, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const MetaAgua = () => {
  const navigate = useNavigate();
  const [copos, setCopos] = useState(0);
  const meta = 8;
  const progresso = Math.min((copos / meta) * 100, 100);

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
                <path
                  d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="hsl(140, 20%, 90%)"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="hsl(195, 80%, 50%)"
                  strokeWidth="3"
                  strokeDasharray={`${progresso}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Droplets className="h-8 w-8" style={{ color: "hsl(195, 80%, 50%)" }} />
                <p className="mt-1 text-3xl font-bold text-foreground">{copos}/{meta}</p>
                <p className="text-sm text-muted-foreground">copos</p>
              </div>
            </div>

            <p className="text-lg text-muted-foreground">
              {copos >= meta ? "🎉 Parabéns! Meta atingida!" : `Faltam ${meta - copos} copos`}
            </p>

            <div className="flex items-center justify-center gap-6">
              <Button
                onClick={() => setCopos(Math.max(0, copos - 1))}
                variant="outline"
                className="h-16 w-16 rounded-full text-2xl"
              >
                <Minus className="h-6 w-6" />
              </Button>
              <Button
                onClick={() => setCopos(copos + 1)}
                className="h-16 w-16 rounded-full gradient-primary text-2xl text-primary-foreground"
              >
                <Plus className="h-6 w-6" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Cada copo = 250ml</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MetaAgua;
