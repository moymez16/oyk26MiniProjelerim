/**
 * Automatically discovers, sorts, and extracts URLs for all hero images
 * in /public/image/hero/resim/ using Vite's glob import.
 * Any new image placed in that folder will be automatically included.
 */
const heroImagesGlob = import.meta.glob(
    '/public/image/hero/resim/*.{jpg,jpeg,png,webp,avif}',
    { eager: true }
);

export const heroImages: string[] = Object.keys(heroImagesGlob)
    .sort((a, b) => {
        return a.localeCompare(b, undefined, {
            numeric: true,
            sensitivity: 'base',
        });
    })
    .map((key) => key.replace(/^\/public/, ''));

/**
 * Preloads all hero images into browser memory to eliminate transition flickers.
 */
export function preloadHeroImages(images: string[] = heroImages): Promise<void[]> {
    if (typeof window === 'undefined') return Promise.resolve([]);

    const promises = images.map((src) => {
        return new Promise<void>((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve();
            img.onerror = () => resolve(); // Don't block if one fails
        });
    });

    return Promise.all(promises);
}
