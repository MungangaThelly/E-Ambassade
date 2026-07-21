import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import AdminShell from '@/components/AdminShell'

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    redirect('/auth/signin')
  }

  return <AdminShell>{children}</AdminShell>
}
