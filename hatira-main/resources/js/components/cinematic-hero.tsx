import React, { useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { ArrowRight, BookOpen, Camera, Heart, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { heroImages, preloadHeroImages } from '@/lib/hero-images';
import { Button } from '@/components/ui/button';
import { dashboard, login, register } from '@/routes';

gsap.registerPlugin(ScrollTrigger);

interface CinematicHeroProps {
    isAuthenticated: boolean;
}

export function CinematicHero({ isAuthenticated }: CinematicHeroProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const pinRef = useRef<HTMLDivElement>(null);
    const bgLayersRef = useRef<(HTMLDivElement | null)[]>([]);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const narrativeRef = useRef<HTMLDivElement>(null);
    const floatingCard1Ref = useRef<HTMLDivElement>(null);
    const floatingCard2Ref = useRef<HTMLDivElement>(null);
    const floatingCard3Ref = useRef<HTMLDivElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLSpanElement>(null);

    const [isLoaded, setIsLoaded] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Filter key narrative images from the discovered collection
    // If there are fewer images, we safely fallback, and if more, we sample key steps
    const imagesToUse = heroImages.length > 0 ? heroImages : [
        '/image/hero/resim/hero_01.jpg',
        '/image/hero/resim/hero_02.jpg',
        '/image/hero/resim/hero_03.jpg',
    ];

    useEffect(() => {
        // Preload all hero images for zero flicker
        preloadHeroImages(imagesToUse).then(() => {
            setIsLoaded(true);
        });
    }, [imagesToUse]);

    useEffect(() => {
        if (!containerRef.current || !pinRef.current) return;

        // Initialize Lenis Smooth Scroll
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
        });

        lenis.on('scroll', ScrollTrigger.update);
        const tickerCallback = (time: number) => {
            lenis.raf(time * 1000);
        };
        gsap.ticker.add(tickerCallback);
        gsap.ticker.lagSmoothing(0);

        const ctx = gsap.context(() => {
            const numImages = imagesToUse.length;
            const totalSteps = Math.min(numImages, 6); // Curate 5-6 major scrollytelling visual acts

            // Create Master ScrollTrigger Timeline with scrub
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    pin: pinRef.current,
                    scrub: 1.2,
                    anticipatePin: 1,
                    onUpdate: (self) => {
                        const progress = self.progress;
                        const idx = Math.min(
                            Math.floor(progress * imagesToUse.length),
                            imagesToUse.length - 1
                        );
                        setCurrentImageIndex(idx);
                        if (counterRef.current) {
                            counterRef.current.innerText = String(idx + 1).padStart(2, '0');
                        }
                    },
                },
            });

            // Parallax on Floating Cards
            if (floatingCard1Ref.current) {
                tl.to(
                    floatingCard1Ref.current,
                    {
                        y: -320,
                        rotationZ: 6,
                        rotationY: -12,
                        scale: 1.08,
                        ease: 'none',
                    },
                    0
                );
            }

            if (floatingCard2Ref.current) {
                tl.to(
                    floatingCard2Ref.current,
                    {
                        y: -480,
                        rotationZ: -8,
                        rotationY: 15,
                        scale: 1.12,
                        ease: 'none',
                    },
                    0
                );
            }

            if (floatingCard3Ref.current) {
                tl.to(
                    floatingCard3Ref.current,
                    {
                        y: -260,
                        rotationZ: 4,
                        scale: 1.05,
                        ease: 'none',
                    },
                    0
                );
            }

            // Crossfades and 3D tilts for each background slide layer
            bgLayersRef.current.forEach((layer, i) => {
                if (!layer) return;

                const stepStart = i / totalSteps;
                const stepEnd = (i + 1) / totalSteps;

                // Scale, 3D rotation, and blur transitions for each slide
                tl.fromTo(
                    layer,
                    {
                        opacity: i === 0 ? 1 : 0,
                        scale: 1.05,
                        rotationZ: i % 2 === 0 ? -1.5 : 1.5,
                        filter: i === 0 ? 'blur(0px)' : 'blur(8px)',
                    },
                    {
                        opacity: 1,
                        scale: 1.15,
                        rotationZ: i % 2 === 0 ? 2 : -2,
                        filter: 'blur(0px)',
                        duration: 1,
                        ease: 'power1.inOut',
                    },
                    stepStart
                );

                if (i < totalSteps - 1) {
                    tl.to(
                        layer,
                        {
                            opacity: 0,
                            scale: 1.2,
                            filter: 'blur(6px)',
                            duration: 0.8,
                            ease: 'power1.inOut',
                        },
                        stepEnd
                    );
                }
            });

            // Headline dynamic narrative text morph
            if (narrativeRef.current) {
                const phrases = narrativeRef.current.querySelectorAll('.narrative-phrase');
                phrases.forEach((phrase, idx) => {
                    const pStart = idx / phrases.length;
                    const pEnd = (idx + 1) / phrases.length;

                    tl.fromTo(
                        phrase,
                        { opacity: idx === 0 ? 1 : 0, y: idx === 0 ? 0 : 30 },
                        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
                        pStart
                    );

                    if (idx < phrases.length - 1) {
                        tl.to(
                            phrase,
                            { opacity: 0, y: -30, duration: 0.5, ease: 'power2.in' },
                            pEnd - 0.1
                        );
                    }
                });
            }
        }, containerRef);

        return () => {
            ctx.revert();
            lenis.destroy();
            gsap.ticker.remove(tickerCallback);
        };
    }, [imagesToUse]);

    return (
        <section
            ref={containerRef}
            className="relative h-[450vh] w-full bg-background text-foreground"
        >
            {/* Sticky Viewport Stage */}
            <div
                ref={pinRef}
                className="relative flex h-screen w-full items-center justify-center overflow-hidden"
            >
                {/* 1. LAYER: Multi-Image Canvas Slides with Crossfade, Parallax & Blur */}
                <div className="pointer-events-none absolute inset-0 size-full overflow-hidden bg-black">
                    {imagesToUse.slice(0, 6).map((imgSrc, idx) => (
                        <div
                            key={imgSrc}
                            ref={(el) => {
                                bgLayersRef.current[idx] = el;
                            }}
                            className="absolute inset-0 size-full overflow-hidden will-change-transform"
                            style={{ opacity: idx === 0 ? 1 : 0 }}
                        >
                            <img
                                src={imgSrc}
                                alt={`Hatıra Anı ${idx + 1}`}
                                className="size-full object-cover object-center transform-gpu select-none"
                                loading={idx === 0 ? 'eager' : 'lazy'}
                            />
                        </div>
                    ))}
                </div>

                {/* 2. LAYER: Atmospheric Gradient Vignette */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-black/40 to-black/70 mix-blend-multiply opacity-90" />
                <div className="pointer-events-none absolute inset-0 bg-radial from-amber-500/10 via-transparent to-background/90" />

                {/* 3. LAYER: Floating 3D Parallax Keepsake Polaroid Layers */}
                {imagesToUse.length >= 3 && (
                    <div className="pointer-events-none absolute inset-0 z-10 mx-auto hidden size-full max-w-7xl lg:block">
                        {/* Polaroid Left Top */}
                        <div
                            ref={floatingCard1Ref}
                            className="absolute top-[20%] left-8 w-64 transform-gpu rounded-2xl border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur-xl transition-shadow dark:border-amber-500/30 dark:bg-black/40"
                        >
                            <div className="aspect-4/3 w-full overflow-hidden rounded-xl bg-black/50">
                                <img
                                    src={imagesToUse[1] || imagesToUse[0]}
                                    alt="Fotoğraf 1"
                                    className="size-full object-cover"
                                />
                            </div>
                            <div className="mt-2.5 flex items-center justify-between text-xs text-white/90">
                                <span className="font-serif-title font-semibold italic">“O ilk günkü heyecan...”</span>
                                <span className="text-[10px] text-amber-400 font-bold">1. GÜN</span>
                            </div>
                        </div>

                        {/* Polaroid Right Center */}
                        <div
                            ref={floatingCard2Ref}
                            className="absolute top-[35%] right-8 w-72 transform-gpu rounded-2xl border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur-xl dark:border-amber-500/30 dark:bg-black/40"
                        >
                            <div className="aspect-4/3 w-full overflow-hidden rounded-xl bg-black/50">
                                <img
                                    src={imagesToUse[2] || imagesToUse[0]}
                                    alt="Fotoğraf 2"
                                    className="size-full object-cover"
                                />
                            </div>
                            <div className="mt-2.5 flex items-center justify-between text-xs text-white/90">
                                <span className="font-serif-title font-semibold italic">“Birlikte paylaşılan her kahkaha”</span>
                                <Heart className="size-3 text-rose-400 fill-current" />
                            </div>
                        </div>

                        {/* Polaroid Bottom Left */}
                        <div
                            ref={floatingCard3Ref}
                            className="absolute bottom-[18%] left-[18%] w-56 transform-gpu rounded-2xl border border-white/20 bg-white/10 p-2.5 shadow-2xl backdrop-blur-xl dark:border-amber-500/30 dark:bg-black/40"
                        >
                            <div className="aspect-4/3 w-full overflow-hidden rounded-lg bg-black/50">
                                <img
                                    src={imagesToUse[3] || imagesToUse[0]}
                                    alt="Fotoğraf 3"
                                    className="size-full object-cover"
                                />
                            </div>
                            <p className="mt-2 text-center text-[11px] font-medium text-amber-300">
                                Mühürlü Hatıra Albümü
                            </p>
                        </div>
                    </div>
                )}

                {/* 4. LAYER: Foreground Typography, Dynamic Narrative & CTA */}
                <div className="relative z-20 mx-auto flex max-w-4xl flex-col items-center px-6 text-center text-white">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-black/50 px-4 py-1.5 text-xs font-semibold text-amber-300 backdrop-blur-xl shadow-lg">
                        <Sparkles className="size-3.5 text-amber-400" />
                        <span>Kolektif Zaman Kapsülü & Dijital Yıllık</span>
                    </div>

                    {/* Main Monumental Serif Title */}
                    <h1
                        ref={titleRef}
                        className="font-serif-title mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
                    >
                        Zaman geçer, <br />
                        <span className="text-gradient-gold italic">hatıralar sonsuza dek</span> parlar.
                    </h1>

                    {/* Scroll-Driven Dynamic Narrative Changing as User Scrubs */}
                    <div
                        ref={narrativeRef}
                        className="relative mt-6 h-14 w-full max-w-xl overflow-hidden"
                    >
                        <p className="narrative-phrase absolute inset-0 flex items-center justify-center text-base sm:text-lg text-zinc-200 leading-relaxed drop-shadow-md">
                            Birlikte geçirilen unutulmaz anları ve dostlukları yaşayan bir albümde toplayın.
                        </p>
                        <p className="narrative-phrase absolute inset-0 flex items-center justify-center text-base sm:text-lg text-amber-200 leading-relaxed drop-shadow-md opacity-0">
                            Her gün eklenen fotoğraflarla ortak hafızanız adım adım canlansın.
                        </p>
                        <p className="narrative-phrase absolute inset-0 flex items-center justify-center text-base sm:text-lg text-zinc-200 leading-relaxed drop-shadow-md opacity-0">
                            Dostlarınızın bıraktığı samimi yıllık izlenimleri ömür boyu saklansın.
                        </p>
                        <p className="narrative-phrase absolute inset-0 flex items-center justify-center text-base sm:text-lg text-amber-300 font-medium leading-relaxed drop-shadow-md opacity-0">
                            Tek tıkla baskıya hazır, kişiselleştirilmiş hatıra kitabınızı oluşturun.
                        </p>
                    </div>

                    {/* CTA Actions */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                        <Button
                            asChild
                            size="lg"
                            className="group h-13 rounded-full bg-amber-500 px-8 text-base font-bold text-black shadow-2xl shadow-amber-500/30 transition-all hover:scale-105 hover:bg-amber-400"
                        >
                            <Link href={isAuthenticated ? dashboard() : register()}>
                                <span>{isAuthenticated ? 'Albümlerime Git' : 'Zaman Kapsülünü Başlat'}</span>
                                <ArrowRight className="size-5 ml-2 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>

                        {!isAuthenticated && (
                            <Button
                                variant="outline"
                                size="lg"
                                asChild
                                className="h-13 rounded-full border-white/30 bg-black/40 px-8 text-base text-white backdrop-blur-xl transition-all hover:bg-white/10 hover:border-amber-400"
                            >
                                <Link href={login()}>Giriş Yap</Link>
                            </Button>
                        )}
                    </div>
                </div>

                {/* 5. LAYER: Bottom Live Indicator & Photo Counter */}
                <div className="absolute bottom-8 left-0 right-0 z-30 mx-auto flex max-w-6xl items-center justify-between px-8 text-xs font-medium text-white/80">
                    <div className="flex items-center gap-2">
                        <Camera className="size-4 text-amber-400" />
                        <span>
                            Arşiv Görseli:{' '}
                            <span ref={counterRef} className="font-bold text-amber-400">
                                01
                            </span>{' '}
                            / {String(imagesToUse.length).padStart(2, '0')}
                        </span>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 text-zinc-300">
                        <span className="inline-block size-1.5 rounded-full bg-amber-400 animate-ping" />
                        <span>Aşağı kaydırarak zaman kapsülünü keşfedin</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
