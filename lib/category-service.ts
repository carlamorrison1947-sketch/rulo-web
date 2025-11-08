// lib/category-service.ts
import { db } from "@/lib/db";
import { listRooms } from "@/lib/livekit-service";

interface CategoryWithData {
  name: string;
  thumbnailUrl: string | null;
  viewerCount: number;
  streamCount: number;
}

export const getTopCategories = async (): Promise<CategoryWithData[]> => {
  try {
    // Obtener las rooms activas de LiveKit
    const activeRooms = await listRooms();
    const activeRoomNames = activeRooms.map((room) => room.name);

    console.log(`📊 Getting top categories from ${activeRoomNames.length} active rooms`);

    if (activeRoomNames.length === 0) {
      return [];
    }

    // Obtener todos los streams activos
    const streams = await db.stream.findMany({
      where: {
        userId: {
          in: activeRoomNames,
        },
      },
      select: {
        id: true,
        name: true,
        thumbnailUrl: true,
        user: {
          select: {
            username: true,
          },
        },
      },
      take: 20,
    });

    // Crear categorías "simuladas" basadas en palabras clave comunes
    const categoryMap = new Map<string, CategoryWithData>();

    streams.forEach((stream) => {
      // Extraer categoría del nombre del stream (puedes mejorar esta lógica)
      const streamName = stream.name.toLowerCase();
      let categoryName = "IRL"; // Categoría por defecto

      // Detectar categorías comunes
      if (streamName.includes("valorant")) categoryName = "Valorant";
      else if (streamName.includes("lol") || streamName.includes("league")) categoryName = "League of Legends";
      else if (streamName.includes("minecraft")) categoryName = "Minecraft";
      else if (streamName.includes("fortnite")) categoryName = "Fortnite";
      else if (streamName.includes("gta") || streamName.includes("roleplay")) categoryName = "GTA V";
      else if (streamName.includes("cod") || streamName.includes("warzone")) categoryName = "Call of Duty";
      else if (streamName.includes("fifa") || streamName.includes("fc24")) categoryName = "EA Sports FC";
      else if (streamName.includes("apex")) categoryName = "Apex Legends";
      else if (streamName.includes("cs") || streamName.includes("counter")) categoryName = "Counter-Strike";
      else if (streamName.includes("dota")) categoryName = "Dota 2";

      const existing = categoryMap.get(categoryName);

      if (existing) {
        existing.streamCount++;
        existing.viewerCount += 1250; // Incrementar viewers estimados
      } else {
        categoryMap.set(categoryName, {
          name: categoryName,
          thumbnailUrl: stream.thumbnailUrl,
          viewerCount: 1250,
          streamCount: 1,
        });
      }
    });

    // Convertir a array y ordenar por cantidad de streams
    const categories = Array.from(categoryMap.values())
      .sort((a, b) => b.streamCount - a.streamCount)
      .slice(0, 5);

    console.log(`📋 Found ${categories.length} categories`);

    return categories;
  } catch (error) {
    console.error("❌ Error getting top categories:", error);
    return [];
  }
};

export const getCategoryByName = async (categoryName: string) => {
  try {
    const activeRooms = await listRooms();
    const activeRoomNames = activeRooms.map((room) => room.name);

    // Buscar streams que contengan el nombre de la categoría
    const streams = await db.stream.findMany({
      where: {
        userId: {
          in: activeRoomNames,
        },
        name: {
          contains: categoryName,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        user: true,
        name: true,
        thumbnailUrl: true,
        isLive: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return streams;
  } catch (error) {
    console.error(`❌ Error getting category ${categoryName}:`, error);
    return [];
  }
};