import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const categories = ["Todos", "Alongamento", "Mobilidade", "Caminhada", "Exercícios leves", "Terceira idade", "Postura", "Bem-estar"];

const Treinos = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("Todos");
  const [playingId, setPlayingId] = useState<string | null>(null);

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["training_videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("training_videos")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = category === "Todos" ? videos : videos.filter((v) => v.category === category);

  const getEmbedUrl = (url: string) => {
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    return url;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-primary px-5 pb-6 pt-5">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-primary-foreground">
          <ArrowLeft className="h-6 w-6" />
          <span className="text-lg font-semibold">Treinos e Exercícios</span>
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
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">Nenhum vídeo disponível nesta categoria.</p>
        ) : (
          <div className="space-y-4">
            {filtered.map((v) => (
              <Card key={v.id} className="overflow-hidden">
                {playingId === v.id && v.video_url && (
                  <div className="aspect-video w-full">
                    <iframe
                      src={getEmbedUrl(v.video_url)}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
                {v.thumbnail_url && playingId !== v.id && (
                  <img src={v.thumbnail_url} alt={v.title} className="aspect-video w-full object-cover" />
                )}
                <CardContent className="flex items-center gap-4 p-4">
                  <button
                    onClick={() => setPlayingId(playingId === v.id ? null : v.id)}
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600"
                  >
                    <Play className="h-7 w-7 text-primary-foreground" />
                  </button>
                  <div className="flex-1">
                    <span className="mb-1 inline-block rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                      {v.category}
                    </span>
                    <h3 className="text-base font-semibold text-foreground">{v.title}</h3>
                    <p className="text-sm text-muted-foreground">{v.description}</p>
                    {v.duration && <p className="mt-1 text-xs text-muted-foreground">⏱ {v.duration}</p>}
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

export default Treinos;
