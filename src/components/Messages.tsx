"use client"

import { FC, useRef, useState } from 'react'
import { Message } from '@/lib/Validations/message'
import { cn } from '@/lib/utils'

interface MessagesProps {
  initialMessages: Message[]
  userId: string
}

const Messages: FC<MessagesProps> = ({ initialMessages, userId }) => {
  const scrollDownRef = useRef<HTMLDivElement | null>(null)

  const [messages, setMessages] = useState<Message[]>(initialMessages)
  return <div className='flex flex-1 h-full flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-tracker-blue-lighter scrollbar-w-2 scrolling-touch'>
    <div ref={scrollDownRef} />
    {
      messages.map((message, index) => {
        const isCurrentUser = message.senderId === userId

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
                <span className='ml-2 text-xs text-gray-400'>{message.timestamp}</span>
                </span>
              </div>
            </div>
          </div>
        )
      })}
  </div>
}

export default Messages