'use client'

import { useEffect } from "react"
import cache from "../lib/cache/localstorage-service";

export default function ModeToggle() {

    useEffect(() => {
        const storedTheme = cache.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    })
        
    function toggle() {
        document.documentElement.classList.toggle('dark');
        
        if (document.documentElement.classList.contains('dark')) {
            cache.store('theme', 'dark');
        } else {
            cache.store('theme', 'light');
        }
    }

    return (

        <button className="p-2 text-gray-900 dark:text-gray-200 cursor-pointer" onClick={toggle}>
            Mudar tema
        </button>
    )

} 