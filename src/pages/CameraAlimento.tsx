import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const alimentosDB: Record<string, { calorias: number; proteinas: number; carboidratos: number; gorduras: number; fibras: number; porcao: string }> = {
  banana: { calorias: 89, proteinas: 1.1, carboidratos: 22.8, gorduras: 0.3, fibras: 2.6, porcao: "1 unidade (100g)" },
  maça: { calorias: 52, proteinas: 0.3, carboidratos: 13.8, gorduras: 0.2, fibras: 2.4, porcao: "1 unidade (100g)" },
  arroz: { calorias: 130, proteinas: 2.7, carboidratos: 28.2, gorduras: 0.3, fibras: 0.4, porcao: "1 xícara (100g)" },
  feijão: { calorias: 77, proteinas: 5.2, carboidratos: 13.6, gorduras: 0.5, fibras: 8.7, porcao: "1 concha (100g)" },
  frango: { calorias: 165, proteinas: 31, carboidratos: 0, gorduras: 3.6, fibras: 0, porcao: "1 filé (100g)" },
  salada: { calorias: 20, proteinas: 1.5, carboidratos: 3.6, gorduras: 0.2, fibras: 2, porcao: "1 prato (100g)" },
  ovo: { calorias: 155, proteinas: 13, carboidratos: 1.1, gorduras: 11, fibras: 0, porcao: "2 unidades (100g)" },
  pão: { calorias: 265, proteinas: 9.4, carboidratos: 49, gorduras: 3.2, fibras: 2.7, porcao: "2 fatias (100g)" },
  leite: { calorias: 61, proteinas: 3.2, carboidratos: 4.8, gorduras: 3.3, fibras: 0, porcao: "1 copo (200ml)" },
  batata: { calorias: 77, proteinas: 2, carboidratos: 17, gorduras: 0.1, fibras: 2.2, porcao: "1 unidade (100g)" },
};

const CameraAlimento = () => {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [alimentoSelecionado, setAlimentoSelecionado] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setShowCamera(true);
    } catch {
      alert("Não foi possível acessar a câmera. Verifique as permissões.");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    setCapturedImage(canvas.toDataURL("image/jpeg"));
    stopCamera();
    // Simulate identification
    const foods = Object.keys(alimentosDB);
    const random = foods[Math.floor(Math.random() * foods.length)];
    setAlimentoSelecionado(random);
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setShowCamera(false);
  };

  const resultados = busca.length >= 2
    ? Object.keys(alimentosDB).filter((a) => a.includes(busca.toLowerCase()))
    : [];

  const info = alimentoSelecionado ? alimentosDB[alimentoSelecionado] : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-primary px-5 pb-6 pt-5">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-primary-foreground">
          <ArrowLeft className="h-6 w-6" />
          <span className="text-lg font-semibold">Leitura de Alimento</span>
        </button>
      </div>

      <div className="mx-auto max-w-lg px-5 py-6 space-y-6">
        {/* Camera */}
        {showCamera ? (
          <Card>
            <CardContent className="p-4 space-y-4">
              <video ref={videoRef} autoPlay playsInline className="w-full rounded-xl" />
              <div className="flex gap-3">
                <Button onClick={capturePhoto} className="flex-1 h-14 gradient-primary text-lg text-primary-foreground">
                  <Camera className="mr-2 h-5 w-5" /> Capturar
                </Button>
                <Button onClick={stopCamera} variant="outline" className="h-14">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button onClick={startCamera} className="h-16 w-full gradient-primary text-lg text-primary-foreground">
            <Camera className="mr-2 h-6 w-6" /> Abrir Câmera
          </Button>
        )}

        {capturedImage && (
          <Card>
            <CardContent className="p-4">
              <img src={capturedImage} alt="Captura" className="w-full rounded-xl" />
              <p className="mt-3 text-center text-base text-muted-foreground">
                Alimento identificado: <strong className="text-foreground capitalize">{alimentoSelecionado}</strong>
              </p>
            </CardContent>
          </Card>
        )}

        {/* Manual search */}
        <div className="space-y-2">
          <p className="text-base font-medium text-foreground">Ou busque manualmente:</p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-14 pl-12 text-lg"
              placeholder="Digite o alimento..."
              value={busca}
              onChange={(e) => { setBusca(e.target.value); setAlimentoSelecionado(null); }}
            />
          </div>
          {resultados.length > 0 && (
            <div className="rounded-xl border bg-card p-2 space-y-1">
              {resultados.map((a) => (
                <button
                  key={a}
                  onClick={() => { setAlimentoSelecionado(a); setBusca(a); }}
                  className="w-full rounded-lg px-4 py-3 text-left text-base capitalize hover:bg-secondary"
                >
                  {a}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Nutritional info */}
        {info && (
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6">
              <h3 className="mb-1 text-center text-xl font-bold capitalize text-foreground">{alimentoSelecionado}</h3>
              <p className="mb-5 text-center text-sm text-muted-foreground">{info.porcao}</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Calorias", value: `${info.calorias} kcal` },
                  { label: "Proteínas", value: `${info.proteinas}g` },
                  { label: "Carboidratos", value: `${info.carboidratos}g` },
                  { label: "Gorduras", value: `${info.gorduras}g` },
                  { label: "Fibras", value: `${info.fibras}g` },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-secondary p-4 text-center">
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="text-lg font-bold text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CameraAlimento;
