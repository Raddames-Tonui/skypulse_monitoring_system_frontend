import DynamicForm from "@/components/dynamic-form/DynamicForm";
import { updateServiceSchema } from "@/components/dynamic-form/FormSchema";
import Modal from "@/components/modal/Modal";
import { useUpdateService } from "@/hooks/hooks";
import React from "react";

interface UpdateServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: Record<string, any>;
}

const UpdateServiceModal: React.FC<UpdateServiceModalProps> = ({
    isOpen,
    onClose,
    initialData,
}) => {
    const { mutate: updateService } = useUpdateService();

    const handleSubmit = (formValues: Record<string, any>) => {
        const payload = { uuid: initialData.uuid, ...formValues };
        updateService(payload, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    if (!initialData) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Update Monitored Service"
              size = "lg"
            body={
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <DynamicForm
                        schema={updateServiceSchema}
                        initialData={{
                            monitored_service_name: initialData.name,
                            monitored_service_url: initialData.url,
                            monitored_service_region: initialData.region,
                            check_interval: initialData.check_interval,
                            retry_count: initialData.retry_count,
                            retry_delay: initialData.retry_delay,
                            expected_status_code: initialData.expected_status_code,
                            ssl_enabled: initialData.ssl_enabled,
                        }}
                        onSubmit={handleSubmit}
                        // className="update-service-form"
                        // buttonClassName="form-buttons"
                        showButtons={false} 
                    />
                </div>
            }
            footer={
                <>
                    <button
                        type="submit"
                        form={updateServiceSchema.id}
                        className="btn-primary"
                    >
                        Save
                    </button>

                    <button
                        type="reset"
                        form={updateServiceSchema.id}
                        className="btn-secondary"
                    >
                        Reset
                    </button>
                </>
            }
        />
    );
};

export default UpdateServiceModal;
