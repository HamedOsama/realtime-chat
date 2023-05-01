
import FriendRequestSidebar from '@/components/FriendRequestSidebar'
import { Icon, Icons } from '@/components/Icons'
import SidebarChatList from '@/components/SidebarChatList'
import SignOutButton from '@/components/SignOutButton'
import { getFriendsByUserId } from '@/helpers/db-helpers'
import { fetchRedisData } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ReactNode } from 'react'

interface layoutProps {
  children: ReactNode
}
interface SidebarOption {
  id: number
  name: string
  href: string
  Icon: Icon

}
const sidebarOptions: SidebarOption[] = [
  {
    id: 1,
    name: 'Add friend',
    href: '/dashboard/add',
    Icon: 'UserPlus'
  }
]
const layout = async ({ children }: layoutProps) => {
  const session = await getServerSession(authOptions);
  if (!session) return notFound();

  const unseenRequestsCount: number = (await fetchRedisData('smembers', `user:${session.user.id}:incoming_friend_requests`) as User[]).length;

  const friends = await getFriendsByUserId(session.user.id)

  return <div className='w-full flex h-screen'>
    <div className="flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
      <Link className='flex h-16 shrink-0 items-center' href="/dashboard" >
        <Icons.Logo className='h-8 w-auto text-indigo-600' />
      </Link>
      {
        friends.length > 0 && (
          <div className="text-xs sm:text-sm font-semibold leading-6 text-gray-400">
            Your Chats
          </div>
        )
      }

      <nav className='flex flex-col flex-1'>
        <ul role='list' className='flex flex-1 flex-col gap-y-7'>
          <SidebarChatList friends={friends} userId={session.user.id} />
          <li>
            <div className='text-xs sm:text-sm font-semibold leading-6 text-gray-400'>
              Overview
            </div>
            <ul role='list' className='-mx-2 mt-2 space-y-1'>
              {sidebarOptions.map((el) => {
                const Icon = Icons[el.Icon]
                return (
                  <li key={el.id}>
                    <Link
                      href={el.href}
                      className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold duration-300'>
                      <span className='text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white duration-300'>
                        <Icon className='h-4 w-4' />
                      </span>
                      <span className='truncate'>{el.name}</span>
                    </Link>
                  </li>
                )
              })}
              <li>
                <FriendRequestSidebar sessionId={session.user.id} initialUnseenRequestsCount={unseenRequestsCount} />
              </li>
            </ul>
          </li>
          <li className='-mx-6 mt-auto flex items-center'>
            <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
              <div className="relative h-8 w-8 bg-gray-50">
                <Image
                  fill
                  referrerPolicy='no-referrer'
                  className='rounded-full'
                  src={session.user.image || ''}
                  alt='Your profile picture'
                />
              </div>
              <span className='sr-only'>Your Profile</span>
              <div className="flex flex-col">
                <span aria-hidden='true'>{session.user.name}</span>
                <span className='text-xs text-zinc-400' aria-hidden='true'>{session.user.email}</span>
              </div>
            </div>
            <SignOutButton />
          </li>
        </ul>
      </nav>
    </div>

    <aside className='w-full flex-1 h-full'>
      {children}
    </aside>
  </div>
}

export default layout