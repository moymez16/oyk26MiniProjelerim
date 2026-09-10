import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Calendar,
    CheckCircle2,
    FolderHeart,
    Mail,
    MapPin,
    Shield,
    Sparkles,
    UserCheck,
} from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/actions/App/Http/Controllers/InvitationController';
import { login, register } from '@/routes';

type Props = {
    token: string;
    event: {
        name: string;
        description: string;
        location: string | null;
        starts_on: string;
        ends_on: string | null;
    };
    invitee_name: string;
    inviter_name: string;
    is_authenticated: boolean;
    email_mismatch: boolean;
    already_joined: boolean;
};

export default function InvitationShow({
    token,
    event,
    invitee_name,
    inviter_name,
    is_authenticated,
    email_mismatch,
    already_joined,
}: Props) {
    return (
        <>
            <Head title={`${event.name} — Özel Davet`} />

            <div className="relative flex flex-col gap-6">
                {/* Invitation Card */}
                <div className="text-center">
                    <div className="mx-auto mb-3 inline-flex size-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-500 ring-2 ring-amber-500/30 shadow-lg">
                        <Mail className="size-7" />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        {inviter_name} Seni Bir Zaman Kapsülüne Davet Etti
                    </p>
                    <h1 className="font-serif-title mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        {event.name}
                    </h1>
                    <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Calendar className="size-3 text-amber-500" />
                            <span>
                                {event.starts_on}
                                {event.ends_on ? ` — ${event.ends_on}` : ''}
                            </span>
                        </div>
                        {event.location && (
                            <div className="flex items-center gap-1">
                                <MapPin className="size-3 text-amber-500" />
                                <span>{event.location}</span>
                            </div>
                        )}
                    </div>
                    {event.description && (
                        <p className="mt-3 text-sm text-foreground/80 italic">
                            “{event.description}”
                        </p>
                    )}
                    <div className="mt-4 inline-block rounded-full bg-muted/60 px-4 py-1 text-xs font-medium">
                        Bu özel davetiye <span className="font-bold text-foreground">{invitee_name}</span> adına hazırlandı.
                    </div>
                </div>

                {/* Consent & Ethics Box */}
                <div className="glass-panel rounded-2xl p-5 ring-1 ring-amber-500/20 text-xs">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                        <Shield className="size-4 text-amber-500" />
                        <span>Katılım ve Hatıra İlkeleri</span>
                    </div>
                    <ul className="mt-2.5 list-disc space-y-1.5 pl-4 text-muted-foreground leading-relaxed">
                        <li>
                            Buradaki içerikler birlikte geçirilen dönemin ortak hatırası olarak saklanır.
                        </li>
                        <li>
                            Etkinlikteki diğer kişiler senin hakkında hatıra notları yazabilir ve bu notlar diğer katılımcılar tarafından görülebilir.
                        </li>
                        <li>
                            İçerikler ve fotoğraflar dijital ve basılabilir yıllık albümlerinde yer alabilir.
                        </li>
                    </ul>
                </div>

                {/* Actions */}
                {already_joined ? (
                    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-center text-sm font-medium text-amber-600 dark:text-amber-300">
                        <CheckCircle2 className="mx-auto size-6 mb-1 text-amber-500" />
                        Bu daveti zaten kabul ettiniz ve albüme katıldınız.
                    </div>
                ) : email_mismatch ? (
                    <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-center text-sm font-medium text-destructive">
                        Bu davetiye başka bir e-posta adresine gönderilmiş. Lütfen davetiyedeki e-posta ile giriş yapın.
                    </div>
                ) : is_authenticated ? (
                    <Form {...store.form(token)} className="space-y-4">
                        {({ processing, errors }) => (
                            <>
                                <div className="flex items-start gap-3">
                                    <Checkbox
                                        id="consent"
                                        name="consent"
                                        value="1"
                                        required
                                        className="mt-0.5"
                                    />
                                    <Label
                                        htmlFor="consent"
                                        className="text-xs leading-normal cursor-pointer"
                                    >
                                        İçerik kurallarını, rıza metnini ve hatıra ilkelerini okudum, kabul ediyorum.
                                    </Label>
                                </div>
                                <InputError
                                    message={
                                        errors.consent ?? errors.invitation
                                    }
                                />
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="h-11 w-full rounded-xl bg-amber-500 font-semibold text-black shadow-lg shadow-amber-500/20 hover:bg-amber-400"
                                >
                                    {processing ? <Spinner /> : <UserCheck className="size-4 mr-1.5" />}
                                    Daveti Kabul Et ve Albüme Katıl
                                </Button>
                            </>
                        )}
                    </Form>
                ) : (
                    <div className="grid gap-3">
                        <Button
                            asChild
                            className="h-11 rounded-xl bg-amber-500 font-semibold text-black shadow-lg shadow-amber-500/20 hover:bg-amber-400"
                        >
                            <Link href={register()}>
                                Hesap Oluştur ve Katıl
                                <ArrowRight className="size-4 ml-1.5" />
                            </Link>
                        </Button>
                        <Button variant="outline" asChild className="rounded-xl">
                            <Link href={login()}>Zaten Hesabım Var, Giriş Yap</Link>
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}

InvitationShow.layout = {
    title: 'Özel Zaman Kapsülü Daveti',
    description: 'Sana özel bir hatıra alanına davet edildin',
};
