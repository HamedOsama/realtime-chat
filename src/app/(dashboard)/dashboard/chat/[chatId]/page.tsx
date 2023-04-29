import { fetchRedisData } from '@/helpers/redis'
import { messageArrayValidator } from '@/lib/Validations/message'
import { authOptions } from '@/lib/auth'
import db from '@/lib/db'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { FC } from 'react'

interface pageProps {
  params: {
    chatId: string
  }
}

async function getChatMessage(chatId : string){
  try {
    const results : string[] = await fetchRedisData(
      'zrange',
      `chat:${chatId}:messages`,
      0,
      -1
      ) as string[]
      const dbMessages = results.map((message) => JSON.parse(message) as Message);

      const reversedMessages = dbMessages.reverse();

      const messages = messageArrayValidator.parse(reversedMessages);

      return messages;
  } catch (e) {
    notFound()
  }
}
const page = async ({ params }: pageProps) => {
  const session = await getServerSession(authOptions)
  if (!session)
    return notFound();

  const { user } = session;

  const { chatId } = params

  const [userId1, userId2] = chatId.split('--');

  if (userId1 !== user.id && userId2 !== user.id)
    return notFound();

  const chatPartnerId = user.id === userId1 ? userId2 : userId1;

  const chatPartner = (await (db.get(`user:${chatPartnerId}`) as Promise<User>) ) as User;

  const initialMessage = await getChatMessage(chatId);
  return <div>{params.chatId}</div>
}

export default page