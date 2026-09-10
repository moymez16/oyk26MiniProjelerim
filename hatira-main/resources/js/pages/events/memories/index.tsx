import { Form, Head, setLayoutProps } from '@inertiajs/react';
import { motion } from 'motion/react';
import {
    Calendar,
    Camera,
    Flag,
    FolderHeart,
    Heart,
    ImagePlus,
    Pencil,
    Send,
    Sparkles,
    Trash2,
} from 'lucide-react';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useInitials } from '@/hooks/use-initials';
import {
    index as eventsIndex,
    show as eventShow,
} from '@/actions/App/Http/Controllers/EventController';
import {
    destroy,
    index,
    store,
    update,
} from '@/actions/App/Http/Controllers/Events/MemoryController';
import { storeMemory as reportMemory } from '@/actions/App/Http/Controllers/Events/ReportController';
import type { EventDetail } from '@/types';

export type PresentedMemory = {
    ulid: string;
    body: string;
    occurred_on: string | null;
    created_at: string | null;
    event_day_label: string;
    display_date: string;
    author_name: string;
    author_ulid: string;
    author_photo_url: string | null;
    attachments: { ulid: string; url: string }[];
    can_update: boolean;
    can_delete: boolean;
    can_report?: boolean;
};

type Props = {
    event: Pick<EventDetail, 'ulid' | 'name'> & {
        starts_on: string;
        ends_on: string | null;
    };
    memories: PresentedMemory[];
};

