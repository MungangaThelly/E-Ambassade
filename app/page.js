'use client'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Välkommen till e-Ambassade
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Din plattform för enkla och snabba ambassadörbokningar
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/booking"
            className="btn btn-primary"
          >
            Gör en bokning
          </a>
          <a
            href="/auth/signin"
            className="btn btn-secondary"
          >
            Logga in
          </a>
        </div>
      </section>

      <section className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-2">Enkelt</h3>
          <p className="text-gray-600">Boka ambassadörer på några klick</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-2">Snabbt</h3>
          <p className="text-gray-600">Omedelbar bekräftelse av din bokning</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-2">Säkert</h3>
          <p className="text-gray-600">Din data är säker och krypterad</p>
        </div>
      </section>
    </div>
  )
}
