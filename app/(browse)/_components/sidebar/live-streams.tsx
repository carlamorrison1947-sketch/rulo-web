// components/sidebar/live-streams.tsx
"use client";

import Link from "next/link";
import { UserAvatar } from "@/components/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/store/use-sidebar";

interface LiveStreamData {
  id: string;
  name: string;
  thumbnailUrl: string | null;
  isLive: boolean;
  user: {
    id: string;
    username: string;
    imageUrl: string;
  };
}

interface LiveStreamsProps {
  data: LiveStreamData[];
  label?: string;
}

export function LiveStreams({ data, label = "Streamers en vivo" }: LiveStreamsProps) {
  const pathname = usePathname();
  const { collapsed } = useSidebar((state) => state);

  if (data.length === 0) {
    return null;
  }

  return (
    <div>
      {!collapsed && (
        <div className="pl-6 mb-4">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
            {label}
          </p>
        </div>
      )}
      <ul className="space-y-2 px-2">
        {data.map((stream) => {
          const href = `/${stream.user.username}`;
          const isActive = pathname === href;

          return (
            <Link key={stream.user.id} href={href}>
              <div
                className={cn(
                  "flex items-center w-full gap-x-3 p-2 rounded-md hover:bg-accent/50 transition",
                  isActive && "bg-accent",
                  collapsed && "justify-center"
                )}
              >
                <div className="relative">
                  <UserAvatar
                    imageUrl={stream.user.imageUrl}
                    username={stream.user.username}
                    isLive={true}
                    showBadge
                  />
                  {collapsed && (
                    <div className="absolute -bottom-0.5 -right-0.5">
                      <div className="bg-red-500 rounded-full h-3 w-3 flex items-center justify-center">
                        <span className="h-1.5 w-1.5 bg-white rounded-full"></span>
                      </div>
                    </div>
                  )}
                </div>
                
                {!collapsed && (
                  <>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-semibold truncate">
                        {stream.user.username}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {stream.name || "Sin título"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-red-500 rounded text-xs font-semibold">
                      <span className="h-1.5 w-1.5 bg-white rounded-full"></span>
                      LIVE
                    </div>
                  </>
                )}
              </div>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}

export function LiveStreamsSkeleton() {
  return (
    <ul className="px-2 space-y-2">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center gap-x-3 p-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-5 w-16 rounded" />
        </div>
      ))}
    </ul>
  );
}