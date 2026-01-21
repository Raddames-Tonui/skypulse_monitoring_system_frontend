import { useQueryClient, useMutation } from "@tanstack/react-query";
import axiosClient from "@/utils/constants/axiosClient";
import Modal from "@/components/modal/Modal";
import DynamicForm from "@/components/dynamic-form/DynamicForm";
import toast from "react-hot-toast";
import {type MonitoredService, useMonitoredServices} from "@/pages/services/data-access/useFetchData.tsx";

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
    const queryClient = useQueryClient();

    const { data, isLoading } = useMonitoredServices({
        page: 1,
        pageSize: 1000,
    });

    const services: MonitoredService[] = Array.isArray(data?.data)
        ? (data.data as MonitoredService[] | MonitoredService[][]).flat()
        : [];

    const mutation = useMutation({
        mutationFn: async (selectedIds: number[]) => {
            await axiosClient.post(`/contacts/groups/${groupUuid}/services`, {
                serviceIds: selectedIds,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contact-group-services", groupUuid] });
            toast.success("Services added successfully.");
            onClose();
        },
    });

    const schema: any = {
        id: "add-services",
        meta: {
            // title: "Add Services",
            subtitle: "Select monitored services to add to the group",
        },
        fields: {
            services: {
                id: "services",
                label: "Select Services",
                renderer: "multiselect",
                props: {
                    data: services.map((s) => ({
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

    return (
        <Modal
            isOpen={isOpen}
            title="Add Services"
            onClose={onClose}
            size={"lg"}
            body={
                isLoading ? (
                    <div>Loading services...</div>
                ) : (
                    <DynamicForm
                        schema={schema}
                        initialData={{
                            services: currentServices
                                .map((s) => s.monitored_service_id ?? s.id)
                                .filter((id) => id != null)
                                .map((id) => String(id)),
                        }}
                        onSubmit={(values) => {
                            const serviceIds = (values.services ?? [])
                                .map((id: string) => parseInt(id, 10))
                                .filter((id) => Number.isInteger(id));

                            if (serviceIds.length > 0) {
                                mutation.mutate(serviceIds);
                            }
                            }}
                            showButtons={false}
                    />
                )
            }

            footer={
                <>
                    <button
                        type="submit"
                        form={schema.id}  
                        className="btn-primary"
                    >
                        Save
                    </button>

                    <button
                        type="reset"
                        form={schema.id}
                        className="btn-secondary"
                    >
                        Reset
                    </button>
                </>
            }
        />
    );
}
