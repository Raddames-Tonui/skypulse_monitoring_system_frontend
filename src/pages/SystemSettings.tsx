import DynamicForm from "@/components/dynamic-form/DynamicForm";
import { systemSettingsFormSchema } from "@/components/dynamic-form/FormSchema";
import Loader from "@/components/Loader";
import axiosClient from "@/utils/constants/axiosClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function SystemSettings() {
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["system-settings"],
    queryFn: async () => {
      const s = await axiosClient.get("/settings");
      return {
        ...s.data,
        ssl_alert_thresholds: s.data.ssl_alert_thresholds
          ? s.data.ssl_alert_thresholds.split(",").map((v: string) => v.trim())
          : [],
      };
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (values: Record<string, any>) => {
      const payload = {
        ...values,
        ssl_alert_thresholds: Array.isArray(values.ssl_alert_thresholds)
          ? values.ssl_alert_thresholds.join(",")
          : values.ssl_alert_thresholds,
      };
      return axiosClient.post("/settings", payload);
    },
    onSuccess: () => {
      toast.success("Settings saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["system-settings"] });
    },
    onError: (err: any) => {
      toast.error(err?.data?.message || err.message || "Failed to save settings");
    },
  });

  const rollbackMutation = useMutation({
    mutationFn: async () => axiosClient.post("/settings/rollback", { rollback: true }),
    onSuccess: async () => {
      toast.success("Settings reverted to previous version!");
      // Invalidate and refetch to reload data
      await queryClient.invalidateQueries({ queryKey: ["system-settings"] });
    },
    onError: (err: any) => {
      toast.error(err?.data?.message || err.message || "Failed to revert settings");
    },
  });

  const restartApplication = useMutation({
    mutationFn: async () => axiosClient.get("/system/tasks/reload"),
    onSuccess: async (data: any) => {
      toast.success(data?.message || "Application restart initiated!");
    },
    onError: (err: any) => {
      toast.error(err?.data?.message || err.message || "Failed to restart application");
    },
  });

  if (isLoading || isFetching) return <Loader />;

  return (
    <div className="page-wrapper space-y-4">
      <div className="mt-4 flex gap-4">
        <button
          type="button"
          disabled={rollbackMutation.isPending}
          onClick={() => rollbackMutation.mutate()}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded"
        >
          {rollbackMutation.isPending ? "Reverting..." : "Revert to Previous Version"}
        </button>
        <button
          type="button"
          disabled={restartApplication.isPending}
          onClick={() => restartApplication.mutate()}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded"
        >
          {restartApplication.isPending ? "Restarting..." : "Restart Application"}
        </button>
      </div>

      <DynamicForm
        schema={systemSettingsFormSchema}
        initialData={data}
        onSubmit={(values) => saveMutation.mutate(values)}
      />
    </div>
  );
}

export default SystemSettings;
