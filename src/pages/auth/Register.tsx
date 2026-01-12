import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import axiosClient from "@/utils/constants/axiosClient";
import toast from "react-hot-toast";

import styles from "@/css/login.module.css";

export default function Register() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const mutation = useMutation({
    mutationFn: (payload: any) => axiosClient.post("/auth/register", payload),
    onSuccess: (res: any) => {
      toast.success(res?.data?.message || "User created successfully");
      setTimeout(() => navigate({ to: "/auth/login" }), 1500);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Registration failed";
      toast.error(msg);
    },
  });

  const handleBlur = (field: string) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  const getInputClass = (field: string, value: string) => {
    if (touchedFields[field]) {
      if (!value) return `${styles.formInput} ${styles.error}`;
      if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return `${styles.formInput} ${styles.error}`;
      if ((field === "password" || field === "confirmPassword") && value.length < 6)
        return `${styles.formInput} ${styles.error}`;
      if (field === "confirmPassword" && value !== password)
        return `${styles.formInput} ${styles.error}`;
      return `${styles.formInput} ${styles.success}`;
    }
    return styles.formInput;
  };

  const getErrorMessage = (field: string) => {
    if (!touchedFields[field]) return "";
    switch (field) {
      case "firstName":
        return !firstName ? "First name is required" : "";
      case "lastName":
        return !lastName ? "Last name is required" : "";
      case "email":
        if (!email) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email address";
        return "";
      case "password":
        if (!password) return "Password is required";
        if (password.length < 6) return "Password must be at least 6 characters";
        return "";
      case "confirmPassword":
        if (!confirmPassword) return "Confirm your password";
        if (confirmPassword !== password) return "Passwords do not match";
        return "";
      default:
        return "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setTouchedFields({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      password.length < 6 ||
      confirmPassword !== password ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      toast.error("Please fix the errors in the form");
      return;
    }

    mutation.mutate({
      first_name: firstName,
      last_name: lastName,
      user_email: email,
      password,
      role_id: 1,
    });
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginCard} onSubmit={handleSubmit}>
        <h2 className={styles.title}>
          Register <span className={styles.green}>!</span>
        </h2>

        <label className={styles.label}>First Name</label>
        <input
          className={getInputClass("firstName", firstName)}
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          onBlur={() => handleBlur("firstName")}
          placeholder="Enter first name"
        />
        <p className={`${styles.errorMessage} ${getErrorMessage("firstName") ? styles.active : ""}`}>
          {getErrorMessage("firstName")}
        </p>

        <label className={styles.label}>Last Name</label>
        <input
          className={getInputClass("lastName", lastName)}
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          onBlur={() => handleBlur("lastName")}
          placeholder="Enter last name"
        />
        <p className={`${styles.errorMessage} ${getErrorMessage("lastName") ? styles.active : ""}`}>
          {getErrorMessage("lastName")}
        </p>

        <label className={styles.label}>Email</label>
        <input
          className={getInputClass("email", email)}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => handleBlur("email")}
          placeholder="Enter email"
        />
        <p className={`${styles.errorMessage} ${getErrorMessage("email") ? styles.active : ""}`}>
          {getErrorMessage("email")}
        </p>

        <label className={styles.label}>Password</label>
        <input
          className={getInputClass("password", password)}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => handleBlur("password")}
          placeholder="Enter password"
        />
        <p className={`${styles.errorMessage} ${getErrorMessage("password") ? styles.active : ""}`}>
          {getErrorMessage("password")}
        </p>

        <label className={styles.label}>Confirm Password</label>
        <input
          className={getInputClass("confirmPassword", confirmPassword)}
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={() => handleBlur("confirmPassword")}
          placeholder="Confirm password"
        />
        <p
          className={`${styles.errorMessage} ${
            getErrorMessage("confirmPassword") ? styles.active : ""
          }`}
        >
          {getErrorMessage("confirmPassword")}
        </p>

        <button
          className={styles.button}
          type="submit"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
