import { useEffect, useRef } from 'react';

type Particle = {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
    fadeSpeed: number;
};

export function AmbientParticles({ count = 40 }: { count?: number }) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
        let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
            height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        const particles: Particle[] = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2 + 0.8,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: -Math.random() * 0.4 - 0.1, // Float gently upwards
            opacity: Math.random() * 0.7 + 0.2,
            fadeSpeed: (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
        }));

        function render() {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);

            particles.forEach((p) => {
                p.x += p.speedX;
                p.y += p.speedY;
                p.opacity += p.fadeSpeed;

                if (p.opacity > 0.8) {
                    p.opacity = 0.8;
                    p.fadeSpeed = -Math.abs(p.fadeSpeed);
                } else if (p.opacity < 0.1) {
                    p.opacity = 0.1;
                    p.fadeSpeed = Math.abs(p.fadeSpeed);
                }

                // Wrap around edges
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;

                ctx.save();
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(245, 158, 11, ${p.opacity})`;
                ctx.shadowBlur = p.size * 3;
                ctx.shadowColor = 'rgba(251, 191, 36, 0.6)';
                ctx.fill();
                ctx.restore();
            });

            animationFrameId = requestAnimationFrame(render);
        }

        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [count]);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 z-0 size-full opacity-70"
            aria-hidden="true"
        />
    );
}
