<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\ReorderItemsRequest;
use App\Http\Requests\Admin\StoreInstagramPostRequest;
use App\Http\Requests\Admin\UpdateInstagramPostRequest;
use App\Models\InstagramPost;
use App\Services\InstagramPostService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InstagramPostController extends AdminCrudController
{
    public function __construct(private readonly InstagramPostService $instagramPostService) {}

    public function index(Request $request)
    {
        $this->ensureModuleAccess($request, 'Postingan Instagram');

        $filters = $request->only(['search', 'is_shown']);

        return Inertia::render('admin/instagram-post/index-page', [
            'pageName' => Inertia::always('Postingan Instagram'),
            'instagramPosts' => $this->instagramPostService->paginate($filters),
            'sortableItems' => $this->instagramPostService->listForOrdering(),
            'filters' => $filters,
        ]);
    }

    public function create(Request $request)
    {
        $this->ensureModuleAccess($request, 'Postingan Instagram');

        return Inertia::render('admin/instagram-post/form-page', [
            'pageName' => Inertia::always('Tambah Postingan Instagram'),
            'instagramPost' => null,
        ]);
    }

    public function store(StoreInstagramPostRequest $request)
    {
        $this->ensureModuleAccess($request, 'Postingan Instagram');

        $this->instagramPostService->create($request->safe()->except('image'), $request->file('image'));

        return redirect()->route('admin.instagram-post.index')->with('success', 'Postingan Instagram berhasil ditambahkan.');
    }

    public function edit(Request $request, InstagramPost $instagramPost)
    {
        $this->ensureModuleAccess($request, 'Postingan Instagram');

        return Inertia::render('admin/instagram-post/form-page', [
            'pageName' => Inertia::always('Ubah Postingan Instagram'),
            'instagramPost' => $instagramPost,
        ]);
    }

    public function update(UpdateInstagramPostRequest $request, InstagramPost $instagramPost)
    {
        $this->ensureModuleAccess($request, 'Postingan Instagram');

        $this->instagramPostService->update($instagramPost, $request->safe()->except('image'), $request->file('image'));

        return redirect()->route('admin.instagram-post.index')->with('success', 'Postingan Instagram berhasil diperbarui.');
    }

    public function destroy(Request $request, InstagramPost $instagramPost)
    {
        $this->ensureModuleAccess($request, 'Postingan Instagram');

        $this->instagramPostService->delete($instagramPost);

        return redirect()->route('admin.instagram-post.index')->with('success', 'Postingan Instagram berhasil dihapus.');
    }

    public function reorder(ReorderItemsRequest $request)
    {
        $this->ensureModuleAccess($request, 'Postingan Instagram');

        $this->instagramPostService->reorder($request->validated('ids'));

        return back()->with('success', 'Urutan postingan Instagram berhasil diperbarui.');
    }
}
