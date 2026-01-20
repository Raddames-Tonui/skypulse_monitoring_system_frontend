import { useState } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import axiosClient from "@/utils/constants/axiosClient";
import toast from "react-hot-toast";
import Icon from "@/utils/Icon";

import styles from "@/css/login.module.css";

export default function ResetPasswordPage() {
  const searchParams = useSearch({ from: "/_public/auth/reset-password" });
  const token = searchParams.token;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
        axiosClient.post("/auth/reset-password", { token, password }),
    onSuccess: (res: any) => {
      toast.success(res?.data?.message || "Password reset successful!");
      navigate({ to: "/auth/login" });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Password reset failed");
    },
  });



  const checks = {
    oneChar: password.length >= 1,
    length: password.length >= 6,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
  };

  const isPasswordValid = Object.values(checks).every(Boolean);
  const passwordsMatch =
      confirmPassword.length > 0 && password === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Missing reset token");
      return;
    }

    if (!isPasswordValid || !passwordsMatch) return;

    mutation.mutate({ token, password });
  };

  if (!token) return <p>Invalid or missing reset token.</p>;

  const ruleClass = (valid: boolean) =>
      valid ? styles.checkValid : styles.checkInvalid;

  return (
      <section className={styles.authPageWrapper}>
        <div className={styles.logoCard}>
          <img
              src="/skypulse_flavicon.png"
              alt="logo"
              style={{ cursor: "pointer" }}
              onClick={() => navigate({ to: "/" })}
          />
        </div>

        <div className={styles.loginContainer}>
          <form className={styles.loginCard} onSubmit={handleSubmit}>
            <h2 className={styles.title}>
              Reset your <span className={styles.green}>password</span>
            </h2>


            <div
                className={`${styles.passwordChecklist} ${
                    isPasswordValid
                        ? styles.checklistValid
                        : styles.checklistInvalid
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


            <label className={styles.label}>New Password</label>
            <div className={styles.passwordWrapper}>
              <input
                  type={showPassword ? "text" : "password"}
                  className={styles.formInput}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
              />

              <span
                  className={styles.eyeIcon}
                  onClick={() => setShowPassword((p) => !p)}
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
                  placeholder="Confirm new password"
              />

              <span
                  className={styles.eyeIcon}
                  onClick={() => setShowConfirmPassword((p) => !p)}
              >
              <Icon iconName={showConfirmPassword ? "eyeClosed" : "eye"} />
            </span>
            </div>

            {confirmPassword.length > 0 && !passwordsMatch && (
                <div className={styles.confirmHint}>Passwords must match</div>
            )}

            <button
                type="submit"
                className={styles.button}
                disabled={!isPasswordValid || !passwordsMatch || mutation.isPending}
            >
              {mutation.isPending ? "Resetting..." : "Reset Password"}
            </button>

            <p className={styles.footerText}>
              Remembered Password?{" "}
              <Link
                  to="/auth/login"
                  from="/auth/reset-password"
                  className={styles.greenLink}
              >
                Back to Login
              </Link>
            </p>
          </form>
        </div>
      </section>
  );
}
