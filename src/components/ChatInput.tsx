'use client'

import { FC, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import Button from './ui/Button';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface ChatInputProps {
  chatPartner: User
  chatId: string
}

const ChatInput: FC<ChatInputProps> = ({ chatPartner, chatId }) => {

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>('')

  const sendMessage = async () => {
    if (!inputValue.trim()) return
    setIsLoading(true)
    try {
      // send message to backend
      await axios.post('/api/messages/send', { text: inputValue, chatId })
      // reset input value 
      setInputValue('')
      // focus on textarea
      textareaRef.current?.focus()
    } catch (e) {
      toast.error('Something went wrong, please try again later.')
    } finally {
      setIsLoading(false)
    }
  }
  return <div className='border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0'>
    <div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">

      <TextareaAutosize
        ref={textareaRef}
        onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage();
          }
        }}
        rows={1}
        value={inputValue}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputValue(_ => e.target.value)}
        placeholder={`Message ${chatPartner.name}`}
        className='block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6'
      />
      <div
        aria-hidden="true"
        className="py-2"
        onClick={() => textareaRef.current?.focus()}
      >
        <div className="py-px">
          <div className='h-9' />
        </div>
      </div>
      <div className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
        <div className="flex-shrink-0">
          <Button isLoading={isLoading} onClick={sendMessage} type='submit'>Send</Button>
        </div>
      </div>
    </div>
  </div>
}

export default ChatInput