import { fetchRedisData } from '@/helpers/redis';
import { authOptions } from '@/lib/auth';
import db from '@/lib/db';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
export async function POST(request: Request) {
  try {
    // check if user is logged in
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { id } = await request.json();

    // validate sent id
    const idToAdd = z.string().parse(id);

    // check if they are already friends
    const isAlreadyFriend = (await fetchRedisData('sismember', `user:${session.user.id}:friends`, idToAdd)) as 0 | 1;
    if (isAlreadyFriend)
      return new Response('You are already friends with this user', { status: 400 })

    // check if friend request is already sent
    const isAlreadyAdded = (await fetchRedisData('sismember', `user:${session.user.id}:incoming_friend_requests`, idToAdd)) as 0 | 1;
    if (!isAlreadyAdded)
      return new Response('Add friend request first', { status: 400 })
      
    // remove friend request from redis
    await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd);
    await db.srem(`user:${idToAdd}:outgoing_friend_requests`, session.user.id);

    // add friend to redis for both users
    await db.sadd(`user:${session.user.id}:friends`, idToAdd);
    await db.sadd(`user:${idToAdd}:friends`, session.user.id);

    return new Response('Friend request accepted', { status: 200 })
  } catch (e) {
    if (e instanceof z.ZodError)
      return new Response('Invalid request payload', { status: 422 })
    return new Response('Invalid Request', { status: 400 })
  }
} 