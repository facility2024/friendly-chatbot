import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const classificar = (sexo: string, percentual: number) => {
  if (sexo === "masculino") {
    if (percentual < 6) return { label: "Gordura essencial", desc: "Nível muito baixo, pode ser arriscado." };
    if (percentual < 14) return { label: "Atleta", desc: "Excelente forma física." };
    if (percentual < 18) return { label: "Fitness", desc: "Boa forma física, saudável." };
    if (percentual < 25) return { label: "Aceitável", desc: "Faixa normal para a maioria." };
    return { label: "Acima do ideal", desc: "Considere ajustar alimentação e exercícios." };
  } else {
    if (percentual < 14) return { label: "Gordura essencial", desc: "Nível muito baixo, pode ser arriscado." };
    if (percentual < 21) return { label: "Atleta", desc: "Excelente forma física." };
    if (percentual < 25) return { label: "Fitness", desc: "Boa forma física, saudável." };
    if (percentual < 32) return { label: "Aceitável", desc: "Faixa normal para a maioria." };
    return { label: "Acima do ideal", desc: "Considere ajustar alimentação e exercícios." };
  }
};

const GorduraCorporal = () => {
  const navigate = useNavigate();
  const [sexo, setSexo] = useState("");
  const [idade, setIdade] = useState("");
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [cintura, setCintura] = useState("");
  const [quadril, setQuadril] = useState("");
  const [pescoco, setPescoco] = useState("");
  const [resultado, setResultado] = useState<{ percentual: number; classificacao: { label: string; desc: string } } | null>(null);

  const calcular = () => {
    const h = parseFloat(altura.replace(",", "."));
    const w = parseFloat(cintura.replace(",", "."));
    const n = parseFloat(pescoco.replace(",", "."));
    const hip = parseFloat(quadril.replace(",", "."));

    if (!h || !w || !n || !sexo) return;

    let bf: number;
    if (sexo === "masculino") {
      bf = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
    } else {
      if (!hip) return;
      bf = 495 / (1.29579 - 0.35004 * Math.log10(w + hip - n) + 0.22100 * Math.log10(h)) - 450;
    }

    bf = Math.max(0, Math.round(bf * 10) / 10);
    setResultado({ percentual: bf, classificacao: classificar(sexo, bf) });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-primary px-5 pb-6 pt-5">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-primary-foreground">
          <ArrowLeft className="h-6 w-6" />
          <span className="text-lg font-semibold">Gordura Corporal</span>
        </button>
      </div>

      <div className="mx-auto max-w-lg px-5 py-6 space-y-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-base">Sexo</Label>
              <Select value={sexo} onValueChange={setSexo}>
                <SelectTrigger className="h-14 text-lg"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-base">Idade</Label>
              <Input className="h-14 text-lg" placeholder="Ex: 55" value={idade} onChange={(e) => setIdade(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-base">Altura (cm)</Label>
              <Input className="h-14 text-lg" placeholder="Ex: 170" value={altura} onChange={(e) => setAltura(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-base">Peso (kg)</Label>
              <Input className="h-14 text-lg" placeholder="Ex: 75" value={peso} onChange={(e) => setPeso(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-base">Cintura (cm)</Label>
              <Input className="h-14 text-lg" placeholder="Ex: 85" value={cintura} onChange={(e) => setCintura(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-base">Pescoço (cm)</Label>
              <Input className="h-14 text-lg" placeholder="Ex: 38" value={pescoco} onChange={(e) => setPescoco(e.target.value)} />
            </div>
            {sexo === "feminino" && (
              <div className="space-y-2">
                <Label className="text-base">Quadril (cm)</Label>
                <Input className="h-14 text-lg" placeholder="Ex: 100" value={quadril} onChange={(e) => setQuadril(e.target.value)} />
              </div>
            )}
            <Button onClick={calcular} className="h-14 w-full gradient-primary text-lg font-semibold text-primary-foreground">
              <Percent className="mr-2 h-5 w-5" /> Calcular
            </Button>
          </CardContent>
        </Card>

        {resultado && (
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6 text-center space-y-4">
              <p className="text-lg text-muted-foreground">Gordura corporal estimada</p>
              <p className="text-5xl font-bold text-gradient">{resultado.percentual}%</p>
              <p className="text-xl font-semibold text-foreground">{resultado.classificacao.label}</p>
              <p className="text-base text-muted-foreground">{resultado.classificacao.desc}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GorduraCorporal;
