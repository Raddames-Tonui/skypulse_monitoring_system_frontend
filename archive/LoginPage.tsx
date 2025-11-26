import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/hooks";
import styles from "../../css/login.module.css";  
import DynamicForm from "@/components/dynamic-form/DynamicForm";
import { loginFormSchema } from "@/components/dynamic-form/FormSchema";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const redirectTo = "/dashboard";

  const handleLogin = async (values: Record<string, any>) => {
    try {
      await login(values.email, values.password);
      toast.success("Login successful");
      navigate({ to: redirectTo });
    } catch (error: any) {
      console.error("LoginPage handleLogin error:", error);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <DynamicForm
        schema={loginFormSchema}
        onSubmit={handleLogin}
        className={styles.loginFormWrapper}
        fieldClassName={styles.loginField}
        buttonClassName={styles.loginButton}
      />
      <a href="/auth/resetpassword" className={styles.formLink}>
        Forgot your password?
      </a>
      <div>
        <a href="/auth/register" className={styles.formLink}>
          Create account
        </a>
      </div>
    </div>
  );
}
