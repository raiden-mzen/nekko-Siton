import React, { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";
import "../styles/login.css";
import "../styles/contact.css";

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [formValues, setFormValues] = useState({ username: "", email: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const userObj = sessionData?.session?.user;
      setUser(userObj);
      if (userObj) {
        // Try to fetch profile info from profiles table
        const { data: profileData } = await supabase
          .from("profiles")
          .select("id, name, email, phone, user_type, username, avatar_url")
          .eq("id", userObj.id)
          .single();
          setProfile(profileData ?? userObj);
          setFormValues({
            username: profileData?.username ?? profileData?.name ?? "",
            email: profileData?.email ?? userObj.email ?? "",
            phone: profileData?.phone ?? "",
          });
        // Fetch user's bookings
        const { data: bookingsData } = await supabase
          .from("bookings")
          .select("id, service, date, status, amount")
          .eq("email", userObj.email)
          .order("date", { ascending: false });
        setBookings(bookingsData ?? []);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  // Handle profile picture upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    setUploadError(null);
    try {
      const filename = `${user.id}_${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadErr } = await supabase.storage.from('profile_avatars').upload(filename, file, { upsert: true });
      if (uploadErr) throw uploadErr;
      // Get public URL
      const { data: urlData } = supabase.storage.from('profile_avatars').getPublicUrl(uploadData.path);
      const avatarUrl = urlData?.publicUrl;
      // Update profile
      await supabase.from("profiles").update({ avatar_url: avatarUrl }).eq("id", user.id);
      setProfile((prev: any) => ({ ...prev, avatar_url: avatarUrl }));
    } catch (err: any) {
      setUploadError(err?.message ?? "Upload failed");
    }
    setUploading(false);
  };

  const handleEditToggle = () => {
    setSaveError(null);
    setSaveSuccess(null);
    setEditing(true);
  };

  const handleCancel = () => {
    // reset form to current profile values
    setFormValues({
      username: profile?.username ?? profile?.name ?? "",
      email: profile?.email ?? user.email ?? "",
      phone: profile?.phone ?? "",
    });
    setEditing(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);
    try {
      // If email changed, update auth user email first
      if (formValues.email && formValues.email !== (user.email ?? profile?.email)) {
        const { error } = await supabase.auth.updateUser({ email: formValues.email });
        if (error) throw error;
        // update local user object
      }

      // Upsert into profiles table (create or update)
        const payload = {
        id: user.id,
        username: formValues.username,
        email: formValues.email,
        phone: formValues.phone,
      };
        const { error: upsertErr } = await supabase.from("profiles").upsert(payload);
      if (upsertErr) throw upsertErr;

      // Refresh profile
      const { data: refreshed } = await supabase.from("profiles").select("id, name, username, email, phone, user_type, avatar_url").eq("id", user.id).single();
      setProfile(refreshed ?? { ...profile, ...payload });
      setSaveSuccess("Profile updated successfully.");
      setEditing(false);
    } catch (err: any) {
      setSaveError(err?.message ?? "Failed to save profile");
    }
    setSaving(false);
  };

  const requestPasswordReset = async () => {
    if (!user?.email) {
      alert('No email associated with account');
      return;
    }
    try {
      await supabase.from('password_reset_requests').insert([{ email: user.email, requested_at: new Date().toISOString(), status: 'pending' }]);
      alert('Password reset request sent to admin.');
    } catch (err: any) {
      alert('Failed to send request: ' + (err.message ?? String(err)));
    }
  };

  if (loading) return <div className="login-container"><div className="login-form-section"><div className="login-form-container"><p>Loading profile...</p></div></div></div>;
  if (!user) return <div className="login-container"><div className="login-form-section"><div className="login-form-container"><p>Please login to view your profile.</p></div></div></div>;

  return (
    <div className="login-container">
      <div className="login-form-section">
        <div className="login-form-container">
          <h2 style={{marginBottom: '1rem'}}>Profile</h2>
          {/* Avatar upload */}
          <div className="form-group" style={{textAlign: 'center'}}>
            <label>Profile Picture</label>
            <div style={{marginBottom: '0.5rem'}}>
              <img src={profile?.avatar_url ?? "https://ui-avatars.com/api/?name=" + encodeURIComponent(profile?.username ?? profile?.name ?? "User")} alt="avatar" style={{width: 80, height: 80, borderRadius: '50%', objectFit: 'cover'}} />
            </div>
            <input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
            {uploadError && <div className="error-message">{uploadError}</div>}
          </div>
          <div className="form-group">
            <label>Username</label>
            <div className="input-with-icon">
              <input name="username" type="text" value={formValues.username} onChange={handleFormChange} disabled={!editing} />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <div className="input-with-icon">
              <input name="email" type="email" value={formValues.email} onChange={handleFormChange} disabled={!editing} />
            </div>
          </div>
          <div className="form-group">
            <label>Contact Number</label>
            <div className="input-with-icon">
              <input name="phone" type="tel" value={formValues.phone} onChange={handleFormChange} disabled={!editing} />
            </div>
          </div>
          <div className="form-group">
            <label>Role</label>
            <div className="input-with-icon">
              <input type="text" value={profile?.user_type ?? (user.user_metadata?.userType ?? "client")} disabled />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <input type="password" value="********" disabled />
            </div>
            <div style={{ marginTop: 8 }}>
              <button type="button" className="action-btn" onClick={requestPasswordReset}>Request password reset (ask admin)</button>
            </div>
          </div>
          {/* Save/Cancel controls */}
          <div className="form-group" style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            {!editing ? (
              <button type="button" className="action-btn" onClick={handleEditToggle}>Edit profile</button>
            ) : (
              <>
                <button type="button" className="action-btn confirm" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
                <button type="button" className="action-btn reject" onClick={handleCancel} disabled={saving}>Cancel</button>
              </>
            )}
          </div>
          {saveError && <div className="error-message">{saveError}</div>}
          {saveSuccess && <div className="success-message">{saveSuccess}</div>}
          {/* Booking progress */}
          <div className="form-group">
            <label>Booking Progress</label>
            <div style={{marginTop: '0.5rem'}}>
              {bookings.length === 0 ? (
                <span>No bookings yet.</span>
              ) : (
                <ul style={{listStyle: 'none', padding: 0}}>
                  {bookings.map((b) => (
                    <li key={b.id} style={{marginBottom: '0.5rem'}}>
                      <strong>{b.service}</strong> — {new Date(b.date).toLocaleDateString()}<br />
                      <span className={`status-badge status-${b.status}`}>{b.status}</span> ₱{b.amount}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
