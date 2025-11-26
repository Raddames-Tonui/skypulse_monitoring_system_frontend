import { useState } from 'react';
import toast from 'react-hot-toast';
import axiosClient from '@/utils/constants/axiosClient';
import DynamicForm from '@/components/dynamic-form/DynamicForm';
import { systemSettingsFormSchema } from '@/components/dynamic-form/FormSchema';

function SystemSettings() {
  const [isRollingBack, setIsRollingBack] = useState(false);

  const handleFormSubmit = async (values: Record<string, any>) => {
    try {
      const response = await axiosClient.post('/settings', values);
      toast.success("Settings saved successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save settings");
    }
  };

  // Handle rollback to previous version
  const handleRollback = async () => {
    setIsRollingBack(true);
    try {
      const response = await axiosClient.post('/settings', { rollback: true });
      toast.success("Settings reverted to previous version!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to revert settings");
    } finally {
      setIsRollingBack(false);
    }
  };

  return (
    <div className="page-wrapper space-y-4">
      <DynamicForm
        schema={systemSettingsFormSchema}
        onSubmit={handleFormSubmit}
      />

      <div className="mt-4">
        <button
          type="button"
          disabled={isRollingBack}
          onClick={handleRollback}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded"
        >
          {isRollingBack ? "Reverting..." : "Revert to Previous Version"}
        </button>
      </div>
    </div>
  );
}

export default SystemSettings;
