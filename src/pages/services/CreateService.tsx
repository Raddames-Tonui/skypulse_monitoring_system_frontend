import DynamicForm from "@/components/dynamic-form/DynamicForm";
import { monitoredServiceFormSchema } from "@components/dynamic-form/utils/FormSchema.ts";
import NavigationBar from "@components/layout/NavigationBar.tsx";

import {useCreateService} from "@/pages/services/data-access/useMutateData.tsx";

function CreateService() {
  const createService = useCreateService();


  const links = [
    { label: "Back", to: "/services", match: (p) => p.includes("uptime-reports") },
  ];
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Create Service</h1>
        <NavigationBar links={links} />
      </div>
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