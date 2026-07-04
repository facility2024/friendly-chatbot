import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type UserRow = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  is_approved: boolean;
  license_expires_at: string | null;
  created_at: string;
};

const toDateInput = (iso: string | null) => (iso ? iso.slice(0, 10) : "");

const AdminUsuarios = () => {
  const qc = useQueryClient();
  const [edits, setEdits] = useState<Record<string, { is_approved: boolean; license_expires_at: string }>>({});
  const [busyId, setBusyId] = useState<string | null>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin_users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as UserRow[];
    },
  });

  const getState = (u: UserRow) =>
    edits[u.user_id] ?? { is_approved: u.is_approved, license_expires_at: toDateInput(u.license_expires_at) };

  const setState = (userId: string, patch: Partial<{ is_approved: boolean; license_expires_at: string }>) => {
    setEdits((prev) => {
      const current = prev[userId] ?? { is_approved: false, license_expires_at: "" };
      const base = prev[userId] ?? current;
      const target = users.find((x) => x.user_id === userId);
      const seed = target
        ? { is_approved: target.is_approved, license_expires_at: toDateInput(target.license_expires_at) }
        : base;
      return { ...prev, [userId]: { ...seed, ...prev[userId], ...patch } };
    });
  };

  const invokeAdmin = async (payload: Record<string, unknown>) => {
    const { data, error } = await supabase.functions.invoke("admin-users", { body: payload });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    return data;
  };

  const handleSave = async (u: UserRow) => {
    const st = getState(u);
    setBusyId(u.user_id);
    try {
      await invokeAdmin({
        action: "update",
        target_user_id: u.user_id,
        is_approved: st.is_approved,
        license_expires_at: st.license_expires_at ? st.license_expires_at : null,
      });
      toast({ title: "Usuário atualizado" });
      setEdits((prev) => {
        const next = { ...prev };
        delete next[u.user_id];
        return next;
      });
      qc.invalidateQueries({ queryKey: ["admin_users"] });
    } catch (e) {
      toast({ title: "Erro ao salvar", description: (e as Error).message, variant: "destructive" });
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (u: UserRow) => {
    setBusyId(u.user_id);
    try {
      await invokeAdmin({ action: "delete", target_user_id: u.user_id });
      toast({ title: "Usuário excluído" });
      qc.invalidateQueries({ queryKey: ["admin_users"] });
    } catch (e) {
      toast({ title: "Erro ao excluir", description: (e as Error).message, variant: "destructive" });
    } finally {
      setBusyId(null);
    }
  };

  if (isLoading)
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Usuários ({users.length})</h2>
      {users.map((u) => {
        const st = getState(u);
        const dirty =
          st.is_approved !== u.is_approved ||
          st.license_expires_at !== toDateInput(u.license_expires_at);
        const busy = busyId === u.user_id;
        return (
          <Card key={u.id}>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{u.name || "Sem nome"}</h3>
                  <p className="text-sm text-muted-foreground truncate">{u.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Cadastro: {new Date(u.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon" disabled={busy} aria-label="Excluir usuário">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir usuário?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Isso removerá {u.email} do banco de dados e do login. Ação irreversível.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(u)}>Excluir</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-md border p-3">
                <div>
                  <Label className="text-sm font-medium">Liberado pelo admin</Label>
                  <p className="text-xs text-muted-foreground">
                    {st.is_approved ? "Acesso ativo" : "Acesso bloqueado"}
                  </p>
                </div>
                <Switch
                  checked={st.is_approved}
                  onCheckedChange={(v) => setState(u.user_id, { is_approved: v })}
                  disabled={busy}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor={`exp-${u.user_id}`} className="text-sm font-medium">
                  Data de expiração
                </Label>
                <Input
                  id={`exp-${u.user_id}`}
                  type="date"
                  value={st.license_expires_at}
                  onChange={(e) => setState(u.user_id, { license_expires_at: e.target.value })}
                  disabled={busy}
                />
                <p className="text-xs text-muted-foreground">
                  Deixe em branco para acesso sem expiração.
                </p>
              </div>

              <Button
                onClick={() => handleSave(u)}
                disabled={!dirty || busy}
                className="w-full"
                size="lg"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Salvar alterações
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminUsuarios;
