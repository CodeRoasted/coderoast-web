interface LogoProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

const sizeMap = {
    sm: 'h-9 w-auto',
    md: 'h-12 w-auto',
    lg: 'h-16 w-auto',
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
    return (
        <img
            src="/mug.svg"
            alt="CodeRoast"
            className={`${sizeMap[size]} select-none ${className}`}
            draggable={false}
        />
    )
}
