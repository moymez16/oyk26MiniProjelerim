import { Form, Head, Link, setLayoutProps } from '@inertiajs/react';
import {
    Mail,
    Send,
    Sparkles,
    Trash2,
    UserPlus,
    Users,
    XCircle,
} from 'lucide-react';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useInitials } from '@/hooks/use-initials';
import {
    index as eventsIndex,
    show,
} from '@/actions/App/Http/Controllers/EventController';
import {
    destroy,
    index,
    store,
} from '@/actions/App/Http/Controllers/Events/ParticipantController';
import { store as storeBulk } from '@/actions/App/Http/Controllers/Events/BulkParticipantController';
import { show as participantShow } from '@/actions/App/Http/Controllers/Events/ParticipantProfileController';
import {
    destroy as revokeInvitation,
    store as sendInvitation,
} from '@/actions/App/Http/Controllers/Events/ParticipantInvitationController';
import type { EventDetail, ParticipantSummary } from '@/types';

type Props = {
    event: Pick<
        EventDetail,
        'ulid' | 'name' | 'is_owner' | 'can_manage_participants'
    >;
    participants: ParticipantSummary[];
};

export default function EventParticipantsIndex({ event, participants }: Props) {
    const initials = useInitials();

    setLayoutProps({
        breadcrumbs: [
            {
                title: 'Anı Albümleri',
                href: eventsIndex(),
            },
            {
                title: event.name,
                href: show(event),
            },
            {
                title: 'Katılımcılar',
                href: index(event),
            },
        ],
    });

    return (
        <>
            <Head title={`${event.name} — Katılımcılar`} />

            <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 p-4 md:p-8">
                <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-500">
                        <Users className="size-3.5" />
                        <span>Kişiler & Portreler</span>
                    </div>
                    <h1 className="font-serif-title mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Katılımcı Albümü
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Bu albümde yer alan tüm dostlar. Henüz hesabı olmayanlara e-posta ile davet gönderebilirsiniz.
                    </p>
                </div>

                {/* Portrait Grid */}
                {participants.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {participants.map((participant) => (
                            <Link
                                key={`card-${participant.ulid}`}
                                href={participantShow([event, participant])}
                                prefetch
                                className="group polaroid-card flex flex-col items-center gap-2 rounded-2xl p-4 text-center ring-1 ring-border/50 transition-all hover:scale-105"
                            >
                                <Avatar className="size-16 ring-2 ring-amber-500/20 shadow-md transition-all group-hover:ring-amber-500/60">
                                    {participant.photo_url && (
                                        <AvatarImage
                                            src={participant.photo_url}
                                            alt={participant.name}
                                        />
                                    )}
                                    <AvatarFallback className="bg-amber-500/10 text-sm font-bold text-amber-600 dark:text-amber-300">
                                        {initials(participant.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="w-full truncate text-sm font-semibold text-foreground group-hover:text-amber-500">
                                    {participant.name}
                                </span>
                                <Badge variant="secondary" className="text-[10px] px-2 py-0 font-normal">
                                    {participant.status_label ?? participant.role}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Participant Management Table */}
                {participants.length === 0 ? (
                    <div className="glass-panel flex flex-col items-center justify-center rounded-3xl p-12 text-center ring-1 ring-amber-500/15">
                        <Users className="size-12 text-amber-500/40" />
                        <h3 className="font-serif-title mt-4 text-xl font-bold">Henüz katılımcı eklenmedi</h3>
                        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                            Aşağıdaki formları kullanarak albüme ilk katılımcıları dahil edebilirsiniz.
                        </p>
                    </div>
                ) : (
                    <Card className="glass-panel overflow-hidden rounded-3xl ring-1 ring-amber-500/20 shadow-md">
                        <CardHeader className="border-b border-border/40 pb-4">
                            <CardTitle className="font-serif-title text-lg font-bold">
                                Katılımcı Listesi ({participants.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="divide-y divide-border/40 p-0">
                            {participants.map((participant) => (
                                <div
                                    key={participant.ulid}
                                    className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar className="size-9">
                                            {participant.photo_url && (
                                                <AvatarImage
                                                    src={participant.photo_url}
                                                    alt={participant.name}
                                                />
                                            )}
                                            <AvatarFallback className="text-xs">
                                                {initials(participant.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-sm text-foreground">
                                                {participant.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {participant.email ?? 'E-posta eklenmedi'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge variant="outline" className="text-xs">
                                            {participant.status_label}
                                        </Badge>
                                        {participant.can_invite && (
                                            <Form
                                                {...sendInvitation.form([
                                                    event,
                                                    participant,
                                                ])}
                                            >
                                                {({ processing }) => (
                                                    <Button
                                                        type="submit"
                                                        variant="outline"
                                                        size="sm"
                                                        disabled={processing}
                                                        className="rounded-lg text-xs"
                                                    >
                                                        <Send className="size-3 mr-1 text-amber-500" />
                                                        {participant.status === 'not_invited'
                                                            ? 'Davet gönder'
                                                            : 'Yeniden gönder'}
                                                    </Button>
                                                )}
                                            </Form>
                                        )}
                                        {participant.can_revoke && (
                                            <Form
                                                {...revokeInvitation.form([
                                                    event,
                                                    participant,
                                                ])}
                                            >
                                                {({ processing }) => (
                                                    <Button
                                                        type="submit"
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled={processing}
                                                        className="rounded-lg text-xs text-muted-foreground"
                                                    >
                                                        <XCircle className="size-3 mr-1" />
                                                        İptal et
                                                    </Button>
                                                )}
                                            </Form>
                                        )}
                                        {participant.can_delete && (
                                            <Form
                                                {...destroy.form([
                                                    event,
                                                    participant,
                                                ])}
                                            >
                                                {({ processing }) => (
                                                    <Button
                                                        type="submit"
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled={processing}
                                                        className="rounded-lg text-xs text-destructive hover:bg-destructive/10"
                                                    >
                                                        <Trash2 className="size-3 mr-1" />
                                                        Kaldır
                                                    </Button>
                                                )}
                                            </Form>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Add Participants Forms */}
                {event.can_manage_participants && (
                    <div className="grid gap-6">
                        {/* Single Add Form */}
                        <Card className="glass-panel rounded-3xl ring-1 ring-amber-500/20 shadow-md">
                            <CardHeader className="border-b border-border/40 pb-4">
                                <CardTitle className="font-serif-title flex items-center gap-2 text-lg font-bold">
                                    <UserPlus className="size-4 text-amber-500" />
                                    Katılımcı Ekle
                                </CardTitle>
                                <p className="text-xs text-muted-foreground">
                                    Yalnızca ad yazarak ekleyebilirsiniz. E-posta adresi davet göndermek için isteğe bağlıdır.
                                </p>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <Form
                                    {...store.form(event)}
                                    resetOnSuccess
                                    className="grid gap-4 sm:grid-cols-2"
                                >
                                    {({ processing, errors }) => (
                                        <>
                                            <div className="grid gap-1.5">
                                                <Label htmlFor="name" className="text-xs font-semibold">
                                                    Ad Soyad
                                                </Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    required
                                                    placeholder="Örn: Ali Berk"
                                                    className="rounded-xl border-border/60 bg-background/50"
                                                />
                                                <InputError message={errors.name} />
                                            </div>
                                            <div className="grid gap-1.5">
                                                <Label htmlFor="email" className="text-xs font-semibold">
                                                    E-posta <span className="text-muted-foreground">(İsteğe bağlı)</span>
                                                </Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="ali@example.com"
                                                    className="rounded-xl border-border/60 bg-background/50"
                                                />
                                                <InputError message={errors.email} />
                                            </div>
                                            <div className="sm:col-span-2 flex justify-end pt-2">
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="rounded-full bg-amber-500 px-6 font-semibold text-black hover:bg-amber-400"
                                                >
                                                    {processing ? <Spinner /> : <UserPlus className="size-4 mr-1.5" />}
                                                    Katılımcıyı Ekle
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </Form>
                            </CardContent>
                        </Card>

                        {/* Bulk Add Form */}
                        <Card className="glass-panel rounded-3xl ring-1 ring-amber-500/20 shadow-md">
                            <CardHeader className="border-b border-border/40 pb-4">
                                <CardTitle className="font-serif-title flex items-center gap-2 text-lg font-bold">
                                    <Users className="size-4 text-amber-500" />
                                    Toplu Katılımcı Ekle
                                </CardTitle>
                                <p className="text-xs text-muted-foreground">
                                    Her satıra bir kişi yazın. Biçim: <span className="font-semibold text-foreground">Ad, e-posta</span> veya yalnızca <span className="font-semibold text-foreground">Ad</span>.
                                </p>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <Form
                                    {...storeBulk.form(event)}
                                    resetOnSuccess
                                    className="space-y-4"
                                >
                                    {({ processing, errors }) => (
                                        <>
                                            <textarea
                                                id="list"
                                                name="list"
                                                rows={5}
                                                placeholder={'Ali Berk, ali@example.com\nAyşe Yılmaz, ayse@example.com\nMehmet Demir'}
                                                className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-amber-500/50 dark:bg-input/30 w-full rounded-2xl border bg-background/50 p-3.5 text-xs shadow-xs outline-none focus-visible:ring-[3px]"
                                            />
                                            <InputError message={errors.list ?? errors.participants} />
                                            <div className="flex justify-end">
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="rounded-full bg-amber-500 px-6 font-semibold text-black hover:bg-amber-400"
                                                >
                                                    {processing ? <Spinner /> : <Sparkles className="size-4 mr-1.5" />}
                                                    Listeyi Topluca Ekle
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </Form>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </>
    );
}
