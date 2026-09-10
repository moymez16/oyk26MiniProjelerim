import { Form, Head } from '@inertiajs/react';
import { CalendarPlus, Sparkles } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
    create,
    index,
    store,
} from '@/actions/App/Http/Controllers/EventController';

export default function EventsCreate() {
    return (
        <>
            <Head title="Yeni Zaman Kapsülü — Hatıra" />

            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4 md:p-8">
                <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-500">
                        <Sparkles className="size-3.5" />
                        <span>Yeni Albüm</span>
                    </div>
                    <h1 className="font-serif-title mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Zaman Kapsülü Başlat
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Birlikte geçirdiğiniz dönemin anılarını ve yıllık notlarını biriktireceğiniz alanı açın.
                    </p>
                </div>

                <Card className="glass-panel rounded-3xl ring-1 ring-amber-500/20 shadow-xl">
                    <CardContent className="pt-6">
                        <Form {...store.form()} className="space-y-6">
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="name" className="text-sm font-semibold">
                                            Albüm / Etkinlik Adı
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            required
                                            autoFocus
                                            placeholder="Örn: Özgür Yazılım Yaz Kampı 2026 — Laravel"
                                            className="rounded-xl border-border/60 bg-background/50 focus-visible:ring-amber-500"
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="description" className="text-sm font-semibold">
                                            Kısa Açıklama
                                        </Label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            required
                                            rows={3}
                                            placeholder="Dokuz gün boyunca aynı sınıfta eğitim alan sınıfımızın ortak hatıra alanı."
                                            className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-amber-500/50 dark:bg-input/30 w-full rounded-xl border bg-background/50 px-3.5 py-2.5 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                                        />
                                        <InputError message={errors.description} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="location" className="text-sm font-semibold">
                                            Konum <span className="text-xs font-normal text-muted-foreground">(İsteğe bağlı)</span>
                                        </Label>
                                        <Input
                                            id="location"
                                            name="location"
                                            placeholder="Örn: Bolu, Abant"
                                            className="rounded-xl border-border/60 bg-background/50 focus-visible:ring-amber-500"
                                        />
                                        <InputError message={errors.location} />
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="starts_on" className="text-sm font-semibold">
                                                Başlangıç Tarihi
                                            </Label>
                                            <Input
                                                id="starts_on"
                                                name="starts_on"
                                                type="date"
                                                required
                                                className="rounded-xl border-border/60 bg-background/50 focus-visible:ring-amber-500"
                                            />
                                            <InputError message={errors.starts_on} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="ends_on" className="text-sm font-semibold">
                                                Bitiş Tarihi <span className="text-xs font-normal text-muted-foreground">(İsteğe bağlı)</span>
                                            </Label>
                                            <Input
                                                id="ends_on"
                                                name="ends_on"
                                                type="date"
                                                className="rounded-xl border-border/60 bg-background/50 focus-visible:ring-amber-500"
                                            />
                                            <InputError message={errors.ends_on} />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="long_description" className="text-sm font-semibold">
                                            Karşılama ve Giriş Notu <span className="text-xs font-normal text-muted-foreground">(İsteğe bağlı)</span>
                                        </Label>
                                        <textarea
                                            id="long_description"
                                            name="long_description"
                                            rows={4}
                                            placeholder="Katılımcıların albümü açtığında göreceği samimi karşılama mektubu..."
                                            className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-amber-500/50 dark:bg-input/30 w-full rounded-xl border bg-background/50 px-3.5 py-2.5 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                                        />
                                        <InputError message={errors.long_description} />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="h-11 w-full rounded-xl bg-amber-500 font-semibold text-black shadow-lg shadow-amber-500/20 hover:bg-amber-400"
                                    >
                                        {processing ? <Spinner /> : <Sparkles className="size-4 mr-1.5" />}
                                        Zaman Kapsülünü Başlat
                                    </Button>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

EventsCreate.layout = {
    breadcrumbs: [
        {
            title: 'Anı Albümleri',
            href: index(),
        },
        {
            title: 'Yeni Albüm',
            href: create(),
        },
    ],
};
