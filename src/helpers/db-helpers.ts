import { fetchRedisData } from "./redis"

export const getFriendsByUserId = async (userId: string): Promise<User[]> => {
  try {
    // get friends ids
    const friendsIds = await fetchRedisData('smembers', `user:${userId}:friends`) as string[];

    // get friends data
    const friends = await Promise.all(
      friendsIds.map(async (friendId: string) => {
        const friend = await fetchRedisData('get', `user:${friendId}`);
        return friend as User;
      }));
    return friends;
  } catch (e) {
    throw new Error(`Unable to get friends ${e as Error}`);
  }
}