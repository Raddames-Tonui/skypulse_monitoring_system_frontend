import React from "react";
import Modal from "@/components/modal/Modal";
import DynamicForm from "@/components/dynamic-form/DynamicForm";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axiosClient from "@/utils/constants/axiosClient";
import { createGroupSchema } from "@components/dynamic-form/utils/FormSchema.ts";
import { toast } from "react-hot-toast";

interface CreateContactGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateContactGroupModal: React.FC<CreateContactGroupModalProps> = ({
                                                                             isOpen,
                                                                             onClose,
                                                                         }) => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: async (values: Record<string, any>) => {
            const { data } = await axiosClient.post("/contacts/groups", values);
            return data;
        },
        onSuccess: (data) => {
            toast.success(data?.message || "Group created successfully");
            queryClient.invalidateQueries({ queryKey: ["contact-groups"] });
            onClose();
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || "Failed to create group");
        },
    });

    return (
        <Modal
            isOpen={isOpen}
            title="Create Contact Group"
            size="lg"
            onClose={onClose}
            body={
                <DynamicForm
                    schema={createGroupSchema}
                    initialData={{}}
                    showButtons={false}
                    onSubmit={(values) => createMutation.mutate(values)}
                />
            }
            footer={
                <>
                    <button
                        type="submit"
                        form={createGroupSchema.id}
                        className="btn-primary"
                        disabled={createMutation.isPending}
                    >
                        {createMutation.isPending ? "Creating..." : "Create"}
                    </button>

                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={onClose}
                        disabled={createMutation.isPending}
                    >
                        Cancel
                    </button>
                </>
            }
        />
    );
};

export default CreateContactGroupModal;
