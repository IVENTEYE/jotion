"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

import React from 'react'

const Error = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4">
        <Image 
            src="/error.png"
            height={300}
            width={300}
            alt="Error"
            className="dark:hidden"
        />
        <Image 
            src="/error-dark.png"
            height={300}
            width={300}
            alt="Error"
            className="dark:block hidden"
        />
        <h2 className="text-xl font-medium">Что-то пошло не так!</h2>
        <Button asChild >
            <Link href="/documents">
                Вернуться к заметкам
            </Link>
        </Button>
    </div>
  )
}

export default Error