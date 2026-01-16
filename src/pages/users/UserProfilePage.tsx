import { useState } from "react";
import { useGetUserProfile } from "./data-access/useFetchData";
import GetUserProfileModal from "./GetUserProfileModal";

export default function UserProfilePage() {
  const { data, isLoading, isError } = useGetUserProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) return <div className="profile-loading">Loading profile…</div>;
  if (isError || !data) return <div className="profile-error">Failed to load profile</div>;

  // Map user_contacts array to a record by type
  const contactsMap = data.user_contacts.reduce<Record<string, string>>(
    (acc, c) => {
      acc[c.type] = c.value;
      return acc;
    },
    {}
  );

  const fullName = `${data.first_name} ${data.last_name}`;

  return (
    <>
      <div className="page-header">
        <h1>User Profile</h1>
      </div>

      <div className="profile-container">
        <aside className="profile-sidebar">
          <div className="profile-avatar">{data.first_name.charAt(0)}</div>
          <h3 className="profile-name">{fullName}</h3>
          <p className="profile-email profile-name">{contactsMap.EMAIL}</p>
          <span className="profile-role profile-name">{data.role_name}</span>

          <nav className="profile-nav">
            {/* <button className="active">Overview</button> */}
            <button onClick={() => setIsModalOpen(true)}>Edit Profile</button>
            <button>Change Password</button>
            <button>Settings</button>
            <button>Activity Log</button>
          </nav>
        </aside>

        <section className="profile-content">
          <h2>Account Overview</h2>
          <div className="profile-grid">

            <div>
              <label>Company</label>
              <p>{data.company_name}</p>
            </div>
            <div>
              <label>Email</label>
              <p>{contactsMap.EMAIL}</p>
            </div>
            <div>
              <label>Phone</label>
              <p>{contactsMap.SMS ?? "Not set"}</p>
            </div>
            <div>
              <label>Telegram</label>
              <p>{contactsMap.TELEGRAM ?? "Not set"}</p>
            </div>
            <div>
              <label>Role</label>
              <span className="profile-role-tag">{data.role_name}</span>
            </div>
            <div>
              <label>Language</label>
              <p>{data.user_preferences.language.toUpperCase()}</p>
            </div>
            <div>
              <label>Timezone</label>
              <p>{data.user_preferences.timezone}</p>
            </div>
          </div>

          <div className="profile-actions">
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
              Edit Profile
            </button>
            {/* <button className="btn-secondary">Change Password</button> */}
          </div>
        </section>

        {isModalOpen && (
          <GetUserProfileModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </>

  );
}
