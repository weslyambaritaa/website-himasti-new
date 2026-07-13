<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\StoreEventRequest;
use App\Http\Requests\Admin\UpdateEventRequest;
use App\Models\Event;
use App\Services\EventService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends AdminCrudController
{
    public function __construct(private readonly EventService $eventService) {}

    public function index(Request $request)
    {
        $this->ensureModuleAccess($request, 'Kegiatan');

        $filters = $request->only(['search', 'location', 'status', 'is_published', 'is_featured']);

        return Inertia::render('admin/event/index-page', [
            'pageName' => Inertia::always('Kegiatan'),
            'events' => $this->eventService->paginate($filters),
            'filters' => $filters,
        ]);
    }

    public function create(Request $request)
    {
        $this->ensureModuleAccess($request, 'Kegiatan');

        return Inertia::render('admin/event/form-page', [
            'pageName' => Inertia::always('Tambah Kegiatan'),
            'eventItem' => null,
        ]);
    }

    public function store(StoreEventRequest $request)
    {
        $this->ensureModuleAccess($request, 'Kegiatan');

        $this->eventService->create($request->safe()->except('cover_image'), $request->file('cover_image'));

        return redirect()->route('admin.event.index')->with('success', 'Kegiatan berhasil ditambahkan.');
    }

    public function edit(Request $request, Event $event)
    {
        $this->ensureModuleAccess($request, 'Kegiatan');

        return Inertia::render('admin/event/form-page', [
            'pageName' => Inertia::always('Ubah Kegiatan'),
            'eventItem' => $event,
        ]);
    }

    public function update(UpdateEventRequest $request, Event $event)
    {
        $this->ensureModuleAccess($request, 'Kegiatan');

        $this->eventService->update($event, $request->safe()->except('cover_image'), $request->file('cover_image'));

        return redirect()->route('admin.event.index')->with('success', 'Kegiatan berhasil diperbarui.');
    }

    public function destroy(Request $request, Event $event)
    {
        $this->ensureModuleAccess($request, 'Kegiatan');

        $this->eventService->delete($event);

        return redirect()->route('admin.event.index')->with('success', 'Kegiatan berhasil dihapus.');
    }
}
