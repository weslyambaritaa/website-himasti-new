import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TableThumbnail from "@/components/admin/table-thumbnail";
import StatusBadge from "@/components/status-badge";
import { cn } from "@/lib/utils";
import { router } from "@inertiajs/react";
import { closestCenter, DndContext, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

function SortableItem({ item }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: item.id,
    });

    return (
        <div
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
            className={cn(
                "flex items-start gap-3 rounded-xl border bg-white p-3 transition",
                isDragging ? "z-10 border-slate-400 shadow-lg" : "border-slate-200",
            )}
        >
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-1 h-8 w-8 shrink-0 text-slate-500"
                {...attributes}
                {...listeners}
                aria-label={`Ubah urutan ${item.title}`}
            >
                <GripVertical className="h-4 w-4" />
            </Button>

            {item.image ? (
                <TableThumbnail
                    path={item.image}
                    alt={item.imageAlt || item.title}
                    emptyLabel={item.emptyLabel || "Tanpa gambar"}
                    className={item.imageClassName || "h-14 rounded-md object-cover"}
                />
            ) : null}

            <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                        {item.subtitle ? <p className="text-xs text-slate-500">{item.subtitle}</p> : null}
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        #{item.order_number ?? 0}
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {item.statusLabel ? <StatusBadge label={item.statusLabel} tone={item.statusTone} /> : null}
                    {item.meta ? <span className="text-xs text-slate-500">{item.meta}</span> : null}
                </div>
            </div>
        </div>
    );
}

export default function SortableOrderPanel({ title, description, items, reorderUrl, emptyMessage }) {
    const [orderedItems, setOrderedItems] = useState(items);
    const [isSaving, setIsSaving] = useState(false);
    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    useEffect(() => {
        setOrderedItems(items);
    }, [items]);

    const handleDragEnd = ({ active, over }) => {
        if (!over || active.id === over.id || isSaving) {
            return;
        }

        const oldIndex = orderedItems.findIndex((item) => item.id === active.id);
        const newIndex = orderedItems.findIndex((item) => item.id === over.id);

        if (oldIndex === -1 || newIndex === -1) {
            return;
        }

        const snapshot = orderedItems;
        const reorderedItems = arrayMove(orderedItems, oldIndex, newIndex).map((item, index) => ({
            ...item,
            order_number: index + 1,
        }));

        setOrderedItems(reorderedItems);
        setIsSaving(true);

        router.post(
            reorderUrl,
            { ids: reorderedItems.map((item) => item.id) },
            {
                preserveScroll: true,
                preserveState: true,
                onError: () => setOrderedItems(snapshot),
                onFinish: () => setIsSaving(false),
            },
        );
    };

    return (
        <Card>
            <CardHeader className="gap-2">
                <div className="flex items-center justify-between gap-3">
                    <div className="space-y-1">
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin text-slate-500" /> : null}
                </div>
            </CardHeader>
            <CardContent>
                {orderedItems.length ? (
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
                        <SortableContext items={orderedItems.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-3">
                                {orderedItems.map((item) => (
                                    <SortableItem key={item.id} item={item} />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                ) : (
                    <p className="text-sm text-slate-500">{emptyMessage}</p>
                )}
            </CardContent>
        </Card>
    );
}
