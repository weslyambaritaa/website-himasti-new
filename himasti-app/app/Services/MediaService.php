<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaService
{
    public function store(?UploadedFile $file, string $directory): ?string
    {
        if (! $file) {
            return null;
        }

        $extension = $file->getClientOriginalExtension();
        $fileName = Str::uuid()->toString().($extension ? '.'.$extension : '');

        return $file->storeAs($directory, $fileName, 'public');
    }

    public function replace(?UploadedFile $file, ?string $oldPath, string $directory): ?string
    {
        if (! $file) {
            return $oldPath;
        }

        $newPath = $this->store($file, $directory);
        if ($oldPath && $newPath) {
            $this->delete($oldPath);
        }

        return $newPath;
    }

    public function delete(?string $path): void
    {
        if (! $path) {
            return;
        }

        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}
