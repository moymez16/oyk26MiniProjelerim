import { Head, Link } from '@inertiajs/react';
import { motion } from 'motion/react';
import {
    Calendar,
    CalendarPlus,
    FolderHeart,
    MapPin,
    Sparkles,
    Users,
} from 'lucide-react';
import { TiltCard } from '@/components/tilt-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    create,
    index,
    show,
} from '@/actions/App/Http/Controllers/EventController';
import type { EventSummary } from '@/types';

type Props = {
    events: EventSummary[];
};

export default function EventsIndex({ events }: Props) {
    return (
        <>
            <Head title="Anı Albümlerim — Hatıra" />

            <div className="flex flex-1 flex-col gap-8 p-4 md:p-8">
                {/* Header with Title & CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-500">
                            <Sparkles className="size-3.5" />
                            <span>Koleksiyon</span>
                        </div>
                        <h1 className="font-serif-title mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            Anı Albümleri
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Sahibi olduğunuz veya katılımcısı olduğunuz dijital zaman kapsülleri.
                        </p>
                    </div>

                    <Button
                        asChild
                        className="rounded-full bg-amber-500 px-6 font-semibold text-black shadow-lg shadow-amber-500/20 hover:bg-amber-400"
                    >
                        <Link href={create()}>
                            <CalendarPlus className="size-4" />
                            Yeni Albüm Oluştur
                        </Link>
                    </Button>
                </motion.div>

                {/* Empty State */}
                {events.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7 }}
                        className="glass-panel relative flex flex-col items-center justify-center rounded-3xl p-12 text-center ring-1 ring-amber-500/20 sm:p-16"
                    >
                        <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500 shadow-inner">
                            <FolderHeart className="size-8" />
                        </div>
                        <h2 className="font-serif-title mt-6 text-2xl font-bold text-foreground">
                            Henüz bir anı albümünüz yok
                        </h2>
                        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                            Birlikte geçirdiğiniz bir dönemin zaman kapsülünü oluşturmak, anıları ve dost izlenimlerini biriktirmek için ilk albümü siz açın.
                        </p>
                        <Button
                            asChild
                            className="mt-6 rounded-full bg-amber-500 px-6 font-semibold text-black shadow-lg shadow-amber-500/20 hover:bg-amber-400"
                        >
                            <Link href={create()}>
                                <CalendarPlus className="size-4" />
                                İlk Albümü Başlat
                            </Link>
                        </Button>
                    </motion.div>
                ) : (
                    /* Album Cards Grid */
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {events.map((event, idx) => (
                            <motion.div
                                key={event.ulid}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: idx * 0.08,
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                            >
                                <TiltCard className="h-full">
                                    <Link
                                        href={show(event)}
                                        prefetch
                                        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-amber-500/20 bg-card shadow-md transition-all duration-300 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/15"
                                    >
                                        {/* Cover Image or Pattern Header */}
                                        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-amber-600/30 via-zinc-800 to-zinc-950">
                                            {event.cover_url ? (
                                                <img
                                                    src={event.cover_url}
                                                    alt={event.name}
                                                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex size-full flex-col items-center justify-center p-6 text-center">
                                                    <FolderHeart className="size-12 text-amber-400/40" />
                                                    <span className="font-serif-title mt-2 text-lg font-bold text-amber-200/80">
                                                        {event.name}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                            {/* Status Badge */}
                                            <div className="absolute top-3 right-3">
                                                <Badge className="border-0 bg-black/60 text-xs font-semibold text-amber-300 backdrop-blur-md">
                                                    {event.status_label}
                                                </Badge>
                                            </div>

                                            {/* Date Overlay */}
                                            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-medium text-zinc-200">
                                                <Calendar className="size-3.5 text-amber-400" />
                                                <span>
                                                    {event.starts_on}
                                                    {event.ends_on ? ` — ${event.ends_on}` : ''}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content Body */}
                                        <div className="flex flex-1 flex-col justify-between p-5">
                                            <div>
                                                <h2 className="font-serif-title text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-amber-500">
                                                    {event.name}
                                                </h2>
                                                {event.description && (
                                                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                                                        {event.description}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Footer Info */}
                                            <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1.5 font-medium">
                                                    <Users className="size-3.5 text-amber-500" />
                                                    <span>{event.participants_count} Katılımcı</span>
                                                </div>
                                                {event.location && (
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="size-3 text-amber-500" />
                                                        <span className="truncate max-w-[120px]">{event.location}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </TiltCard>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

EventsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Anı Albümleri',
            href: index(),
        },
    ],
};
