import DynamicForm from "@/components/dynamic-form/DynamicForm";
import { createGroupSchema } from "@components/dynamic-form/utils/FormSchema.ts";
import NavigationBar from "@components/layout/NavigationBar.tsx";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import axiosClient from "@/utils/constants/axiosClient";
import { toast } from "react-hot-toast";

function CreateContactGroupPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const links = [
    { label: "Back", to: "/groups", match: (p) => p.includes("groups") },
  ];

  const handleSubmit = async (values: Record<string, any>) => {
    setIsSubmitting(true);
    try {
      const res = await axiosClient.post("/contacts/groups", values);
      toast.success(res.data?.message || "Group created successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create group");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Create Contact Group</h1>
        <NavigationBar links={links} />
      </div>

      <DynamicForm
        schema={createGroupSchema}
        initialData={{
          contact_group_name: "",
          contact_group_description: "",
          members: [],
          services: [],
          is_deleted: false,
        }}
        onSubmit={handleSubmit}
        className="dynamic-form-wrapper"
        fieldClassName="form-field-wrapper"
        buttonClassName="form-buttons-wrapper"
        style={{ maxWidth: "800px", margin: "0 auto" }}
        submitting={isSubmitting}
      />
    </div>
  );
}

export default CreateContactGroupPage;
