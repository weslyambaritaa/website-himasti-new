<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\StoreNewsRequest;
use App\Http\Requests\Admin\UpdateNewsRequest;
use App\Models\News;
use App\Services\NewsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewsController extends AdminCrudController
{
    public function __construct(private readonly NewsService $newsService) {}

    public function index(Request $request)
    {
        $this->ensureModuleAccess($request, 'Berita');

        $filters = $request->only(['search', 'status']);

        return Inertia::render('admin/news/index-page', [
            'pageName' => Inertia::always('Berita'),
            'newsItems' => $this->newsService->paginate($filters),
            'filters' => $filters,
        ]);
    }

    public function create(Request $request)
    {
        $this->ensureModuleAccess($request, 'Berita');

        return Inertia::render('admin/news/form-page', [
            'pageName' => Inertia::always('Tambah Berita'),
            'newsItem' => null,
        ]);
    }

    public function store(StoreNewsRequest $request)
    {
        $this->ensureModuleAccess($request, 'Berita');

        $this->newsService->create($request->safe()->except('cover_image'), $request->file('cover_image'));

        return redirect()->route('admin.news.index')->with('success', 'Berita berhasil ditambahkan.');
    }

    public function edit(Request $request, News $news)
    {
        $this->ensureModuleAccess($request, 'Berita');

        return Inertia::render('admin/news/form-page', [
            'pageName' => Inertia::always('Ubah Berita'),
            'newsItem' => $news,
        ]);
    }

    public function update(UpdateNewsRequest $request, News $news)
    {
        $this->ensureModuleAccess($request, 'Berita');

        $this->newsService->update($news, $request->safe()->except('cover_image'), $request->file('cover_image'));

        return redirect()->route('admin.news.index')->with('success', 'Berita berhasil diperbarui.');
    }

    public function destroy(Request $request, News $news)
    {
        $this->ensureModuleAccess($request, 'Berita');

        $this->newsService->delete($news);

        return redirect()->route('admin.news.index')->with('success', 'Berita berhasil dihapus.');
    }
}
