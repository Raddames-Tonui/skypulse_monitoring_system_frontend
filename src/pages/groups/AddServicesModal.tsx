import Modal from "@/components/modal/Modal";
import DynamicForm from "@/components/dynamic-form/DynamicForm";
import { useAddGroupServices } from "@/pages/groups/data-access/useMutateData";
import {useGetMonitoredServices} from "@/pages/services/data-access/useFetchData.tsx";

interface AddServicesModalProps {
    isOpen: boolean;
    onClose: () => void;
    groupUuid: string;
    currentServices?: any[];
}

export default function AddServicesModal({
                                             isOpen,
                                             onClose,
                                             groupUuid,
                                             currentServices = [],
                                         }: AddServicesModalProps) {

    const { data: allServicesData, isLoading } = useGetMonitoredServices({
        page: 1,
        pageSize: 1000,
    });

    const { mutate, isPending } = useAddGroupServices(groupUuid);

    const services = Array.isArray(allServicesData?.data)
        ? allServicesData.data.flat()
        : [];

    const schema: any = {
        id: "add-services-form",
        meta: {
            title: "Add Services",
            subtitle: "Select monitored services to add to the group",
        },
        fields: {
            services: {
                id: "services",
                label: "Select Services",
                renderer: "multiselect",
                props: {
                    data: services.map((s: any) => ({
                        label: s.monitored_service_name,
                        value: String(s.monitored_service_id),
                    })),
                    searchable: true,
                    valueKey: "value",
                    labelKey: "label",
                },
            },
        },
        layout: [
            {
                kind: "stack",
                spacing: "md",
                children: [{ kind: "field", fieldId: "services" }],
            },
        ],
    };

    const handleFormSubmit = (values: any) => {
        const serviceIds = (values.services ?? [])
            .map((id: string) => parseInt(id, 10))
            .filter((id: number) => !isNaN(id));

        if (serviceIds.length > 0) {
            mutate(serviceIds, {
                onSuccess: () => {
                    onClose();
                },
            });
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            title="Add Services"
            onClose={onClose}
            size={"lg"}
            body={
                isLoading ? (
                    <div className="p-4 text-center">Loading available services...</div>
                ) : (
                    <DynamicForm
                        schema={schema}
                        initialData={{
                            services: currentServices
                                .map((s) => s.monitored_service_id ?? s.id)
                                .filter((id) => id != null)
                                .map((id) => String(id)),
                        }}
                        onSubmit={handleFormSubmit}
                        showButtons={false}
                    />
                )
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
                        form={schema.id}
                        className="btn-primary"
                        disabled={isPending}
                    >
                        {isPending ? "Adding..." : "Add Services"}
                    </button>
                </div>
            }
        />
    );
}
