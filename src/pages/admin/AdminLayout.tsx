import { useState, useEffect } from "react";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, Dumbbell, UtensilsCrossed, Store, FileText, Users, LogOut, Menu, X, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Treinos", path: "/admin/treinos", icon: Dumbbell },
  { label: "Receitas", path: "/admin/receitas", icon: UtensilsCrossed },
  { label: "Lojas", path: "/admin/lojas", icon: Store },
  { label: "Dicas PDF", path: "/admin/dicas", icon: FileText },
  { label: "Usuários", path: "/admin/usuarios", icon: Users },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) { navigate("/login"); return; }
      const { data } = await supabase.rpc("has_role", { _user_id: user.user.id, _role: "admin" });
      if (!data) { navigate("/dashboard"); return; }
      setLoading(false);
    };
    checkAdmin();
  }, [navigate]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-card shadow-xl transition-transform lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center gap-3 border-b px-6">
          <Apple className="h-6 w-6" style={{ color: "hsl(145, 63%, 42%)" }} />
          <span className="text-lg font-bold text-foreground">Admin</span>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="space-y-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={async () => { await supabase.auth.signOut(); navigate("/login"); }}
          >
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1">
        <header className="flex h-16 items-center border-b px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="ml-4 text-lg font-semibold text-foreground lg:ml-0">
            {navItems.find((i) => i.path === location.pathname)?.label || "Admin"}
          </h1>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
