<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\ReorderItemsRequest;
use App\Http\Requests\Admin\StoreBannerRequest;
use App\Http\Requests\Admin\UpdateBannerRequest;
use App\Models\Banner;
use App\Services\BannerService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BannerController extends AdminCrudController
{
    public function __construct(
        private readonly BannerService $bannerService
    ) {}

    public function index(Request $request)
    {
        $this->ensureModuleAccess($request, 'Banner');

        $filters = $request->only(['search', 'is_shown']);

        return Inertia::render('admin/banner/index-page', [
            'pageName' => Inertia::always('Banner'),
            'banners' => $this->bannerService->paginate($filters, 10),
            'sortableItems' => $this->bannerService->listForOrdering(),
            'filters' => $filters,
        ]);
    }

    public function create(Request $request)
    {
        $this->ensureModuleAccess($request, 'Banner');

        return Inertia::render('admin/banner/form-page', [
            'pageName' => Inertia::always('Tambah Banner'),
            'banner' => null,
        ]);
    }

    public function store(StoreBannerRequest $request)
    {
        $this->ensureModuleAccess($request, 'Banner');

        $this->bannerService->create(
            $request->safe()->except('image'),
            $request->file('image')
        );

        return redirect()->route('admin.banner.index')->with('success', 'Banner berhasil ditambahkan.');
    }

    public function edit(Request $request, Banner $banner)
    {
        $this->ensureModuleAccess($request, 'Banner');

        return Inertia::render('admin/banner/form-page', [
            'pageName' => Inertia::always('Ubah Banner'),
            'banner' => $banner,
        ]);
    }

    public function update(UpdateBannerRequest $request, Banner $banner)
    {
        $this->ensureModuleAccess($request, 'Banner');

        $this->bannerService->update(
            $banner,
            $request->safe()->except('image'),
            $request->file('image')
        );

        return redirect()->route('admin.banner.index')->with('success', 'Banner berhasil diperbarui.');
    }

    public function destroy(Request $request, Banner $banner)
    {
        $this->ensureModuleAccess($request, 'Banner');

        $this->bannerService->delete($banner);

        return redirect()->route('admin.banner.index')->with('success', 'Banner berhasil dihapus.');
    }

    public function reorder(ReorderItemsRequest $request)
    {
        $this->ensureModuleAccess($request, 'Banner');

        $this->bannerService->reorder($request->validated('ids'));

        return back()->with('success', 'Urutan banner berhasil diperbarui.');
    }
}
