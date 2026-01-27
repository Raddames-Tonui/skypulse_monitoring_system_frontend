import React from "react";
import Modal from "@/components/modal/Modal";
import DynamicForm from "@/components/dynamic-form/DynamicForm";
import { updateServiceSchema } from "@/components/dynamic-form/utils/FormSchema";
import { useUpdateService } from "@/pages/services/data-access/useMutateData";

interface UpdateServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: Record<string, any> | null;
}

const UpdateServiceModal: React.FC<UpdateServiceModalProps> = ({
                                                                   isOpen,
                                                                   onClose,
                                                                   initialData,
                                                               }) => {
    const { mutate: updateService, isPending } = useUpdateService();

    if (!initialData) return null;

    const handleFormSubmit = (values: Record<string, any>) => {
        const payload = { uuid: initialData.uuid, ...values };
        updateService(payload, {
            onSuccess: () => onClose(),
        });
    };

    const initialFormData = {
        monitored_service_name: initialData.name,
        monitored_service_url: initialData.url,
        monitored_service_region: initialData.region,
        check_interval: initialData.check_interval,
        retry_count: initialData.retry_count,
        retry_delay: initialData.retry_delay,
        expected_status_code: initialData.expected_status_code,
        ssl_enabled: initialData.ssl_enabled,
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Update Service: ${initialData.name}`}
            size="lg"
            body={
                <DynamicForm
                    schema={updateServiceSchema}
                    initialData={initialFormData}
                    onSubmit={handleFormSubmit}
                    showButtons={false}
                />
            }
            footer={
                <div className="flex justify-end gap-2">
                    <button
                        type="reset"
                        form={updateServiceSchema.id}
                        className="btn-secondary"
                        disabled={isPending}
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        form={updateServiceSchema.id}
                        className="btn-primary"
                        disabled={isPending}
                    >
                        {isPending ? "Saving..." : "Save"}
                    </button>
                </div>
            }
        />
    );
};

export default UpdateServiceModal;
