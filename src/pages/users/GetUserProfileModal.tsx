import Loader from "@/components/Loader";
import Modal from "@/components/Modal";
import { useGetUserProfile } from "./data-access/useFetchData";

interface GetUserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GetUserProfileModal: React.FC<GetUserProfileModalProps> = ({ isOpen, onClose }) => {
  const { data, isPending, isError, error } = useGetUserProfile();

  const modalBody = () => {
    if (isPending) return <Loader />;
    if (isError) return <div>{error.message}</div>;
    if (!data) return <div>No profile found.</div>;

    return (
      <section className="profile-card">
        <div className="profile-header">
          <h2>{data.first_name} {data.last_name}</h2>
          <span className="profile-role">{data.role_name}</span>
        </div>

        <p className="profile-company">{data.company_name}</p>
        <p className="profile-email">{data.email}</p>

        {/* CONTACTS */}
        <div className="profile-section">
          <h3>Contacts</h3>
          <ul className="contact-list">
            {data.user_contacts.map((contact) => (
              <li key={`${contact.contact_type}-${contact.value}`}>
                <span className="contact-type">{contact.contact_type}</span>
                <span className="contact-value">{contact.value}</span>

                {contact.is_primary && (
                  <span className="badge primary">Primary</span>
                )}

                {!contact.verified && (
                  <span className="badge warning">Unverified</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* PREFERENCES */}
        <div className="profile-section">
          <h3>Preferences</h3>
          <div className="preferences-grid">
            <div>
              <label>Alert Channel</label>
              <span>{data.user_preferences.alert_channel}</span>
            </div>

            <div>
              <label>Weekly Reports</label>
              <span>
                {data.user_preferences.receive_weekly_reports ? "Enabled" : "Disabled"}
              </span>
            </div>

            <div>
              <label>Timezone</label>
              <span>{data.user_preferences.timezone}</span>
            </div>

            <div>
              <label>Language</label>
              <span>{data.user_preferences.language}</span>
            </div>
          </div>
        </div>
      </section>

    );
  };

  const modalFooter = (
    <button className="btn btn-primary" onClick={onClose}>
      Close
    </button>
  );

  return (
    <Modal
      isOpen={isOpen}
      title="User Profile"
      body={modalBody()}
      footer={modalFooter}
      onClose={onClose}
    />
  );
};

export default GetUserProfileModal;
