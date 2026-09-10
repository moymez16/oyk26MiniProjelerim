import type { PropsWithChildren } from 'react';

export default function YearbookLayout({ children }: PropsWithChildren) {
    return (
        <div className="yearbook-print bg-background min-h-screen text-neutral-900">
            {children}
        </div>
    );
}
