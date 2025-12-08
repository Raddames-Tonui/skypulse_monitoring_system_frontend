import { createFileRoute } from "@tanstack/react-router";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage.tsx";

export const Route = createFileRoute("/_public/auth/reset-password")({
    validateSearch: (search) => ({
        token: search.token as string | undefined,
    }),
    component: ResetPasswordPage,
});