import React from "react";
import DynamicForm from "@/components/dynamic-form/DynamicForm";
import Modal from "@/components/modal/Modal";
import { useUpdateTemplate } from "./data-access/useMutateData";
import type { NotificationTemplate } from "./data-access/types";
import {updateTemplateSchema} from "@components/dynamic-form/utils/FormSchema.ts";

interface UpdateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: NotificationTemplate | null;
}

const UpdateTemplateModal: React.FC<UpdateTemplateModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const { mutate: updateTemplate, isPending } = useUpdateTemplate();

  const handleSubmit = (formValues: Record<string, any>) => {
    if (!initialData?.uuid) return;

    const payload = {
      uuid: initialData.uuid,
      ...formValues,
    };

    updateTemplate(payload, {
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
      title="Update Notification Template"
      size="lg"
      body={
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ 
            padding: "0.75rem", 
            background: "#f6f7f9", 
            borderRadius: "4px",
            marginBottom: "0.5rem"
          }}>
            <strong>Event Type:</strong> {initialData.event_type}
          </div>

          <DynamicForm
            schema={updateTemplateSchema}
            initialData={{
              subject_template: initialData.subject_template,
              body_template: initialData.body_template,
              pdf_template: initialData.pdf_template || "",
              include_pdf: initialData.include_pdf,
              storage_mode: initialData.storage_mode,
              template_syntax: initialData.template_syntax,
            }}
            onSubmit={handleSubmit}
            showButtons={false}
          />
        </div>
      }
      footer={
        <>
          <button
            type="submit"
            form={updateTemplateSchema.id}
            className="btn-primary"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="reset"
            form={updateTemplateSchema.id}
            className="btn-secondary"
            disabled={isPending}
          >
            Reset
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </button>
        </>
      }
    />
  );
};

export default UpdateTemplateModal;
