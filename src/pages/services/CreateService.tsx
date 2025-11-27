import DynamicForm from "@/components/dynamic-form/DynamicForm";
import { monitoredServiceFormSchema } from "@/components/dynamic-form/FormSchema";
import { useCreateService } from "@/hooks/services";

function CreateService() {
  const createService = useCreateService();

  return (
    <div className="page-wrapper">
      <h1>Create Monitored Service</h1>
      <DynamicForm
        schema={monitoredServiceFormSchema}
        initialData={{
          monitored_service_name: "",
          monitored_service_url: "",
          monitored_service_region: "",
          check_interval: "",
          retry_count: "",
          retry_delay: "",
          expected_status_code: "",
          ssl_enabled: true,
        }}
        onSubmit={(values) => createService.mutate(values)}
        className="dynamic-form-wrapper"
        fieldClassName="form-field-wrapper"
        buttonClassName="form-buttons-wrapper"
        style={{ maxWidth: "800px", margin: "0 auto" }}
      />
    </div>
  );
}

export default CreateService;
