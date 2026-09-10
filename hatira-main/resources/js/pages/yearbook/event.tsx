import { Head, Link } from '@inertiajs/react';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, Download, Printer, Sparkles } from 'lucide-react';
import { AmbientParticles } from '@/components/ambient-particles';
import { Button } from '@/components/ui/button';
import { useLenis } from '@/hooks/use-lenis';
import { show as eventShow } from '@/actions/App/Http/Controllers/EventController';
import type { PresentedImpression } from '@/pages/events/impressions/index';
import type { PresentedMemory } from '@/pages/events/memories/index';

type YearbookParticipant = {
    ulid: string;
    name: string;
    bio: string | null;
    photo_url: string | null;
    impressions: PresentedImpression[];
};

type Props = {
    event: {
        ulid: string;
        name: string;
        description: string;
        long_description: string | null;
        location: string | null;
        cover_url: string | null;
        starts_on: string;
        ends_on: string | null;
    };
    memories: PresentedMemory[];
    participants: YearbookParticipant[];
};

export default function EventYearbook({
    event,
    memories,
    participants,
}: Props) {
    // Enable Lenis Smooth Scroll on screen mode
    useLenis(true);

    return (
        <div className="relative min-h-screen bg-background text-foreground selection:bg-amber-500 selection:text-black">
            <Head title={`${event.name} — Dijital Yıllık`} />

            {/* Screen Controls Header */}
            <div className="yearbook-screen-only sticky top-0 z-50 border-b border-border/40 bg-background/80 px-4 py-3 backdrop-blur-xl print:hidden">
                <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
                    <Button variant="ghost" size="sm" asChild className="rounded-full">
                        <Link href={eventShow(event)} className="flex items-center gap-1.5">
                            <ArrowLeft className="size-4" />
                            <span>Etkinliğe Dön</span>
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
                💡 İpucu: Açılan yazdırma penceresinde “PDF olarak kaydet”i seçerek bu yıllığı dijital hatıra kitabı olarak arşivleyebilirsiniz.
            </p>

            {/* Ambient Golden Particles in screen mode */}
            <div className="print:hidden">
                <AmbientParticles count={30} />
            </div>

            {/* Main Book Canvas */}
            <main className="relative z-10 mx-auto my-8 max-w-4xl space-y-12 px-6 py-6 font-sans antialiased sm:px-12 print:my-0 print:space-y-8 print:p-0">
                {/* Book Cover / Frontispiece */}
                <motion.article
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="yearbook-break relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-b from-card via-card/90 to-card/60 p-8 shadow-2xl ring-1 ring-amber-500/20 sm:p-14 print:border-none print:shadow-none"
                >
                    {event.cover_url && (
                        <div className="relative mb-8 h-72 w-full overflow-hidden rounded-2xl border border-border shadow-md print:h-56">
                            <img
                                src={event.cover_url}
                                alt={event.name}
                                className="size-full object-cover"
                            />
                        </div>
                    )}

                    <div className="text-center">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-300">
                            <Sparkles className="size-3" />
                            <span>Dönem Hatıra Yıllığı</span>
                        </div>

                        <h1 className="font-serif-title mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                            {event.name}
                        </h1>

                        <p className="mt-3 text-sm font-medium text-amber-600 dark:text-amber-400 sm:text-base">
                            {event.starts_on}
                            {event.ends_on ? ` — ${event.ends_on}` : ''}
                            {event.location ? ` · ${event.location}` : ''}
                        </p>

                        <div className="mx-auto my-6 h-px w-24 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

                        <p className="font-serif-title mx-auto max-w-2xl text-lg italic text-foreground/90 sm:text-xl">
                            “{event.description}”
                        </p>

                        {event.long_description && (
                            <div className="mx-auto mt-6 max-w-2xl text-left">
                                <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                                    {event.long_description}
                                </p>
                            </div>
                        )}
                    </div>
                </motion.article>

                {/* Section 1: Katılımcı Portreleri */}
                <motion.section
                    whileInView={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 30 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.8 }}
                    className="yearbook-break yearbook-section rounded-3xl border border-amber-500/20 bg-card p-8 shadow-xl ring-1 ring-amber-500/10 sm:p-12 print:border-none print:shadow-none"
                >
                    <div className="border-b border-border/40 pb-4 text-center">
                        <h2 className="font-serif-title text-3xl font-bold tracking-tight text-foreground">
                            Katılımcılar
                        </h2>
                        <p className="mt-1 text-xs text-muted-foreground">Bu dönemi birlikte paylaşan tüm dostlar</p>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4 print:grid-cols-4">
                        {participants.map((participant) => (
                            <div
                                key={participant.ulid}
                                className="flex flex-col items-center gap-2 text-center"
                            >
                                {participant.photo_url ? (
                                    <img
                                        src={participant.photo_url}
                                        alt={participant.name}
                                        className="size-24 rounded-full object-cover ring-2 ring-amber-500/30 shadow-md"
                                    />
                                ) : (
                                    <div className="flex size-24 items-center justify-center rounded-full bg-amber-500/10 text-xl font-bold text-amber-600 dark:text-amber-300 ring-2 ring-amber-500/20">
                                        {participant.name.charAt(0)}
                                    </div>
                                )}
                                <p className="font-medium text-sm text-foreground">
                                    {participant.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* Section 2: Ortak Anılar */}
                <motion.section
                    whileInView={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 30 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.8 }}
                    className="yearbook-break yearbook-section rounded-3xl border border-amber-500/20 bg-card p-8 shadow-xl ring-1 ring-amber-500/10 sm:p-12 print:border-none print:shadow-none"
                >
                    <div className="border-b border-border/40 pb-4 text-center">
                        <h2 className="font-serif-title text-3xl font-bold tracking-tight text-foreground">
                            Ortak Anılar & Hikayeler
                        </h2>
                        <p className="mt-1 text-xs text-muted-foreground">Gün gün yaşananlar ve unutulmaz anlar</p>
                    </div>

                    <div className="mt-8 space-y-6">
                        {memories.length === 0 ? (
                            <p className="text-center text-sm text-muted-foreground">Bu etkinlikte henüz ortak bir anı kaydedilmemiş.</p>
                        ) : (
                            memories.map((memory) => (
                                <div
                                    key={memory.ulid}
                                    className="yearbook-section rounded-2xl border border-border/50 bg-background/50 p-6 shadow-sm"
                                >
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span className="font-semibold text-amber-600 dark:text-amber-400">
                                            {memory.author_name}
                                        </span>
                                        <span>{memory.event_day_label}</span>
                                    </div>
                                    <p className="font-serif-title mt-3 whitespace-pre-wrap text-base leading-relaxed text-foreground/95">
                                        {memory.body}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </motion.section>

                {/* Section 3: Katılımcı Sayfaları */}
                {participants.map((participant) => (
                    <motion.section
                        key={participant.ulid}
                        whileInView={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 30 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.8 }}
                        className="yearbook-break yearbook-section rounded-3xl border border-amber-500/20 bg-card p-8 shadow-xl ring-1 ring-amber-500/10 sm:p-12 print:border-none print:shadow-none"
                    >
                        <div className="flex items-center gap-6 border-b border-border/40 pb-6">
                            {participant.photo_url ? (
                                <img
                                    src={participant.photo_url}
                                    alt={participant.name}
                                    className="size-24 rounded-full object-cover ring-4 ring-amber-500/30 shadow-md"
                                />
                            ) : (
                                <div className="flex size-24 items-center justify-center rounded-full bg-amber-500/10 text-2xl font-bold text-amber-600 dark:text-amber-300 ring-4 ring-amber-500/30">
                                    {participant.name.charAt(0)}
                                </div>
                            )}
                            <div>
                                <h2 className="font-serif-title text-3xl font-bold tracking-tight text-foreground">
                                    {participant.name}
                                </h2>
                                {participant.bio && (
                                    <p className="mt-1.5 text-sm italic text-muted-foreground">
                                        “{participant.bio}”
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                                {participant.name} Hakkında Ne Dediler?
                            </h3>

                            {participant.impressions.length === 0 ? (
                                <p className="text-sm italic text-muted-foreground">Hakkında henüz görünür bir izlenim bulunmuyor.</p>
                            ) : (
                                <div className="space-y-4">
                                    {participant.impressions.map((impression) => (
                                        <div
                                            key={impression.ulid}
                                            className="yearbook-section rounded-2xl border border-border/40 bg-background/40 p-5"
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
                    </motion.section>
                ))}
            </main>
        </div>
    );
}
