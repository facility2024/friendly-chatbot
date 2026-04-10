import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const AdminUsuarios = () => {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin_users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Usuários ({users.length})</h2>
      {users.map((u) => (
        <Card key={u.id}>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <h3 className="font-semibold text-foreground">{u.name || "Sem nome"}</h3>
              <p className="text-sm text-muted-foreground">{u.email}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(u.created_at).toLocaleDateString("pt-BR")}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminUsuarios;
