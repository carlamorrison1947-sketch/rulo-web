// lib/live-service.ts
import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";
import { listRooms } from "@/lib/livekit-service";

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

export const getLiveStreams = async (): Promise<LiveStreamData[]> => {
  try {
    let userId;

    try {
      const self = await getSelf();
      userId = self.id;
    } catch {
      userId = null;
    }

    // Obtener las rooms activas de LiveKit
    const activeRooms = await listRooms();
    const activeRoomNames = activeRooms.map((room) => room.name);

    console.log(`📡 Active rooms in LiveKit: ${activeRoomNames.length}`);

    if (activeRoomNames.length === 0) {
      return [];
    }

    let streams = [];

    if (userId) {
      streams = await db.stream.findMany({
        where: {
          user: {
            NOT: {
              blocking: {
                some: {
                  blockedId: userId,
                },
              },
            },
          },
          userId: {
            in: activeRoomNames,
          },
        },
        select: {
          id: true,
          name: true,
          thumbnailUrl: true,
          isLive: true,
          user: {
            select: {
              id: true,
              username: true,
              imageUrl: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 10,
      });
    } else {
      streams = await db.stream.findMany({
        where: {
          userId: {
            in: activeRoomNames,
          },
        },
        select: {
          id: true,
          name: true,
          thumbnailUrl: true,
          isLive: true,
          user: {
            select: {
              id: true,
              username: true,
              imageUrl: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 10,
      });
    }

    console.log(`🎥 Found ${streams.length} live streams`);
    return streams;
  } catch (error) {
    console.error("❌ Error in getLiveStreams:", error);
    return [];
  }
};

export const getLiveStreamsNotFollowed = async (): Promise<LiveStreamData[]> => {
  try {
    let userId;

    try {
      const self = await getSelf();
      userId = self.id;
    } catch {
      userId = null;
    }

    const activeRooms = await listRooms();
    const activeRoomNames = activeRooms.map((room) => room.name);

    if (activeRoomNames.length === 0) {
      return [];
    }

    if (!userId) {
      // Si no está logueado, mostrar todos los streams
      return db.stream.findMany({
        where: {
          userId: {
            in: activeRoomNames,
          },
        },
        select: {
          id: true,
          name: true,
          thumbnailUrl: true,
          isLive: true,
          user: {
            select: {
              id: true,
              username: true,
              imageUrl: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 10,
      });
    }

    const following = await db.follow.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true,
      },
    });

    const followingIds = following.map((f) => f.followingId);

    const streams = await db.stream.findMany({
      where: {
        userId: {
          in: activeRoomNames,
          notIn: followingIds,
        },
        user: {
          NOT: {
            blocking: {
              some: {
                blockedId: userId,
              },
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        thumbnailUrl: true,
        isLive: true,
        user: {
          select: {
            id: true,
            username: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 10,
    });

    return streams;
  } catch (error) {
    console.error("❌ Error in getLiveStreamsNotFollowed:", error);
    return [];
  }
};

export const getLiveFollowing = async (): Promise<LiveStreamData[]> => {
  try {
    let userId;

    try {
      const self = await getSelf();
      userId = self.id;
    } catch {
      // Si no está logueado, retornar array vacío
      return [];
    }

    const activeRooms = await listRooms();
    const activeRoomNames = activeRooms.map((room) => room.name);

    if (activeRoomNames.length === 0) {
      return [];
    }

    const streams = await db.follow.findMany({
      where: {
        followerId: userId,
        following: {
          id: {
            in: activeRoomNames,
          },
        },
      },
      select: {
        following: {
          select: {
            id: true,
            username: true,
            imageUrl: true,
            stream: {
              select: {
                id: true,
                isLive: true,
                name: true,
                thumbnailUrl: true,
              },
            },
          },
        },
      },
    });

    return streams
      .filter((item) => item.following.stream !== null)
      .map((item) => ({
        id: item.following.stream!.id,
        name: item.following.stream!.name,
        thumbnailUrl: item.following.stream!.thumbnailUrl,
        isLive: item.following.stream!.isLive,
        user: {
          id: item.following.id,
          username: item.following.username,
          imageUrl: item.following.imageUrl,
        },
      }));
  } catch (error) {
    console.error("❌ Error in getLiveFollowing:", error);
    return [];
  }
};