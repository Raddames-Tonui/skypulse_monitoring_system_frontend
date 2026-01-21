import DynamicForm from "@/components/dynamic-form/DynamicForm";
import { systemSettingsFormSchema } from "@components/dynamic-form/utils/FormSchema.ts";
import Loader from "@components/layout/Loader.tsx";
import { useRestartApplication, useRollbackSettings, useSaveSettings } from "@/pages/settings/data-access/useMutateData";
import { useSystemSettings } from "@/pages/settings/data-access/useFetchData";


function SystemSettings() {
  const { data, isLoading, isFetching, queryClient } = useSystemSettings();
  const saveMutation = useSaveSettings(queryClient);
  const rollbackMutation = useRollbackSettings(queryClient);
  const restartApplication = useRestartApplication();

  if (isLoading || isFetching) return <Loader  className={"loading"}/>;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>System Settings</h1>
        <div className="page-header-buttons">
          <button
            type="button"
            disabled={rollbackMutation.isPending}
            onClick={() => rollbackMutation.mutate()}
            className="btn-secondary"
          >
            {rollbackMutation.isPending ? "Reverting..." : "Revert to Previous Version"}
          </button>
          <button
            type="button"
            disabled={restartApplication.isPending}
            onClick={() => restartApplication.mutate()}
            className="btn-primary"
          >
            {restartApplication.isPending ? "Restarting..." : "Restart Application"}
          </button>
        </div>
      </div>

      <section>
        <DynamicForm
          schema={systemSettingsFormSchema}
          initialData={data?.data}
          onSubmit={(values) => saveMutation.mutate(values)}
          className="dynamic-form-wrapper"
          fieldClassName="system-form-field-wrapper"
          buttonClassName="form-buttons-wrapper"
        />
      </section>
    </div>
  );
}

export default SystemSettings;
