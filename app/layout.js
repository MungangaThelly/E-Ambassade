import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Providers } from '@/app/providers'

export const metadata = {
  title: 'e-Ambassade',
  description: 'Din plattform för enkla ambassadörbokningar',
}

export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
