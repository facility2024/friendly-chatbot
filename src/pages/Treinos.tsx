import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const videos = [
  { title: "Alongamento matinal", desc: "10 min de exercícios leves para começar o dia", duration: "10 min", category: "Alongamento" },
  { title: "Caminhada em casa", desc: "Exercícios de caminhada sem sair de casa", duration: "15 min", category: "Cardio" },
  { title: "Fortalecimento de pernas", desc: "Exercícios para fortalecer pernas e equilíbrio", duration: "12 min", category: "Força" },
  { title: "Exercícios para coluna", desc: "Alívio de dores e fortalecimento postural", duration: "10 min", category: "Postura" },
  { title: "Respiração e relaxamento", desc: "Técnicas de respiração para bem-estar", duration: "8 min", category: "Relaxamento" },
  { title: "Mobilidade articular", desc: "Movimentos para manter as articulações saudáveis", duration: "12 min", category: "Mobilidade" },
];

const Treinos = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-primary px-5 pb-6 pt-5">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-primary-foreground">
          <ArrowLeft className="h-6 w-6" />
          <span className="text-lg font-semibold">Treinos e Exercícios</span>
        </button>
      </div>

      <div className="mx-auto max-w-lg px-5 py-6 space-y-4">
        {videos.map((v, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600">
                <Play className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <span className="mb-1 inline-block rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                  {v.category}
                </span>
                <h3 className="text-base font-semibold text-foreground">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
                <p className="mt-1 text-xs text-muted-foreground">⏱ {v.duration}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Treinos;
