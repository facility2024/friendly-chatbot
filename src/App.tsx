import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SplashScreen from "./pages/SplashScreen";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import IMC from "./pages/IMC";
import GorduraCorporal from "./pages/GorduraCorporal";
import CameraAlimento from "./pages/CameraAlimento";
import Treinos from "./pages/Treinos";
import Caminhada from "./pages/Caminhada";
import MetaAgua from "./pages/MetaAgua";
import Receitas from "./pages/Receitas";
import Lojas from "./pages/Lojas";
import Dicas from "./pages/Dicas";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTreinos from "./pages/admin/AdminTreinos";
import AdminReceitas from "./pages/admin/AdminReceitas";
import AdminLojas from "./pages/admin/AdminLojas";
import AdminDicas from "./pages/admin/AdminDicas";
import AdminUsuarios from "./pages/admin/AdminUsuarios";
import AdminIA from "./pages/admin/AdminIA";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/imc" element={<IMC />} />
          <Route path="/gordura" element={<GorduraCorporal />} />
          <Route path="/camera" element={<CameraAlimento />} />
          <Route path="/treinos" element={<Treinos />} />
          <Route path="/caminhada" element={<Caminhada />} />
          <Route path="/agua" element={<MetaAgua />} />
          <Route path="/receitas" element={<Receitas />} />
          <Route path="/lojas" element={<Lojas />} />
          <Route path="/dicas" element={<Dicas />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="treinos" element={<AdminTreinos />} />
            <Route path="receitas" element={<AdminReceitas />} />
            <Route path="lojas" element={<AdminLojas />} />
            <Route path="dicas" element={<AdminDicas />} />
            <Route path="usuarios" element={<AdminUsuarios />} />
            <Route path="ia" element={<AdminIA />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
