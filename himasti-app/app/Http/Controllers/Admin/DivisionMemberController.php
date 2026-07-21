<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\ReorderItemsRequest;
use App\Http\Requests\Admin\StoreDivisionMemberRequest;
use App\Http\Requests\Admin\UpdateDivisionMemberRequest;
use App\Models\Division;
use App\Models\DivisionMember;
use App\Services\DivisionMemberService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DivisionMemberController extends AdminCrudController
{
    public function __construct(private readonly DivisionMemberService $divisionMemberService) {}

    public function index(Request $request)
    {
        $this->ensureModuleAccess($request, 'Anggota Divisi');

        $filters = $request->only(['search', 'division_id', 'period', 'is_active']);

        return Inertia::render('admin/division-member/index-page', [
            'pageName' => Inertia::always('Anggota Divisi'),
            'divisionMembers' => $this->divisionMemberService->paginate($filters),
            'sortableItems' => $this->divisionMemberService->listForOrdering(),
            'filters' => $filters,
            'divisions' => Division::query()->orderBy('name')->get(['id', 'name']),
            'periods' => DivisionMember::query()
                ->select('period')
                ->whereNotNull('period')
                ->where('period', '!=', '')
                ->distinct()
                ->orderBy('period')
                ->pluck('period'),
        ]);
    }

    public function create(Request $request)
    {
        $this->ensureModuleAccess($request, 'Anggota Divisi');

        return Inertia::render('admin/division-member/form-page', [
            'pageName' => Inertia::always('Tambah Anggota Divisi'),
            'divisionMember' => null,
            'divisions' => Division::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreDivisionMemberRequest $request)
    {
        $this->ensureModuleAccess($request, 'Anggota Divisi');

        $this->divisionMemberService->create($request->safe()->except('photo'), $request->file('photo'));

        return redirect()->route('admin.division-member.index')->with('success', 'Anggota divisi berhasil ditambahkan.');
    }

    public function edit(Request $request, DivisionMember $divisionMember)
    {
        $this->ensureModuleAccess($request, 'Anggota Divisi');

        return Inertia::render('admin/division-member/form-page', [
            'pageName' => Inertia::always('Ubah Anggota Divisi'),
            'divisionMember' => $divisionMember,
            'divisions' => Division::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(UpdateDivisionMemberRequest $request, DivisionMember $divisionMember)
    {
        $this->ensureModuleAccess($request, 'Anggota Divisi');

        $this->divisionMemberService->update($divisionMember, $request->safe()->except('photo'), $request->file('photo'));

        return redirect()->route('admin.division-member.index')->with('success', 'Anggota divisi berhasil diperbarui.');
    }

    public function destroy(Request $request, DivisionMember $divisionMember)
    {
        $this->ensureModuleAccess($request, 'Anggota Divisi');

        $this->divisionMemberService->delete($divisionMember);

        return redirect()->route('admin.division-member.index')->with('success', 'Anggota divisi berhasil dihapus.');
    }

    public function reorder(ReorderItemsRequest $request)
    {
        $this->ensureModuleAccess($request, 'Anggota Divisi');

        $this->divisionMemberService->reorder($request->validated('ids'));

        return back()->with('success', 'Urutan anggota divisi berhasil diperbarui.');
    }
}
