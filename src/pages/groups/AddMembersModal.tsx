import { useQueryClient, useMutation } from "@tanstack/react-query";
import axiosClient from "@/utils/constants/axiosClient";
import Modal from "@/components/modal/Modal";
import DynamicForm from "@/components/dynamic-form/DynamicForm";
import toast from "react-hot-toast";
import {useUsers} from "@/pages/users/data-access/useFetchData.tsx";
import type {User} from "@/pages/users/data-access/types.ts";

interface AddMembersModalProps {
    isOpen: boolean;
    onClose: () => void;
    groupUuid: string;
    currentMembers?: { user_id: number }[];
}

export default function AddMembersModal({
    isOpen,
    onClose,
    groupUuid,
    currentMembers = [],

}: AddMembersModalProps) {
    const queryClient = useQueryClient();

    const { data, isLoading } = useUsers({ page: 1, pageSize: 50 });

    const users: User[] = data?.data ?? [];

    const mutation = useMutation({
        mutationFn: async (selectedIds: string[]) => {
            await axiosClient.post(`/contacts/groups/${groupUuid}/members`, {
                membersIds: selectedIds.map((id) => Number(id)),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contact-group", groupUuid] });
            toast.success("Members added successfully.");
            onClose();
        },
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
                    <div>Loading users...</div>
                ) : (
                    <DynamicForm
                        schema={schema}
                        initialData={{
                            members: currentMembers
                                .map((m) => m.user_id ?? m.id)
                                .filter((id) => id != null)
                                .map((id) => String(id)),
                        }}

                        onSubmit={(values) => {
                            const membersIds = (values.members ?? [])
                                .map((id: string) => parseInt(id, 10))
                                .filter((id) => Number.isInteger(id));

                            if (membersIds.length > 0) {
                                mutation.mutate(membersIds);
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
