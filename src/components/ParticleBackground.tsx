import { useCallback, useEffect, useRef } from 'react'

interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    radius: number
    opacity: number
}

export default function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particlesRef = useRef<Particle[]>([])
    const animationRef = useRef<number>(0)
    const mouseRef = useRef({ x: 0, y: 0 })

    const initParticles = useCallback((width: number, height: number) => {
        const count = Math.min(80, Math.floor((width * height) / 15000))
        particlesRef.current = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.1,
        }))
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            initParticles(canvas.width, canvas.height)
        }

        const handleMouse = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY }
        }

        resize()
        window.addEventListener('resize', resize)
        window.addEventListener('mousemove', handleMouse)

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            const particles = particlesRef.current
            const mouse = mouseRef.current

            for (const p of particles) {
                p.x += p.vx
                p.y += p.vy

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1

                const dx = mouse.x - p.x
                const dy = mouse.y - p.y
                const dist = Math.sqrt(dx * dx + dy * dy)
                if (dist < 150) {
                    p.vx += dx * 0.00005
                    p.vy += dy * 0.00005
                }

                ctx.beginPath()
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(249, 168, 37, ${p.opacity})`
                ctx.fill()
            }

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const pi = particles[i]!
                    const pj = particles[j]!
                    const dx = pi.x - pj.x
                    const dy = pi.y - pj.y
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < 120) {
                        ctx.beginPath()
                        ctx.moveTo(pi.x, pi.y)
                        ctx.lineTo(pj.x, pj.y)
                        ctx.strokeStyle = `rgba(249, 168, 37, ${0.15 * (1 - dist / 120)})`
                        ctx.lineWidth = 0.5
                        ctx.stroke()
                    }
                }
            }

            animationRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            cancelAnimationFrame(animationRef.current)
            window.removeEventListener('resize', resize)
            window.removeEventListener('mousemove', handleMouse)
        }
    }, [initParticles])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
        />
    )
}
