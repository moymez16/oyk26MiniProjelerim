import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type HTMLMotionProps } from 'motion/react';

interface TiltCardProps extends HTMLMotionProps<'div'> {
    children: React.ReactNode;
    className?: string;
    glowColor?: string;
}

export function TiltCard({
    children,
    className = '',
    glowColor = 'rgba(245, 158, 11, 0.15)',
    ...props
}: TiltCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 25 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 25 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7deg', '-7deg']);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7deg', '7deg']);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
            }}
            className={`relative rounded-3xl transition-all duration-300 ${className}`}
            {...props}
        >
            {/* Dynamic Spotlight Glow */}
            {isHovered && (
                <div
                    className="pointer-events-none absolute -inset-px rounded-3xl opacity-100 transition-opacity duration-500"
                    style={{
                        background: `radial-gradient(400px circle at calc(${x.get() + 0.5} * 100%) calc(${y.get() + 0.5} * 100%), ${glowColor}, transparent 80%)`,
                    }}
                />
            )}
            <div style={{ transform: 'translateZ(20px)' }} className="relative z-10 size-full">
                {children}
            </div>
        </motion.div>
    );
}
