import { Form, Head, setLayoutProps } from '@inertiajs/react';
import {
    Calendar,
    FolderHeart,
    ImagePlus,
    Pencil,
    Shield,
    Sparkles,
    Trash2,
    Upload,
    UserCheck,
} from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
    destroy,
    edit,
    index,
    show,
    update,
} from '@/actions/App/Http/Controllers/EventController';
import {
    destroy as destroyCover,
    update as updateCover,
} from '@/actions/App/Http/Controllers/Events/EventCoverController';
import type { EventFormValues } from '@/types';

type Props = {
    event: EventFormValues;
    transferable_participants: { ulid: string; name: string }[];
    allowed_statuses: string[];
};

export default function EventsEdit({
    event,
    transferable_participants,
    allowed_statuses,
}: Props) {
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
            {
                title: 'Düzenle',
                href: edit(event),
            },
        ],
    });

    return (
        <>
            <Head title={`${event.name} — Düzenle`} />

            <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 p-4 md:p-8">
                <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-500">
                        <Pencil className="size-3.5" />
                        <span>Yönetim & Ayarlar</span>
                    </div>
                    <h1 className="font-serif-title mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Albümü Düzenle
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {event.name} albümünün kapak görselini, bilgilerini ve durumunu güncelleyin.
                    </p>
                </div>

                {/* Cover Image Studio Card */}
                <Card className="glass-panel rounded-3xl ring-1 ring-amber-500/20 shadow-md overflow-hidden">
                    <CardHeader className="border-b border-border/40 pb-4">
                        <CardTitle className="font-serif-title text-xl font-bold">
                            Albüm Kapak Görseli
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        {event.cover_url ? (
                            <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-border">
                                <img
                                    src={event.cover_url}
                                    alt={event.name}
                                    className="size-full object-cover"
                                />
                                <div className="absolute top-3 right-3">
                                    <Form {...destroyCover.form(event)}>
                                        {({ processing }) => (
                                            <Button
                                                type="submit"
                                                variant="destructive"
                                                size="sm"
                                                disabled={processing}
                                                className="rounded-full shadow-lg"
                                            >
                                                <Trash2 className="size-3.5 mr-1" />
                                                Kapağı Kaldır
                                            </Button>
                                        )}
                                    </Form>
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-36 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/80 bg-muted/20 text-center">
                                <ImagePlus className="size-8 text-muted-foreground/60" />
                                <p className="mt-2 text-xs text-muted-foreground">Henüz kapak fotoğrafı yüklenmedi</p>
                            </div>
                        )}

                        <Form
                            {...updateCover.form(event)}
                            encType="multipart/form-data"
                            className="space-y-3"
                        >
                            {({ processing, errors }) => (
                                <div className="grid gap-2">
                                    <Label htmlFor="cover" className="text-xs font-semibold">
                                        Yeni Kapak Görseli Seç
                                    </Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="cover"
                                            name="cover"
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            required
                                            className="rounded-xl border-border/60 bg-background/50"
                                        />
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="rounded-xl bg-amber-500 font-semibold text-black hover:bg-amber-400"
                                        >
                                            {processing ? <Spinner /> : <Upload className="size-4 mr-1.5" />}
                                            Yükle
                                        </Button>
                                    </div>
                                    <InputError message={errors.cover} />
                                </div>
                            )}
                        </Form>
                    </CardContent>
                </Card>

                {/* Main Event Info Card */}
                <Card className="glass-panel rounded-3xl ring-1 ring-amber-500/20 shadow-md">
                    <CardHeader className="border-b border-border/40 pb-4">
                        <CardTitle className="font-serif-title text-xl font-bold">
                            Temel Bilgiler
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Form {...update.form(event)} className="space-y-6">
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
                                            defaultValue={event.name}
                                            className="rounded-xl border-border/60 bg-background/50"
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
                                            defaultValue={event.description}
                                            className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-amber-500/50 dark:bg-input/30 w-full rounded-xl border bg-background/50 px-3.5 py-2.5 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                                        />
                                        <InputError message={errors.description} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="location" className="text-sm font-semibold">
                                            Konum
                                        </Label>
                                        <Input
                                            id="location"
                                            name="location"
                                            defaultValue={event.location ?? ''}
                                            className="rounded-xl border-border/60 bg-background/50"
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
                                                defaultValue={event.starts_on}
                                                className="rounded-xl border-border/60 bg-background/50"
                                            />
                                            <InputError message={errors.starts_on} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="ends_on" className="text-sm font-semibold">
                                                Bitiş Tarihi
                                            </Label>
                                            <Input
                                                id="ends_on"
                                                name="ends_on"
                                                type="date"
                                                defaultValue={event.ends_on ?? ''}
                                                className="rounded-xl border-border/60 bg-background/50"
                                            />
                                            <InputError message={errors.ends_on} />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="long_description" className="text-sm font-semibold">
                                            Karşılama ve Giriş Metni
                                        </Label>
                                        <textarea
                                            id="long_description"
                                            name="long_description"
                                            rows={4}
                                            defaultValue={event.long_description ?? ''}
                                            className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-amber-500/50 dark:bg-input/30 w-full rounded-xl border bg-background/50 px-3.5 py-2.5 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                                        />
                                        <InputError message={errors.long_description} />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="h-11 rounded-xl bg-amber-500 font-semibold text-black shadow-lg shadow-amber-500/20 hover:bg-amber-400"
                                    >
                                        {processing ? <Spinner /> : <Sparkles className="size-4 mr-1.5" />}
                                        Değişiklikleri Kaydet
                                    </Button>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>

                {/* Status & Lifecycle Card */}
                <Card className="glass-panel rounded-3xl ring-1 ring-amber-500/20 shadow-md">
                    <CardHeader className="border-b border-border/40 pb-4">
                        <CardTitle className="font-serif-title text-xl font-bold">
                            Yaşam Döngüsü & Kilit Durumu
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                            Tamamlanmış etkinliklerde hatıralar korunur. Kilitlenen yıllıkta yeni anı eklenemez.
                        </p>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Form
                            action={`/events/${event.ulid}/status`}
                            method="put"
                            className="space-y-4"
                        >
                            {allowed_statuses.length === 0 && (
                                <input
                                    type="hidden"
                                    name="status"
                                    value={event.status}
                                />
                            )}
                            {allowed_statuses.length > 0 && (
                                <div className="grid gap-2">
                                    <Label htmlFor="status" className="text-sm font-semibold">
                                        Etkinlik Durumu
                                    </Label>
                                    <select
                                        id="status"
                                        name="status"
                                        className="border-input dark:bg-input/30 w-full rounded-xl border bg-background/50 px-3 py-2 text-sm"
                                        defaultValue={event.status}
                                    >
                                        <option value={event.status}>
                                            {event.status}
                                        </option>
                                        {allowed_statuses.map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <label className="flex items-center gap-2.5 text-sm font-medium">
                                <input
                                    type="hidden"
                                    name="allows_content_after_close"
                                    value="0"
                                />
                                <input
                                    type="checkbox"
                                    name="allows_content_after_close"
                                    value="1"
                                    defaultChecked={
                                        event.allows_content_after_close !== false
                                    }
                                    className="size-4 rounded accent-amber-500"
                                />
                                Hatıralar ve anı girişi açık kalsın
                            </label>

                            <Button type="submit" variant="outline" className="rounded-xl">
                                Durumu Güncelle
                            </Button>
                        </Form>
                    </CardContent>
                </Card>

                {/* Transfer Ownership Card */}
                {transferable_participants.length > 0 && (
                    <Card className="glass-panel rounded-3xl ring-1 ring-amber-500/20 shadow-md">
                        <CardHeader className="border-b border-border/40 pb-4">
                            <CardTitle className="font-serif-title text-xl font-bold">
                                Sahipliği Devret
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">
                                Albüm sahipliğini yalnızca aktif bir katılımcıya devredebilirsiniz.
                            </p>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <Form
                                action={`/events/${event.ulid}/owner`}
                                method="put"
                                className="space-y-4"
                            >
                                <select
                                    name="participant_ulid"
                                    className="border-input dark:bg-input/30 w-full rounded-xl border bg-background/50 px-3 py-2 text-sm"
                                >
                                    {transferable_participants.map((participant) => (
                                        <option
                                            key={participant.ulid}
                                            value={participant.ulid}
                                        >
                                            {participant.name}
                                        </option>
                                    ))}
                                </select>
                                <Button type="submit" variant="outline" className="rounded-xl">
                                    <UserCheck className="size-4 mr-1.5 text-amber-500" />
                                    Sahipliği Devret
                                </Button>
                            </Form>
                        </CardContent>
                    </Card>
                )}

                {/* Danger Zone */}
                <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
                    <h3 className="font-serif-title text-lg font-bold text-destructive">
                        Tehlikeli Bölge
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Bu albümü silmek, tüm ortak anıları, fotoğrafları ve izlenimleri kalıcı olarak kaldırır.
                    </p>
                    <div className="mt-4">
                        <Form {...destroy.form(event)}>
                            {({ processing }) => (
                                <Button
                                    type="submit"
                                    variant="destructive"
                                    disabled={processing}
                                    className="rounded-xl"
                                >
                                    <Trash2 className="size-4 mr-1.5" />
                                    Etkinliği Kalıcı Olarak Sil
                                </Button>
                            )}
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}
