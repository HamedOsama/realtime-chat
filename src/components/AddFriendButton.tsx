"use client"
import { FC, useState } from 'react'
import axios, { AxiosError } from 'axios'
import { z } from 'zod'
import Button from './ui/Button'
import { addFriendValidator } from '@/lib/Validations/add-friend'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

interface AddFriendButtonProps { }

type FormData = z.infer<typeof addFriendValidator>

const AddFriendButton: FC<AddFriendButtonProps> = ({ }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuccessState, setShowSuccessState] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator)
  })
  const addFriendHandler = async (email: string) => {
    setIsLoading(true);
    try {
      const validatedEmail = addFriendValidator.parse({ email });
      await axios.post('/api/friends/add', {
        email: validatedEmail.email,
      });
      setShowSuccessState(true);
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError('email', {
          message: e.message
        })
        return;
      }
      if (e instanceof AxiosError) {
        setError('email', {
          message: e.response?.data
        })
        return;
      }
      setError('email', {
        message: 'Something went wrong'
      })
    } finally {
      setIsLoading(false);
    }
  }
  const onSubmitHandler = (data: FormData) => {
    addFriendHandler(data.email)
  }
  return <form className="max-w-sm" onSubmit={handleSubmit(onSubmitHandler)}>
    <label htmlFor="email" className='block text-sm font-medium leading-6 text-gray-900'>
      Add friend by email
    </label>
    <div className="mt-2 flex gap-4 items-center">
      <input
        {...register('email')}
        type="text"
        className='block w-full rounded-md border-0 py-1.5 px-2 sm:px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
        placeholder="you@example.com"
      />
      <Button isLoading={isLoading} type='submit'>ADD</Button>
    </div>
    <p className='mt-1 text-sm text-red-600'>{errors?.email?.message}</p>
    {
      showSuccessState ? <p className='mt-1 text-sm text-green-600'>Friend added!</p> : null
    }
  </form>
}

export default AddFriendButton