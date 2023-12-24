"use client"

import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react'
import { Button } from '@/components/ui/button';
import { ImageIcon, X } from 'lucide-react';
import { useCoverImage } from '@/hooks/use-cover-image';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { Id } from '@/convex/_generated/dataModel';
import { useEdgeStore } from '@/lib/edgestore';
import { Skeleton } from './ui/skeleton';

interface CoverImageProps {
    url?: string;
    preview?: boolean;
}

const Cover = ({ url, preview }: CoverImageProps) => {
    const { edgestore } = useEdgeStore();
    const coverImage = useCoverImage();
    const removeCoverImage = useMutation(api.documents.removeCoverImage);
    const params = useParams();

    const onRemoveCoverImage = async () => {
        if (url) {
            await edgestore.publicFiles.delete({
                url: url
            });
        }
        removeCoverImage({
            id: params.documentId as Id<"documents">
        })
    }

  return (
    <div className={cn(
        "relative w-full h-[35vh] group",
        !url && "h-[12vh]",
        url && "bg-muted"
    )}>
        {!!url && (
            <Image 
                src={url}
                fill
                alt='Cover'
                className='object-cover'
            />
        )}
        {url && !preview && (
            <div className='opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2'>
                <Button
                    onClick={() => coverImage.onReplace(url)}
                    className='text-muted-foreground text-xs'
                    variant="outline"
                    size="sm"
                >
                    <ImageIcon className='w-4 h-4 md:mr-2'/>
                    <p className='md:block hidden'>Изменить обложку</p>
                </Button>
                <Button
                    onClick={onRemoveCoverImage}
                    className='text-muted-foreground text-xs'
                    variant="outline"
                    size="sm"
                >
                    <X className='w-4 h-4 md:mr-2'/>
                    <p className='md:block hidden'>Удалить обложку</p>
                </Button>
            </div>
        )}
    </div>
  )
}

Cover.Skeleton = function CverSkeleton() {
    return (
        <Skeleton className='w-full h-[12vh]'/>
    )
};

export default Cover