import { useEffect, useState } from "react"
import logoWhite from "@/assets/Logo_White_Full-01.png"
import logoBlack from "@/assets/Logo_Black_Full.png"
import { AuthForm } from "@/components/auth-form"
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    // Add a small delay to trigger the animation
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    // Detect theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) setIsDarkMode(savedTheme === 'dark');
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`grid min-h-svh transition-colors duration-300 ${
      isDarkMode
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white'
        : 'bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900'
    }`}>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className={`flex justify-center md:justify-start transition-all duration-1000 ease-out transform ${isLoaded
          ? 'translate-y-0 opacity-100'
          : '-translate-y-full opacity-0'
          }`}>
          <button type="button" onClick={() => window.location.href = '/'} className="flex items-center font-medium bg-transparent border-none outline-none cursor-pointer">
            <img src={isDarkMode ? logoBlack : logoWhite} alt="Khan's Trading Company" className="w-32 h-auto" />
          </button>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className={`w-full max-w-xs transition-all duration-1000 ease-out transform ${isLoaded
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full opacity-0'
            }`}>
            <AuthForm isSignUp={false} isDarkMode={isDarkMode} />
          </div>
        </div>
      </div>
    </div>
  )
}