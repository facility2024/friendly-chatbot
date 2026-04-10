import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Download, Eye, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Dicas = () => {
  const navigate = useNavigate();

  const { data: dicas = [], isLoading } = useQuery({
    queryKey: ["tips_pdf"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tips_pdf")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-primary px-5 pb-6 pt-5">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-primary-foreground">
          <ArrowLeft className="h-6 w-6" />
          <span className="text-lg font-semibold">Dicas em PDF</span>
        </button>
      </div>

      <div className="mx-auto max-w-lg px-5 py-6 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : dicas.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">Nenhuma dica disponível.</p>
        ) : (
          dicas.map((d) => (
            <Card key={d.id}>
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600">
                  <FileText className="h-7 w-7 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-foreground">{d.title}</h3>
                  <p className="text-sm text-muted-foreground">{d.description}</p>
                </div>
                <div className="flex flex-col gap-2">
                  {d.file_url && (
                    <>
                      <Button asChild variant="outline" size="icon">
                        <a href={d.file_url} target="_blank" rel="noopener noreferrer"><Eye className="h-4 w-4" /></a>
                      </Button>
                      <Button asChild variant="outline" size="icon">
                        <a href={d.file_url} download><Download className="h-4 w-4" /></a>
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Dicas;
