import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background p-6 md:p-10">
            {/* Ambient Background Aura */}
            <div className="pointer-events-none absolute -top-40 -left-40 size-96 rounded-full bg-amber-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -right-40 size-96 rounded-full bg-amber-600/10 blur-3xl" />

            <div className="relative z-10 flex w-full max-w-md flex-col gap-6">
                <Link
                    href={home()}
                    className="flex items-center justify-center gap-2 self-center font-medium"
                >
                    <div className="relative flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/10 p-2 shadow-[0_0_25px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/30">
                        <AppLogoIcon className="size-7 drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)]" />
                    </div>
                </Link>

                <div className="flex flex-col gap-6">
                    <Card className="glass-panel rounded-2xl shadow-xl ring-1 ring-amber-500/20">
                        <CardHeader className="px-8 pt-8 pb-2 text-center">
                            <CardTitle className="font-serif-title text-2xl font-bold tracking-tight">
                                {title}
                            </CardTitle>
                            {description && (
                                <CardDescription className="text-sm mt-1">
                                    {description}
                                </CardDescription>
                            )}
                        </CardHeader>
                        <CardContent className="px-8 py-6">
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
