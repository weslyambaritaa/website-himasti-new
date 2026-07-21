<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\ReorderItemsRequest;
use App\Http\Requests\Admin\StoreWorkProgramRequest;
use App\Http\Requests\Admin\UpdateWorkProgramRequest;
use App\Models\Division;
use App\Models\WorkProgram;
use App\Services\WorkProgramService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkProgramController extends AdminCrudController
{
    public function __construct(private readonly WorkProgramService $workProgramService) {}

    public function index(Request $request)
    {
        $this->ensureModuleAccess($request, 'Program Kerja');

        $filters = $request->only(['search', 'division_id', 'year', 'status', 'is_published', 'is_featured']);

        return Inertia::render('admin/work-program/index-page', [
            'pageName' => Inertia::always('Program Kerja'),
            'workPrograms' => $this->workProgramService->paginate($filters),
            'sortableItems' => $this->workProgramService->listForOrdering(),
            'filters' => $filters,
            'divisions' => Division::query()->whereNull('deleted_at')->orderBy('name')->get(['id', 'name']),
            'statuses' => ['planned', 'ongoing', 'completed', 'cancelled'],
            'years' => WorkProgram::query()->select('year')->distinct()->orderByDesc('year')->pluck('year')->filter()->values(),
        ]);
    }

    public function create(Request $request)
    {
        $this->ensureModuleAccess($request, 'Program Kerja');

        return Inertia::render('admin/work-program/form-page', [
            'pageName' => Inertia::always('Tambah Program Kerja'),
            'workProgram' => null,
            'divisions' => Division::query()->whereNull('deleted_at')->orderBy('name')->get(['id', 'name']),
            'statuses' => ['planned', 'ongoing', 'completed', 'cancelled'],
        ]);
    }

    public function store(StoreWorkProgramRequest $request)
    {
        $this->ensureModuleAccess($request, 'Program Kerja');

        $this->workProgramService->create(
            $request->safe()->except('cover_image'),
            $request->file('cover_image')
        );

        return redirect()->route('admin.work-programs.index')->with('success', 'Program kerja berhasil ditambahkan.');
    }

    public function edit(Request $request, WorkProgram $workProgram)
    {
        $this->ensureModuleAccess($request, 'Program Kerja');

        return Inertia::render('admin/work-program/form-page', [
            'pageName' => Inertia::always('Ubah Program Kerja'),
            'workProgram' => $workProgram->load('division'),
            'divisions' => Division::query()->whereNull('deleted_at')->orderBy('name')->get(['id', 'name']),
            'statuses' => ['planned', 'ongoing', 'completed', 'cancelled'],
        ]);
    }

    public function update(UpdateWorkProgramRequest $request, WorkProgram $workProgram)
    {
        $this->ensureModuleAccess($request, 'Program Kerja');

        $this->workProgramService->update(
            $workProgram,
            $request->safe()->except('cover_image'),
            $request->file('cover_image')
        );

        return redirect()->route('admin.work-programs.index')->with('success', 'Program kerja berhasil diperbarui.');
    }

    public function destroy(Request $request, WorkProgram $workProgram)
    {
        $this->ensureModuleAccess($request, 'Program Kerja');

        $this->workProgramService->delete($workProgram);

        return redirect()->route('admin.work-programs.index')->with('success', 'Program kerja berhasil dihapus.');
    }

    public function reorder(ReorderItemsRequest $request)
    {
        $this->ensureModuleAccess($request, 'Program Kerja');

        $this->workProgramService->reorder($request->validated('ids'));

        return back()->with('success', 'Urutan program kerja berhasil diperbarui.');
    }
}