export default function EventMemories({ event, memories }: Props) {
    const initials = useInitials();

    setLayoutProps({
        breadcrumbs: [
            { title: 'Anı Albümleri', href: eventsIndex() },
            { title: event.name, href: eventShow(event) },
            { title: 'Anılar', href: index(event) },
        ],
    });

    return (
        <>
            <Head title={`${event.name} — Anılar`} />

            <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 p-4 md:p-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-500">
                        <Sparkles className="size-3.5" />
                        <span>Kolektif Günlük</span>
                    </div>
                    <h1 className="font-serif-title mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Ortak Anılar
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Bu etkinlikte birlikte yaşanan unutulmaz anlar. Belirli bir kişiye değil, tüm gruba ait.
                    </p>
                </motion.div>

                {/* Create Memory Card Composer */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <Card className="glass-panel rounded-3xl ring-1 ring-amber-500/25 shadow-xl">
                        <CardHeader className="border-b border-border/40 pb-4">
                            <CardTitle className="font-serif-title flex items-center gap-2 text-xl font-bold">
                                <Camera className="size-5 text-amber-500" />
                                Bir Anı Bırak
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">
                                O an neler yaşandı? Bir fotoğraf ekleyin veya hislerinizi kelimelere dökün.
                            </p>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <Form
                                {...store.form(event)}
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
                                            placeholder="Bugün ne oldu? Gece yapılan o samimi sohbet, kamp ateşi ya da unutulmaz bir an..."
                                            className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-amber-500/50 dark:bg-input/30 w-full rounded-2xl border bg-background/50 p-4 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                                        />
                                        <InputError message={errors.body} />

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="grid gap-1.5">
                                                <Label htmlFor="occurred_on" className="text-xs font-semibold">
                                                    Olayın Gerçek Günü
                                                </Label>
                                                <input
                                                    id="occurred_on"
                                                    name="occurred_on"
                                                    type="date"
                                                    className="border-input dark:bg-input/30 w-full rounded-xl border bg-background/50 px-3.5 py-2 text-sm"
                                                />
                                                <InputError message={errors.occurred_on} />
                                            </div>

                                            <div className="grid gap-1.5">
                                                <Label htmlFor="images" className="text-xs font-semibold">
                                                    Fotoğraflar (Çoklu Seçim)
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
                                        </div>

                                        <div className="flex justify-end pt-2">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="rounded-full bg-amber-500 px-6 font-semibold text-black shadow-lg shadow-amber-500/20 hover:bg-amber-400"
                                            >
                                                {processing ? <Spinner /> : <Send className="size-4 mr-1.5" />}
                                                Anıyı Paylaş
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Memories Timeline Feed */}
                {memories.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7 }}
                        className="glass-panel flex flex-col items-center justify-center rounded-3xl p-12 text-center ring-1 ring-amber-500/15"
                    >
                        <FolderHeart className="size-12 text-amber-500/40" />
                        <h3 className="font-serif-title mt-4 text-xl font-bold">Henüz anı eklenmemiş</h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Bu albümün ilk hatırasını siz bırakabilirsiniz.
                        </p>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        {memories.map((memory, idx) => (
                            <motion.div
                                key={memory.ulid}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{
                                    duration: 0.6,
                                    delay: (idx % 4) * 0.08,
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                                className="polaroid-card rounded-3xl p-6 ring-1 ring-amber-500/15 shadow-lg"
                            >
                                {/* Author & Timestamp Header */}
                                <div className="flex items-center justify-between border-b border-border/40 pb-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="size-10 ring-2 ring-amber-500/20 shadow-md">
                                            {memory.author_photo_url && (
                                                <AvatarImage
                                                    src={memory.author_photo_url}
                                                    alt={memory.author_name}
                                                />
                                            )}
                                            <AvatarFallback className="bg-amber-500/10 text-xs font-bold text-amber-600 dark:text-amber-300">
                                                {initials(memory.author_name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-medium text-sm text-foreground">
                                                {memory.author_name}
                                            </h3>
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Calendar className="size-3 text-amber-500" />
                                                <span>{memory.event_day_label}</span>
                                                {memory.display_date && (
                                                    <span>· {memory.display_date}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {memory.can_report && (
                                        <Form {...reportMemory.form([event, memory])}>
                                            <input
                                                type="hidden"
                                                name="reason"
                                                value="inappropriate"
                                            />
                                            <Button
                                                type="submit"
                                                size="sm"
                                                variant="ghost"
                                                className="text-xs text-muted-foreground hover:text-destructive"
                                            >
                                                <Flag className="size-3 mr-1" />
                                                Bildir
                                            </Button>
                                        </Form>
                                    )}
                                </div>

                                {/* Body Text */}
                                <div className="py-4">
                                    <p className="font-serif-title whitespace-pre-wrap text-base leading-relaxed text-foreground/90 sm:text-lg">
                                        {memory.body}
                                    </p>
                                </div>

                                {/* Photo Gallery (Polaroid-style thumbnails) */}
                                {memory.attachments.length > 0 && (
                                    <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                        {memory.attachments.map((attachment) => (
                                            <div
                                                key={attachment.ulid}
                                                className="overflow-hidden rounded-2xl border border-border shadow-md transition-transform hover:scale-105"
                                            >
                                                <img
                                                    src={attachment.url}
                                                    alt=""
                                                    className="h-36 w-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Edit / Delete Controls */}
                                {(memory.can_update || memory.can_delete) && (
                                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/40 pt-4 text-xs">
                                        {memory.can_update && (
                                            <Form
                                                {...update.form([event, memory])}
                                                className="grid w-full gap-2 pt-2"
                                            >
                                                <textarea
                                                    name="body"
                                                    defaultValue={memory.body}
                                                    rows={2}
                                                    className="border-input focus-visible:border-ring focus-visible:ring-amber-500/50 dark:bg-input/30 w-full rounded-xl border bg-background/50 p-2.5 text-xs shadow-xs outline-none focus-visible:ring-[3px]"
                                                />
                                                <div className="flex items-center justify-between gap-2">
                                                    <input
                                                        type="date"
                                                        name="occurred_on"
                                                        defaultValue={memory.occurred_on ?? ''}
                                                        className="border-input dark:bg-input/30 rounded-lg border bg-background/50 px-2.5 py-1 text-xs"
                                                    />
                                                    <Button
                                                        type="submit"
                                                        size="sm"
                                                        variant="outline"
                                                        className="rounded-lg"
                                                    >
                                                        <Pencil className="size-3 mr-1" />
                                                        Düzelt
                                                    </Button>
                                                </div>
                                            </Form>
                                        )}
                                        {memory.can_delete && (
                                            <div className="flex w-full justify-end pt-2">
                                                <Form {...destroy.form([event, memory])}>
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
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
