import { fetchRedisData } from "@/helpers/redis";
import { addFriendValidator } from "@/lib/Validations/add-friend";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    // check if user is logged in
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    // check if email is valid
    const { email } = await request.json();
    const emailToAdd = addFriendValidator.parse({ email });

    // check if email exists in redis
    const RESTResponse = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/get/user:email:${emailToAdd.email}`, {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      },
      cache: "no-store",
    })
    const data = await RESTResponse.json() as { result: string };

    console.log(data);
    const idToAdd = data.result
    // if email does not exist, return error
    if (!idToAdd)
      return new Response('E-mail does not exist', { status: 400 })
    // if email is the same as the logged in user, return error
    if (idToAdd === session.user.id)
      return new Response('You cannot add yourself', { status: 400 })

    // check if friend request is already sent
    const isAlreadyAdded = (await fetchRedisData('sismember', `user:${idToAdd}:incoming_friend_requests`, session.user.id)) as 0 | 1;
    if (isAlreadyAdded)
      return new Response('You are already added this user', { status: 400 })

    // check if user is already in the friend list
    const isAlreadyFriend = (await fetchRedisData('sismember', `user:${session.user.id}:friend`, idToAdd)) as 0 | 1;
    if (isAlreadyFriend)
      return new Response('You are already friends with this user', { status: 400 })

    // add friend request to redis
    db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);

    return new Response('Friend request sent', { status: 200 })
  } catch (e) {
    if (e instanceof z.ZodError)
      return new Response('Invalid request payload', { status: 422 })
    return new Response('Invalid Request', { status: 400 })
  }
}