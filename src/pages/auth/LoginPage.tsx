import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import * as z from "zod";

import styles from "@/css/login.module.css";
import { useLogin } from "@/context/data-access/useFetchData";


const loginSchema = z.object({
  email: z.string().email("Invalid email").nonempty("Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const getInputClass = (field: keyof FormData) => {
    if (errors[field]) return `${styles.formInput} ${styles.error}`;
    if (touchedFields[field]) return `${styles.formInput} ${styles.success}`;
    return styles.formInput;
  };

  const onSubmit = async (data: FormData) => {
    await loginMutation.mutateAsync({
      email: data.email,
      password: data.password,
    });

    navigate({ to: "/dashboard" });
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.loginCard}>
        <h2 className={styles.title}>
          Welcome back <span className={styles.green}>!</span>
        </h2>

        <label className={styles.label} htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className={getInputClass("email")}
          placeholder="Enter email"
        />
        <p className={`${styles.errorMessage} ${errors.email ? styles.active : ""}`}>
          {errors.email?.message}
        </p>

        <label className={styles.label} htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...register("password")}
          className={getInputClass("password")}
          placeholder="Enter password"
        />
        <p className={`${styles.errorMessage} ${errors.password ? styles.active : ""}`}>
          {errors.password?.message}
        </p>

        <a href="/auth/request-password" className={styles.link}>
          Forgot your password?
        </a>

        <button
          type="submit"
          className={styles.button}
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </button>

      </form>
    </div>
  );
}
