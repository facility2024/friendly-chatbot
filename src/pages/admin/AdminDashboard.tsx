import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, UtensilsCrossed, Store, FileText, Users } from "lucide-react";

const AdminDashboard = () => {
  const { data: counts } = useQuery({
    queryKey: ["admin_counts"],
    queryFn: async () => {
      const [v, r, s, t, u] = await Promise.all([
        supabase.from("training_videos").select("id", { count: "exact", head: true }),
        supabase.from("recipes").select("id", { count: "exact", head: true }),
        supabase.from("stores").select("id", { count: "exact", head: true }),
        supabase.from("tips_pdf").select("id", { count: "exact", head: true }),
        supabase.from("user_profiles").select("id", { count: "exact", head: true }),
      ]);
      return {
        videos: v.count || 0,
        recipes: r.count || 0,
        stores: s.count || 0,
        tips: t.count || 0,
        users: u.count || 0,
      };
    },
  });

  const stats = [
    { label: "Treinos", value: counts?.videos || 0, icon: Dumbbell },
    { label: "Receitas", value: counts?.recipes || 0, icon: UtensilsCrossed },
    { label: "Lojas", value: counts?.stores || 0, icon: Store },
    { label: "Dicas PDF", value: counts?.tips || 0, icon: FileText },
    { label: "Usuários", value: counts?.users || 0, icon: Users },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <s.icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminDashboard;
