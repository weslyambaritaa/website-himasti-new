<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\StoreDocumentationRequest;
use App\Http\Requests\Admin\UpdateDocumentationRequest;
use App\Models\Documentation;
use App\Models\WorkProgram;
use App\Services\DocumentationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentationController extends AdminCrudController
{
    public function __construct(private readonly DocumentationService $documentationService) {}

    public function index(Request $request)
    {
        $this->ensureModuleAccess($request, 'Dokumentasi');

        $filters = $request->only(['search', 'year', 'work_program_id']);

        return Inertia::render('admin/documentation/index-page', [
            'pageName' => Inertia::always('Dokumentasi'),
            'documentations' => $this->documentationService->paginate($filters),
            'filters' => $filters,
            'workPrograms' => WorkProgram::query()->with('division')->orderByDesc('year')->orderBy('name')->get(['id', 'division_id', 'name', 'year']),
        ]);
    }

    public function create(Request $request)
    {
        $this->ensureModuleAccess($request, 'Dokumentasi');

        return Inertia::render('admin/documentation/form-page', [
            'pageName' => Inertia::always('Tambah Dokumentasi'),
            'documentation' => null,
            'workPrograms' => WorkProgram::query()->with('division')->orderByDesc('year')->orderBy('name')->get(['id', 'division_id', 'name', 'year']),
        ]);
    }

    public function store(StoreDocumentationRequest $request)
    {
        $this->ensureModuleAccess($request, 'Dokumentasi');

        $this->documentationService->create(
            $request->safe()->except(['cover_image', 'images', 'captions', 'existing_image_ids', 'existing_captions']),
            $request->file('cover_image'),
            $request->file('images', []),
            $request->input('captions', [])
        );

        return redirect()->route('admin.documentation.index')->with('success', 'Dokumentasi berhasil ditambahkan.');
    }

    public function edit(Request $request, Documentation $documentation)
    {
        $this->ensureModuleAccess($request, 'Dokumentasi');

        return Inertia::render('admin/documentation/form-page', [
            'pageName' => Inertia::always('Ubah Dokumentasi'),
            'documentation' => $documentation->load('images'),
            'workPrograms' => WorkProgram::query()->with('division')->orderByDesc('year')->orderBy('name')->get(['id', 'division_id', 'name', 'year']),
        ]);
    }

    public function update(UpdateDocumentationRequest $request, Documentation $documentation)
    {
        $this->ensureModuleAccess($request, 'Dokumentasi');

        $this->documentationService->update(
            $documentation,
            $request->safe()->except(['cover_image', 'images', 'captions', 'existing_image_ids', 'existing_captions']),
            $request->file('cover_image'),
            $request->input('existing_image_ids', []),
            $request->input('existing_captions', []),
            $request->input('existing_orders', []),
            $request->file('images', []),
            $request->input('captions', [])
        );

        return redirect()->route('admin.documentation.index')->with('success', 'Dokumentasi berhasil diperbarui.');
    }

    public function destroy(Request $request, Documentation $documentation)
    {
        $this->ensureModuleAccess($request, 'Dokumentasi');

        $this->documentationService->delete($documentation->load('images'));

        return redirect()->route('admin.documentation.index')->with('success', 'Dokumentasi berhasil dihapus.');
    }
}
