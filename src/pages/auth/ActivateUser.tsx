import { useState, useContext } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import axiosClient from '@/utils/constants/axiosClient'
import { Route } from '@/routes/_public/auth/set-password'
import toast from 'react-hot-toast'
import { AuthContext } from '@/context/AuthContext'

export default function ActivateUser() {
  const searchParams = Route.useSearch()
  const token = (searchParams as any).token as string | undefined

  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const auth = useContext(AuthContext)

  const mutation = useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      axiosClient.post('/auth/activate', { token, password }),
    onSuccess: async (res: any) => {
      toast.success(res?.message || 'Account activated successfully')

      try {
        await auth?.fetchProfile()
        navigate({ to: '/dashboard' })
      } catch (err) {
        console.error(err)
        toast.error('Failed to fetch profile after activation')
      }
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Activation failed'
      toast.error(msg)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    if (token) {
      mutation.mutate({ token, password })
    }
  }

  if (!token) return <p>Invalid or missing activation token.</p>

  return (
    <div className="sp-container">
      <div className="sp-card">
        <h2 className="sp-title">
          Just enter your <span className="highlight">password!</span>
        </h2>

        <form onSubmit={handleSubmit}>
          <label className="sp-label" htmlFor="password">
            Your password
          </label>
          <input
            id="password"
            type="password"
            className="sp-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="sp-button" type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? 'Activating...' : 'Activate Account'}
          </button>
        </form>
      </div>
    </div>
  )
}
