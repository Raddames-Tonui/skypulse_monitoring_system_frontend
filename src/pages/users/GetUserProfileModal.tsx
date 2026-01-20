import React from "react";
import Loader from "@components/layout/Loader.tsx";
import Modal from "@/components/modal/Modal";
import DynamicForm from "@/components/dynamic-form/DynamicForm";
import { useGetUserProfile } from "./data-access/useFetchData";
import { useUpdateUserProfile } from "@/context/data-access/useMutateData";
import { userProfileSchema } from "@components/dynamic-form/utils/FormSchema.ts";
import type { UserProfile } from "@/context/data-access/types";
import { normalizeContacts } from "./data-access/normalizeContacts";

interface GetUserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GetUserProfileModal: React.FC<GetUserProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { data, isPending: isFetching, isError, error } = useGetUserProfile();
  const updateMutation = useUpdateUserProfile();

  if (isFetching) {
    return (
      <Modal
        isOpen={isOpen}
        title="User Profile"
        body={<Loader />}
        onClose={onClose}
      />
    );
  }

  if (isError || !data) {
    return (
      <Modal
        isOpen={isOpen}
        title="User Profile"
        body={<div>{error?.message ?? "Failed to load profile"}</div>}
        onClose={onClose}
      />
    );
  }

  const contactsMap = normalizeContacts(data.user_contacts);

  const initialData = {
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,

    contact_email: contactsMap.EMAIL ?? "",
    contact_sms: contactsMap.SMS ?? "",
    contact_telegram: contactsMap.TELEGRAM ?? "",

    alert_channel: data.user_preferences.alert_channel,
    receive_weekly_reports: data.user_preferences.receive_weekly_reports,
    language: data.user_preferences.language,
    timezone: data.user_preferences.timezone,
    dashboard_layout: data.user_preferences.dashboard_layout ?? {},
  };

  return (
    <Modal
      isOpen={isOpen}
      title="User Profile"
      size="lg"
      onClose={onClose}
      body={
        <DynamicForm
          schema={userProfileSchema}
          initialData={initialData}
          showButtons={false}
          onSubmit={(values) => {
            updateMutation.mutate({
              user_id: data.user_id,
              first_name: values.first_name,
              last_name: values.last_name,

              user_preferences: {
                alert_channel: values.alert_channel,
                receive_weekly_reports: values.receive_weekly_reports,
                language: values.language,
                timezone: values.timezone,
                dashboard_layout: values.dashboard_layout ?? {},
              },

              user_contacts: {
                EMAIL: values.contact_email || null,
                SMS: values.contact_sms || null,
                TELEGRAM: values.contact_telegram || null,
              },
            } satisfies Partial<UserProfile>);
          }}
        />
      }
      footer={
        <>
          <button
            type="submit"
            form={userProfileSchema.id}
            className="btn-primary"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Saving…" : "Save"}
          </button>

          <button
            type="reset"
            form={userProfileSchema.id}
            className="btn-secondary"
            disabled={updateMutation.isPending}
          >
            Reset
          </button>
        </>
      }
    />
  );
};

export default GetUserProfileModal;
