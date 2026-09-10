import { Form, Head, Link, setLayoutProps } from '@inertiajs/react';
import {
    ArrowRight,
    Bell,
    CheckCheck,
    FolderHeart,
    MessageSquareQuote,
    Sparkles,
    Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    destroy,
    index,
} from '@/actions/App/Http/Controllers/NotificationController';

type NotificationItem = {
    id: string;
    type: string;
    message: string;
    url: string | null;
    read_at: string | null;
    created_at: string | null;
};

type Props = {
    notifications: NotificationItem[];
};

export default function NotificationsIndex({ notifications }: Props) {
    setLayoutProps({
        breadcrumbs: [{ title: 'Bildirimler', href: index() }],
    });

    return (
        <>
            <Head title="Bildirimler — Hatıra" />

            <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 p-4 md:p-8">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-500">
                            <Bell className="size-3.5" />
                            <span>Haberler</span>
                        </div>
                        <h1 className="font-serif-title mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            Bildirimler
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Etkinliklerden ve anı albümlerinden gelen sessiz haberler.
                        </p>
                    </div>

                    {notifications.length > 0 && (
                        <Form {...destroy.form()}>
                            <Button type="submit" variant="ghost" size="sm" className="rounded-full text-xs text-muted-foreground hover:text-foreground">
                                <Trash2 className="size-3.5 mr-1" />
                                Tümünü Temizle
                            </Button>
                        </Form>
                    )}
                </div>

                {notifications.length === 0 ? (
                    <div className="glass-panel flex flex-col items-center justify-center rounded-3xl p-12 text-center ring-1 ring-amber-500/15">
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                            <Bell className="size-7" />
                        </div>
                        <h3 className="font-serif-title mt-4 text-xl font-bold">Şimdilik her şey sessiz</h3>
                        <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                            Yeni bir anı paylaşıldığında, bir izlenim yazıldığında veya davet kabul edildiğinde burada görünür.
                        </p>
                    </div>
                ) : (
                    <Card className="glass-panel overflow-hidden rounded-3xl ring-1 ring-amber-500/20 shadow-md">
                        <CardContent className="divide-y divide-border/40 p-0">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-muted/20"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
                                            <Sparkles className="size-4" />
                                        </div>
                                        {notification.url ? (
                                            <Link
                                                href={notification.url}
                                                className="text-sm font-medium text-foreground hover:text-amber-500 transition-colors"
                                            >
                                                {notification.message}
                                            </Link>
                                        ) : (
                                            <p className="text-sm text-foreground/90">
                                                {notification.message}
                                            </p>
                                        )}
                                    </div>

                                    {notification.url && (
                                        <Link href={notification.url} className="text-muted-foreground hover:text-amber-500">
                                            <ArrowRight className="size-4" />
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}
