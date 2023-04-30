"use client"

import { FC, useRef, useState } from 'react'
import { Message } from '@/lib/Validations/message'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import Image from 'next/image'
import { Session } from 'next-auth'

interface MessagesProps {
  initialMessages: Message[]
  session: Session
  chatPartner: User
}

const Messages: FC<MessagesProps> = ({ initialMessages, session, chatPartner }) => {

  const scrollDownRef = useRef<HTMLDivElement | null>(null)

  const [messages, setMessages] = useState<Message[]>(initialMessages)

  const formatTimestamp = (timestamp: number) => {
    return format(timestamp, 'HH:mm')
  }
  return <div className='flex flex-1 h-full flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-tracker-blue-lighter scrollbar-w-2 scrolling-touch'>
    <div ref={scrollDownRef} />
    {
      messages.map((message, index) => {
        const isCurrentUser = message.senderId === session.user.id

        const hasNextMessage = messages[index - 1]?.senderId === messages[index].senderId

        return (
          <div className="chat-message" key={`${message.id}-${message.timestamp}`}>
            <div className={cn('flex items-end', {
              'justify-end': isCurrentUser,
            })}>
              <div className={cn('flex flex-col space-y-2 text-base max-w-xs mx-2', {
                'order-1 items-end': isCurrentUser,
                'order-2 items-start': !isCurrentUser,
              })}>
                <span className={cn('px-4 py-2 rounded-lg inline-block', {
                  'bg-indigo-600 text-white': isCurrentUser,
                  'bg-gray-200 text-gray-900': !isCurrentUser,
                  'rounded-br-none': !hasNextMessage && isCurrentUser,
                  'rounded-bl-none': !hasNextMessage && !isCurrentUser,
                })}>{message.text}{' '}
                  <span className='ml-2 text-xs text-gray-400'>{formatTimestamp(message.timestamp)}</span>
                </span>
              </div>
              <div className={cn('relative w-6 h-6', {
                'order-2': isCurrentUser,
                'order-1': !isCurrentUser,
                'invisible': hasNextMessage,
              })}>
                <Image
                  src={isCurrentUser ? (session.user.image as string) : chatPartner.image}
                  alt={`${isCurrentUser ? session.user.name : chatPartner.name}'s profile picture}`}
                  fill
                  referrerPolicy='no-referrer'
                  className='rounded-full'
                />
              </div>
            </div>
          </div>
        )
      })}
  </div>
}

export default Messages