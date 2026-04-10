import { useNavigate } from "react-router-dom";
import { ArrowLeft, Store, MapPin, ExternalLink, Phone, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Lojas = () => {
  const navigate = useNavigate();

  const { data: lojas = [], isLoading } = useQuery({
    queryKey: ["stores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stores")
        .select("*")
        .eq("published", true)
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-primary px-5 pb-6 pt-5">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-primary-foreground">
          <ArrowLeft className="h-6 w-6" />
          <span className="text-lg font-semibold">Lojas de Produtos Naturais</span>
        </button>
      </div>

      <div className="mx-auto max-w-lg px-5 py-6 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : lojas.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">Nenhuma loja cadastrada.</p>
        ) : (
          lojas.map((l) => (
            <Card key={l.id}>
              {l.photo_url && <img src={l.photo_url} alt={l.name} className="h-40 w-full object-cover rounded-t-lg" />}
              <CardContent className="p-5 space-y-3">
                <h3 className="text-lg font-semibold text-foreground">{l.name}</h3>
                {l.address && (
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" /> {l.address}
                  </p>
                )}
                {l.phone && (
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 shrink-0" /> {l.phone}
                  </p>
                )}
                <div className="flex gap-2 pt-1">
                  {l.whatsapp && (
                    <Button asChild size="sm" className="gradient-primary text-primary-foreground">
                      <a href={`https://wa.me/${l.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                        WhatsApp
                      </a>
                    </Button>
                  )}
                  {l.maps_link && (
                    <Button asChild variant="outline" size="sm">
                      <a href={l.maps_link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-1 h-4 w-4" /> Ver localização
                      </a>
                    </Button>
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

export default Lojas;
