import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import Home from '@/pages/Home'

export default function App() {
    const theme = useStore((s) => s.theme)

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark')
    }, [theme])

    return (
        <BrowserRouter>
            <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                <Routes>
                    <Route path="/" element={<Home />} />
                    {/* Future routes for individual app pages */}
                </Routes>
            </div>
        </BrowserRouter>
    )
}
