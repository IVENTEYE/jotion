'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useUser } from '@clerk/clerk-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useSearch } from '@/hooks/use-search';
import { File } from 'lucide-react';

const SearchCommand = () => {
  const router = useRouter();
  const documents = useQuery(api.documents.getSearch);
  const [isMounted, setIsMounted] = useState(false);

  const toggle = useSearch(store => store.toggle);
  const isOpen = useSearch(store => store.isOpen);
  const onClose = useSearch(store => store.onClose);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };

    document.addEventListener('keydown', down);

    return () => document.removeEventListener('keydown', down);
  }, [toggle]);

  const onSelect = (id: string) => {
    router.push(`/documents/${id}`);
    onClose();
  };

  if (!isMounted) null;

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput 
        placeholder="Поиск ваших заметок..."
      />
      <CommandList>
        <CommandEmpty>
          Результатов не найдено.
        </CommandEmpty>
        <CommandGroup heading="Заметки">
          {documents?.map(document => (
            <CommandItem
              key={document._id}
              value={`${document._id} — ${document.title}`}
              title={document.title}
              onSelect={onSelect}
            >
              {document.icon ? (
                <p className='mr-2 text-[18px]'>{document.icon}</p>
              ) : (
                <File className='mr-2 h-4 w-4' />
              )}
              <span>{document.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
};

export default SearchCommand;
