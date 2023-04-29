"use client"
import { chatHrefConstructor } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC, useEffect, useState } from 'react'

interface SidebarChatListProps {
  friends: User[]
  userId: string
}

const SidebarChatList: FC<SidebarChatListProps> = ({ friends, userId }) => {
  const pathname = usePathname()
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (pathname?.includes('chat')) {
      setUnseenMessages(prev => prev.filter((message) => !pathname.includes(message.senderId)))
    }
  }, [pathname])

  return <ul role='list' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
    {friends.sort().map((friend) => {
      return (
        <li key={friend.id}>
          <Link href={`/dashboard/chat/${chatHrefConstructor(userId, friend.id)}`} className='flex items-center px-2 py-2 rounded-md hover:bg-gray-50 text-gray-700 hover:text-indigo-600'>
            <div className='flex-shrink-0'>
              <Image
                className='h-8 w-8 rounded-full'
                src={friend.image}
                alt={friend.name}
                width={32}
                height={32}
              />
            </div>
            <div className='ml-3 flex-1 min-w-0'>
              <div className='flex items-center'>
                <div className='text-sm font-medium truncate'>
                  {friend.name}
                </div>
                {/* <div className='ml-1 flex-shrink-0'>
                  <span className='inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                    {friend ? 'Online' : 'Offline'}
                  </span>
                </div> */}

                <div className=""></div>
              </div>
              {/* <div className='mt-1 flex items-center'> */}
              {/* <div className='flex-shrink-0'>
                  <span className='inline-flex items-center justify-center h-2 w-2 rounded-full bg-green-400' />
                </div> */}
              {/* <div className='ml-2 flex-1 text-sm truncate'>
                  {unseenMessages.filter((message) => message.senderId === friend.id).length > 0 && (
                    <span className='font-semibold text-indigo-600'>New message</span>
                  )}
                </div> */}
              {/* </div> */}
            </div>
          </Link>
        </li>
      )
    })}
  </ul>
}

export default SidebarChatList