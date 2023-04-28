'use client'
import { Check, UserPlus, X } from 'lucide-react'
import Image from 'next/image'
import { FC, useState } from 'react'

interface FriendRequestsProps {
  incomingFriendRequests: IncomingFriendRequests[]
  sessionId: string
}

const FriendRequests: FC<FriendRequestsProps> = ({ incomingFriendRequests }) => {
  const [friendRequests, setFriendRequests] =
    useState<IncomingFriendRequests[]>(
      incomingFriendRequests
    )
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
              <button type="button" aria-label='accept friend request' className='w-8 h-8 bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center rounded-full transition hover:shadow-md'>
                <Check className='text-white font-semibold w-3/4 h-3/4' />
              </button>
              <button type="button" aria-label='deny friend request' className='w-8 h-8 bg-red-600 hover:bg-red-700 flex items-center justify-center rounded-full transition hover:shadow-md'>
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