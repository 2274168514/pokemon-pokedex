import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '宝可梦图鉴 | Pokémon Pokédex',
  description: '一个基于Next.js的宝可梦图鉴应用，使用PokeAPI数据',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <LanguageProvider>
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  )
}