import { useState } from "react";
import { normalizeContacts } from "@/pages/users/data-access/normalizeContacts";
import Loader from "@components/layout/Loader";
import GetUserProfileModal from "@/pages/users/GetUserProfileModal.tsx";
import {useGetUserProfile} from "@/context/data-access/useFetchData.tsx";

export default function UserProfilePage() {
  const { data, isLoading, isError } = useGetUserProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) return <Loader />;
  if (isError || !data) return <div>Failed to load profile</div>;

  const contactsMap = normalizeContacts(data.user_contacts);
  const fullName = `${data.first_name} ${data.last_name}`;

  return (
      <>
        <div className="page-header">
          <h1>User Profile</h1>
        </div>

        <div className="profile-container">
          <div className="profile-sidebar">
            <div className="profile-avatar">
              {data.first_name.charAt(0)}
            </div>

            <h3 className="profile-name">{fullName}</h3>

            <p className="profile-email profile-name">
              {data.email}
            </p>

            <span className="profile-role profile-name">
            {data.role_name}
          </span>

            <button
                className="btn-primary profile-edit-btn"
                onClick={() => setIsModalOpen(true)}
            >
              Edit Profile
            </button>
          </div>

          <section className="profile-content">
            <h2>Account Overview</h2>

            <div className="profile-section">
              <h3>Contacts</h3>

              <div className="profile-grid">
                <div>
                  <label>Notification Email</label>
                  <p>{contactsMap.EMAIL ?? "Not set"}</p>
                </div>

                <div>
                  <label>Phone</label>
                  <p>{contactsMap.SMS ?? "Not set"}</p>
                </div>

                <div>
                  <label>Telegram</label>
                  <p>{contactsMap.TELEGRAM ?? "Not set"}</p>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h3>Preferences</h3>

              <div className="profile-grid">
                <div>
                  <label>Language</label>
                  <p>{data.user_preferences.language.toUpperCase()}</p>
                </div>

                <div>
                  <label>Timezone</label>
                  <p>{data.user_preferences.timezone}</p>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h3>Organization</h3>

              <div className="profile-grid">
                <div>
                  <label>Company</label>
                  <p>{data.company_name ?? "—"}</p>
                </div>
              </div>
            </div>
          </section>

          {isModalOpen && (
              <GetUserProfileModal
                  isOpen
                  onClose={() => setIsModalOpen(false)}
              />
          )}
        </div>
      </>
  );
}
