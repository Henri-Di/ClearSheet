<?php

namespace App\Modules\Financial\Sheets\Services;

use App\Modules\Financial\Sheets\Models\SheetItem;

class SheetItemService
{
    public function listItems(int $sheetId)
    {
        return SheetItem::with(['category', 'bank'])
            ->where('sheet_id', $sheetId)
            ->orderBy('date', 'desc')
            ->orderBy('id', 'desc')
            ->get();
    }

    public function createItem(int $sheetId, array $data)
    {
        $data['sheet_id'] = $sheetId;

        if (isset($data['value'])) {
            $data['value'] = abs($data['value']);
        }

        $data['category_id'] = $data['category_id'] ?? null;
        $data['bank_id']     = $data['bank_id']     ?? null;

        $item = SheetItem::create($data);

        return $item->fresh(['category', 'bank']);
    }

    public function findItemForSheet(int $sheetId, int $itemId): ?SheetItem
    {
        return SheetItem::where('sheet_id', $sheetId)
            ->where('id', $itemId)
            ->with(['category', 'bank'])
            ->first();
    }

    public function updateItem(SheetItem $item, array $data)
    {
        if (isset($data['value'])) {
            $data['value'] = abs($data['value']);
        }

        if (array_key_exists('category_id', $data)) {
            $data['category_id'] = $data['category_id'] ?: null;
        }

        if (array_key_exists('bank_id', $data)) {
            $data['bank_id'] = $data['bank_id'] ?: null;
        }

        if (array_key_exists('paid_at', $data)) {
            $data['paid_at'] = $data['paid_at'] ?: null;
        }

        $item->update($data);

        return $item->fresh(['category', 'bank']);
    }

    public function deleteItem(SheetItem $item)
    {
        $item->delete();
    }
}
