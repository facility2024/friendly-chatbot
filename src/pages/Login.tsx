import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Apple, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "", password: "" });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              name: form.name,
              whatsapp: form.whatsapp,
            },
          },
        });
        if (error) throw error;
        toast({ title: "Conta criada!", description: "Verifique seu e-mail para confirmar." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gradient-primary-vertical px-4 py-8">
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
          <Apple className="h-10 w-10 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-primary-foreground">Nutrivision</h1>
      </div>

      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="pb-2 pt-6 text-center">
          <h2 className="text-2xl font-bold text-foreground">
            {isSignup ? "Criar conta" : "Entrar"}
          </h2>
          <p className="text-base text-muted-foreground">
            {isSignup ? "Preencha seus dados para começar" : "Acesse sua conta"}
          </p>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base">Nome completo</Label>
                  <Input
                    id="name"
                    placeholder="Seu nome completo"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="h-14 text-lg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp" className="text-base">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    placeholder="(00) 00000-0000"
                    value={form.whatsapp}
                    onChange={(e) => handleChange("whatsapp", e.target.value)}
                    className="h-14 text-lg"
                    required
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="h-14 text-lg"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-base">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="h-14 text-lg"
                required
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-14 w-full gradient-primary text-lg font-semibold text-primary-foreground shadow-lg"
            >
              {loading ? "Aguarde..." : isSignup ? "Criar conta" : "Entrar"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="text-base font-medium text-primary underline-offset-4 hover:underline"
              style={{ color: "hsl(145, 63%, 42%)" }}
            >
              {isSignup ? "Já tem conta? Entrar" : "Não tem conta? Criar agora"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
