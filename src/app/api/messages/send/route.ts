import { fetchRedisData } from "@/helpers/redis";
import { Message, messageArrayValidator } from "@/lib/Validations/message";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response('Unauthorized, sign in first to use this', { status: 401 });
    }

    const { chatId, text }: { text: string, chatId: string } = await request.json();

    const [user1, user2] = chatId.split('--');

    const currentUser = session.user.id;

    if (currentUser !== user1 && currentUser !== user2) {
      return new Response('Unauthorized', { status: 401 });
    }

    const chatPartner = currentUser === user1 ? user2 : user1;

    const alreadyFriends = await fetchRedisData('sismember', `user:${currentUser}:friends`, chatPartner) as 0 | 1;

    if (!alreadyFriends) {
      return new Response('Unauthorized, you are not friend with him to send message', { status: 401 });
    }

    const currentUserData = JSON.parse(await fetchRedisData('get', `user:${currentUser}`) as string) as User;

    // send message to chat

    const timestamp: number = Date.now();

    const messageData: Message = {
      id: nanoid(),
      text,
      timestamp,
      senderId: currentUser,
    }

    messageArrayValidator.parse([messageData]);

    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(messageData)
    });

    return new Response('Message sent successfully', { status: 200 });
  } catch (e) {
    if (e instanceof z.ZodError)
      return new Response('Invalid request payload', { status: 422 });
    if(e instanceof Error)
      return new Response(e.message, { status: 500 });
    return new Response('Invalid Request', { status: 500 });
  }

}