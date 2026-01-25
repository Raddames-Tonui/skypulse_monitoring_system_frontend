import { useQueryClient, useMutation } from "@tanstack/react-query";
import axiosClient from "@/utils/constants/axiosClient";
import Modal from "@/components/modal/Modal";
import DynamicForm from "@/components/dynamic-form/DynamicForm";
import toast from "react-hot-toast";
import { useUsers } from "@/pages/users/data-access/useFetchData.tsx";
import type { Users } from "@/pages/users/data-access/types.ts";

interface AddMembersModalProps {
    isOpen: boolean;
    onClose: () => void;
    groupUuid: string;
    currentMembers?: { user_id: number; id?: number }[];
}

export default function AddMembersModal({
                                            isOpen,
                                            onClose,
                                            groupUuid,
                                            currentMembers = [],
                                        }: AddMembersModalProps) {
    const queryClient = useQueryClient();

    const { data, isLoading } = useUsers({ page: 1, pageSize: 50 });

    const users: Users[] = data?.data ?? [];

    const mutation = useMutation({
        mutationFn: async (selectedIds: number[]) => {
            await axiosClient.post(`/contacts/groups/${groupUuid}/members`, {
                membersIds: selectedIds,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contact-group", groupUuid] });
            toast.success("Members added successfully.");
            onClose();
        },
        onError: () => {
            toast.error("Failed to add members.");
        }
    });

    const schema: any = {
        id: "add-members",
        meta: {
            // title: "Add Members",
            subtitle: "Select users to add to the group",
        },
        fields: {
            members: {
                id: "members",
                label: "Select Members",
                renderer: "multiselect",
                props: {
                    data: users.map((u) => ({
                        label: `${u.first_name} ${u.last_name}`,
                        value: String(u.user_id),
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
                children: [{ kind: "field", fieldId: "members" }],
            },
        ],
    };

    return (
        <Modal
            isOpen={isOpen}
            title="Add Members"
            onClose={onClose}
            size={"lg"}
            body={
                isLoading ? (
                    <div className="p-4 text-center">Loading users...</div>
                ) : (
                    <DynamicForm
                        schema={schema}
                        initialData={{
                            members: currentMembers
                                .map((m) => m.user_id ?? m.id)
                                .filter((id): id is number => id != null)
                                .map((id) => String(id)),
                        }}
                        onSubmit={(values) => {
                            const membersIds = (values.members ?? [])
                                .map((id: string) => parseInt(id, 10))
                                .filter((id: number) => !isNaN(id));

                            if (membersIds.length > 0) {
                                mutation.mutate(membersIds);
                            } else {
                                toast.error("Please select at least one member.");
                            }
                        }}
                        showButtons={false}
                    />
                )
            }
            footer={
                <div className="flex gap-2 justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-secondary"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form={schema.id}
                        className="btn-primary"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? "Saving..." : "Save"}
                    </button>
                </div>
            }
        />
    );
}
