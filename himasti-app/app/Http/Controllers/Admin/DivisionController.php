<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\ReorderItemsRequest;
use App\Http\Requests\Admin\StoreDivisionRequest;
use App\Http\Requests\Admin\UpdateDivisionRequest;
use App\Models\Division;
use App\Services\DivisionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DivisionController extends AdminCrudController
{
    public function __construct(private readonly DivisionService $divisionService) {}

    public function index(Request $request)
    {
        $this->ensureModuleAccess($request, 'Divisi');

        $filters = $request->only(['search', 'is_active']);

        return Inertia::render('admin/division/index-page', [
            'pageName' => Inertia::always('Divisi'),
            'divisions' => $this->divisionService->paginate($filters),
            'sortableItems' => $this->divisionService->listForOrdering(),
            'filters' => $filters,
        ]);
    }

    public function create(Request $request)
    {
        $this->ensureModuleAccess($request, 'Divisi');

        return Inertia::render('admin/division/form-page', [
            'pageName' => Inertia::always('Tambah Divisi'),
            'division' => null,
        ]);
    }

    public function store(StoreDivisionRequest $request)
    {
        $this->ensureModuleAccess($request, 'Divisi');

        $this->divisionService->create(
            $request->safe()->except(['logo', 'cover_image']),
            $request->file('logo'),
            $request->file('cover_image')
        );

        return redirect()->route('admin.division.index')->with('success', 'Divisi berhasil ditambahkan.');
    }

    public function edit(Request $request, Division $division)
    {
        $this->ensureModuleAccess($request, 'Divisi');

        return Inertia::render('admin/division/form-page', [
            'pageName' => Inertia::always('Ubah Divisi'),
            'division' => $division,
        ]);
    }

    public function update(UpdateDivisionRequest $request, Division $division)
    {
        $this->ensureModuleAccess($request, 'Divisi');

        $this->divisionService->update(
            $division,
            $request->safe()->except(['logo', 'cover_image']),
            $request->file('logo'),
            $request->file('cover_image')
        );

        return redirect()->route('admin.division.index')->with('success', 'Divisi berhasil diperbarui.');
    }

    public function destroy(Request $request, Division $division)
    {
        $this->ensureModuleAccess($request, 'Divisi');

        $this->divisionService->delete($division);

        return redirect()->route('admin.division.index')->with('success', 'Divisi berhasil dihapus.');
    }

    public function reorder(ReorderItemsRequest $request)
    {
        $this->ensureModuleAccess($request, 'Divisi');

        $this->divisionService->reorder($request->validated('ids'));

        return back()->with('success', 'Urutan divisi berhasil diperbarui.');
    }
}
