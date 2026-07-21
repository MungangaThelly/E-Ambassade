import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import DashboardShell from '@/components/DashboardShell'

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return <DashboardShell>{children}</DashboardShell>
}
