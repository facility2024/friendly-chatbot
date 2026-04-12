import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "@/assets/nutrivision-icon.jpeg";

const PARTICLE_COUNT = 60;

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

const SplashScreen = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"logo" | "done">("logo");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Init particles
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: (Math.random() - 0.5) * 0.8,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      // Draw particles
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
      }

      // Draw lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Update positions
      for (const p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Navigate timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("done");
      setTimeout(() => navigate("/login"), 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Green gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(145,72%,35%)] via-[hsl(150,65%,40%)] to-[hsl(160,65%,45%)]" />

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-[1]" />

      {/* Content */}
      <div
        className="relative z-[2] flex flex-col items-center gap-6"
        style={{
          opacity: phase === "done" ? 0 : 1,
          transition: "opacity 0.3s",
        }}
      >
        <img
          src={logoImg}
          alt="Nutrivision"
          className="w-32 h-32 rounded-3xl object-contain shadow-2xl"
          style={{
            animation: "zoomIn 4s ease-out forwards",
          }}
        />
        <h1
          className="text-4xl font-bold tracking-wide text-primary-foreground drop-shadow-lg"
          style={{
            animation: "fadeUp 1.5s ease-out 0.5s both",
          }}
        >
          Nutrivision
        </h1>
      </div>

      <style>{`
        @keyframes zoomIn {
          0% { transform: scale(0.3); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
