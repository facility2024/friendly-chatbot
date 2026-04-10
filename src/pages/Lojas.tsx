import { useNavigate } from "react-router-dom";
import { ArrowLeft, Store, MapPin, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const lojas = [
  { nome: "Mundo Verde", endereco: "Av. Paulista, 1000", tel: "(11) 3456-7890" },
  { nome: "Empório Natural", endereco: "Rua Augusta, 500", tel: "(11) 2345-6789" },
  { nome: "Casa da Natureza", endereco: "Rua Oscar Freire, 200", tel: "(11) 5678-1234" },
  { nome: "Bio Vida", endereco: "Av. Brasil, 1500", tel: "(11) 9876-5432" },
  { nome: "Natural da Terra", endereco: "Av. Rebouças, 800", tel: "(11) 1234-5678" },
];

const Lojas = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-primary px-5 pb-6 pt-5">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-primary-foreground">
          <ArrowLeft className="h-6 w-6" />
          <span className="text-lg font-semibold">Lojas de Produtos Naturais</span>
        </button>
      </div>

      <div className="mx-auto max-w-lg px-5 py-6 space-y-4">
        {lojas.map((l, i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-green-500">
                <Store className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-foreground">{l.nome}</h3>
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {l.endereco}
                </p>
                <p className="text-sm text-muted-foreground">📞 {l.tel}</p>
              </div>
              <ExternalLink className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Lojas;
