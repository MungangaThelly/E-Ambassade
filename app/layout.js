import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Providers } from '@/app/providers'

export const metadata = {
  title: 'e-Ambassade',
  description: 'Plateforme de reservation consulaire multilingue',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
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
