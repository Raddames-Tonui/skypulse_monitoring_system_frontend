import { useState } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import axiosClient from "@/utils/constants/axiosClient";
import toast from "react-hot-toast";

import styles from "@/css/login.module.css";

export default function ResetPasswordPage() {
  const searchParams = useSearch({ from: "/_public/auth/reset-password" });
  const token = searchParams.token;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      axiosClient.post("/auth/reset-password", { token, password }),
    onSuccess: (res: any) => {
      toast.success(res?.data?.message || "Password reset successful!");
      setTimeout(() => navigate({ to: "/auth/login" }), 1500);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Password reset failed";
      toast.error(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({ password: true, confirmPassword: true });

    if (!password || password.length < 6) {
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    if (!token) {
      toast.error("Missing reset token");
      return;
    }

    mutation.mutate({ token, password });
  };

  const getInputClass = (field: "password" | "confirmPassword") => {
    if (!touched[field]) return styles.formInput;
    if (field === "password" && password.length < 6)
      return `${styles.formInput} ${styles.error}`;
    if (field === "confirmPassword" && password !== confirmPassword)
      return `${styles.formInput} ${styles.error}`;
    if (
      (field === "password" && password.length >= 6) ||
      (field === "confirmPassword" && password === confirmPassword)
    )
      return `${styles.formInput} ${styles.success}`;
    return styles.formInput;
  };

  if (!token) return <p>Invalid or missing reset token.</p>;

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginCard} onSubmit={handleSubmit}>
        <h2 className={styles.title}>
          Reset your <span className={styles.green}>password</span>
        </h2>

        <label className={styles.label} htmlFor="password">
          New Password
        </label>
        <input
          id="password"
          type="password"
          className={getInputClass("password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() =>
            setTouched((prev) => ({ ...prev, password: true }))
          }
          placeholder="Enter new password"
        />
        <p
          className={`${styles.errorMessage} ${touched.password && password.length < 6 ? styles.active : ""
            }`}
        >
          Password must be at least 6 characters
        </p>

        <label className={styles.label} htmlFor="confirmPassword">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          className={getInputClass("confirmPassword")}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={() =>
            setTouched((prev) => ({ ...prev, confirmPassword: true }))
          }
          placeholder="Confirm new password"
        />
        <p
          className={`${styles.errorMessage} ${touched.confirmPassword && password !== confirmPassword
            ? styles.active
            : ""
            }`}
        >
          Passwords do not match
        </p>
        <button
          type="submit"
          className={styles.button}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Resetting..." : "Reset Password"}
        </button>
        <p className={styles.footerText}>
          Remembered Password?{" "}
          <Link to="/auth/login" from="/auth/reset-password" className={styles.greenLink}>Back to Login</Link>
        </p>
      </form>
    </div>
  );
}