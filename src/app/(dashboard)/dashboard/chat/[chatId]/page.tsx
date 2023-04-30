import ChatInput from '@/components/ChatInput'
import Messages from '@/components/Messages'
import { fetchRedisData } from '@/helpers/redis'
import { messageArrayValidator } from '@/lib/Validations/message'
import { authOptions } from '@/lib/auth'
import db from '@/lib/db'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { FC } from 'react'

interface pageProps {
  params: {
    chatId: string
  }
}

async function getChatMessages(chatId: string) {
  try {
    const results: string[] = await fetchRedisData(
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

  const chatPartner = (await (db.get(`user:${chatPartnerId}`) as Promise<User>)) as User;

  const initialMessages = await getChatMessages(chatId);
  return <div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]'>
    <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
      <div className="relative flex items-center space-x-4">
        <div className="relative">
          <div className="relative w-8 sm:w-12 h-8 sm:h-12">
            <Image
              src={chatPartner.image}
              alt={`${chatPartner.name}'s profile picture`}
              fill
              referrerPolicy='no-referrer'
              className='rounded-full'
            />
          </div>
        </div>

        <div className="flex flex-col leading-tight">
          <div className="text-xl flex items-center">
            <span className='text-gray-700 mr-3 font-semibold'>{chatPartner.name}</span>
          </div>
          <span className='text-sm text-gray-600'>{chatPartner.email}</span>
        </div>
      </div>
    </div>
    <Messages initialMessages={initialMessages} session={session} chatPartner={chatPartner} chatId={chatId} />
    <ChatInput chatPartner={chatPartner} chatId={chatId} />
  </div>
}

export default page