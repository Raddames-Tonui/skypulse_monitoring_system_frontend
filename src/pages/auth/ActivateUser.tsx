import { useState, useContext } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import axiosClient from '@/utils/constants/axiosClient'
import toast from 'react-hot-toast'
import { AuthContext } from '@/context/AuthContext'

import styles from '@/css/login.module.css'

export default function ActivateUser() {
  const searchParams = useSearch({ from: "/_public/auth/set-password" });
  const token = searchParams.token;

  const [password, setPassword] = useState("")
  const [touched, setTouched] = useState(false)
  const navigate = useNavigate()
  const auth = useContext(AuthContext)

  const mutation = useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      axiosClient.post('/auth/activate', { token, password }),
    onSuccess: async (res: any) => {
      toast.success(res?.data?.message || 'Account activated successfully')

      try {
        await auth?.fetchProfile()
        navigate({ to: '/dashboard' })
      } catch (err) {
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
    setTouched(true)

    if (!password || password.length < 6) {
      return
    }

    if (!token) {
      toast.error("Missing reset token");
      return;
    }
    mutation.mutate({ token, password })
  }

  const getInputClass = () => {
    if (!touched) {
      return styles.formInput
    }
    return password.length >= 6 ? `${styles.formInput} ${styles.success}` : `${styles.formInput} ${styles.error}`
  }

  if (!token) return <p>Invalid or missing activation token.</p>

  return (
    <section className={styles.authPageWrapper}>
      <div className={styles.logoCard}>
        <img src="/skypulse_flavicon.png" alt="logo" />
      </div>

      <div className={styles.loginContainer}>
        <form className={styles.loginCard} onSubmit={handleSubmit}>
          <h2 className={styles.title}>
            Just enter your <span className={styles.green}>password!</span>
          </h2>

          <label className={styles.label} htmlFor="password">
            Your password
          </label>
          <input
            id="password"
            type="password"
            className={getInputClass()}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="Enter password"
          />
          {touched && password.length < 6 && (
            <p className={`${styles.errorMessage} ${styles.active}`}>
              Password must be at least 6 characters
            </p>
          )}

          <button className={styles.button} type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Activating...' : 'Activate Account'}
          </button>
        </form>
      </div>
    </section>

  )
}
