import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const dicas = [
  { title: "10 alimentos para emagrecer", desc: "Guia completo com os melhores alimentos" },
  { title: "Como beber mais água", desc: "Dicas práticas para manter-se hidratado" },
  { title: "Exercícios para iniciantes", desc: "Rotina simples para começar a se exercitar" },
  { title: "Alimentação saudável após os 50", desc: "Nutrientes essenciais para a sua faixa etária" },
  { title: "Receitas detox", desc: "Sucos e receitas para desintoxicar o corpo" },
  { title: "Como melhorar o sono", desc: "Hábitos para dormir melhor todas as noites" },
];

const Dicas = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-primary px-5 pb-6 pt-5">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-primary-foreground">
          <ArrowLeft className="h-6 w-6" />
          <span className="text-lg font-semibold">Dicas em PDF</span>
        </button>
      </div>

      <div className="mx-auto max-w-lg px-5 py-6 space-y-4">
        {dicas.map((d, i) => (
          <Card key={i} className="cursor-pointer transition-transform active:scale-[0.98]">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600">
                <FileText className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-foreground">{d.title}</h3>
                <p className="text-sm text-muted-foreground">{d.desc}</p>
              </div>
              <Download className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dicas;
