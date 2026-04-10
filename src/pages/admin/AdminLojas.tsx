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

type StoreItem = {
  id: string; name: string; photo_url: string; address: string;
  phone: string; whatsapp: string; maps_link: string; published: boolean;
};

const emptyForm: Omit<StoreItem, "id"> = {
  name: "", photo_url: "", address: "", phone: "", whatsapp: "", maps_link: "", published: false,
};

const AdminLojas = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);

  const { data: stores = [] } = useQuery({
    queryKey: ["admin_stores"],
    queryFn: async () => {
      const { data, error } = await supabase.from("stores").select("*").order("name");
      if (error) throw error;
      return data as StoreItem[];
    },
  });

  const save = async () => {
    if (!form.name) return;
    if (editId) {
      await supabase.from("stores").update(form).eq("id", editId);
    } else {
      await supabase.from("stores").insert(form);
    }
    toast({ title: editId ? "Atualizado!" : "Cadastrado!" });
    setOpen(false); setForm(emptyForm); setEditId(null);
    qc.invalidateQueries({ queryKey: ["admin_stores"] });
  };

  const remove = async (id: string) => {
    await supabase.from("stores").delete().eq("id", id);
    toast({ title: "Removido!" });
    qc.invalidateQueries({ queryKey: ["admin_stores"] });
  };

  const edit = (s: StoreItem) => {
    setForm({ name: s.name, photo_url: s.photo_url, address: s.address, phone: s.phone, whatsapp: s.whatsapp, maps_link: s.maps_link, published: s.published });
    setEditId(s.id); setOpen(true);
  };

  const togglePublish = async (s: StoreItem) => {
    await supabase.from("stores").update({ published: !s.published }).eq("id", s.id);
    qc.invalidateQueries({ queryKey: ["admin_stores"] });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Lojas ({stores.length})</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setForm(emptyForm); setEditId(null); } }}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground"><Plus className="mr-2 h-4 w-4" /> Nova</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editId ? "Editar" : "Nova"} Loja</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Nome</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>URL da Foto</Label><Input value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} /></div>
              <div><Label>Endereço</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
              <div><Label>Telefone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div><Label>WhatsApp</Label><Input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="5511999999999" /></div>
              <div><Label>Link Google Maps</Label><Input value={form.maps_link} onChange={(e) => setForm({ ...form, maps_link: e.target.value })} /></div>
              <div className="flex items-center gap-2">
                <Switch checked={form.published} onCheckedChange={(c) => setForm({ ...form, published: c })} />
                <Label>Publicado</Label>
              </div>
              <Button onClick={save} className="w-full gradient-primary text-primary-foreground">Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {stores.map((s) => (
        <Card key={s.id}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{s.name}</h3>
                <span className={`rounded-full px-2 py-0.5 text-xs ${s.published ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                  {s.published ? "Publicado" : "Rascunho"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{s.address}</p>
            </div>
            <div className="flex gap-2">
              <Switch checked={s.published} onCheckedChange={() => togglePublish(s)} />
              <Button variant="ghost" size="icon" onClick={() => edit(s)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => remove(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminLojas;
