'use client';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { cn } from '@/lib/utils';
import { useUser } from '@clerk/clerk-react';
import { useMutation } from 'convex/react';
import { ChevronDown, ChevronRight, LucideIcon, MoreHorizontal, Plus, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

interface ItemProps {
  id?: Id<'documents'>;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpand?: () => void;
  label: string;
  onClick?: () => void;
  icon: LucideIcon;
}

const Item = ({
  active,
  documentIcon,
  expanded,
  id,
  isSearch,
  level = 0,
  onExpand,
  label,
  icon: Icon,
  onClick,
}: ItemProps) => {
  const { user } = useUser();

  const router = useRouter();
  const create = useMutation(api.documents.create);
  const archive = useMutation(api.documents.archive);

  const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();

    if (!id) return;
    const promise = archive({ id }).then(() => router.push("/documents"));

    toast.promise(promise, {
      loading: "Заметка удаляется...",
      success: "Заметка перемещена в корзину.",
      error: "Не удалось удалть заметку."
    })
  }

  const handleExpand = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    onExpand?.();
  };

  const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    if (!id) return;

    const promise = create({ title: 'Без названия', parentDocument: id })
      .then((documentId) => {
        if (!expanded) {
          onExpand?.();
        }
        router.push(`/documents/${documentId}`);
      });

    toast.promise(promise, {
      loading: "Создание новой заметки...",
      success: "Новая заметка создана!",
      error: "Не удалось создать новую заметку."
    });
  };

  const ChevronIcon = expanded ? ChevronDown : ChevronRight;
  
  return (
    <div
      onClick={onClick}
      role="button"
      style={{ paddingLeft: level ? `${(level * 12) + 12}px` : '12px' }}
      className={cn(
        "group min-h-[27px] font-medium text-sm py-1 pr-3 w-full flex items-center text-muted-foreground hover:bg-primary/5",
        active && "bg-primary/5 text-primary"
      )}>
      {!!id && (
        <div
            role='button'
            className='h-full rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1'
            onClick={handleExpand}
        >
            <ChevronIcon 
                className='h-4 w-4 shrink-0 to-muted-foreground/50'
            />
        </div>
      )}
      {documentIcon ? (
        <div className='shrink-0 mr-2 text-[18px]'>
            {documentIcon}
        </div>
      ) : (
        <Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground" />
      )}
      <span className="truncate">{label}</span>
      {isSearch && (
        <kbd className='ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted p-1.5 font-monotext-[10px] to-muted-foreground opacity-100'>
            <span className='text-xs'>Ctrl</span> + k
        </kbd>
      )}
      {!!id && (
        <div className='ml-auto flex items-center gap-x-2'>
          <DropdownMenu>
            <DropdownMenuTrigger
              onClick={(event) => event.stopPropagation()}
              asChild
            >
              <div role='button' className='opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600'>
                <MoreHorizontal className='h-4 w-4 text-muted-foreground' />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='w-60'
              align='start'
              side="right"
              forceMount
            >
              <DropdownMenuItem onClick={onArchive}>
                <Trash className='h-4 w-4 mr-2' />
                Удалить
              </DropdownMenuItem>
              <DropdownMenuSeparator/>
              <div className='text-xs text-muted-foreground p-2'>Последнее редактирование пользователем: {user?.fullName}</div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div role='button' onClick={onCreate} className='opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:bg-neutral-600'>
            <Plus className='w-4 h-4 text-muted-foreground'/>
          </div>
        </div>
      )}
    </div>
  );
};

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div 
      style={{
        paddingLeft: level ? `${(level * 12) + 25}px` : "12px"
      }}
      className='flex gap-x-2 py-[3px]'
    >
      <Skeleton className='h-4 w-4'/>
      <Skeleton className='h-4 w-[30%]'/>
    </div>
  )
}

export default Item;
