"use client";

import EmojiPicker, { Theme } from "emoji-picker-react";
import { useTheme } from "next-themes";

import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface IconPickerProps {
    onChange: (icon: string) => void;
    children: React.ReactNode;
    asChild?: boolean;
};

const IconPicker = ({ children, onChange, asChild }: IconPickerProps) => {
    const { resolvedTheme } = useTheme();

    const themeMap = {
        "dark": Theme.DARK,
        "light": Theme.LIGHT,
    };
    const currentTheme = (resolvedTheme || "light") as keyof typeof themeMap; 
    const theme = themeMap[currentTheme];

  return (
    <Popover>
        <PopoverTrigger asChild={asChild}>
            {children}
        </PopoverTrigger>
        <PopoverContent className="p-0 border-none w-full shadow-none">
            <EmojiPicker
                height={350}
                theme={theme}
                onEmojiClick={(data) => onChange(data.emoji)}
            />
        </PopoverContent>
    </Popover>
  )
}

export default IconPicker