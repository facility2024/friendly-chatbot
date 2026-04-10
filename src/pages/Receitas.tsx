import { useNavigate } from "react-router-dom";
import { ArrowLeft, UtensilsCrossed, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const receitas = [
  { title: "Salada de quinoa", cal: "180 kcal", tempo: "15 min", desc: "Quinoa, tomate, pepino e limão" },
  { title: "Sopa de legumes", cal: "120 kcal", tempo: "30 min", desc: "Cenoura, abobrinha, batata e temperos" },
  { title: "Frango grelhado com salada", cal: "250 kcal", tempo: "20 min", desc: "Peito de frango, alface e tomate" },
  { title: "Smoothie verde", cal: "95 kcal", tempo: "5 min", desc: "Espinafre, banana e leite vegetal" },
  { title: "Wrap integral", cal: "200 kcal", tempo: "10 min", desc: "Tortilla integral, atum e vegetais" },
  { title: "Omelete de claras", cal: "150 kcal", tempo: "10 min", desc: "Claras de ovo, tomate e espinafre" },
];

const Receitas = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-primary px-5 pb-6 pt-5">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-primary-foreground">
          <ArrowLeft className="h-6 w-6" />
          <span className="text-lg font-semibold">Receitas Light</span>
        </button>
      </div>

      <div className="mx-auto max-w-lg px-5 py-6 space-y-4">
        {receitas.map((r, i) => (
          <Card key={i}>
            <CardContent className="flex items-start gap-4 p-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500">
                <UtensilsCrossed className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">{r.title}</h3>
                <p className="text-sm text-muted-foreground">{r.desc}</p>
                <div className="mt-2 flex gap-3 text-xs text-muted-foreground">
                  <span>🔥 {r.cal}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {r.tempo}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Receitas;
