import DynamicForm from "@/components/dynamic-form/DynamicForm";
import { systemSettingsFormSchema } from "@/components/dynamic-form/FormSchema";
import Loader from "@/components/Loader";
import axiosClient from "@/utils/constants/axiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

interface ApiResponse {
  message: string;
  status?: "success" | "error";
}

function SystemSettings() {
  const queryClient = useQueryClient();

  // ---------- Query for system settings ----------
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["system-settings"],
    queryFn: async () => {
      const res = await axiosClient.get<ApiResponse & Record<string, string | number | boolean>>("/settings");
      return {
        ...res.data,
        ssl_alert_thresholds: res.data.ssl_alert_thresholds
          ? res.data.ssl_alert_thresholds.split(",").map((v: string) => v.trim())
          : [],
      };
    },
  });

  // ----------  Save settings ----------
  const saveMutation = useMutation({
    mutationFn: async (values: Record<string, any>) => {
      const payload = {
        ...values,
        ssl_alert_thresholds: Array.isArray(values.ssl_alert_thresholds)
          ? values.ssl_alert_thresholds.join(",")
          : values.ssl_alert_thresholds,
      };
      return axiosClient.post<ApiResponse>("/settings", payload);
    },
    onSuccess: () => {
      toast.success("Settings saved successfully");
      queryClient.invalidateQueries({ queryKey: ["system-settings"] });
    },
    onError: (err: unknown) => {
      const error = err as AxiosError<ApiResponse>;
      const message = error.response?.data?.message || error.message || "Failed to save settings";
      toast.error(message);
    },
  });


  const rollbackMutation = useMutation({
    mutationFn: async () => axiosClient.post<ApiResponse>("/settings/rollback", { rollback: true }),
    onSuccess: async (res) => {
      if (res.data?.status === "error") {
        toast.error(res.data.message || "Rollback failed");
      } else {
        toast.success(res.data.message || "Settings reverted to previous version!");
        await queryClient.invalidateQueries({ queryKey: ["system-settings"] });
      }
    },
    onError: (err: unknown) => {
      const error = err as AxiosError<ApiResponse>;
      const message = error.response?.data?.message || error.message || "Failed to revert settings";
      toast.error(message);
    },
  });

  const restartApplication = useMutation({
    mutationFn: async () => axiosClient.get<ApiResponse>("/system/tasks/reload"),
    onSuccess: (res) => {
      toast.success(res.data?.message || "Application restart initiated!");
    },
    onError: (err: unknown) => {
      const error = err as AxiosError<ApiResponse>;
      const message = error.response?.data?.message || error.message || "Failed to restart application";
      toast.error(message);
    },
  });

  if (isLoading || isFetching) return <Loader />;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>System Settings</h1>
        <div className="page-header-buttons">
          <button
            type="button"
            disabled={rollbackMutation.isPending}
            onClick={() => rollbackMutation.mutate()}
            className="btn btn-danger"
          >
            {rollbackMutation.isPending ? "Reverting..." : "Revert to Previous Version"}
          </button>
          <button
            type="button"
            disabled={restartApplication.isPending}
            onClick={() => restartApplication.mutate()}
            className="btn btn-danger"
          >
            {restartApplication.isPending ? "Restarting..." : "Restart Application"}
          </button>
        </div>
      </div>

      <DynamicForm
        schema={systemSettingsFormSchema}
        initialData={data?.data}
        onSubmit={(values) => saveMutation.mutate(values)}
        className="dynamic-form-wrapper"
        fieldClassName="system-form-field-wrapper"
        buttonClassName="form-buttons-wrapper"
        style={{ maxWidth: "800px", margin: "0 auto" }}
      />
    </div>
  );
}

export default SystemSettings;
