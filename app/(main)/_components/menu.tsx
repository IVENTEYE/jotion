"use client";

import { Id } from '@/convex/_generated/dataModel';
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuContent
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/clerk-react';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { Skeleton } from '@/components/ui/skeleton';

interface MenuProps {
    documentId: Id<"documents">
}

const Menu = ({ documentId }: MenuProps) => {
    const router = useRouter();
    const { user } = useUser();
    const archive = useMutation(api.documents.archive);

    const onArchive = () => {
        const promise = archive({ id: documentId });

        toast.promise(promise, {
            loading: "Перемещение в корзину...",
            success: "Заметка перемещена в корзину!",
            error: "Не удалось переместить заметку в корзину."
        });

        router.push("/documents");
    };
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
                <MoreHorizontal className='h-4 w-4' />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-60' align="end" alignOffset={8} forceMount>
            <DropdownMenuItem onClick={onArchive}>
                <Trash className='w-4 mr-2'/>
                Удалить
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className='text-xs text-muted-foreground p-2'>
                Последнее редактирование: {user?.fullName}
            </div>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

Menu.Skeleton = function MenuSkeleton() {
    return (
        <Skeleton className='w-10 h-10'/>
    );
}

export default Menu