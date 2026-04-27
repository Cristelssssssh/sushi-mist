import React, { useEffect, useMemo, useRef } from "react";

/**
 * KyotoRain — animated atmospheric overlay:
 *  - Soft rain streaks (canvas)
 *  - Floating lantern glows (DOM)
 *  - Subtle vignette
 * Pointer-events: none, fixed, behind content.
 */
const KyotoRain = ({ density = 110 }) => {
  const canvasRef = useRef(null);
  const animRef = useRef(0);

  const lanterns = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        id: i,
        left: 6 + i * 16 + Math.random() * 6,
        top: 8 + Math.random() * 70,
        delay: Math.random() * 6,
        size: 12 + Math.random() * 10,
      })),
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let drops = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drops = Array.from({ length: density }).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        len: 8 + Math.random() * 14,
        speed: 2 + Math.random() * 3,
        op: 0.15 + Math.random() * 0.35,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 1;
      drops.forEach((d) => {
        ctx.strokeStyle = `rgba(190, 210, 230, ${d.op})`;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 1, d.y + d.len);
        ctx.stroke();
        d.y += d.speed;
        d.x -= 0.4;
        if (d.y > canvas.height) {
          d.y = -10;
          d.x = Math.random() * canvas.width + 20;
        }
      });
      animRef.current = window.requestAnimationFrame(tick);
    };
    animRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [density]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      data-testid="kyoto-rain"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {lanterns.map((l) => (
        <div
          key={l.id}
          className="absolute rounded-full"
          style={{
            left: `${l.left}%`,
            top: `${l.top}%`,
            width: l.size,
            height: l.size,
            background:
              "radial-gradient(circle, rgba(255,170,90,0.55) 0%, rgba(230,92,0,0.18) 45%, rgba(0,0,0,0) 70%)",
            filter: "blur(4px)",
            animation: `lanternSway 7s ease-in-out ${l.delay}s infinite alternate`,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,28,44,0.0)_0%,rgba(8,10,14,0.55)_70%,rgba(8,10,14,0.85)_100%)]" />
    </div>
  );
};

export default KyotoRain;
