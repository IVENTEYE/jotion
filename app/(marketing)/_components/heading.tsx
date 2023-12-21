"use client";

import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { SignInButton } from '@clerk/clerk-react';
import { useConvexAuth } from 'convex/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  return (
    <div className='max-w-3xl space-y-4'>
        <h1 className='text-3xl sm:text-5xl md:text-6xl font-bold'>
            Ваши идеи, документы, планы в одном месте. Добро пожаловать в <span className='underline'>Jotion</span>
        </h1>
        <h3 className='text-base sm:text-xl md:text-2xl font-medium'>
            Jotion — это мобильное рабочее пространство, <br />
            где происходит качественная и быстрая работа
        </h3>
        {isLoading && (
          <div className='flex w-full items-center justify-center'>
            <Spinner size="lg"/>
          </div>
        )}
        {isAuthenticated && !isLoading && (
          <Button asChild>
            <Link href="/documents">
              Перейти к документам <ArrowRight className='h-4 w-4 ml-2'/>  
            </Link>
          </Button>
        )}
        {!isAuthenticated && !isLoading && (
          <SignInButton mode='modal'>
            <Button>
              Начать работу в Jotion <ArrowRight className='h-4 w-4 ml-2'/>
            </Button>
          </SignInButton>
        )}  
    </div>
  )
}

export default Heading