import Loader from "@/components/Loader";
import Modal from "@/components/modal/Modal";
import DynamicForm from "@/components/dynamic-form/DynamicForm";
import { useGetUserProfile } from "./data-access/useFetchData";
import { useUpdateUserProfile } from "./data-access/useMutateData";
import { userProfileSchema } from "@/components/dynamic-form/FormSchema";

interface GetUserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GetUserProfileModal: React.FC<GetUserProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { data, isPending, isError, error } = useGetUserProfile();
  const updateMutation = useUpdateUserProfile();

  if (isPending) {
    return (
      <Modal
        isOpen={isOpen}
        title="User Profile"
        body={<Loader />}
        onClose={onClose}
      />
    );
  }

  if (isError) {
    return (
      <Modal
        isOpen={isOpen}
        title="User Profile"
        body={<div>{error.message}</div>}
        onClose={onClose}
      />
    );
  }

  if (!data) {
    return (
      <Modal
        isOpen={isOpen}
        title="User Profile"
        body={<div>No profile found.</div>}
        onClose={onClose}
      />
    );
  }

  const initialData = {
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,

    contact_email:
      data.user_contacts?.find((c) => c.is_primary)?.value ?? "",

    alert_channel: data.user_preferences.alert_channel,
    receive_weekly_reports: data.user_preferences.receive_weekly_reports,
    language: data.user_preferences.language,
    timezone: data.user_preferences.timezone,
  };

  return (
    <Modal
      isOpen={isOpen}
      title="User Profile"
      onClose={onClose}
      body={
        <DynamicForm
          schema={userProfileSchema}
          initialData={initialData}
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
              },
            });
          }}
          showButtons={false}  // hide internal buttons
        />
      }
      footer={
        <>
          <button
            type="submit"
            form={userProfileSchema.id}   // connects to the form
            className="btn-primary"
          >
            Save
          </button>

          <button
            type="reset"
            form={userProfileSchema.id}
            className="btn-secondary"
          >
            Reset
          </button>
        </>
      }
    />
  );
};

export default GetUserProfileModal;
