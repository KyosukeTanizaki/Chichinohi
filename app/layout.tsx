import type { Metadata } from 'next'
import { Noto_Serif_JP } from 'next/font/google'
import './globals.css'

const notoSerif = Noto_Serif_JP({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-noto-serif',
})

export const metadata: Metadata = {
  title: '父の履歴書 — Father\'s Day 2026',
  description: 'AIがお父さんに30日間インタビュー。父の日に「お父さんの履歴書」があなたに届きます。',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${notoSerif.variable} font-serif antialiased`}>
        {children}
      </body>
    </html>
  )
}
