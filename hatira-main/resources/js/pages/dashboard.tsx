import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'motion/react';
import {
    ArrowRight,
    Bell,
    BookHeart,
    CalendarPlus,
    FolderHeart,
    Heart,
    Sparkles,
} from 'lucide-react';
import { TiltCard } from '@/components/tilt-card';
import { Button } from '@/components/ui/button';
import {
    create as eventsCreate,
    index as eventsIndex,
} from '@/actions/App/Http/Controllers/EventController';
import { index as notificationsIndex } from '@/actions/App/Http/Controllers/NotificationController';
import { show as yearbookShow } from '@/actions/App/Http/Controllers/YearbookController';
import { dashboard } from '@/routes';

export default function Dashboard() {
    const { auth } = usePage().props;
    const userName = auth.user?.name ?? 'Dostum';

    return (
        <>
            <Head title="Panel — Hatıra" />

            <div className="flex flex-1 flex-col gap-8 p-4 md:p-8">
                {/* Hero Greeting Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-6 sm:p-10 shadow-lg"
                >
                    <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-amber-500/15 blur-3xl" />

                    <div className="relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-300">
                            <Sparkles className="size-3.5" />
                            <span>Zaman Kapsülü & Hatıra Alanı</span>
                        </div>

                        <h1 className="font-serif-title mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            Hoş geldin, {userName}.
                        </h1>
                        <p className="mt-2 text-base text-muted-foreground">
                            Birlikte biriktirdiğin anılar, yazılan içten izlenimler ve unutulmaz dönemlerin burada özenle saklanıyor.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <Button
                                asChild
                                className="rounded-full bg-amber-500 px-6 font-semibold text-black shadow-lg shadow-amber-500/20 hover:bg-amber-400"
                            >
                                <Link href={eventsIndex()} prefetch>
                                    <FolderHeart className="size-4" />
                                    Anı Albümlerine Git
                                    <ArrowRight className="size-4" />
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                asChild
                                className="glass-panel rounded-full border-amber-500/30 px-5"
                            >
                                <Link href={eventsCreate()} prefetch>
                                    <CalendarPlus className="size-4 text-amber-500" />
                                    Yeni Etkinlik Aç
                                </Link>
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Hub Action Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Card 1: Albümlerim */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <TiltCard className="glass-panel ring-1 ring-amber-500/20">
                            <Link
                                href={eventsIndex()}
                                prefetch
                                className="group block p-6"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex size-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
                                        <FolderHeart className="size-6" />
                                    </div>
                                    <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-amber-500" />
                                </div>
                                <h2 className="font-serif-title mt-5 text-xl font-bold text-foreground">
                                    Anı Albümleri
                                </h2>
                                <p className="mt-1.5 text-sm text-muted-foreground">
                                    Katıldığın kamplar, mezuniyetler, buluşmalar ve ortak zaman kapsülleri.
                                </p>
                            </Link>
                        </TiltCard>
                    </motion.div>

                    {/* Card 2: Kişisel Yıllığım */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <TiltCard className="glass-panel ring-1 ring-amber-500/20">
                            <Link
                                href={yearbookShow()}
                                prefetch
                                className="group block p-6"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex size-12 items-center justify-center rounded-xl bg-rose-500/15 text-rose-500">
                                        <BookHeart className="size-6" />
                                    </div>
                                    <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-rose-500" />
                                </div>
                                <h2 className="font-serif-title mt-5 text-xl font-bold text-foreground">
                                    Kişisel Yıllığım
                                </h2>
                                <p className="mt-1.5 text-sm text-muted-foreground">
                                    Hakkında yazılan cümleler, bıraktığın anılar ve baskıya hazır kişisel hatıra kitabın.
                                </p>
                            </Link>
                        </TiltCard>
                    </motion.div>

                    {/* Card 3: Bildirimler */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <TiltCard className="glass-panel ring-1 ring-amber-500/20">
                            <Link
                                href={notificationsIndex()}
                                prefetch
                                className="group block p-6"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500/15 text-blue-500">
                                        <Bell className="size-6" />
                                    </div>
                                    <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-blue-500" />
                                </div>
                                <h2 className="font-serif-title mt-5 text-xl font-bold text-foreground">
                                    Haberler & Bildirimler
                                </h2>
                                <p className="mt-1.5 text-sm text-muted-foreground">
                                    Yeni paylaşılan anılar, senin hakkında yazılan izlenimler ve davet güncellemeleri.
                                </p>
                            </Link>
                        </TiltCard>
                    </motion.div>
                </div>

                {/* Inspirational Quote Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="glass-panel relative mt-2 flex flex-col items-center justify-center rounded-2xl p-8 text-center ring-1 ring-amber-500/20 shadow-md"
                >
                    <Heart className="size-6 text-amber-500" />
                    <blockquote className="font-serif-title mt-3 text-lg font-medium italic text-foreground/90 sm:text-xl">
                        “Zamanın içinde kaybolup giden günleri değil, kalplerde iz bırakan hatıraları yaşatıyoruz.”
                    </blockquote>
                </motion.div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Panel',
            href: dashboard(),
        },
    ],
};
