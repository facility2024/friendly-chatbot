import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Search, X, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { analyzeFoodDirect } from "@/lib/aiFood";

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
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<any | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      let stream: MediaStream | null = null;
      try {
        // Try to force the rear camera
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { exact: "environment" } },
          audio: false,
        });
      } catch {
        // Fallback for devices/browsers that don't support "exact"
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
            audio: false,
          });
        } catch {
          // Last fallback: any camera
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        }
      }
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setShowCamera(true);
    } catch {
      alert("Não foi possível acessar a câmera. Verifique as permissões do navegador.");
    }
  };

  const analyzeImage = async (dataUrl: string) => {
    setAnalyzing(true);
    setAiResult(null);
    setAlimentoSelecionado(null);
    try {
      const r = await analyzeFoodDirect({ image: dataUrl });
      if (!r || r.erro) throw new Error("Não consegui identificar o alimento. Tente outra foto.");
      setAiResult(r);
    } catch (e) {
      toast({ title: "Erro na leitura", description: (e as Error).message, variant: "destructive" });
      // fallback local
      const foods = Object.keys(alimentosDB);
      const random = foods[Math.floor(Math.random() * foods.length)];
      setAlimentoSelecionado(random);
    } finally {
      setAnalyzing(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setCapturedImage(dataUrl);
    stopCamera();
    analyzeImage(dataUrl);
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setShowCamera(false);
  };

  const resultados = busca.length >= 2
    ? Object.keys(alimentosDB).filter((a) => a.includes(busca.toLowerCase()))
    : [];

  const info = alimentoSelecionado ? alimentosDB[alimentoSelecionado] : null;
  const displayInfo = aiResult
    ? {
        nome: aiResult.nome,
        porcao: aiResult.porcao,
        calorias: aiResult.calorias,
        proteinas: aiResult.proteinas,
        carboidratos: aiResult.carboidratos,
        gorduras: aiResult.gorduras,
        fibras: aiResult.fibras,
        confianca: aiResult.confianca,
      }
    : info
    ? {
        nome: alimentoSelecionado!,
        porcao: info.porcao,
        calorias: info.calorias,
        proteinas: info.proteinas,
        carboidratos: info.carboidratos,
        gorduras: info.gorduras,
        fibras: info.fibras,
        confianca: null as number | null,
      }
    : null;

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
              {analyzing ? (
                <div className="mt-3 flex items-center justify-center gap-2 text-primary">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-base font-medium">Analisando com IA...</span>
                </div>
              ) : aiResult ? (
                <div className="mt-3 flex items-center justify-center gap-2 text-emerald-600">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-medium">Identificado por IA</span>
                </div>
              ) : alimentoSelecionado ? (
                <p className="mt-3 text-center text-base text-muted-foreground">
                  Alimento: <strong className="text-foreground capitalize">{alimentoSelecionado}</strong>
                </p>
              ) : null}
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
              onChange={(e) => { setBusca(e.target.value); setAlimentoSelecionado(null); setAiResult(null); }}
            />
          </div>
          {resultados.length > 0 && (
            <div className="rounded-xl border bg-card p-2 space-y-1">
              {resultados.map((a) => (
                <button
                  key={a}
                  onClick={() => { setAlimentoSelecionado(a); setBusca(a); setAiResult(null); }}
                  className="w-full rounded-lg px-4 py-3 text-left text-base capitalize hover:bg-secondary"
                >
                  {a}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Nutritional info */}
        {displayInfo && (
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6">
              <h3 className="mb-1 text-center text-xl font-bold capitalize text-foreground">{displayInfo.nome}</h3>
              <p className="mb-1 text-center text-sm text-muted-foreground">{displayInfo.porcao}</p>
              {displayInfo.confianca != null && (
                <p className="mb-4 text-center text-xs text-emerald-600 font-medium">
                  Confiança IA: {displayInfo.confianca}%
                </p>
              )}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Calorias", value: `${displayInfo.calorias} kcal` },
                  { label: "Proteínas", value: `${displayInfo.proteinas}g` },
                  { label: "Carboidratos", value: `${displayInfo.carboidratos}g` },
                  { label: "Gorduras", value: `${displayInfo.gorduras}g` },
                  { label: "Fibras", value: `${displayInfo.fibras}g` },
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
