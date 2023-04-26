"use client";

import { ButtonHTMLAttributes, FC, useState } from 'react';
import Button from './ui/Button';
import { signOut } from 'next-auth/react';
import { authOptions } from '@/lib/auth';
import { toast } from 'react-hot-toast';
import { Loader2, LogOut } from 'lucide-react';

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { }

const SignOutButton: FC<SignOutButtonProps> = ({ ...props }) => {
  const [isSingingOut, setIsSigningOut] = useState<boolean>(false);

  const signOutHandler = async () => {
    setIsSigningOut(true);
    try {
      await signOut();

    } catch (e) {
      toast.error('Something went wrong while signing out');
    } finally {
      setIsSigningOut(false);
    }
  }
  return <Button {...props} variant="ghost" onClick={signOutHandler}>
    {isSingingOut ?
      (
        <Loader2 className='animate-spin h-4 w-4' />
      )
      : (
        <LogOut className='h-4 w-4' />
      )
    }
  </Button>
}

export default SignOutButton