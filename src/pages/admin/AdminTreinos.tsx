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

const categories = ["Alongamento", "Mobilidade", "Caminhada", "Exercícios leves", "Terceira idade", "Postura", "Bem-estar"];

type Video = {
  id: string; title: string; description: string; video_url: string;
  thumbnail_url: string; category: string; duration: string; published: boolean;
};

const emptyForm: Omit<Video, "id"> = {
  title: "", description: "", video_url: "", thumbnail_url: "",
  category: "Alongamento", duration: "", published: false,
};

const AdminTreinos = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);

  const { data: videos = [] } = useQuery({
    queryKey: ["admin_training_videos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("training_videos").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Video[];
    },
  });

  const save = async () => {
    if (!form.title) return;
    if (editId) {
      await supabase.from("training_videos").update(form).eq("id", editId);
    } else {
      await supabase.from("training_videos").insert(form);
    }
    toast({ title: editId ? "Atualizado!" : "Cadastrado!" });
    setOpen(false);
    setForm(emptyForm);
    setEditId(null);
    qc.invalidateQueries({ queryKey: ["admin_training_videos"] });
  };

  const remove = async (id: string) => {
    await supabase.from("training_videos").delete().eq("id", id);
    toast({ title: "Removido!" });
    qc.invalidateQueries({ queryKey: ["admin_training_videos"] });
  };

  const edit = (v: Video) => {
    setForm({ title: v.title, description: v.description, video_url: v.video_url, thumbnail_url: v.thumbnail_url, category: v.category, duration: v.duration, published: v.published });
    setEditId(v.id);
    setOpen(true);
  };

  const togglePublish = async (v: Video) => {
    await supabase.from("training_videos").update({ published: !v.published }).eq("id", v.id);
    qc.invalidateQueries({ queryKey: ["admin_training_videos"] });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Treinos ({videos.length})</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setForm(emptyForm); setEditId(null); } }}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground"><Plus className="mr-2 h-4 w-4" /> Novo</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editId ? "Editar" : "Novo"} Treino</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Título</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div><Label>Descrição</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div><Label>URL do Vídeo</Label><Input value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} placeholder="https://youtube.com/watch?v=..." /></div>
              <div><Label>URL da Thumbnail</Label><Input value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} /></div>
              <div><Label>Categoria</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Duração</Label><Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="10 min" /></div>
              <div className="flex items-center gap-2">
                <Switch checked={form.published} onCheckedChange={(c) => setForm({ ...form, published: c })} />
                <Label>Publicado</Label>
              </div>
              <Button onClick={save} className="w-full gradient-primary text-primary-foreground">Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {videos.map((v) => (
        <Card key={v.id}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{v.title}</h3>
                <span className={`rounded-full px-2 py-0.5 text-xs ${v.published ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                  {v.published ? "Publicado" : "Rascunho"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{v.category} • {v.duration}</p>
            </div>
            <div className="flex gap-2">
              <Switch checked={v.published} onCheckedChange={() => togglePublish(v)} />
              <Button variant="ghost" size="icon" onClick={() => edit(v)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => remove(v.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminTreinos;
