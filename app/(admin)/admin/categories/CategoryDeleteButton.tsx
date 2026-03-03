"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { deleteCategoryAction } from "./actions";
import { useRouter } from "next/navigation";

interface CategoryDeleteButtonProps {
    id: string;
}

export function CategoryDeleteButton({ id }: CategoryDeleteButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;

        setIsLoading(true);
        const result = await deleteCategoryAction({ id });
        setIsLoading(false);

        if (result?.data?.success) {
            router.refresh();
        } else {
            alert(result?.data?.error || result?.serverError || "Bir hata oluştu");
        }
    };

    return (
        <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isLoading}
        >
            {isLoading ? "Siliniyor..." : "Sil"}
        </Button>
    );
}
