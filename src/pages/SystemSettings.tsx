import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axiosClient from '@/utils/constants/axiosClient';
import { systemSettingsFormSchema } from '@/components/dynamic-form/FormSchema';
import DynamicForm from '@/components/dynamic-form/DynamicForm';
import Loader from '@/components/Loader';

function SystemSettings() {
  const [initialValues, setInitialValues] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [isRollingBack, setIsRollingBack] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axiosClient.get('/settings');
        // Axios interceptor already returns response.data
        if (response?.data) {
          const defaults = {
            ...response.data,
            ssl_alert_thresholds: response.data.ssl_alert_thresholds
              ? response.data.ssl_alert_thresholds.split(',').map((v: string) => v.trim())
              : [],
          };
          setInitialValues(defaults);
        }
      } catch (err: any) {
        toast.error(err?.message || "Failed to load system settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);


  const handleFormSubmit = async (values: Record<string, any>) => {
    try {
      await axiosClient.post('/settings', values);
      toast.success("Settings saved successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save settings");
    }
  };

  const handleRollback = async () => {
    setIsRollingBack(true);
    try {
      await axiosClient.post('/settings/rollback', { rollback: true });
      toast.success("Settings reverted to previous version!");
      const response = await axiosClient.get('/settings');
      if (response.data?.data) {
        const defaults = {
          ...response.data.data,
          ssl_alert_thresholds: response.data.data.ssl_alert_thresholds
            ? response.data.data.ssl_alert_thresholds.split(',').map((v: string) => v.trim())
            : [],
        };
        setInitialValues(defaults);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to revert settings");
    } finally {
      setIsRollingBack(false);
    }
  };

  if (loading) return <p>
    <Loader />
  </p>;

  return (
    <div className="page-wrapper space-y-4">
      <DynamicForm
        schema={systemSettingsFormSchema}
        onSubmit={handleFormSubmit}
        initialData={initialValues}
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
