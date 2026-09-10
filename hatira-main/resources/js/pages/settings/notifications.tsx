import { Form, Head } from '@inertiajs/react';
import NotificationPreferenceController from '@/actions/App/Http/Controllers/Settings/NotificationPreferenceController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { edit } from '@/routes/notifications/preferences';

type Props = {
    preferences: {
        new_impression: boolean;
        new_memory: boolean;
        new_participant: boolean;
    };
};

export default function NotificationPreferences({ preferences }: Props) {
    return (
        <>
            <Head title="Bildirim ayarları" />

            <h1 className="sr-only">Bildirim ayarları</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Bildirimler"
                    description="Hangi haberlerin geleceğini seç. Kapalı olanlar hem e-postaya hem uygulamaya düşmez."
                />

                <Form
                    {...NotificationPreferenceController.update.form()}
                    options={{ preserveScroll: true }}
                    className="space-y-6"
                >
                    {({ processing }) => (
                        <>
                            <label className="flex items-start gap-3 text-sm">
                                <input
                                    type="hidden"
                                    name="new_impression"
                                    value="0"
                                />
                                <input
                                    type="checkbox"
                                    name="new_impression"
                                    value="1"
                                    defaultChecked={preferences.new_impression}
                                    className="mt-1"
                                />
                                <span>
                                    <span className="font-medium">
                                        Hakkımda izlenim
                                    </span>
                                    <span className="text-muted-foreground block">
                                        Biri senin hakkında yazınca haber ver.
                                    </span>
                                </span>
                            </label>
                            <label className="flex items-start gap-3 text-sm">
                                <input
                                    type="hidden"
                                    name="new_memory"
                                    value="0"
                                />
                                <input
                                    type="checkbox"
                                    name="new_memory"
                                    value="1"
                                    defaultChecked={preferences.new_memory}
                                    className="mt-1"
                                />
                                <span>
                                    <span className="font-medium">
                                        Yeni anı
                                    </span>
                                    <span className="text-muted-foreground block">
                                        Etkinliğe bir anı eklenince haber ver.
                                    </span>
                                </span>
                            </label>
                            <label className="flex items-start gap-3 text-sm">
                                <input
                                    type="hidden"
                                    name="new_participant"
                                    value="0"
                                />
                                <input
                                    type="checkbox"
                                    name="new_participant"
                                    value="1"
                                    defaultChecked={preferences.new_participant}
                                    className="mt-1"
                                />
                                <span>
                                    <span className="font-medium">
                                        Yeni katılımcı
                                    </span>
                                    <span className="text-muted-foreground block">
                                        Biri daveti kabul edince haber ver.
                                    </span>
                                </span>
                            </label>
                            <Button type="submit" disabled={processing}>
                                Tercihleri kaydet
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

NotificationPreferences.layout = {
    breadcrumbs: [
        {
            title: 'Bildirim ayarları',
            href: edit(),
        },
    ],
};
