import FriendRequests from '@/components/FriendRequests'
import { fetchRedisData } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { FC } from 'react'

const page = async ({ }) => {
  const session = await getServerSession(authOptions);
  if (!session) return notFound();

  const incomingSenderIds = await fetchRedisData('smembers', `user:${session.user.id}:incoming_friend_requests`) as string[];

  const incomingFriendRequests : IncomingFriendRequests[] = await Promise.all(
    incomingSenderIds.map(async (id) => {
      const user = await fetchRedisData('get', `user:${id}`) as string;
      const parsedUser = JSON.parse(user) as User;
      return {
        senderId : id,
        senderEmail : parsedUser.email,
        senderImage : parsedUser.image
      };
    })
  )
  return <main className='pt-8 px-4 sm:px-8'>
    <h1 className='font-bold text-5xl mb-8'>Friend Requests</h1>
    <div className="flex flex-col gap-4">
      <FriendRequests sessionId={session.user.id} incomingFriendRequests={incomingFriendRequests}/>
    </div>
  </main>
}

export default page