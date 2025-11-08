// components/sidebar/index.tsx
import React from "react";

import { getRecommended } from "@/lib/recommended-service";
import { getFollwedUser } from "@/lib/follow-service";
import { getLiveStreamsNotFollowed, getLiveFollowing } from "@/lib/live-service";
import { getTopCategories } from "@/lib/category-service";

import { Wrapper } from "./wrapper";
import { Toggle, ToggleSkeleton } from "./toggle";
import { Recommended, RecommendedSkeleton } from "./recommended";
import { Following, FollowingSkeleton } from "./following";
import { LiveStreams, LiveStreamsSkeleton } from "./live-streams";
import { Categories, CategoriesSkeleton } from "./categories";

export async function Sidebar() {
  // Usar Promise.allSettled para que si un servicio falla, los demás sigan funcionando
  const [
    recommendedResult,
    followingResult,
    liveFollowingResult,
    liveStreamsResult,
    categoriesResult,
  ] = await Promise.allSettled([
    getRecommended(),
    getFollwedUser(),
    getLiveFollowing(),
    getLiveStreamsNotFollowed(),
    getTopCategories(),
  ]);

  // Extraer datos o usar array vacío si falló
  const recommended = recommendedResult.status === "fulfilled" ? recommendedResult.value : [];
  const following = followingResult.status === "fulfilled" ? followingResult.value : [];
  const liveFollowing = liveFollowingResult.status === "fulfilled" ? liveFollowingResult.value : [];
  const liveStreams = liveStreamsResult.status === "fulfilled" ? liveStreamsResult.value : [];
  const categories = categoriesResult.status === "fulfilled" ? categoriesResult.value : [];

  return (
    <Wrapper>
      <Toggle />
      {/* Contenedor con scroll para todo el contenido */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent hover:scrollbar-thumb-cyan-500/40">
        <div className="space-y-4 pt-4 lg:pt-0 pb-4">
          {/* Seguidos que están en vivo - Siempre mostrar si hay datos */}
          {liveFollowing.length > 0 && (
            <LiveStreams 
              data={liveFollowing} 
              label="En vivo ahora"
            />
          )}
          
          {/* Seguidos (no en vivo) */}
          <Following data={following} />
          
          {/* Categorías recomendadas - Siempre mostrar si hay datos */}
          {categories.length > 0 && <Categories data={categories} />}
          
          {/* Otros streamers en vivo (no seguidos) - Siempre mostrar */}
          <LiveStreams 
            data={liveStreams} 
            label="Streamers en vivo"
          />
          
          {/* Recomendados */}
          <Recommended data={recommended} />
        </div>
      </div>
    </Wrapper>
  );
}

export function SidebarSkeleton() {
  return (
    <aside className="fixed left-0 flex flex-col w-[70px] lg:w-60 h-full bg-background border-r border-[#2D2E35] z-50">
      <ToggleSkeleton />
      <div className="flex-1 overflow-y-auto">
        <LiveStreamsSkeleton />
        <FollowingSkeleton />
        <CategoriesSkeleton />
        <RecommendedSkeleton />
      </div>
    </aside>
  );
}