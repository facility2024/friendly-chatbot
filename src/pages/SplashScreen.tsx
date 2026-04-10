import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "@/assets/nutrivision-icon.jpeg";

const SplashScreen = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"logo" | "done">("logo");

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("done");
      setTimeout(() => navigate("/login"), 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6">
      <img
        src={logoImg}
        alt="Nutrivision"
        className="w-72 max-w-[80vw] object-contain"
        style={{
          animation: "zoomIn 4s ease-out forwards",
          opacity: phase === "done" ? 0 : 1,
          transition: "opacity 0.3s",
        }}
      />
      <style>{`
        @keyframes zoomIn {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
