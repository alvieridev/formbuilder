"use client"

import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'
import { Tabs, TabsList } from './ui/tabs';
import { TabsTrigger } from '@radix-ui/react-tabs';
import { DesktopIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons';

function ThemeSwitcher() {
    const {theme, setTheme} = useTheme();
    const [mounted, SetMounted] = useState(false);

    useEffect( () => {
        SetMounted(true)
    }, [] );

    if(!mounted) return null;

  return (
    <Tabs defaultValue={theme}>
        <TabsList className='border flex gap-3'>
            <TabsTrigger 
            value='light' 
            onClick={ () => setTheme("light") }>
                <SunIcon className='h-[1.2rem] w-[1.2rem]' />
            </TabsTrigger>
            <TabsTrigger 
                value='dark' 
                onClick={ () => setTheme("dark") }>
                    <MoonIcon className='h-[1.2rem] w-[1.2rem] duration-1000 ease-in-out rotate-90 transition-all dark:rotate-0' />
            </TabsTrigger>
            <TabsTrigger 
            value='system' 
            onClick={ () => setTheme("system") }>
                <DesktopIcon className='h-[1.2rem] w-[1.2rem]' />
            </TabsTrigger>
        </TabsList>
    </Tabs>
  )
}

export default ThemeSwitcher