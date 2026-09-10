import { Form, Head, setLayoutProps } from '@inertiajs/react';
import {
    EyeOff,
    Flag,
    Shield,
    Sparkles,
    Trash2,
    XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    index as eventsIndex,
    show as eventShow,
} from '@/actions/App/Http/Controllers/EventController';
import { update } from '@/actions/App/Http/Controllers/Events/ModerationController';
import type { EventDetail } from '@/types';

type ReportItem = {
    ulid: string;
    reason: string;
    note: string | null;
    status: string;
    reporter_name: string;
    body: string;
    type: string;
};

type Props = {
    event: Pick<EventDetail, 'ulid' | 'name'>;
    reports: ReportItem[];
};

export default function EventModeration({ event, reports }: Props) {
    setLayoutProps({
        breadcrumbs: [
            { title: 'Anı Albümleri', href: eventsIndex() },
            { title: event.name, href: eventShow(event) },
            { title: 'Moderasyon', href: '#' },
        ],
    });

    return (
        <>
            <Head title={`${event.name} — Moderasyon`} />

            <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 p-4 md:p-8">
                <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-500">
                        <Shield className="size-3.5" />
                        <span>Güvenlik & Topluluk</span>
                    </div>
                    <h1 className="font-serif-title mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Moderasyon Paneli
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Katılımcılar tarafından bildirilen içerikleri inceleyin. Gizlemek kaydı durdurur, kaldırmak ise kalıcıdır.
                    </p>
                </div>

                {reports.length === 0 ? (
                    <div className="glass-panel flex flex-col items-center justify-center rounded-3xl p-12 text-center ring-1 ring-amber-500/15">
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                            <Shield className="size-7" />
                        </div>
                        <h3 className="font-serif-title mt-4 text-xl font-bold">Açık bildirim bulunmuyor</h3>
                        <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                            Topluluk ilkelerine aykırı bir durum bildirildiğinde burada listelenecektir.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {reports.map((report) => (
                            <Card key={report.ulid} className="glass-panel overflow-hidden rounded-3xl ring-1 ring-amber-500/20 shadow-md">
                                <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Flag className="size-4 text-rose-500" />
                                            <CardTitle className="text-sm font-bold">
                                                {report.type} · {report.reason}
                                            </CardTitle>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {report.reporter_name} bildirdi ({report.status})
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-6">
                                    <div className="rounded-2xl border border-border/50 bg-background/50 p-4">
                                        <p className="font-serif-title whitespace-pre-wrap text-base italic leading-relaxed text-foreground">
                                            “{report.body}”
                                        </p>
                                    </div>

                                    {report.note && (
                                        <p className="text-xs text-muted-foreground">
                                            Not: {report.note}
                                        </p>
                                    )}

                                    {report.status === 'open' && (
                                        <div className="flex flex-wrap items-center gap-2 pt-2">
                                            <Form {...update.form([event, report])}>
                                                <input
                                                    type="hidden"
                                                    name="action"
                                                    value="hide"
                                                />
                                                <Button
                                                    type="submit"
                                                    size="sm"
                                                    variant="outline"
                                                    className="rounded-xl text-xs"
                                                >
                                                    <EyeOff className="size-3.5 mr-1" />
                                                    Gizle
                                                </Button>
                                            </Form>

                                            <Form {...update.form([event, report])}>
                                                <input
                                                    type="hidden"
                                                    name="action"
                                                    value="remove"
                                                />
                                                <Button
                                                    type="submit"
                                                    size="sm"
                                                    variant="destructive"
                                                    className="rounded-xl text-xs"
                                                >
                                                    <Trash2 className="size-3.5 mr-1" />
                                                    Kalıcı Olarak Kaldır
                                                </Button>
                                            </Form>

                                            <Form {...update.form([event, report])}>
                                                <input
                                                    type="hidden"
                                                    name="action"
                                                    value="dismiss"
                                                />
                                                <Button
                                                    type="submit"
                                                    size="sm"
                                                    variant="ghost"
                                                    className="rounded-xl text-xs text-muted-foreground"
                                                >
                                                    <XCircle className="size-3.5 mr-1" />
                                                    Görmezden Gel
                                                </Button>
                                            </Form>
                                        </div>
                                    )}

                                    <p className="text-[11px] text-muted-foreground">
                                        ⚠️ Kaldırılan içerik daha önce üretilmiş yıllık çıktılarından geri alınamaz.
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
