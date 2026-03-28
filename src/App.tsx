import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'

export default function App() {
    useEffect(() => {
        document.documentElement.classList.add('dark')
    }, [])

    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-950 text-gray-100">
                <Routes>
                    <Route path="/" element={<Home />} />
                    {/* Future routes for individual app pages */}
                </Routes>
            </div>
        </BrowserRouter>
    )
}
