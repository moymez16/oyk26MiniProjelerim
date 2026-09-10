import { Form, Head, Link, setLayoutProps } from '@inertiajs/react';
import {
    Camera,
    Eye,
    EyeOff,
    ExternalLink,
    Flag,
    Heart,
    MessageSquareQuote,
    Pencil,
    Send,
    Sparkles,
    Trash2,
    UserRound,
    Users,
} from 'lucide-react';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useInitials } from '@/hooks/use-initials';
import {
    index,
    show as eventShow,
} from '@/actions/App/Http/Controllers/EventController';
import { index as participantsIndex } from '@/actions/App/Http/Controllers/Events/ParticipantController';
import { show } from '@/actions/App/Http/Controllers/Events/ParticipantProfileController';
import { edit as editProfile } from '@/actions/App/Http/Controllers/Events/ProfileController';
import {
    destroy as destroyImpression,
    store as storeImpression,
    update as updateImpression,
} from '@/actions/App/Http/Controllers/Events/ImpressionController';
import { store as hideImpression } from '@/actions/App/Http/Controllers/Events/ImpressionHideController';
import { storeImpression as reportImpression } from '@/actions/App/Http/Controllers/Events/ReportController';
import type { EventDetail, ParticipantSummary, ProfileLink } from '@/types';
import type { PresentedImpression } from '@/pages/events/impressions/index';

type Props = {
    event: Pick<EventDetail, 'ulid' | 'name'>;
    participant: ParticipantSummary & {
        bio: string | null;
        links: ProfileLink[];
        is_self: boolean;
    };
    impressions: PresentedImpression[];
    prompt: string | null;
};

