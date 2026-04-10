import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const faixas = [
  { label: "Abaixo do peso", min: 0, max: 18.5, color: "bg-blue-400" },
  { label: "Peso normal", min: 18.5, max: 24.9, color: "bg-green-500" },
  { label: "Sobrepeso", min: 25, max: 29.9, color: "bg-yellow-500" },
  { label: "Obesidade grau 1", min: 30, max: 34.9, color: "bg-orange-500" },
  { label: "Obesidade grau 2", min: 35, max: 39.9, color: "bg-red-400" },
  { label: "Obesidade grau 3", min: 40, max: 100, color: "bg-red-600" },
];

const IMC = () => {
  const navigate = useNavigate();
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [resultado, setResultado] = useState<{ imc: number; classificacao: string } | null>(null);

  const calcular = () => {
    const h = parseFloat(altura.replace(",", ".")) / 100;
    const p = parseFloat(peso.replace(",", "."));
    if (!h || !p || h <= 0) return;
    const imc = p / (h * h);
    const faixa = faixas.find((f) => imc >= f.min && imc <= f.max) || faixas[faixas.length - 1];
    setResultado({ imc: Math.round(imc * 10) / 10, classificacao: faixa.label });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-primary px-5 pb-6 pt-5">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-primary-foreground">
          <ArrowLeft className="h-6 w-6" />
          <span className="text-lg font-semibold">Calcular IMC</span>
        </button>
      </div>

      <div className="mx-auto max-w-lg px-5 py-6 space-y-6">
        <Card>
          <CardContent className="p-6 space-y-5">
            <div className="space-y-2">
              <Label className="text-base">Altura (cm)</Label>
              <Input className="h-14 text-lg" placeholder="Ex: 170" value={altura} onChange={(e) => setAltura(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-base">Peso (kg)</Label>
              <Input className="h-14 text-lg" placeholder="Ex: 75" value={peso} onChange={(e) => setPeso(e.target.value)} />
            </div>
            <Button onClick={calcular} className="h-14 w-full gradient-primary text-lg font-semibold text-primary-foreground">
              <Calculator className="mr-2 h-5 w-5" /> Calcular
            </Button>
          </CardContent>
        </Card>

        {resultado && (
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6 text-center space-y-4">
              <p className="text-lg text-muted-foreground">Seu IMC</p>
              <p className="text-5xl font-bold text-gradient">{resultado.imc}</p>
              <p className="text-xl font-semibold text-foreground">{resultado.classificacao}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-5">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Tabela de referência</h3>
            <div className="space-y-2">
              {faixas.map((f) => (
                <div
                  key={f.label}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 ${
                    resultado?.classificacao === f.label ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-4 w-4 rounded-full ${f.color}`} />
                    <span className="text-base font-medium text-foreground">{f.label}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {f.min} - {f.max >= 100 ? "40+" : f.max}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IMC;
