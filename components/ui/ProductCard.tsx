import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "./Card";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
    product: {
        name: string;
        slug: string;
        images: string[];
        price: number | null;
        category: {
            name: string;
        };
    };
}

export function ProductCard({ product }: ProductCardProps) {
    const imageUrl = product.images[0] || "/placeholder.jpg";

    return (
        <Link href={`/products/${product.slug}`} className="group">
            <Card className="overflow-hidden border-none shadow-none bg-transparent hover:shadow-md transition-shadow">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100 mb-4">
                    <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        priority={false}
                    />
                </div>
                <CardContent className="p-0 space-y-1">
                    {product.category && (
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">
                            {product.category.name}
                        </p>
                    )}
                    <h3 className="font-serif text-lg font-semibold leading-tight text-furniture-dark group-hover:text-furniture-bronze transition-colors">
                        {product.name}
                    </h3>
                    {product.price && (
                        <p className="text-sm font-medium text-furniture-bronze pt-1">
                            {formatPrice(product.price)}
                        </p>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
}
