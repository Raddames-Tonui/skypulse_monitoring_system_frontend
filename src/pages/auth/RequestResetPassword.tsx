import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axiosClient from "@/utils/constants/axiosClient";
import toast from "react-hot-toast";

import styles from "@/css/login.module.css";

export default function RequestResetPassword() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  const mutation = useMutation({
    mutationFn: (email: string) =>
      axiosClient.post("/auth/request/reset-password", { email }),
    onSuccess: (res: any) => {
      toast.success(
        res?.data?.message ??
          "If the email exists, a reset link has been sent."
      );
      setEmail("");
      setTouched(false);
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ??
          "Unable to process your request. Try again."
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!email) return toast.error("Email is required");
    if (!validEmail) return toast.error("Enter a valid email");

    mutation.mutate(email);
  };

  const inputClass = () => {
    if (!touched) return styles.formInput;
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    return `${styles.formInput} ${
      valid ? styles.success : styles.error
    }`;
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginCard}>

        <h2 className={styles.title}>
          Reset <span className={styles.green}>Password</span>
        </h2>

        <label className={styles.label} htmlFor="email">
          Email Address
        </label>

        <input
          id="email"
          type="email"
          className={inputClass()}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="Enter your email"
        />

        {/* Error message */}
        <p
          className={`${styles.errorMessage} ${
            touched &&
            (!email ||
              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
              ? styles.active
              : ""
          }`}
        >
          {!email && touched && "Email is required"}
          {email &&
            touched &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
            "Invalid email address"}
        </p>

        <a href="/auth/login" className={styles.greenLink}>
          Back to login
        </a>

        <button
          type="submit"
          className={styles.button}
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}
