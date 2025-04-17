// pages/debug-session.jsx   (or app/debug-session/page.jsx if using the app folder)
'use client'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function DebugSession() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <p>Loading…</p>
  }

  if (!session) {
    return (
      <div>
        <p>Not signed in</p>
        <button onClick={() => signIn()}>Sign In</button>
      </div>
    )
  }

  return (
    <div>
      <p>
        Signed in as <strong>{session.user.email}</strong>
      </p>
      <pre style={{ background: '#eee', padding: '1em' }}>
        {JSON.stringify(session, null, 2)}
      </pre>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  )
}
