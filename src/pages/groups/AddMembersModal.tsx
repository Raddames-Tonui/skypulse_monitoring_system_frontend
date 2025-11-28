import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axiosClient from "@/utils/constants/axiosClient";
import Modal from "@/components/Modal";
import DynamicForm from "@/components/dynamic-form/DynamicForm";

interface AddMembersModalProps {
    isOpen: boolean;
    onClose: () => void;
    groupUuid: string;
    currentMembers?: { id: number;[key: string]: any }[];
}

export default function AddMembersModal({
    isOpen,
    onClose,
    groupUuid,
    currentMembers = [],
}: AddMembersModalProps) {
    const queryClient = useQueryClient();

    // Fetch all users
    const { data: users = [], isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const { data } = await axiosClient.get("/users");
            return data?.data || [];
        },
    });

    // Mutation to add members
    const mutation = useMutation({
        mutationFn: async (selectedIds: string[]) => {
            await axiosClient.post(`/contacts/groups/${groupUuid}/members`, {
                membersIds: selectedIds.map((id) => Number(id)),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contactGroup", groupUuid] });
            onClose();
        },
    });

    const schema: any = {
        id: "add-members",
        meta: {
            title: "Add Members",
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
                        value: String(u.id),
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
            body={
                isLoading ? (
                    <div>Loading users...</div>
                ) : (
                    <DynamicForm
                        schema={schema}
                        initialData={{
                            members: currentMembers.map((m) => String(m.id)),
                        }}
                        onSubmit={(values) => {
                            const membersIds = values.members.map((id: string) => Number(id));
                            mutation.mutate(membersIds);
                        }}
                    />

                )
            }
        />
    );
}
