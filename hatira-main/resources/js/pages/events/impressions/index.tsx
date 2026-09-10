import { Form, Head, Link, setLayoutProps } from '@inertiajs/react';
import {
    Eye,
    EyeOff,
    Heart,
    MessageSquareQuote,
    Pencil,
    Sparkles,
    Trash2,
    User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    index as eventsIndex,
    show as eventShow,
} from '@/actions/App/Http/Controllers/EventController';
import {
    destroy,
    index,
    update,
} from '@/actions/App/Http/Controllers/Events/ImpressionController';
import { show as participantShow } from '@/actions/App/Http/Controllers/Events/ParticipantProfileController';
import type { EventDetail } from '@/types';

export type PresentedImpression = {
    ulid: string;
    body: string;
    created_at: string | null;
    event_day_label: string;
    attachments: { ulid: string; url: string }[];
    can_update: boolean;
    can_delete: boolean;
    can_hide?: boolean;
    can_report?: boolean;
    author_name?: string;
    author_ulid?: string;
    shows_author_name?: boolean;
    subject_name?: string;
    subject_ulid?: string;
};

type Props = {
    event: Pick<EventDetail, 'ulid' | 'name'>;
    impressions: PresentedImpression[];
};

export default function MyImpressions({ event, impressions }: Props) {
    setLayoutProps({
        breadcrumbs: [
            { title: 'Anı Albümleri', href: eventsIndex() },
            { title: event.name, href: eventShow(event) },
            { title: 'Yazdığım İzlenimler', href: index(event) },
        ],
    });

    const grouped = impressions.reduce<Record<string, PresentedImpression[]>>(
        (groups, impression) => {
            const key = impression.subject_ulid ?? 'unknown';
            groups[key] = [...(groups[key] ?? []), impression];
            return groups;
        },
        {},
    );

    return (
        <>
            <Head title={`${event.name} — Yazdığım İzlenimler`} />

            <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 p-4 md:p-8">
                <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-500">
                        <MessageSquareQuote className="size-3.5" />
                        <span>Dostluk Notları</span>
                    </div>
                    <h1 className="font-serif-title mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Yazdığım İzlenimler
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Katılımcılar hakkında zaman içinde bıraktığınız samimi cümleler ve yıllık notları.
                    </p>
                </div>

                {impressions.length === 0 ? (
                    <div className="glass-panel flex flex-col items-center justify-center rounded-3xl p-12 text-center ring-1 ring-amber-500/15">
                        <MessageSquareQuote className="size-12 text-amber-500/40" />
                        <h3 className="font-serif-title mt-4 text-xl font-bold">Henüz kimse hakkında yazmadınız</h3>
                        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                            Etkinlikteki arkadaşlarının profiline giderek ilk hatıra cümleni bırakabilirsin.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(grouped).map(([subjectUlid, items]) => (
                            <Card key={subjectUlid} className="glass-panel overflow-hidden rounded-3xl ring-1 ring-amber-500/20 shadow-md">
                                <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
                                    <div className="flex items-center gap-2">
                                        <User className="size-4 text-amber-500" />
                                        <CardTitle className="font-serif-title text-lg font-bold">
                                            {items[0]?.subject_ulid ? (
                                                <Link
                                                    href={participantShow([
                                                        event,
                                                        { ulid: items[0].subject_ulid },
                                                    ])}
                                                    className="hover:text-amber-500 transition-colors"
                                                >
                                                    {items[0].subject_name}
                                                </Link>
                                            ) : (
                                                items[0]?.subject_name
                                            )}
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6 pt-6">
                                    {items.map((impression) => (
                                        <ImpressionItem
                                            key={impression.ulid}
                                            event={event}
                                            impression={impression}
                                        />
                                    ))}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

function ImpressionItem({
    event,
    impression,
}: {
    event: Pick<EventDetail, 'ulid' | 'name'>;
    impression: PresentedImpression;
}) {
    return (
        <div className="space-y-3 border-t border-border/30 pt-4 first:border-t-0 first:pt-0">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium text-amber-500">{impression.event_day_label}</span>
                <span>·</span>
                {impression.shows_author_name === false ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400">
                        <EyeOff className="size-3" /> İsimsiz Not
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-300">
                        <Eye className="size-3" /> Adımla Gösteriliyor
                    </span>
                )}
            </div>

            <blockquote className="font-serif-title whitespace-pre-wrap text-base italic leading-relaxed text-foreground/95">
                “{impression.body}”
            </blockquote>

            {impression.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                    {impression.attachments.map((attachment) => (
                        <img
                            key={attachment.ulid}
                            src={attachment.url}
                            alt=""
                            className="h-20 rounded-xl object-cover ring-1 ring-border"
                        />
                    ))}
                </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
                {impression.can_update && (
                    <Form
                        {...update.form([event, impression])}
                        className="grid w-full gap-3 pt-2"
                    >
                        <textarea
                            name="body"
                            defaultValue={impression.body}
                            rows={3}
                            className="border-input focus-visible:border-ring focus-visible:ring-amber-500/50 dark:bg-input/30 w-full rounded-xl border bg-background/50 p-3 text-xs shadow-xs outline-none focus-visible:ring-[3px]"
                        />
                        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                            <fieldset className="flex items-center gap-4">
                                <legend className="sr-only">Adın görünsün mü?</legend>
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="shows_author_name"
                                        value="1"
                                        defaultChecked={impression.shows_author_name !== false}
                                        className="size-3.5 accent-amber-500"
                                    />
                                    <span>İsmimle göster</span>
                                </label>
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="shows_author_name"
                                        value="0"
                                        defaultChecked={impression.shows_author_name === false}
                                        className="size-3.5 accent-amber-500"
                                    />
                                    <span>İsimsiz göster</span>
                                </label>
                            </fieldset>
                            <Button type="submit" size="sm" variant="outline" className="rounded-lg">
                                <Pencil className="size-3 mr-1" />
                                Düzelt
                            </Button>
                        </div>
                    </Form>
                )}

                {impression.can_delete && (
                    <div className="flex w-full justify-end">
                        <Form {...destroy.form([event, impression])}>
                            <Button type="submit" size="sm" variant="ghost" className="text-xs text-destructive hover:bg-destructive/10">
                                <Trash2 className="size-3 mr-1" />
                                Notu Kaldır
                            </Button>
                        </Form>
                    </div>
                )}
            </div>
        </div>
    );
}
