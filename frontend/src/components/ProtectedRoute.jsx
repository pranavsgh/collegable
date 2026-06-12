// Guards any route that requires authentication
// Renders nothing while the session check is in flight to avoid a flash of the login page
import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { supabase } from "../lib/supabase"

export default function ProtectedRoute({ children }) {
  // undefined = still loading, null = no session, object = authenticated
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    // One-time session check on mount; no subscription needed since pages do full navigations
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
  }, [])

  // Don't render anything until we know whether there's a session
  if (session === undefined) return null
  // Redirect unauthenticated visitors to login, preserving the intended URL via replace
  if (!session) return <Navigate to="/login" replace />
  return children
}
