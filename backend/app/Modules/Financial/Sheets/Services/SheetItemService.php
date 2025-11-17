<?php

namespace App\Modules\Financial\Sheets\Services;

use App\Modules\Financial\Sheets\Models\SheetItem;

class SheetItemService
{
    /**
     * Lista todos os itens da planilha.
     */
    public function listItems(int $sheetId)
    {
        return SheetItem::with(['category', 'bank']) // ← AGORA CARREGA O BANCO
            ->where('sheet_id', $sheetId)
            ->orderBy('date', 'desc')
            ->orderBy('id', 'desc')
            ->get();
    }

    /**
     * Cria um item na planilha.
     */
    public function createItem(int $sheetId, array $data)
    {
        $data['sheet_id'] = $sheetId;

        // normaliza valor
        if (isset($data['value'])) {
            $data['value'] = abs($data['value']);
        }

        // converte campos vazios em null
        $data['category_id'] = $data['category_id'] ?? null;
        $data['bank_id']     = $data['bank_id']     ?? null;

        $item = SheetItem::create($data);

        // carrega categoria + banco para o retorno completo
        return $item->fresh(['category', 'bank']);
    }

    /**
     * Busca item garantindo que pertence à planilha.
     */
    public function findItemForSheet(int $sheetId, int $itemId): ?SheetItem
    {
        return SheetItem::where('sheet_id', $sheetId)
            ->where('id', $itemId)
            ->with(['category', 'bank']) // ← atualizado para retornar tudo
            ->first();
    }

    /**
     * Atualiza item da planilha.
     */
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

            // NOVO
            if (array_key_exists('paid_at', $data)) {
                $data['paid_at'] = $data['paid_at'] ?: null;
            }

            $item->update($data);

            return $item->fresh(['category', 'bank']);
        }


    /**
     * Exclui item.
     */
    public function deleteItem(SheetItem $item)
    {
        $item->delete();
    }
}
