<?php

namespace App\Actions;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class StorePublicImage
{
    public function handle(UploadedFile $file, string $directory, ?string $previousPath = null): string
    {
        if ($previousPath !== null) {
            $this->delete($previousPath);
        }

        $path = $file->store($directory, 'public');

        if ($path === false) {
            throw new RuntimeException('The uploaded image could not be stored.');
        }

        return $path;
    }

    public function delete(?string $path): void
    {
        if ($path === null || $path === '') {
            return;
        }

        Storage::disk('public')->delete($path);
    }

    public function url(?string $path): ?string
    {
        if ($path === null || $path === '') {
            return null;
        }

        return Storage::disk('public')->url($path);
    }
}
