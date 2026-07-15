'use client'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white mt-12 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">e-Ambassade</h3>
            <p className="text-gray-400">
              Din plattform för enkla ambassadörbokningar
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Länkar</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/booking" className="hover:text-white">Boka</a></li>
              <li><a href="/dashboard" className="hover:text-white">Dashboard</a></li>
              <li><a href="/auth/signin" className="hover:text-white">Logga in</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="mailto:support@e-ambassade.se" className="hover:text-white">Kontakta oss</a></li>
              <li><a href="#" className="hover:text-white">FAQ</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} e-Ambassade. Alla rättigheter förbehållna.</p>
        </div>
      </div>
    </footer>
  )
}
