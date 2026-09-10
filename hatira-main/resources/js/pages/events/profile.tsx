import { Form, Head, setLayoutProps } from '@inertiajs/react';
import {
    Camera,
    FolderHeart,
    Globe,
    Sparkles,
    Trash2,
    Upload,
    UserRound,
} from 'lucide-react';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useInitials } from '@/hooks/use-initials';
import { index, show } from '@/actions/App/Http/Controllers/EventController';
import {
    edit,
    update,
} from '@/actions/App/Http/Controllers/Events/ProfileController';
import type { EventDetail, ProfileLink } from '@/types';

type Props = {
    event: Pick<EventDetail, 'ulid' | 'name'>;
    profile: {
        name: string;
        bio: string | null;
        links: ProfileLink[];
        photo_url: string | null;
    };
};

export default function EventProfileEdit({ event, profile }: Props) {
    const initials = useInitials();

    setLayoutProps({
        breadcrumbs: [
            { title: 'Anı Albümleri', href: index() },
            { title: event.name, href: show(event) },
            { title: 'Etkinlik Profilim', href: edit(event) },
        ],
    });

    const defaultLinks = [
        ...profile.links,
        ...Array.from(
            { length: Math.max(0, 5 - profile.links.length) },
            () => ({
                label: '',
                url: '',
            }),
        ),
    ];

    return (
        <>
            <Head title={`${event.name} — Profilim`} />

            <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 p-4 md:p-8">
                <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-500">
                        <UserRound className="size-3.5" />
                        <span>Kişisel Alan</span>
                    </div>
                    <h1 className="font-serif-title mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Etkinlik Profilin
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {event.name} albümünde görünecek fotoğrafın, biyografin ve sosyal bağlantıların.
                    </p>
                </div>

                <Card className="glass-panel rounded-3xl ring-1 ring-amber-500/20 shadow-xl">
                    <CardHeader className="border-b border-border/40 pb-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="size-20 ring-4 ring-amber-500/30 shadow-lg">
                                {profile.photo_url && (
                                    <AvatarImage
                                        src={profile.photo_url}
                                        alt={profile.name}
                                    />
                                )}
                                <AvatarFallback className="bg-amber-500/15 text-xl font-bold text-amber-600 dark:text-amber-300">
                                    {initials(profile.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="font-serif-title text-xl font-bold">
                                    {profile.name}
                                </CardTitle>
                                <p className="text-xs text-muted-foreground">
                                    Yıllıkta yer alacak portren ve biyografin
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Form
                            {...update.form(event)}
                            encType="multipart/form-data"
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="photo" className="text-sm font-semibold">
                                            Profil Fotoğrafı
                                        </Label>
                                        <Input
                                            id="photo"
                                            name="photo"
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            className="rounded-xl border-border/60 bg-background/50"
                                        />
                                        <InputError message={errors.photo} />
                                    </div>

                                    {profile.photo_url && (
                                        <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="remove_photo"
                                                value="1"
                                                className="size-3.5 rounded accent-amber-500"
                                            />
                                            <span>Mevcut profil fotoğrafını kaldır</span>
                                        </label>
                                    )}

                                    <div className="grid gap-2">
                                        <Label htmlFor="bio" className="text-sm font-semibold">
                                            Kısa Tanıtım / Yıllık Cümlen <span className="text-xs font-normal text-muted-foreground">(En fazla 280 karakter)</span>
                                        </Label>
                                        <textarea
                                            id="bio"
                                            name="bio"
                                            rows={4}
                                            maxLength={280}
                                            defaultValue={profile.bio ?? ''}
                                            placeholder="Örn: Bu kampta öğrendiklerim ve kurduğum dostluklar hayatımın en güzel dönüm noktalarından biri oldu..."
                                            className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-amber-500/50 dark:bg-input/30 w-full rounded-2xl border bg-background/50 p-4 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                                        />
                                        <InputError message={errors.bio} />
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-sm font-semibold">
                                            Bağlantılar & Sosyal Medya
                                        </Label>
                                        {defaultLinks.map((link, idx) => (
                                            <div
                                                key={`${link.label}-${idx}`}
                                                className="grid gap-3 sm:grid-cols-2"
                                            >
                                                <Input
                                                    id={`links-${idx}-label`}
                                                    name={`links[${idx}][label]`}
                                                    defaultValue={link.label}
                                                    placeholder="Örn: GitHub / LinkedIn / Web"
                                                    className="rounded-xl border-border/60 bg-background/50 text-xs"
                                                />
                                                <Input
                                                    id={`links-${idx}-url`}
                                                    name={`links[${idx}][url]`}
                                                    defaultValue={link.url}
                                                    placeholder="https://"
                                                    className="rounded-xl border-border/60 bg-background/50 text-xs"
                                                />
                                            </div>
                                        ))}
                                        <InputError
                                            message={
                                                errors.links ??
                                                errors['links.0.url'] ??
                                                errors['links.0.label']
                                            }
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="h-11 w-full rounded-xl bg-amber-500 font-semibold text-black shadow-lg shadow-amber-500/20 hover:bg-amber-400"
                                    >
                                        {processing ? <Spinner /> : <Sparkles className="size-4 mr-1.5" />}
                                        Profili Kaydet
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
