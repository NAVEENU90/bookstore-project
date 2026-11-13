import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faPen } from "@fortawesome/free-solid-svg-icons";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import Footer from "../../components/Footer";
import { getProfileAPI, updateProfileAPI } from "../../services/allApi";
import { serverURL } from "../../services/serverURL";
import { ToastContainer, toast } from "react-toastify";

const EMPTY_FORM = { username: "", password: "", confirmPassword: "" };

const inputClass =
  "w-full rounded border border-gray-400 bg-white px-3 py-2 placeholder-gray-500 focus:border-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-900";

const AdminSettings = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [profile, setProfile] = useState(null);
  const [token] = useState(() => sessionStorage.getItem("token") || "");
  const [isLoading, setIsLoading] = useState(Boolean(token));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(
    token ? "" : "Please log in to manage your admin settings.",
  );
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    const loadProfile = async () => {
      const result = await getProfileAPI({
        Authorization: `Bearer ${token}`,
      });

      if (!isMounted) return;
      setIsLoading(false);
      if (result?.status === 200) {
        setProfile(result.data);
        setForm({ ...EMPTY_FORM, username: result.data.username || "" });
      } else {
        const message = result?.response?.data;
        setError(
          typeof message === "string"
            ? message
            : result?.message || "Failed to load your admin profile.",
        );
      }
    };

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setError("Choose a PNG or JPEG image.");
      e.target.value = "";
      return;
    }
    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const handleReset = () => {
    setForm({ ...EMPTY_FORM, username: profile?.username || "" });
    setAvatarFile(null);
    setPreview("");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.username.trim()) {
      setError("Username is required.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
      setError("Please log in to manage your admin settings.");
      return;
    }

    if (
      form.username.trim() === profile?.username &&
      !form.password &&
      !avatarFile
    ) {
      setError("Make a change before selecting Update.");
      return;
    }

    const data = new FormData();
    const usernameChanged = form.username.trim() !== profile?.username;
    const passwordChanged = Boolean(form.password);
    const profileImageChanged = Boolean(avatarFile);
    data.append("username", form.username.trim());
    if (form.password) data.append("password", form.password);
    if (avatarFile) data.append("profileImage", avatarFile);

    setIsSaving(true);
    setError("");
    let result;
    try {
      result = await updateProfileAPI(data, {
        Authorization: `Bearer ${token}`,
      });
    } finally {
      setIsSaving(false);
    }

    if (result?.status === 200) {
      setProfile(result.data);
      setForm({ ...EMPTY_FORM, username: result.data.username || "" });
      setAvatarFile(null);
      setPreview("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      sessionStorage.setItem("existingUser", JSON.stringify(result.data));
      if (usernameChanged && !passwordChanged && !profileImageChanged) {
        toast.success("Admin profile updated successfully.");
      } else if (passwordChanged && !usernameChanged && !profileImageChanged) {
        toast.success("Password changed successfully.");
      } else if (profileImageChanged && !usernameChanged && !passwordChanged) {
        toast.success("Admin profile picture updated successfully.");
      } else {
        toast.success("Admin settings updated successfully.");
      }
      return;
    }

    const message = result?.response?.data;
    setError(
      typeof message === "string"
        ? message
        : result?.message || "Failed to update admin settings.",
    );
  };

  const profileImage = profile?.profile
    ? profile.profile.startsWith("http")
      ? profile.profile
      : `${serverURL}${profile.profile}`
    : "";

  return (
    <>
      <AdminHeader />
      <div className="grid grid-cols-[1fr_4fr]">
        <div className="bg-blue-100 flex flex-col items-center">
          <AdminSidebar profileImage={preview || profileImage} />
        </div>

        <main className="px-6 py-6 font-['Playfair_Display',serif] sm:px-10">
          <h1 className="text-center text-2xl text-gray-900">Settings</h1>

          <div className="mt-6 grid gap-10 md:grid-cols-2">
            <div className="text-justify text-gray-900 md:self-center">
              <p className="mb-4">
                Manage your administrator profile and keep your account details
                up to date.
              </p>
              <p>
                Update your username, change your password, or choose a new
                profile picture. Leave the password fields blank to keep your
                current password.
              </p>
            </div>

            {/* Profile card */}
            <form
              onSubmit={handleUpdate}
              className="rounded bg-blue-200 p-9 shadow-sm"
            >
              <div className="mb-12 flex justify-center">
                <div className="relative h-30 w-30">
                  {preview || profileImage ? (
                    <img
                      src={preview || profileImage}
                      alt="Admin profile"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faCircleUser}
                      className="text-[120px] text-black"
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Change profile picture"
                    className="absolute -bottom-6 right-0 flex h-9 w-12 items-center justify-center rounded bg-yellow-400 text-white transition-colors hover:bg-yellow-500"
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleFile}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Username"
                  autoComplete="username"
                  disabled={isLoading || isSaving}
                  required
                  className={inputClass}
                />
                <p className="text-xs text-gray-600">
                  Leave password fields blank to keep your current password.
                </p>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="New password"
                  autoComplete="new-password"
                  disabled={isLoading || isSaving}
                  className={inputClass}
                />
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  disabled={isLoading || isSaving}
                  className={inputClass}
                />
              </div>

              {isLoading && (
                <p className="mt-2 text-sm text-gray-700">
                  Loading admin profile...
                </p>
              )}
              {error && (
                <p role="alert" className="mt-2 text-sm text-red-700">
                  {error}
                </p>
              )}
              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isLoading || isSaving}
                  className="flex-1 rounded bg-orange-600 py-3 text-white transition-colors hover:bg-orange-700"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={isLoading || isSaving}
                  className="flex-1 rounded bg-green-600 py-3 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
      <Footer />
      <ToastContainer theme="colored" position="top-center" autoClose={2000} />
    </>
  );
};

export default AdminSettings;