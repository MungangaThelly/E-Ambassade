import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    redirect('/auth/signin')
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Admin</h2>
        <nav className="space-y-4">
          <a href="/admin" className="block hover:text-blue-400">
            Dashboard
          </a>
          <a href="/admin/bookings" className="block hover:text-blue-400">
            Alla bokningar
          </a>
          <a href="/admin/users" className="block hover:text-blue-400">
            Användare
          </a>
          <a href="/admin/notifications" className="block hover:text-blue-400">
            Notifikationer
          </a>
          <a href="/admin/settings" className="block hover:text-blue-400">
            Inställningar
          </a>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
