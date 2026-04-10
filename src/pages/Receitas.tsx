import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Clock, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const categories = ["Todos", "Café da manhã", "Almoço", "Jantar", "Lanches", "Sucos", "Sobremesas"];

const Receitas = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("Todos");
  const [playingId, setPlayingId] = useState<string | null>(null);

  const { data: receitas = [], isLoading } = useQuery({
    queryKey: ["recipes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = category === "Todos" ? receitas : receitas.filter((r) => r.category === category);

  const getEmbedUrl = (url: string) => {
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    return url;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-primary px-5 pb-6 pt-5">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-primary-foreground">
          <ArrowLeft className="h-6 w-6" />
          <span className="text-lg font-semibold">Receitas Light</span>
        </button>
      </div>

      <div className="mx-auto max-w-lg px-5 py-4">
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {categories.map((c) => (
            <Button
              key={c}
              variant={category === c ? "default" : "outline"}
              size="sm"
              onClick={() => setCategory(c)}
              className={`shrink-0 rounded-full ${category === c ? "gradient-primary text-primary-foreground" : ""}`}
            >
              {c}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">Nenhuma receita disponível.</p>
        ) : (
          <div className="space-y-4">
            {filtered.map((r) => (
              <Card key={r.id} className="overflow-hidden">
                {playingId === r.id && r.video_url && (
                  <div className="aspect-video w-full">
                    <iframe src={getEmbedUrl(r.video_url)} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                  </div>
                )}
                {r.thumbnail_url && playingId !== r.id && (
                  <img src={r.thumbnail_url} alt={r.title} className="aspect-video w-full object-cover" />
                )}
                <CardContent className="flex items-center gap-4 p-4">
                  <button
                    onClick={() => setPlayingId(playingId === r.id ? null : r.id)}
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500"
                  >
                    <Play className="h-7 w-7 text-primary-foreground" />
                  </button>
                  <div className="flex-1">
                    <span className="mb-1 inline-block rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">{r.category}</span>
                    <h3 className="text-base font-semibold text-foreground">{r.title}</h3>
                    <p className="text-sm text-muted-foreground">{r.description}</p>
                    {r.prep_time && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" /> {r.prep_time}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Receitas;
