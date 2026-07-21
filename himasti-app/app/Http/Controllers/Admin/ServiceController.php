<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\ReorderItemsRequest;
use App\Http\Requests\Admin\StoreServiceRequest;
use App\Http\Requests\Admin\UpdateServiceRequest;
use App\Models\Service;
use App\Services\ServiceItemService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceController extends AdminCrudController
{
    public function __construct(private readonly ServiceItemService $serviceItemService) {}

    public function index(Request $request)
    {
        $this->ensureModuleAccess($request, 'Layanan');

        $filters = $request->only(['search', 'is_active']);

        return Inertia::render('admin/service/index-page', [
            'pageName' => Inertia::always('Layanan'),
            'services' => $this->serviceItemService->paginate($filters),
            'sortableItems' => $this->serviceItemService->listForOrdering(),
            'filters' => $filters,
        ]);
    }

    public function create(Request $request)
    {
        $this->ensureModuleAccess($request, 'Layanan');

        return Inertia::render('admin/service/form-page', [
            'pageName' => Inertia::always('Tambah Layanan'),
            'serviceItem' => null,
        ]);
    }

    public function store(StoreServiceRequest $request)
    {
        $this->ensureModuleAccess($request, 'Layanan');

        $this->serviceItemService->create($request->safe()->except('logo'), $request->file('logo'));

        return redirect()->route('admin.service.index')->with('success', 'Layanan berhasil ditambahkan.');
    }

    public function edit(Request $request, Service $service)
    {
        $this->ensureModuleAccess($request, 'Layanan');

        return Inertia::render('admin/service/form-page', [
            'pageName' => Inertia::always('Ubah Layanan'),
            'serviceItem' => $service,
        ]);
    }

    public function update(UpdateServiceRequest $request, Service $service)
    {
        $this->ensureModuleAccess($request, 'Layanan');

        $this->serviceItemService->update($service, $request->safe()->except('logo'), $request->file('logo'));

        return redirect()->route('admin.service.index')->with('success', 'Layanan berhasil diperbarui.');
    }

    public function destroy(Request $request, Service $service)
    {
        $this->ensureModuleAccess($request, 'Layanan');

        $this->serviceItemService->delete($service);

        return redirect()->route('admin.service.index')->with('success', 'Layanan berhasil dihapus.');
    }

    public function reorder(ReorderItemsRequest $request)
    {
        $this->ensureModuleAccess($request, 'Layanan');

        $this->serviceItemService->reorder($request->validated('ids'));

        return back()->with('success', 'Urutan layanan berhasil diperbarui.');
    }
}
