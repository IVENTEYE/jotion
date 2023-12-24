"use client";

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import { useOrigin } from '@/hooks/use-origin';
import { cn } from '@/lib/utils';
import { useMutation } from 'convex/react';
import { Check, Copy, Globe } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

interface PublishProps {
    initialData: Doc<"documents">;
}

const Publish = ({ initialData }: PublishProps) => {
    
  const origin = useOrigin();
  const update = useMutation(api.documents.update);
  const publicEdit = useMutation(api.documents.publicEdit);
  
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setISubmitting] = useState(false);
  const [checked, setCheked] = useState(initialData.publicEditable);

  const url = `${origin}/preview/${initialData._id}`;

  useEffect(() => {
    publicEdit({ id: initialData._id, edit: checked });
  }, [checked])

  const onPublish = () => {
    setISubmitting(true);

    const promise = update({
      id: initialData._id,
      isPublished: true,
    }).finally(() => setISubmitting(false));

    toast.promise(promise, {
      loading: "Публикация...",
      success: "Заметка опубликована!",
      error: "Не удалось опубликовать заметку."
    });
  };

  const onUnpublish = () => {
    setISubmitting(true);

    const promise = update({
      id: initialData._id,
      isPublished: false,
      publicEditable: false,
    }).finally(() => setISubmitting(false));

    toast.promise(promise, {
      loading: "Пожалуйста, подождите...",
      success: "Заметка скрыта из общего доступа!",
      error: "Не удалось закрыть доступ к заметке."
    });
  };

  const onCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Popover>
        <PopoverTrigger>
          <Button size="sm" variant="ghost">
            <p className='sm:block hidden'>Публикация</p> 
            {initialData.isPublished && <Globe className='text-sky-500 w-4 h-4 sm:ml-2' />}
            {!initialData.isPublished && <Globe className='sm:hidden w-4 h-4' />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-72' align='end' alignOffset={0} forceMount>
          {initialData.isPublished 
          ? (
            <div className='space-y-4'>
              <div className='flex items-center gap-x-2'>
                <Globe className='text-sky-500 animate-pulse h-4 w-4'/>
                <p className='text-xs font-medium text-sky-500'>
                  Заметка доступна в сети
                </p>
              </div>
              <div className='flex items-center'>
                <input  
                  value={url}
                  className='flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate'
                  disabled
                />
                <Button onClick={onCopy} disabled={copied} className='h-8 rounded-l-none'>
                  {copied 
                    ? (<Check className='h-4 w-4'/>)
                    : (<Copy className='h-4 w-4'/>)
                  }
                </Button>
              </div>
              <label className='flex justify-between items-center'>
                <p className='text-[13px]'>Разрешить редактирование</p>
                <label className='cursor-pointer relative'>
                  <input 
                    type="checkbox" 
                    className='absolute top-0 left-0 opacity-0 w-full h-full'
                    checked={initialData.publicEditable}
                    onChange={() => setCheked(!checked)}
                  />
                  <div 
                    className={cn(
                      'w-10 h-[20px] relative rounded-full bg-muted transition-all ease-in-out before:absolute before:dark:bg-white before:transition-all before:ease-in-out before:top-1/2 before:translate-y-[-50%] before:rounded-full before:left-0 before:w-[21px] before:h-[21px] before:bg-black',
                      checked && "before:left-[calc(100%-20px)] shadow-lg before:bg-white bg-black dark:bg-muted-foreground"
                    )}
                  />
                </label>
              </label>
              <Button size="sm" className='w-full text-xs' disabled={isSubmitting} onClick={onUnpublish}>
                Отключить
              </Button>
            </div>
          )
          : (
            <div className='flex flex-col items-center justify-center'>
              <Globe className='h-8 w-8 to-muted-foreground mb-2'/>
              <p className='text-sm font-medium mb-2'>Опубликовать заметку</p>
              <span className='text-xs text-muted-foreground mb-4'>
                Поделитесь своей работой с другими.
              </span>
              <Button
                size="sm"
                disabled={isSubmitting}
                onClick={onPublish}
                className='w-full text-xs'
              >
                Опубликовать
              </Button>
            </div>
          )}
        </PopoverContent>
    </Popover>
  )
}

export default Publish