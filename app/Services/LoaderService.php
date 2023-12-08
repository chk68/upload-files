<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;


class LoaderService
{
    const SAVE_PATH = 'app/uploads/newFile';

    public function extractTokenFromId(string $fileName): string
    {
        $fileNameArr = explode('_', $fileName);
        return end($fileNameArr);
    }

    public function getFileExtension(string $fileName): string
    {
        $fileNameArr = explode('_', $fileName);
        array_pop($fileNameArr);
        $tmpFileNameArr = explode('.', end($fileNameArr));
        return end($tmpFileNameArr);
    }

    public function uploadChunk(string $fileName, ?UploadedFile $chunk): ?string
    {

        if ($chunk !== null) {
            $token = $this->extractTokenFromId($fileName);
            $ext = $this->getFileExtension($fileName);

            $basePath = storage_path(self::SAVE_PATH);
            $filePath = $basePath . '/' . $token . '.' . $ext;

            file_put_contents($filePath, file_get_contents($chunk), FILE_APPEND);

            return $filePath;
        } else {
            return null;
        }
    }

}
