import React, { useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import axiosClient from '@/utils/constants/axiosClient'
import toast from 'react-hot-toast'
import Icon from '@/utils/Icon'

import styles from '@/css/login.module.css'

export default function ActivateUser() {
  const searchParams = useSearch({ from: "/_public/auth/set-password" })
  const token = searchParams.token

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
        axiosClient.post('/auth/activate', { token, password }),
    onSuccess: async (res: any) => {
      toast.success(res?.data?.message || 'Account activated successfully')
      await navigate({to: '/auth/login'})
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Activation failed')
    },
  })



  const checks = {
    oneChar: password.length >= 1,
    length: password.length >= 6,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
  }

  const isPasswordValid = Object.values(checks).every(Boolean)
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      toast.error("Missing activation token")
      return
    }

    if (!isPasswordValid || !passwordsMatch) return

    mutation.mutate({ token, password })
  }

  if (!token) return <p>Invalid or missing activation token.</p>

  const ruleClass = (valid: boolean) =>
      valid ? styles.checkValid : styles.checkInvalid

  return (
      <section className={styles.authPageWrapper}>
        <div className={styles.logoCard}>
          <img
              src="/skypulse_flavicon.png"
              alt="logo"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate({ to: "/" })}
          />
        </div>

        <div className={styles.loginContainer}>
          <form className={styles.loginCard} onSubmit={handleSubmit}>
            <h2 className={styles.title}>
              Set your <span className={styles.green}>password</span>
            </h2>


            <div
                className={`${styles.passwordChecklist} ${
                    isPasswordValid ? styles.checklistValid : styles.checklistInvalid
                }`}
            >
              <div className={ruleClass(checks.oneChar)}>
                <Icon iconName="check" /> At least 1 character
              </div>

              <div className={ruleClass(checks.upper)}>
                <Icon iconName="check" /> One uppercase letter
              </div>
              <div className={ruleClass(checks.lower)}>
                <Icon iconName="check" /> One lowercase letter
              </div>
              <div className={ruleClass(checks.number)}>
                <Icon iconName="check" /> One number
              </div>
              <div className={ruleClass(checks.length)}>
                <Icon iconName="check" /> At least 6 characters
              </div>
            </div>


            <label className={styles.label}>Password</label>
            <div className={styles.passwordWrapper}>
              <input
                  type={showPassword ? "text" : "password"}
                  className={styles.formInput}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
              />

              <span
                  className={styles.eyeIcon}
                  onClick={() => setShowPassword(p => !p)}
              >
              <Icon iconName={showPassword ? "eyeClosed" : "eye"} />
            </span>
            </div>


            <label className={styles.label}>Confirm Password</label>
            <div className={styles.passwordWrapper}>
              <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={styles.formInput}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
              />

              <span
                  className={styles.eyeIcon}
                  onClick={() => setShowConfirmPassword(p => !p)}
              >
              <Icon iconName={showConfirmPassword ? "eyeClosed" : "eye"} />
            </span>
            </div>

            {confirmPassword.length > 0 && !passwordsMatch && (
                <div className={styles.confirmHint}>
                  Passwords must match
                </div>
            )}

            <button
                className={styles.button}
                type="submit"
                disabled={!isPasswordValid || !passwordsMatch || mutation.isPending}
            >
              {mutation.isPending ? 'Activating...' : 'Activate Account'}
            </button>
          </form>
        </div>
      </section>
  )
}
