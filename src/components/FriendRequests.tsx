'use client'
import { FC, useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { Check, UserPlus, X } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { pusherClient } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'

interface FriendRequestsProps {
  incomingFriendRequests: IncomingFriendRequests[]
  sessionId: string
}

const FriendRequests: FC<FriendRequestsProps> = ({ incomingFriendRequests, sessionId }) => {
  const router = useRouter();
  const [friendRequests, setFriendRequests] =
    useState<IncomingFriendRequests[]>(
      incomingFriendRequests
    )

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))

    const friendRequestHandler = () => {
      console.log('friend request received')
    }
    pusherClient.bind('incoming_friend_requests', friendRequestHandler)

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
      pusherClient.unbind('incoming_friend_requests', friendRequestHandler)
    }
  }, [])
  const acceptFriendHandler = async (senderId: string) => {
    try {
      const req = await axios.post('/api/friends/accept', { id: senderId });

      setFriendRequests((prev) => prev.filter((request) => request.senderId !== senderId));

      toast.success('Friend request accepted');
      // router.refresh()
    } catch (e) {
      let errorMessage = 'Something went wrong';
      if (e instanceof AxiosError)
        errorMessage = e.response?.data;
      toast.error(errorMessage);
    }
  }

  const denyFriendHandler = async (senderId: string) => {
    try {
      const req = await axios.post('/api/friends/deny', { id: senderId });

      setFriendRequests((prev) => prev.filter((request) => request.senderId !== senderId));

      toast.success('Friend request denied');
      router.refresh();
    } catch (e) {
      let errorMessage = 'Something went wrong';
      if (e instanceof AxiosError)
        errorMessage = e.response?.data;
      toast.error(errorMessage);
    }
  }
  return <>
    {
      friendRequests.length === 0 ? (
        <p className='text-sm text-zinc-500'>Nothing to show here...</p>
      ) : (
        friendRequests.map((request) => (
          <div className='flex items-center gap-4' key={request.senderId}>
            <Image
              src={request.senderImage}
              alt={request.senderEmail + "'s profile picture"}
              width={40}
              height={40}
              className='rounded-full'
            />
            <p className='text-lg font-medium'>{request.senderEmail}</p>
            <div className="flex-1 ml-auto flex items-center justify-end gap-4 ">
              <button
                type="button"
                aria-label='accept friend request'
                className='w-8 h-8 bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center rounded-full transition hover:shadow-md'
                onClick={() => acceptFriendHandler(request.senderId)}
              >
                <Check className='text-white font-semibold w-3/4 h-3/4' />
              </button>
              <button
                type="button"
                aria-label='deny friend request'
                className='w-8 h-8 bg-red-600 hover:bg-red-700 flex items-center justify-center rounded-full transition hover:shadow-md'
                onClick={() => denyFriendHandler(request.senderId)}
              >
                <X className='text-white font-semibold w-3/4 h-3/4' />
              </button>
            </div>
          </div>
        ))

      )
    }
  </>
}

export default FriendRequests