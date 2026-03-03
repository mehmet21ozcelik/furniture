'use client';

import { Button } from "@/components/ui/Button";
import { deleteProductAction } from "./actions";
import { useTransition } from "react";

export function ProductDeleteButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
            startTransition(async () => {
                const res = await deleteProductAction({ id });
                if (!res?.data?.success) {
                    alert(res?.data?.error || res?.serverError || "Bir hata oluştu");
                }
            });
        }
    };

    return (
        <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isPending}
        >
            {isPending ? 'Siliniyor...' : 'Sil'}
        </Button>
    );
}
