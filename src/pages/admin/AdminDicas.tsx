import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Tip = { id: string; title: string; description: string; file_url: string; published: boolean };

const emptyForm: Omit<Tip, "id"> = { title: "", description: "", file_url: "", published: false };

const AdminDicas = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);

  const { data: tips = [] } = useQuery({
    queryKey: ["admin_tips_pdf"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tips_pdf").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Tip[];
    },
  });

  const save = async () => {
    if (!form.title) return;
    if (editId) {
      await supabase.from("tips_pdf").update(form).eq("id", editId);
    } else {
      await supabase.from("tips_pdf").insert(form);
    }
    toast({ title: editId ? "Atualizado!" : "Cadastrado!" });
    setOpen(false); setForm(emptyForm); setEditId(null);
    qc.invalidateQueries({ queryKey: ["admin_tips_pdf"] });
  };

  const remove = async (id: string) => {
    await supabase.from("tips_pdf").delete().eq("id", id);
    toast({ title: "Removido!" });
    qc.invalidateQueries({ queryKey: ["admin_tips_pdf"] });
  };

  const edit = (t: Tip) => {
    setForm({ title: t.title, description: t.description, file_url: t.file_url, published: t.published });
    setEditId(t.id); setOpen(true);
  };

  const togglePublish = async (t: Tip) => {
    await supabase.from("tips_pdf").update({ published: !t.published }).eq("id", t.id);
    qc.invalidateQueries({ queryKey: ["admin_tips_pdf"] });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Dicas PDF ({tips.length})</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setForm(emptyForm); setEditId(null); } }}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground"><Plus className="mr-2 h-4 w-4" /> Nova</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? "Editar" : "Nova"} Dica</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Título</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div><Label>Descrição</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div><Label>URL do PDF</Label><Input value={form.file_url} onChange={(e) => setForm({ ...form, file_url: e.target.value })} placeholder="https://..." /></div>
              <div className="flex items-center gap-2">
                <Switch checked={form.published} onCheckedChange={(c) => setForm({ ...form, published: c })} />
                <Label>Publicado</Label>
              </div>
              <Button onClick={save} className="w-full gradient-primary text-primary-foreground">Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {tips.map((t) => (
        <Card key={t.id}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{t.title}</h3>
                <span className={`rounded-full px-2 py-0.5 text-xs ${t.published ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                  {t.published ? "Publicado" : "Rascunho"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{t.description}</p>
            </div>
            <div className="flex gap-2">
              <Switch checked={t.published} onCheckedChange={() => togglePublish(t)} />
              <Button variant="ghost" size="icon" onClick={() => edit(t)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => remove(t.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminDicas;
