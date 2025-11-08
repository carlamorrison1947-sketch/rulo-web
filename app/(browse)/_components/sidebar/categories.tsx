// components/sidebar/categories.tsx
"use client";

import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Gamepad2 } from "lucide-react";
import { useSidebar } from "@/store/use-sidebar";

interface Category {
  name: string;
  thumbnailUrl: string | null;
  viewerCount: number;
  streamCount: number;
}

interface CategoriesProps {
  data: Category[];
}

export function Categories({ data }: CategoriesProps) {
  const pathname = usePathname();
  const { collapsed } = useSidebar((state) => state);

  if (data.length === 0) {
    return null;
  }

  const formatViewerCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div>
      {!collapsed && (
        <div className="pl-6 mb-4">
          <p className="text-sm text-muted-foreground">
            Categorías recomendadas
          </p>
        </div>
      )}
      <ul className="space-y-2 px-2">
        {data.map((category) => {
          const href = `/category/${encodeURIComponent(category.name)}`;
          const isActive = pathname === href;

          return (
            <Link key={category.name} href={href}>
              <div
                className={cn(
                  "flex items-center w-full gap-x-3 p-2 rounded-md hover:bg-accent/50 transition",
                  isActive && "bg-accent",
                  collapsed && "justify-center"
                )}
              >
                {/* Thumbnail */}
                <div className="relative h-10 w-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
                  {category.thumbnailUrl ? (
                    <img
                      src={category.thumbnailUrl}
                      alt={category.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Gamepad2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Info - Solo mostrar si no está colapsado */}
                {!collapsed && (
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-semibold truncate">
                      {category.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-red-500">●</span>{" "}
                      {formatViewerCount(category.viewerCount)}
                    </p>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}

export function CategoriesSkeleton() {
  return (
    <ul className="px-2 space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-x-3 p-2">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </ul>
  );
}