export default function ParticipantProfileShow({
    event,
    participant,
    impressions,
    prompt,
}: Props) {
    const initials = useInitials();

    setLayoutProps({
        breadcrumbs: [
            { title: 'Anı Albümleri', href: index() },
            { title: event.name, href: eventShow(event) },
            { title: 'Katılımcılar', href: participantsIndex(event) },
            { title: participant.name, href: show([event, participant]) },
        ],
    });

    return (
        <>
            <Head title={`${participant.name} — ${event.name}`} />

            <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 p-4 md:p-8">
                {/* Participant Portrait Hero Card */}
                <div className="glass-panel relative overflow-hidden rounded-3xl p-6 ring-1 ring-amber-500/25 shadow-xl sm:p-8">
                    <div className="pointer-events-none absolute -top-20 -right-20 size-60 rounded-full bg-amber-500/15 blur-3xl" />

                    <div className="relative z-10 flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
                        <Avatar className="size-24 ring-4 ring-amber-500/30 shadow-xl sm:size-28">
                            {participant.photo_url && (
                                <AvatarImage
                                    src={participant.photo_url}
                                    alt={participant.name}
                                />
                            )}
                            <AvatarFallback className="bg-amber-500/15 text-2xl font-bold text-amber-600 dark:text-amber-300">
                                {initials(participant.name)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                                <h1 className="font-serif-title text-2xl font-bold text-foreground sm:text-3xl">
                                    {participant.name}
                                </h1>
                                <Badge variant="secondary" className="text-xs">
                                    {participant.is_owner ? 'Albüm Sahibi' : 'Katılımcı'}
                                </Badge>
                            </div>

                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                                {participant.bio
                                    ? participant.bio
                                    : 'Henüz kısa bir tanıtım yazılmamış.'}
                            </p>

                            {/* External Profile Links */}
                            {participant.links.length > 0 && (
                                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                                    {participant.links.map((link) => (
                                        <a
                                            key={`${link.label}-${link.url}`}
                                            href={link.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 transition-colors hover:bg-amber-500/20 dark:text-amber-300"
                                        >
                                            <span>{link.label}</span>
                                            <ExternalLink className="size-3" />
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>

                        {participant.is_self && (
                            <div className="sm:self-start">
                                <Button asChild variant="outline" size="sm" className="rounded-full border-amber-500/30">
                                    <Link href={editProfile(event)}>
                                        <Pencil className="size-3.5 mr-1 text-amber-500" />
                                        Profilimi Düzenle
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Write Impression Box (if prompt exists / allowed) */}
                {prompt && (
                    <Card className="glass-panel rounded-3xl ring-1 ring-amber-500/25 shadow-xl">
                        <CardHeader className="border-b border-border/40 pb-4">
                            <CardTitle className="font-serif-title flex items-center gap-2 text-xl font-bold">
                                <MessageSquareQuote className="size-5 text-amber-500" />
                                {participant.name} Hakkında Bir Şey Yaz
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">{prompt}</p>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <Form
                                {...storeImpression.form([event, participant])}
                                encType="multipart/form-data"
                                resetOnSuccess
                                className="space-y-4"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <textarea
                                            name="body"
                                            required
                                            rows={4}
                                            placeholder={`${participant.name} hakkında hissettiğin, unutamadığın veya gelecekte tebessümle hatırlanacak samimi bir hatıra notu bırak...`}
                                            className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-amber-500/50 dark:bg-input/30 w-full rounded-2xl border bg-background/50 p-4 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                                        />
                                        <InputError message={errors.body} />

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="grid gap-1.5">
                                                <Label htmlFor="images" className="text-xs font-semibold">
                                                    Birlikte Fotoğraf (İsteğe bağlı)
                                                </Label>
                                                <input
                                                    id="images"
                                                    name="images[]"
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/webp"
                                                    multiple
                                                    className="border-input dark:bg-input/30 w-full rounded-xl border bg-background/50 px-3 py-1.5 text-xs file:mr-2 file:rounded-md file:border-0 file:bg-amber-500/20 file:px-2 file:py-1 file:text-xs file:font-semibold file:text-amber-600 dark:file:text-amber-300"
                                                />
                                                <InputError message={errors.images} />
                                            </div>

                                            <fieldset className="grid gap-1 text-xs">
                                                <legend className="font-semibold text-foreground">
                                                    Yazar Kimliği
                                                </legend>
                                                <div className="flex items-center gap-4 pt-1">
                                                    <label className="flex items-center gap-1.5 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="shows_author_name"
                                                            value="1"
                                                            defaultChecked
                                                            className="size-3.5 accent-amber-500"
                                                        />
                                                        <span>İsmimle göster</span>
                                                    </label>
                                                    <label className="flex items-center gap-1.5 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="shows_author_name"
                                                            value="0"
                                                            className="size-3.5 accent-amber-500"
                                                        />
                                                        <span>İsimsiz göster</span>
                                                    </label>
                                                </div>
                                            </fieldset>
                                        </div>

                                        <div className="flex justify-end pt-2">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="rounded-full bg-amber-500 px-6 font-semibold text-black shadow-lg shadow-amber-500/20 hover:bg-amber-400"
                                            >
                                                {processing ? <Spinner /> : <Send className="size-4 mr-1.5" />}
                                                İzlenimi Bırak
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </CardContent>
                    </Card>
                )}

                {/* Impressions Left For Participant */}
                <Card className="glass-panel rounded-3xl ring-1 ring-amber-500/20 shadow-md">
                    <CardHeader className="border-b border-border/40 pb-4">
                        <CardTitle className="font-serif-title text-xl font-bold">
                            {participant.is_self
                                ? 'Hakkımda Yazılanlar'
                                : `${participant.name} Hakkında Bırakılan İzlenimler`}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                            {impressions.length === 0
                                ? participant.is_self
                                    ? 'Henüz kimse senin hakkında bir şey yazmamış. Belki henüz birbirinizi yeni tanıyorsunuz.'
                                    : 'Henüz bir izlenim yok. İlk hatıra cümlesini yukarıdan siz bırakabilirsiniz.'
                                : 'Zaman içinde biriken tüm samimi notlar.'}
                        </p>
                    </CardHeader>
                    {impressions.length > 0 && (
                        <CardContent className="space-y-6 pt-6">
                            {impressions.map((impression) => (
                                <div
                                    key={impression.ulid}
                                    className="polaroid-card rounded-2xl p-5 ring-1 ring-amber-500/15 transition-all"
                                >
                                    <div className="flex items-center justify-between border-b border-border/30 pb-3 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-amber-500">{impression.event_day_label}</span>
                                            <span>·</span>
                                            <span className="font-medium text-foreground">
                                                {impression.author_name ?? 'İsimsiz'}
                                            </span>
                                        </div>
                                        {impression.can_report && (
                                            <Form {...reportImpression.form([event, impression])}>
                                                <input
                                                    type="hidden"
                                                    name="reason"
                                                    value="inappropriate"
                                                />
                                                <Button
                                                    type="submit"
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-auto p-0 text-xs text-muted-foreground hover:text-destructive"
                                                >
                                                    <Flag className="size-3 mr-1" />
                                                    Bildir
                                                </Button>
                                            </Form>
                                        )}
                                    </div>

                                    <blockquote className="font-serif-title py-3 whitespace-pre-wrap text-base italic leading-relaxed text-foreground/95">
                                        “{impression.body}”
                                    </blockquote>

                                    {impression.attachments.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {impression.attachments.map((attachment) => (
                                                <img
                                                    key={attachment.ulid}
                                                    src={attachment.url}
                                                    alt=""
                                                    className="h-24 rounded-xl object-cover ring-1 ring-border"
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Action items */}
                                    {(impression.can_update || impression.can_delete || impression.can_hide) && (
                                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border/30 pt-3 text-xs">
                                            {impression.can_update && (
                                                <Form
                                                    {...updateImpression.form([event, impression])}
                                                    className="grid w-full gap-2"
                                                >
                                                    <textarea
                                                        name="body"
                                                        defaultValue={impression.body}
                                                        rows={2}
                                                        className="border-input focus-visible:border-ring focus-visible:ring-amber-500/50 dark:bg-input/30 w-full rounded-xl border bg-background/50 p-2.5 text-xs shadow-xs outline-none focus-visible:ring-[3px]"
                                                    />
                                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                                        <fieldset className="flex items-center gap-3">
                                                            <legend className="sr-only">Adın görünsün mü?</legend>
                                                            <label className="flex items-center gap-1 cursor-pointer">
                                                                <input
                                                                    type="radio"
                                                                    name="shows_author_name"
                                                                    value="1"
                                                                    defaultChecked={impression.shows_author_name !== false}
                                                                    className="size-3 accent-amber-500"
                                                                />
                                                                <span>İsmimle</span>
                                                            </label>
                                                            <label className="flex items-center gap-1 cursor-pointer">
                                                                <input
                                                                    type="radio"
                                                                    name="shows_author_name"
                                                                    value="0"
                                                                    defaultChecked={impression.shows_author_name === false}
                                                                    className="size-3 accent-amber-500"
                                                                />
                                                                <span>İsimsiz</span>
                                                            </label>
                                                        </fieldset>
                                                        <Button type="submit" size="sm" variant="outline" className="rounded-lg">
                                                            <Pencil className="size-3 mr-1" />
                                                            Düzelt
                                                        </Button>
                                                    </div>
                                                </Form>
                                            )}

                                            <div className="flex w-full items-center justify-end gap-2 pt-1">
                                                {impression.can_hide && (
                                                    <Form {...hideImpression.form([event, impression])}>
                                                        <Button
                                                            type="submit"
                                                            size="sm"
                                                            variant="ghost"
                                                            className="text-xs text-muted-foreground"
                                                        >
                                                            <EyeOff className="size-3 mr-1" />
                                                            Profilimden Gizle
                                                        </Button>
                                                    </Form>
                                                )}
                                                {impression.can_delete && (
                                                    <Form {...destroyImpression.form([event, impression])}>
                                                        <Button
                                                            type="submit"
                                                            size="sm"
                                                            variant="ghost"
                                                            className="text-xs text-destructive hover:bg-destructive/10"
                                                        >
                                                            <Trash2 className="size-3 mr-1" />
                                                            Kaldır
                                                        </Button>
                                                    </Form>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    )}
                </Card>
            </div>
        </>
    );
}
