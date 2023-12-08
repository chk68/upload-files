<?php

namespace App\Http\Controllers;

use App\Services\LoaderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use \Illuminate\Contracts\View\View;
use \Illuminate\Foundation\Application;
use \Illuminate\Contracts\View\Factory;
use \Illuminate\Contracts\Foundation\Application as Applic;

class LoaderController extends Controller
{
    protected LoaderService $fileLoaderService;

    public function __construct(LoaderService $fileLoaderService)
    {
        $this->fileLoaderService = $fileLoaderService;
    }

    public function index(): View|Application|Factory|Applic
    {
        return view('index');
    }

    public function uploadChunk(Request $request): JsonResponse
    {
        $filePath = $this->fileLoaderService->uploadChunk(
            $request->header('X-File-Id'),
            $request->file('fileChunk')
        );

        return response()->json(($filePath !== null) ? [
            'message' => 'Chunk uploaded successfully',
            'file_path' => $filePath
        ] : [
            'message' => 'Chunk is empty'
        ]);
    }

}
