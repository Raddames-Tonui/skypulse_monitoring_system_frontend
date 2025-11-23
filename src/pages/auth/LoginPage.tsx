import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useNavigate } from "@tanstack/react-router";
import * as z from "zod";

import styles from "@/css/login.module.css";
import { useAuth } from "@/hooks/hooks";

// ----- Zod schema -----
const loginSchema = z.object({
  email: z.string().email("Invalid email").nonempty("Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const redirectTo = "/dashboard"; // Replace with useSearch if needed

  const [authError, setAuthError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted, touchedFields },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const getInputClass = (field: keyof FormData) => {
    if (errors[field]) return `${styles.formInput} ${styles.error}`;
    if (authError && isSubmitted) return `${styles.formInput} ${styles.neutral}`;
    if (touchedFields[field]) return `${styles.formInput} ${styles.success}`;
    return styles.formInput;
  };

  const onSubmit = async (data: FormData) => {
    setAuthError(false);
    try {
      await login(data.email, data.password);
      navigate({ to: redirectTo });
    } catch (error: any) {
      setAuthError(true);
      toast.error(error?.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.loginForm}>
        <h2 className={styles.formTitle}>Login</h2>

        <label className={styles.formLabel} htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className={getInputClass("email")}
          placeholder="Enter email"
        />
        <p className={`${styles.errorMessage} ${errors.email ? styles.active : ""}`}>
          {errors.email?.message && `${errors.email.message} ❌`}
        </p>

        <label className={styles.formLabel} htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          {...register("password")}
          className={getInputClass("password")}
          placeholder="Enter password"
        />
        <p className={`${styles.errorMessage} ${errors.password ? styles.active : ""}`}>
          {errors.password?.message && `${errors.password.message} ❌`}
        </p>

        <a href="/auth/resetpassword" className={styles.formLink}>
          Forgot your password?
        </a>

        <button type="submit" className={styles.formSubmit}>Login</button>

        <div className={styles.formLinks}>
          <a href="/auth/register" className={styles.formLink}>Create account</a>
        </div>
      </form>
    </div>
  );
}
