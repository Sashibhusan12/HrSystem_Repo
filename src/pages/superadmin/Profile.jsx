import React, { useState, useEffect, useRef } from "react";
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Edit2, Save, Camera, X, Upload } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Profile() {
  const { user, getUserById, uploadProfilePicture } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    location: "", position: "", department: "", joinDate: "",
    profileUrl: null, bio: "Welcome to your profile",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getUserById(user?.userId);
      if (res?.success && res?.data) {
        const d = res.data;
        setProfile({
          firstName: d.FirstName ?? "",
          lastName: d.LastName ?? "",
          email: d.Email ?? "",
          phone: d.PhoneNumber ?? "",
          location: d.Loaction ?? "—",
          position: d.RoleName ?? "—",
          department: d.DesignationName ?? "—",
          profileUrl: d.ProfileUrl ?? null,
          joinDate: d.JoinDate
            ? new Date(d.JoinDate).toLocaleDateString()
            : d.CreatedOn
              ? new Date(d.CreatedOn).toLocaleDateString()
              : "—",
          bio: "Welcome to your profile",
        });
      }
      setLoading(false);
    };
    fetchUser();
  }, [user?.userId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("Please select an image file."); return; }
    if (file.size > 5 * 1024 * 1024) { alert("File size must be less than 5MB."); return; }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);

    const res = await uploadProfilePicture(
      selectedFile,
      user?.userId
    );

    if (res.success && res.data?.profileUrl) {
      setProfile((prev) => ({
        ...prev,
        profileUrl: res.data.profileUrl,
      }));

      toast.success("Profile picture updated successfully!");
      setSelectedFile(null);
      setPreviewUrl(null);
    } else {
      toast.error(res.message || "Upload failed.");
    }

    setUploading(false);
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getFullName = () => `${profile.firstName} ${profile.lastName}`.trim() || "—";
  const getInitials = () => {
    const f = profile.firstName?.[0] ?? "";
    const l = profile.lastName?.[0] ?? "";
    return (f + l).toUpperCase() || "U";
  };

  const currentImage = previewUrl || profile.profileUrl;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Profile</h1>
          <p className="text-slate-600">Manage your account information</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
        >
          {isEditing ? <Save size={20} /> : <Edit2 size={20} />}
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Profile Card ── */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 text-white text-center">

            {/* Avatar */}
            <div className="relative w-32 h-32 mx-auto mb-4">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center overflow-hidden border-4 border-white/30">
                {currentImage ? (
                  <img src={currentImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl font-bold text-indigo-600">{getInitials()}</span>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-9 h-9 bg-white text-indigo-600 rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-50 transition"
                title="Change profile picture"
              >
                <Camera size={16} />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>

            {/* Upload Actions */}
            {selectedFile && (
              <div className="mb-4 bg-white/20 rounded-xl p-3">
                <p className="text-xs text-white/80 mb-2 truncate">{selectedFile.name}</p>
                <div className="flex gap-2 justify-center">
                  <button onClick={handleUpload} disabled={uploading}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white text-indigo-600 rounded-lg text-xs font-semibold hover:bg-indigo-50 transition disabled:opacity-50">
                    <Upload size={13} />
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                  <button onClick={handleCancelUpload}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white/20 text-white rounded-lg text-xs font-semibold hover:bg-white/30 transition">
                    <X size={13} /> Cancel
                  </button>
                </div>
              </div>
            )}

            <h2 className="text-2xl font-bold mb-1">{getFullName()}</h2>
            <p className="text-indigo-200 mb-4">{profile.position}</p>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-center gap-2 text-sm">
                <Calendar size={16} />
                <span>Joined {profile.joinDate || "—"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Profile Details ── */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Personal Information</h3>

            {/* Row 1: First Name + Last Name */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-1">
                  <User size={14} className="text-indigo-500" /> First Name
                </label>
                {isEditing ? (
                  <input type="text" value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                ) : (
                  <p className="text-slate-900 font-medium px-4 py-2 bg-slate-50 rounded-lg">{profile.firstName || "—"}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-1">
                  <User size={14} className="text-indigo-500" /> Last Name
                </label>
                {isEditing ? (
                  <input type="text" value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                ) : (
                  <p className="text-slate-900 font-medium px-4 py-2 bg-slate-50 rounded-lg">{profile.lastName || "—"}</p>
                )}
              </div>
            </div>

            {/* Row 2: Email + Phone */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-1">
                  <Mail size={14} className="text-purple-500" /> Email Address
                </label>
                <p className="text-slate-900 font-medium px-4 py-2 bg-slate-50 rounded-lg truncate">{profile.email || "—"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-1">
                  <Phone size={14} className="text-green-500" /> Phone Number
                </label>
                {isEditing ? (
                  <input type="tel" value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                ) : (
                  <p className="text-slate-900 font-medium px-4 py-2 bg-slate-50 rounded-lg">{profile.phone || "—"}</p>
                )}
              </div>
            </div>

            {/* Row 3: Position + Designation */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-1">
                  <Briefcase size={14} className="text-blue-500" /> Position
                </label>
                <p className="text-slate-900 font-medium px-4 py-2 bg-slate-50 rounded-lg">{profile.position || "—"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-1">
                  <Briefcase size={14} className="text-pink-500" /> Designation
                </label>
                <p className="text-slate-900 font-medium px-4 py-2 bg-slate-50 rounded-lg">{profile.department || "—"}</p>
              </div>
            </div>

            {/* Row 4: Location + Join Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-1">
                  <MapPin size={14} className="text-orange-500" /> Location
                </label>
                <p className="text-slate-900 font-medium px-4 py-2 bg-slate-50 rounded-lg">{profile.location || "—"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 flex items-center gap-2 mb-1">
                  <Calendar size={14} className="text-teal-500" /> Join Date
                </label>
                <p className="text-slate-900 font-medium px-4 py-2 bg-slate-50 rounded-lg">{profile.joinDate || "—"}</p>
              </div>
            </div>

          </div>

          {/* Bio */}
          {/* <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Bio</h3>
            {isEditing ? (
              <textarea value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows="4"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            ) : (
              <p className="text-slate-600">{profile.bio || "—"}</p>
            )}
          </div> */}
        </div>

      </div>
    </div>
  );
}