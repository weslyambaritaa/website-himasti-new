<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class OrderNumberManager
{
    /**
     * @param  class-string<Model>  $modelClass
     */
    public function appendIfMissing(array $data, string $modelClass): array
    {
        if (! array_key_exists('order_number', $data) || $data['order_number'] === null || $data['order_number'] === '') {
            $data['order_number'] = $this->nextOrderNumber($modelClass);
        }

        return $data;
    }

    /**
     * @param  class-string<Model>  $modelClass
     */
    public function nextOrderNumber(string $modelClass): int
    {
        return (int) $modelClass::query()->max('order_number') + 1;
    }

    /**
     * @param  class-string<Model>  $modelClass
     * @param  array<int, int|string>  $ids
     */
    public function reorder(string $modelClass, array $ids): void
    {
        DB::transaction(function () use ($modelClass, $ids) {
            $records = $modelClass::query()
                ->whereIn('id', $ids)
                ->get()
                ->keyBy('id');

            foreach (array_values($ids) as $index => $id) {
                $record = $records->get((int) $id);

                if (! $record) {
                    continue;
                }

                $record->forceFill([
                    'order_number' => $index + 1,
                ])->save();
            }
        });
    }
}
