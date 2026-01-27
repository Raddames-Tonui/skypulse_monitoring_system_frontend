import Modal from "@components/modal/Modal.tsx";
import DynamicForm from "@components/dynamic-form/DynamicForm.tsx";
import { monitoredServiceFormSchema } from "@components/dynamic-form/utils/FormSchema.ts";
import { useCreateService } from "@/pages/services/data-access/useMutateData.tsx";

interface CreateServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function CreateServiceModal({
                                               isOpen,
                                               onClose,
                                               onSuccess,
                                           }: CreateServiceModalProps) {
    const { mutate, isPending } = useCreateService();

    const handleSubmit = (values: Record<string, any>) => {
        mutate(values, {
            onSuccess: () => {
                onClose();
                onSuccess?.();
            },
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create Monitored Service"
            size="lg"
            body={
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
                    onSubmit={handleSubmit}
                    showButtons={false}
                />
            }
            footer={
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={onClose}
                        disabled={isPending}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form={monitoredServiceFormSchema.id}
                        className="btn-primary"
                        disabled={isPending}
                    >
                        {isPending ? "Creating..." : "Create Service"}
                    </button>
                </div>
            }
        />
    );
}
