import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
        <nav className="space-y-4">
          <a href="/dashboard" className="block hover:text-blue-400">
            Mina bokningar
          </a>
          <a href="/dashboard/profile" className="block hover:text-blue-400">
            Min profil
          </a>
          <a href="/dashboard/notifications" className="block hover:text-blue-400">
            Notifikationer
          </a>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
