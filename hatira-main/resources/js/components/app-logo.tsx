import { usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { name } = usePage().props;

    return (
        <div className="flex items-center gap-2.5">
            <div className="relative flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-700/10 p-1.5 shadow-[0_0_15px_rgba(245,158,11,0.2)] ring-1 ring-amber-500/30">
                <AppLogoIcon className="size-5 drop-shadow-[0_2px_4px_rgba(245,158,11,0.4)]" />
            </div>
            <div className="grid flex-1 text-left text-sm">
                <span className="font-serif-title text-base font-bold tracking-tight text-foreground">
                    {name ?? 'Hatıra'}
                </span>
            </div>
        </div>
    );
}
