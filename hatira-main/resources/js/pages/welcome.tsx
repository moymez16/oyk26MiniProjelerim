import React, { useRef, useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    motion,
    useScroll,
    useSpring,
    AnimatePresence,
} from 'motion/react';
import {
    ArrowRight,
    BookHeart,
    BookOpen,
    CheckCircle2,
    FolderHeart,
    Lock,
    MessageSquareQuote,
    Printer,
    Sparkles,
} from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { AmbientParticles } from '@/components/ambient-particles';
import { CinematicHero } from '@/components/cinematic-hero';
import { NoiseOverlay } from '@/components/noise-overlay';
import { TiltCard } from '@/components/tilt-card';
import { Button } from '@/components/ui/button';
import { useLenis } from '@/hooks/use-lenis';
import { dashboard, login, register } from '@/routes';

export default function Welcome() {
    const { auth } = usePage().props;

    // Enable Lenis Smooth Momentum Scroll for the landing page
    useLenis(true);

    // Mouse Spotlight Position
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Global Scroll Progress Bar
    const { scrollYProgress } = useScroll();
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
    });

    // Interactive Yearbook Simulator Tab Index
    const [simulatorPage, setSimulatorPage] = useState(0);

    return (
        <>
            <Head title="Hatıra — Awwwards Seviyesinde Sinematik Anı Albümü" />

            <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground selection:bg-amber-500 selection:text-black">
                {/* 1. Film Noise Texture Overlay */}
                <NoiseOverlay opacity={0.035} />

                {/* 2. Global Ambient Glow Follower */}
                <div
                    className="pointer-events-none fixed inset-0 z-30 opacity-60 transition-opacity duration-300 dark:opacity-40"
                    style={{
                        background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(245, 158, 11, 0.08), transparent 80%)`,
                    }}
                />

                {/* 3. Ambient Golden Particle Nebula */}
                <AmbientParticles count={40} />

                {/* 4. Fixed Top Progress Bar */}
                <motion.div
                    style={{ scaleX: smoothProgress }}
                    className="fixed top-0 left-0 right-0 z-50 h-1 origin-left bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 shadow-[0_0_12px_rgba(245,158,11,0.6)]"
                />

                {/* 5. Navigation Bar */}
                <header className="absolute top-0 left-0 right-0 z-40 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <div className="relative flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/25 to-amber-700/10 p-2 shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/30">
                            <AppLogoIcon className="size-6 drop-shadow-[0_2px_6px_rgba(245,158,11,0.4)]" />
                        </div>
                        <span className="font-serif-title text-2xl font-bold tracking-tight text-white drop-shadow-md">
                            Hatıra
                        </span>
                    </div>

                    <nav className="flex items-center gap-3">
                        {auth.user ? (
                            <Button
                                asChild
                                className="group relative overflow-hidden rounded-full bg-amber-500 px-6 font-semibold text-black shadow-lg shadow-amber-500/25 transition-all hover:scale-105 hover:bg-amber-400"
                            >
                                <Link href={dashboard()}>
                                    <Sparkles className="size-4 mr-1.5 transition-transform group-hover:rotate-12" />
                                    Panele Git
                                </Link>
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    asChild
                                    className="rounded-full px-5 text-sm text-white transition-colors hover:bg-white/10 hover:text-amber-300"
                                >
                                    <Link href={login()}>Giriş yap</Link>
                                </Button>
                                <Button
                                    asChild
                                    className="group relative overflow-hidden rounded-full bg-amber-500 px-6 font-semibold text-black shadow-lg shadow-amber-500/25 transition-all hover:scale-105 hover:bg-amber-400"
                                >
                                    <Link href={register()}>
                                        Hesap Oluştur
                                        <ArrowRight className="size-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                            </>
                        )}
                    </nav>
                </header>

                {/* ========================================================================= */}
                {/* 6. CINEMATIC SCROLL-DRIVEN HERO WITH GSAP SCROLLTRIGGER (image/hero/resim/) */}
                {/* ========================================================================= */}
                <CinematicHero isAuthenticated={!!auth.user} />

                {/* ========================================================================= */}
                {/* 7. INTERACTIVE 3D BENTO GRID (Linear/Apple Caliber Feature Cards) */}
                {/* ========================================================================= */}
                <section className="relative z-20 mx-auto max-w-6xl px-6 py-28 lg:px-8">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-500">
                            <Sparkles className="size-3.5" />
                            <span>Özellikler & Mimari</span>
                        </div>
                        <h2 className="font-serif-title mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
                            Her Detayıyla Bir Başyapıt
                        </h2>
                        <p className="mx-auto mt-3 max-w-xl text-muted-foreground text-sm sm:text-base">
                            Sıradan bir sosyal medya akışı değil, ömür boyu kütüphanenizde duracak bir zaman kapsülü.
                        </p>
                    </div>

                    <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Bento Card 1 */}
                        <TiltCard className="glass-panel p-8 ring-1 ring-amber-500/20">
                            <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500">
                                <FolderHeart className="size-6" />
                            </div>
                            <h3 className="font-serif-title mt-6 text-xl font-bold">Kolektif Anı Günlüğü</h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                Etkinliğe katılan herkes fotoğraflar, anektodlar ve o günün ruhunu yansıtan yazılar bırakır.
                            </p>
                        </TiltCard>

                        {/* Bento Card 2 */}
                        <TiltCard className="glass-panel p-8 ring-1 ring-amber-500/20">
                            <div className="flex size-12 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-500">
                                <MessageSquareQuote className="size-6" />
                            </div>
                            <h3 className="font-serif-title mt-6 text-xl font-bold">Yıllık Notları & İzlenimler</h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                Arkadaşlarınıza özel hatıra cümleleri yazın. İster kendi adınızla, ister isimsiz olarak paylaşın.
                            </p>
                        </TiltCard>

                        {/* Bento Card 3 */}
                        <TiltCard className="glass-panel p-8 ring-1 ring-amber-500/20">
                            <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-500">
                                <Printer className="size-6" />
                            </div>
                            <h3 className="font-serif-title mt-6 text-xl font-bold">Baskıya Hazır PDF Kitabı</h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                Tek bir dokunuşla tüm albümü veya kişisel sayfanızı zarif bir hatıra kitabına dönüştürün.
                            </p>
                        </TiltCard>

                        {/* Bento Card 4 */}
                        <TiltCard className="glass-panel p-8 ring-1 ring-amber-500/20 sm:col-span-2 lg:col-span-2">
                            <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500">
                                <Lock className="size-6" />
                            </div>
                            <h3 className="font-serif-title mt-6 text-xl font-bold">Tamamen Özel & Kapalı Alan</h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                Yalnızca özel davetiye bağlantısına sahip katılımcılar albüme dahil olabilir. Moderasyon mekanizmaları ile samimi ortam daima korunur.
                            </p>
                        </TiltCard>

                        {/* Bento Card 5 */}
                        <TiltCard className="glass-panel p-8 ring-1 ring-amber-500/20">
                            <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-500">
                                <CheckCircle2 className="size-6" />
                            </div>
                            <h3 className="font-serif-title mt-6 text-xl font-bold">Sonsuz Kalıcılık</h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                Kilitlenen etkinlikler silinmez; yıllar sonra dahi o günün heyecanıyla yeniden okunur.
                            </p>
                        </TiltCard>
                    </div>
                </section>

                {/* ========================================================================= */}
                {/* 8. INTERACTIVE YEARBOOK SIMULATOR PREVIEW */}
                {/* ========================================================================= */}
                <section className="relative z-20 mx-auto max-w-5xl px-6 py-20 text-center lg:px-8">
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-500">
                        <BookOpen className="size-3.5" />
                        <span>İnteraktif Deneyim</span>
                    </div>
                    <h2 className="font-serif-title mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                        Yıllık Sayfalarını Çevirin
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Aşağıdaki butonlara tıklayarak dijital yıllığın nasıl canlandığını deneyimleyin.
                    </p>

                    <div className="mx-auto mt-10 max-w-2xl">
                        <div className="flex justify-center gap-2 mb-4">
                            {['Kapak & Başlangıç', 'Katılımcı Profili', 'Hatıra Notları'].map((tab, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setSimulatorPage(idx)}
                                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                                        simulatorPage === idx
                                            ? 'bg-amber-500 text-black shadow-md shadow-amber-500/25'
                                            : 'bg-muted/40 text-muted-foreground hover:bg-muted'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="relative min-h-[220px] overflow-hidden rounded-3xl border border-amber-500/30 bg-card p-8 text-left shadow-2xl ring-1 ring-amber-500/20">
                            <AnimatePresence mode="wait">
                                {simulatorPage === 0 && (
                                    <motion.div
                                        key="page-0"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.4 }}
                                        className="space-y-3"
                                    >
                                        <div className="text-xs font-bold uppercase tracking-wider text-amber-500">
                                            Özgür Yazılım Yaz Kampı 2026
                                        </div>
                                        <h3 className="font-serif-title text-2xl font-bold text-foreground">
                                            Laravel Sınıfı Hatıra Yıllığı
                                        </h3>
                                        <p className="text-sm italic text-muted-foreground">
                                            “Dokuz gün boyunca aynı sınıfta eğitim alan dostların ortak hafızası.”
                                        </p>
                                    </motion.div>
                                )}

                                {simulatorPage === 1 && (
                                    <motion.div
                                        key="page-1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.4 }}
                                        className="space-y-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-12 items-center justify-center rounded-full bg-amber-500/15 text-lg font-bold text-amber-500">
                                                AB
                                            </div>
                                            <div>
                                                <h3 className="font-serif-title text-xl font-bold text-foreground">
                                                    Ali Berk
                                                </h3>
                                                <p className="text-xs text-muted-foreground">
                                                    “En çok gece yapılan o derin sohbetleri hatırlayacağım.”
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {simulatorPage === 2 && (
                                    <motion.div
                                        key="page-2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.4 }}
                                        className="space-y-3"
                                    >
                                        <div className="text-xs font-semibold text-amber-500">
                                            Ali Hakkında Ne Dediler?
                                        </div>
                                        <blockquote className="font-serif-title text-base italic text-foreground">
                                            “Bitmeyen enerjin ve problem çözme azminle bu kampa damga vurdun!”
                                        </blockquote>
                                        <p className="text-xs text-muted-foreground text-right">
                                            — İsimsiz, 8. Gün
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </section>

                {/* ========================================================================= */}
                {/* 9. EMOTIONAL GRAND FINALE CTA */}
                {/* ========================================================================= */}
                <section className="relative z-20 mx-auto max-w-4xl px-6 py-24 text-center">
                    <motion.div
                        whileInView={{ opacity: 1, scale: 1 }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="glass-panel relative overflow-hidden rounded-3xl p-10 ring-1 ring-amber-500/30 sm:p-16 shadow-2xl"
                    >
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/15" />
                        <Sparkles className="mx-auto size-10 text-amber-500 animate-pulse" />

                        <h2 className="font-serif-title mt-6 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                            Zamanı Durduramazsınız, Ama Hatıraları Ölümsüzleştirebilirsiniz.
                        </h2>

                        <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground sm:text-base">
                            Hemen ücretsiz bir zaman kapsülü başlatın ve arkadaşlarınızı ortak albümünüze davet edin.
                        </p>

                        <div className="mt-8 flex justify-center">
                            <Button
                                asChild
                                size="lg"
                                className="group h-13 rounded-full bg-amber-500 px-8 text-base font-bold text-black shadow-xl shadow-amber-500/30 transition-all hover:scale-105 hover:bg-amber-400"
                            >
                                <Link href={auth.user ? dashboard() : register()}>
                                    <span>{auth.user ? 'Panele Git' : 'Hemen Başla'}</span>
                                    <ArrowRight className="size-5 ml-2 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </section>

                {/* 10. FOOTER */}
                <footer className="relative z-20 border-t border-border/40 py-8 text-center text-xs text-muted-foreground">
                    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row lg:px-8">
                        <div className="flex items-center gap-2">
                            <AppLogoIcon className="size-4" />
                            <span className="font-serif-title text-sm font-semibold text-foreground">
                                Hatıra
                            </span>
                            <span>— Kolektif Dijital Zaman Kapsülü</span>
                        </div>
                        <p>© {new Date().getFullYear()} Hatıra. Awwwards seviyesinde zanaat ile tasarlandı.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
