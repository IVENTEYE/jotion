"use client"
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { PlusCircle } from 'lucide-react';
import { toast } from "sonner"
import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation';

const DocumentsPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const create = useMutation(api.documents.create);

  const onCreate = () => {
    const promise = create({ title: "Untitled" })
      .then((documentId) => router.push(`/documents/${documentId}`));

    toast.promise(promise, {
      loading: "Создание новой заметки...",
      success: "Новая заметка создана!",
      error: "Не удалось создать новую заметку."
    });
  };

  return (
    <div className='h-full flex flex-col items-center justify-center space-y-4'>
        <Image 
          src="/empty.png"
          height="300"
          width="300"
          alt='Empty'
          className='dark:hidden'
        />
        <Image 
          src="/empty-dark.png"
          height="300"
          width="300"
          alt='Empty'
          className='dark:block hidden'
        />
        <h2 className='text-lg font-medium'>
          {user?.firstName}, добро пожаловать в Jotion!
        </h2>
        <Button onClick={onCreate}>
          <PlusCircle className='h-4 w-4 mr-2'/>
          Создать заметку
        </Button>
    </div>
  )
}

export default DocumentsPage