import { Form, Head, Link, setLayoutProps } from '@inertiajs/react';
import { motion } from 'motion/react';
import {
    BookHeart,
    BookOpen,
    Calendar,
    FolderHeart,
    MapPin,
    MessageSquareQuote,
    Pencil,
    Shield,
    Sparkles,
    UserRound,
    Users,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInitials } from '@/hooks/use-initials';
import {
    edit,
    index,
    show,
} from '@/actions/App/Http/Controllers/EventController';
import { edit as editProfile } from '@/actions/App/Http/Controllers/Events/ProfileController';
import { index as myImpressions } from '@/actions/App/Http/Controllers/Events/ImpressionController';
import { index as memoriesIndex } from '@/actions/App/Http/Controllers/Events/MemoryController';
import { index as participantsIndex } from '@/actions/App/Http/Controllers/Events/ParticipantController';
import { show as eventYearbook } from '@/actions/App/Http/Controllers/Events/YearbookController';
import { show as participantShow } from '@/actions/App/Http/Controllers/Events/ParticipantProfileController';
import type { EventDetail } from '@/types';

type FeedItem = {
    type: 'memory' | 'impression' | 'participant';
    occurred_at: string | null;
    headline: string;
};

type Props = {
    event: EventDetail;
    feed: FeedItem[];
};

