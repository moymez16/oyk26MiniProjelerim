import { Head, Link } from '@inertiajs/react';
import { motion } from 'motion/react';
import { ArrowLeft, BookHeart, Heart, MessageSquareQuote, Printer, Sparkles } from 'lucide-react';
import { AmbientParticles } from '@/components/ambient-particles';
import { Button } from '@/components/ui/button';
import { useLenis } from '@/hooks/use-lenis';
import { index as eventsIndex } from '@/actions/App/Http/Controllers/EventController';
import type { PresentedImpression } from '@/pages/events/impressions/index';
import type { PresentedMemory } from '@/pages/events/memories/index';

type PersonalEvent = {
    ulid: string;
    name: string;
    cover_url: string | null;
    starts_on: string;
    profile: {
        name: string;
        bio: string | null;
        photo_url: string | null;
    };
    about_me: PresentedImpression[];
    written_by_me: PresentedImpression[];
    my_memories: PresentedMemory[];
};

type Props = {
    events: PersonalEvent[];
};

export default function MyYearbook({ events }: Props) {
    // Enable Lenis Smooth Scroll
    useLenis(true);

    return (
        <div className="relative min-h-screen bg-background text-foreground selection:bg-amber-500 selection:text-black">
            <Head title="Kişisel Yıllığım — Hatıra" />

            {/* Screen Controls Header */}
            <div className="yearbook-screen-only sticky top-0 z-50 border-b border-border/40 bg-background/80 px-4 py-3 backdrop-blur-xl print:hidden">
                <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
                    <Button variant="ghost" size="sm" asChild className="rounded-full">
                        <Link href={eventsIndex()} className="flex items-center gap-1.5">
                            <ArrowLeft className="size-4" />
                            <span>Albümlerime Dön</span>
                        </Link>
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            onClick={() => window.print()}
                            className="rounded-full bg-amber-500 font-semibold text-black shadow-lg shadow-amber-500/20 hover:bg-amber-400"
                        >
                            <Printer className="size-4 mr-1.5" />
                            PDF Olarak Kaydet / Yazdır
                        </Button>
                    </div>
                </div>
            </div>

            <p className="yearbook-screen-only mx-auto max-w-4xl px-4 pt-4 text-center text-xs text-muted-foreground print:hidden">
                🔒 Bu dosya senin kişisel hatıran. Yalnızca sana özel yazılanlar ve bıraktığın anılar burada yer alır.
            </p>

            <div className="print:hidden">
                <AmbientParticles count={25} />
            </div>

            <main className="relative z-10 mx-auto my-8 max-w-4xl space-y-12 px-6 py-6 font-sans antialiased sm:px-12 print:my-0 print:space-y-8 print:p-0">
                {events.length === 0 ? (
                    <div className="glass-panel flex flex-col items-center justify-center rounded-3xl p-16 text-center ring-1 ring-amber-500/15">
                        <BookHeart className="size-16 text-amber-500/40" />
                        <h2 className="font-serif-title mt-4 text-2xl font-bold">Henüz bir etkinlik yıllığınız yok</h2>
                        <p className="mt-2 text-sm text-muted-foreground">Bir etkinliğe katıldığınızda veya anı biriktirdiğinizde kişisel yıllığınız burada oluşur.</p>
                    </div>
                ) : (
                    events.map((event) => (
                        <motion.article
                            key={event.ulid}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 0.8 }}
                            className="yearbook-break relative overflow-hidden rounded-3xl border border-amber-500/30 bg-card p-8 shadow-2xl ring-1 ring-amber-500/15 sm:p-14 print:border-none print:shadow-none"
                        >
                            {event.cover_url && (
                                <div className="relative mb-8 h-64 w-full overflow-hidden rounded-2xl border border-border shadow-md print:h-48">
                                    <img
                                        src={event.cover_url}
                                        alt=""
                                        className="size-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Event Title & Personal Profile */}
                            <div className="border-b border-border/40 pb-8 text-center">
                                <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-300">
                                    <Sparkles className="size-3" />
                                    <span>Kişisel Hatıra Sayfası</span>
                                </div>
                                <h1 className="font-serif-title mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
                                    {event.name}
                                </h1>
                                <p className="mt-1 text-sm text-muted-foreground">{event.starts_on}</p>

                                <div className="mt-6 flex flex-col items-center gap-2">
                                    {event.profile.photo_url && (
                                        <img
                                            src={event.profile.photo_url}
                                            alt={event.profile.name}
                                            className="size-20 rounded-full object-cover ring-4 ring-amber-500/30 shadow-md"
                                        />
                                    )}
                                    <h2 className="font-serif-title text-2xl font-bold text-foreground">
                                        {event.profile.name}
                                    </h2>
                                    {event.profile.bio && (
                                        <p className="max-w-xl text-sm italic text-muted-foreground">
                                            “{event.profile.bio}”
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Section 1: Hakkımda Yazılanlar */}
                            <div className="mt-10 space-y-4">
                                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                                    <Heart className="size-4 fill-current" />
                                    <h3 className="font-serif-title text-2xl font-bold">
                                        Hakkımda Yazılanlar
                                    </h3>
                                </div>

                                {event.about_me.length === 0 ? (
                                    <p className="text-sm italic text-muted-foreground">Bu etkinlikte senin hakkında henüz bir cümle yazılmamış.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {event.about_me.map((impression) => (
                                            <div
                                                key={impression.ulid}
                                                className="yearbook-section rounded-2xl border border-border/40 bg-background/50 p-5 shadow-sm"
                                            >
                                                <p className="font-serif-title whitespace-pre-wrap text-base italic leading-relaxed text-foreground/95">
                                                    “{impression.body}”
                                                </p>
                                                <div className="mt-2 text-right text-xs text-muted-foreground">
                                                    — <span className="font-medium text-foreground">{impression.author_name ?? 'İsimsiz'}</span>, {impression.event_day_label}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Section 2: Benim Yazdıklarım */}
                            <div className="mt-10 space-y-4 border-t border-border/30 pt-8">
                                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                                    <MessageSquareQuote className="size-4" />
                                    <h3 className="font-serif-title text-2xl font-bold">
                                        Benim Yazdıklarım
                                    </h3>
                                </div>

                                {event.written_by_me.length === 0 ? (
                                    <p className="text-sm italic text-muted-foreground">Bu etkinlikte kimse hakkında yazı bırakmadın.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {event.written_by_me.map((impression) => (
                                            <div
                                                key={impression.ulid}
                                                className="yearbook-section rounded-2xl border border-border/40 bg-background/50 p-5 shadow-sm"
                                            >
                                                <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                                                    {impression.subject_name} için yazıldı · {impression.event_day_label}
                                                </div>
                                                <p className="font-serif-title mt-2 whitespace-pre-wrap text-base italic leading-relaxed text-foreground/95">
                                                    “{impression.body}”
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Section 3: Bıraktığım Anılar */}
                            <div className="mt-10 space-y-4 border-t border-border/30 pt-8">
                                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                                    <Sparkles className="size-4" />
                                    <h3 className="font-serif-title text-2xl font-bold">
                                        Bıraktığım Ortak Anılar
                                    </h3>
                                </div>

                                {event.my_memories.length === 0 ? (
                                    <p className="text-sm italic text-muted-foreground">Bu etkinlikte anı bırakmadın.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {event.my_memories.map((memory) => (
                                            <div
                                                key={memory.ulid}
                                                className="yearbook-section rounded-2xl border border-border/40 bg-background/50 p-5 shadow-sm"
                                            >
                                                <p className="font-serif-title whitespace-pre-wrap text-base leading-relaxed text-foreground/95">
                                                    {memory.body}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.article>
                    ))
                )}
            </main>
        </div>
    );
}
