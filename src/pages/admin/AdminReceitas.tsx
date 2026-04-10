import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const categories = ["Café da manhã", "Almoço", "Jantar", "Lanches", "Sucos", "Sobremesas", "Geral"];

type Recipe = {
  id: string; title: string; description: string; video_url: string;
  thumbnail_url: string; category: string; prep_time: string; published: boolean;
};

const emptyForm: Omit<Recipe, "id"> = {
  title: "", description: "", video_url: "", thumbnail_url: "",
  category: "Geral", prep_time: "", published: false,
};

const AdminReceitas = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);

  const { data: recipes = [] } = useQuery({
    queryKey: ["admin_recipes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("recipes").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Recipe[];
    },
  });

  const save = async () => {
    if (!form.title) return;
    if (editId) {
      await supabase.from("recipes").update(form).eq("id", editId);
    } else {
      await supabase.from("recipes").insert(form);
    }
    toast({ title: editId ? "Atualizado!" : "Cadastrado!" });
    setOpen(false); setForm(emptyForm); setEditId(null);
    qc.invalidateQueries({ queryKey: ["admin_recipes"] });
  };

  const remove = async (id: string) => {
    await supabase.from("recipes").delete().eq("id", id);
    toast({ title: "Removido!" });
    qc.invalidateQueries({ queryKey: ["admin_recipes"] });
  };

  const edit = (r: Recipe) => {
    setForm({ title: r.title, description: r.description, video_url: r.video_url, thumbnail_url: r.thumbnail_url, category: r.category, prep_time: r.prep_time, published: r.published });
    setEditId(r.id); setOpen(true);
  };

  const togglePublish = async (r: Recipe) => {
    await supabase.from("recipes").update({ published: !r.published }).eq("id", r.id);
    qc.invalidateQueries({ queryKey: ["admin_recipes"] });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Receitas ({recipes.length})</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setForm(emptyForm); setEditId(null); } }}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground"><Plus className="mr-2 h-4 w-4" /> Nova</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editId ? "Editar" : "Nova"} Receita</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Título</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div><Label>Descrição</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div><Label>URL do Vídeo</Label><Input value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} /></div>
              <div><Label>URL da Thumbnail</Label><Input value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} /></div>
              <div><Label>Categoria</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Tempo de preparo</Label><Input value={form.prep_time} onChange={(e) => setForm({ ...form, prep_time: e.target.value })} placeholder="15 min" /></div>
              <div className="flex items-center gap-2">
                <Switch checked={form.published} onCheckedChange={(c) => setForm({ ...form, published: c })} />
                <Label>Publicado</Label>
              </div>
              <Button onClick={save} className="w-full gradient-primary text-primary-foreground">Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {recipes.map((r) => (
        <Card key={r.id}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{r.title}</h3>
                <span className={`rounded-full px-2 py-0.5 text-xs ${r.published ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                  {r.published ? "Publicado" : "Rascunho"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{r.category} • {r.prep_time}</p>
            </div>
            <div className="flex gap-2">
              <Switch checked={r.published} onCheckedChange={() => togglePublish(r)} />
              <Button variant="ghost" size="icon" onClick={() => edit(r)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminReceitas;