export default function EventsShow({ event, feed }: Props) {
    const initials = useInitials();

    setLayoutProps({
        breadcrumbs: [
            {
                title: 'Anı Albümleri',
                href: index(),
            },
            {
                title: event.name,
                href: show(event),
            },
        ],
    });

    return (
        <>
            <Head title={`${event.name} — Hatıra`} />

            <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 p-4 md:p-8">
                {/* Cinematic Hero Cover Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-card shadow-2xl"
                >
                    <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-amber-600/30 via-zinc-800 to-zinc-950 sm:h-80">
                        {event.cover_url ? (
                            <img
                                src={event.cover_url}
                                alt={event.name}
                                className="size-full object-cover"
                            />
                        ) : (
                            <div className="flex size-full flex-col items-center justify-center p-8 text-center">
                                <FolderHeart className="size-16 text-amber-400/40" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                        {/* Status Badge */}
                        <div className="absolute top-4 right-4">
                            <Badge className="border-0 bg-black/60 px-3 py-1 text-xs font-semibold text-amber-300 backdrop-blur-md">
                                {event.status_label}
                            </Badge>
                        </div>

                        {/* Event Title & Metadata overlay */}
                        <div className="absolute bottom-6 left-6 right-6 text-white">
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-0.5 text-xs font-semibold text-amber-300 backdrop-blur-md">
                                <Sparkles className="size-3" />
                                <span>Zaman Kapsülü</span>
                            </div>
                            <h1 className="font-serif-title mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                {event.name}
                            </h1>
                            <p className="mt-1 text-sm text-zinc-300 sm:text-base">
                                {event.description}
                            </p>
                            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-300">
                                <div className="flex items-center gap-1">
                                    <Calendar className="size-3.5 text-amber-400" />
                                    <span>
                                        {event.starts_on}
                                        {event.ends_on ? ` — ${event.ends_on}` : ''}
                                    </span>
                                </div>
                                {event.location && (
                                    <div className="flex items-center gap-1">
                                        <MapPin className="size-3.5 text-amber-400" />
                                        <span>{event.location}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1">
                                    <Users className="size-3.5 text-amber-400" />
                                    <span>{event.participants.length} Katılımcı</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Navigation Action Grid */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <Button
                        asChild
                        className="h-auto flex-col gap-1.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-600 shadow-sm transition-all hover:-translate-y-1 hover:bg-amber-500/20 dark:text-amber-300"
                    >
                        <Link href={eventYearbook(event)} prefetch>
                            <BookOpen className="size-5" />
                            <span className="font-semibold text-sm">Yıllığı Aç</span>
                        </Link>
                    </Button>

                    <Button
                        asChild
                        variant="outline"
                        className="h-auto flex-col gap-1.5 rounded-2xl border-border bg-card p-4 transition-all hover:-translate-y-1 hover:border-amber-500/40"
                    >
                        <Link href={memoriesIndex(event)} prefetch>
                            <FolderHeart className="size-5 text-amber-500" />
                            <span className="font-semibold text-sm">Anılar</span>
                        </Link>
                    </Button>

                    <Button
                        asChild
                        variant="outline"
                        className="h-auto flex-col gap-1.5 rounded-2xl border-border bg-card p-4 transition-all hover:-translate-y-1 hover:border-amber-500/40"
                    >
                        <Link href={myImpressions(event)} prefetch>
                            <MessageSquareQuote className="size-5 text-amber-500" />
                            <span className="font-semibold text-sm">İzlenimler</span>
                        </Link>
                    </Button>

                    <Button
                        asChild
                        variant="outline"
                        className="h-auto flex-col gap-1.5 rounded-2xl border-border bg-card p-4 transition-all hover:-translate-y-1 hover:border-amber-500/40"
                    >
                        <Link href={editProfile(event)} prefetch>
                            <UserRound className="size-5 text-amber-500" />
                            <span className="font-semibold text-sm">Profilim</span>
                        </Link>
                    </Button>
                </div>

                {/* Long Description Card if exists */}
                {event.long_description && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Card className="glass-panel rounded-2xl ring-1 ring-amber-500/15">
                            <CardContent className="pt-6">
                                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                                    {event.long_description}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Participants Ribbon */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <Card className="glass-panel rounded-2xl ring-1 ring-amber-500/15 shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div>
                                <CardTitle className="font-serif-title text-xl font-bold">
                                    Birlikte Olanlar
                                </CardTitle>
                                <p className="text-xs text-muted-foreground">
                                    Birine dokunarak hatıra profiline gidebilir ve onun hakkında izlenim bırakabilirsiniz.
                                </p>
                            </div>
                            <Button variant="ghost" size="sm" asChild className="text-xs text-amber-500 hover:text-amber-400">
                                <Link href={participantsIndex(event)} prefetch>
                                    Tümünü Gör ({event.participants.length})
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-4 pt-2">
                            {event.participants.map((participant) => (
                                <Link
                                    key={participant.ulid}
                                    href={participantShow([event, participant])}
                                    prefetch
                                    className="group flex w-16 flex-col items-center gap-1.5 transition-transform hover:scale-105"
                                >
                                    <Avatar className="size-14 ring-2 ring-amber-500/20 transition-all group-hover:ring-amber-500/60 shadow-md">
                                        {participant.photo_url && (
                                            <AvatarImage
                                                src={participant.photo_url}
                                                alt={participant.name}
                                            />
                                        )}
                                        <AvatarFallback className="bg-amber-500/10 text-xs font-bold text-amber-600 dark:text-amber-300">
                                            {initials(participant.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="w-full truncate text-center text-xs font-medium text-foreground group-hover:text-amber-500">
                                        {participant.name}
                                    </span>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Recent Feed / Memory Timeline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Card className="glass-panel rounded-2xl ring-1 ring-amber-500/15 shadow-md">
                        <CardHeader>
                            <CardTitle className="font-serif-title text-xl font-bold">
                                Son Olanlar & Akış
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">
                                Beğeni yok, sıralama yok. Sadece neler yaşandığını hatırlamak için.
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {feed.length === 0 ? (
                                <div className="py-6 text-center text-sm text-muted-foreground">
                                    <Sparkles className="mx-auto size-6 text-amber-500/60" />
                                    <p className="mt-2 font-medium">Henüz akışta bir şey yok.</p>
                                    <p className="text-xs mt-1">İlk anıyı bırakmak veya bir arkadaşına dair ilk cümleyi yazmak yeterli.</p>
                                </div>
                            ) : (
                                feed.map((item, idx) => (
                                    <div
                                        key={`${item.type}-${item.occurred_at}-${idx}`}
                                        className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/40 p-3 text-sm"
                                    >
                                        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                                            <Sparkles className="size-3.5" />
                                        </div>
                                        <p className="flex-1 text-foreground/90">{item.headline}</p>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Bottom Management Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-4">
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" asChild className="rounded-full">
                            <Link href={participantsIndex(event)} prefetch>
                                <Users className="size-3.5 mr-1 text-amber-500" />
                                Katılımcı Yönetimi
                            </Link>
                        </Button>
                        {event.can_moderate && (
                            <Button variant="outline" size="sm" asChild className="rounded-full">
                                <Link href={`/events/${event.ulid}/moderation`} prefetch>
                                    <Shield className="size-3.5 mr-1 text-amber-500" />
                                    Moderasyon
                                </Link>
                            </Button>
                        )}
                        {event.is_owner && (
                            <Button variant="outline" size="sm" asChild className="rounded-full">
                                <Link href={edit(event)} prefetch>
                                    <Pencil className="size-3.5 mr-1 text-amber-500" />
                                    Albümü Düzenle
                                </Link>
                            </Button>
                        )}
                    </div>

                    {!event.is_owner && (
                        <Form
                            action={`/events/${event.ulid}/participation`}
                            method="delete"
                        >
                            <Button type="submit" variant="ghost" size="sm" className="rounded-full text-destructive hover:bg-destructive/10">
                                Etkinlikten Ayrıl
                            </Button>
                        </Form>
                    )}
                </div>
            </div>
        </>
    );
}
