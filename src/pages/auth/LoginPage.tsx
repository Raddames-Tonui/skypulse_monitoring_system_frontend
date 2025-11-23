import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-hot-toast";
import { useNavigate, useSearch } from "@tanstack/react-router";

import styles from "@/css/login.module.css";
import { useAuth } from "@/hooks/hooks";

// Form validation schema
const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
});

type FormData = yup.InferType<typeof schema>;

// Optional search params type
type LoginSearchSchema = {
  redirect?: string;
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Safe useSearch with default empty object
//   const search = useSearch<LoginSearchSchema>() ?? {};
//   const redirectTo = search.redirect || "/";
const redirectTo = "/dashboard";

  const [authError, setAuthError] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitted, touchedFields } } = useForm<FormData>({
    resolver: yupResolver(schema),
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
      toast.success("Logged in successfully!");
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
          {errors.email?.message ? `${errors.email.message} ❌` : ""}
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
          {errors.password?.message ? `${errors.password.message} ❌` : ""}
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
