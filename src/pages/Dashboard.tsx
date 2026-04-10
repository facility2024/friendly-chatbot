import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Calculator,
  Percent,
  Camera,
  Dumbbell,
  Footprints,
  Droplets,
  UtensilsCrossed,
  Store,
  FileText,
  LogOut,
  Apple,
  Shield,
} from "lucide-react";

const modules = [
  { icon: Calculator, label: "Calcular IMC", path: "/imc", color: "from-emerald-500 to-green-600" },
  { icon: Percent, label: "Gordura Corporal", path: "/gordura", color: "from-teal-500 to-emerald-600" },
  { icon: Camera, label: "Leitura de Alimento", path: "/camera", color: "from-green-500 to-teal-600" },
  { icon: Dumbbell, label: "Treinos", path: "/treinos", color: "from-lime-500 to-green-600" },
  { icon: Footprints, label: "Medidor de Caminhada", path: "/caminhada", color: "from-emerald-400 to-teal-500" },
  { icon: Droplets, label: "Meta de Água", path: "/agua", color: "from-cyan-500 to-teal-600" },
  { icon: UtensilsCrossed, label: "Receitas Light", path: "/receitas", color: "from-green-400 to-emerald-500" },
  { icon: Store, label: "Lojas Naturais", path: "/lojas", color: "from-teal-400 to-green-500" },
  { icon: FileText, label: "Dicas em PDF", path: "/dicas", color: "from-emerald-500 to-cyan-600" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate("/login");
        return;
      }
      setUserName(data.user.user_metadata?.name || "Usuário");
      
      // Check admin role
      const { data: hasAdmin } = await supabase.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
      if (hasAdmin) setIsAdmin(true);
    };
    getUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="gradient-primary px-5 pb-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              <Apple className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-primary-foreground">Nutrivision</span>
          </div>
          <button onClick={handleLogout} className="rounded-xl bg-white/20 p-2.5">
            <LogOut className="h-5 w-5 text-primary-foreground" />
          </button>
        </div>
        <div className="mt-6">
          <p className="text-base text-primary-foreground/80">Olá,</p>
          <h1 className="text-2xl font-bold text-primary-foreground">{userName} 👋</h1>
          <p className="mt-1 text-base text-primary-foreground/70">Como posso te ajudar hoje?</p>
        </div>
      </div>

      {/* Module grid */}
      <div className="mx-auto max-w-lg px-5">
        <div className="-mt-4 grid grid-cols-3 gap-4">
          {modules.map((mod) => (
            <button
              key={mod.path}
              onClick={() => navigate(mod.path)}
              className="flex flex-col items-center gap-3 rounded-2xl bg-card p-4 shadow-md transition-transform active:scale-95"
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${mod.color}`}>
                <mod.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <span className="text-center text-sm font-medium leading-tight text-card-foreground">
                {mod.label}
              </span>
            </button>
          ))}
          {isAdmin && (
            <button
              onClick={() => navigate("/admin")}
              className="flex flex-col items-center gap-3 rounded-2xl bg-card p-4 shadow-md transition-transform active:scale-95 ring-2 ring-primary"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600">
                <Shield className="h-7 w-7 text-primary-foreground" />
              </div>
              <span className="text-center text-sm font-medium leading-tight text-card-foreground">
                Painel Admin
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
