import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background p-6 md:p-10">
            {/* Ambient Background Aura */}
            <div className="pointer-events-none absolute -top-40 -left-40 size-96 rounded-full bg-amber-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -right-40 size-96 rounded-full bg-amber-600/10 blur-3xl" />

            <div className="relative z-10 w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="relative mb-1 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/10 p-2 shadow-[0_0_25px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/30">
                                <AppLogoIcon className="size-7 drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)]" />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="font-serif-title text-2xl font-bold tracking-tight text-foreground">{title}</h1>
                            {description && (
                                <p className="text-muted-foreground text-center text-sm">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
