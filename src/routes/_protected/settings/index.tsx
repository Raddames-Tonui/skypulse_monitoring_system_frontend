import DynamicForm from '@/components/dynamic-form/DynamicForm'
import { systemSettingsFormSchema } from '@/components/dynamic-form/FormSchema'
import axiosClient from '@/utils/constants/axiosClient';
import { createFileRoute } from '@tanstack/react-router'
import toast from 'react-hot-toast';

export const Route = createFileRoute('/_protected/settings/')({
  component: RouteComponent,
})

function RouteComponent() {
  const handleFormSubmit = async (values: Record<string, any>) => {
    try {
      const response = await axiosClient.post('/settings', values); 
      // console.log("Server response:", response.data);
      toast.success("Settings saved successfully!");
    } catch (err: any) {
      // console.error("Failed to save settings:", err.response?.data || err.message);
      toast.error("Failed to save settings");
    }
  };

  return (
    <div className="page-wrapper">
      <DynamicForm
        schema={systemSettingsFormSchema}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
