// import { useGetUserProfile } from "@/hooks/useGetUserProfile";
// import "./UserProfile.css";

export default function UserProfile() {
  const { data, isLoading, isError } = useGetUserProfile();

  if (isLoading) return <div className="profile-loading">Loading profile…</div>;
  if (isError || !data) return <div className="profile-error">Failed to load profile</div>;

  const emailContact = data.user_contacts.find(
    (c) => c.type === "EMAIL" && c.is_primary
  );

  const phoneContact = data.user_contacts.find(
    (c) => c.type === "SMS" && c.is_primary
  );

  const fullName = `${data.first_name} ${data.last_name}`;

  return (
    <div className="profile-container">
      {/* Sidebar */}
      <aside className="profile-sidebar">
        <div className="profile-avatar">
          {data.first_name.charAt(0)}
        </div>

        <h3 className="profile-name">{fullName}</h3>
        <p className="profile-email">{emailContact?.value}</p>

        <span className="profile-role">{data.role_name}</span>

        <nav className="profile-nav">
          <button className="active">Overview</button>
          <button>Edit Profile</button>
          <button>Change Password</button>
          <button>Settings</button>
          <button>Activity Log</button>
        </nav>
      </aside>

      {/* Main Content */}
      <section className="profile-content">
        <h2>Account Overview</h2>

        <div className="profile-grid">
          <div>
            <label>User ID</label>
            <p>{data.user_id}</p>
          </div>

          <div>
            <label>Company</label>
            <p>{data.company_name}</p>
          </div>

          <div>
            <label>Email</label>
            <p>{emailContact?.value}</p>
          </div>

          <div>
            <label>Phone</label>
            <p>{phoneContact?.value ?? "Not set"}</p>
          </div>

          <div>
            <label>Role</label>
            <span className="profile-role-tag">{data.role_name}</span>
          </div>

          <div>
            <label>Status</label>
            <span className={data.is_active ? "status-active" : "status-inactive"}>
              {data.is_active ? "Active" : "Inactive"}
            </span>
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
          <button className="btn-primary">Edit Profile</button>
          <button className="btn-secondary">Change Password</button>
        </div>
      </section>
    </div>
  );
}
