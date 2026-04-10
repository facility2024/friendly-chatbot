import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Apple } from "lucide-react";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gradient-primary-vertical px-6">
      <div className="animate-fade-in flex flex-col items-center gap-6 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-sm">
          <Apple className="h-14 w-14 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-5xl font-bold tracking-tight text-primary-foreground">
            Nutrivision
          </h1>
          <p className="mt-3 text-lg text-primary-foreground/80">
            Sua saúde em suas mãos
          </p>
        </div>
        <div className="mt-8 flex gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-primary-foreground/60" />
          <div className="h-2 w-2 animate-pulse rounded-full bg-primary-foreground/60 [animation-delay:0.2s]" />
          <div className="h-2 w-2 animate-pulse rounded-full bg-primary-foreground/60 [animation-delay:0.4s]" />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
