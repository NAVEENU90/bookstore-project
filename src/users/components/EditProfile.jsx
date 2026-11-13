import { useState } from "react";
import {
  faPenNib,
  faPenSquare,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { updateProfileAPI } from "../../services/allApi";
import { serverURL } from "../../services/serverURL";

const fallbackAvatar =
  "https://cdn-icons-png.flaticon.com/512/8792/8792047.png";

const getProfileImage = (profile) => {
  if (!profile) return fallbackAvatar;
  return profile.startsWith("http") ? profile : `${serverURL}${profile}`;
};

const EditProfile = ({ user, token, onProfileUpdated }) => {
  const [offCanvasStatus, setOffCanvasStatus] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openEditor = () => {
    setUsername(user?.username || "");
    setBio(user?.bio || "");
    setPassword("");
    setConfirmPassword("");
    setProfileImage(null);
    setPreview("");
    setOffCanvasStatus(true);
  };

  const closeEditor = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview("");
    setProfileImage(null);
    setOffCanvasStatus(false);
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file");
      event.target.value = "";
      return;
    }

    if (preview) URL.revokeObjectURL(preview);
    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleReset = () => {
    setUsername(user?.username || "");
    setBio(user?.bio || "");
    setPassword("");
    setConfirmPassword("");
    setProfileImage(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username.trim()) {
      toast.info("Username is required");
      return;
    }
    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!token) {
      toast.error("Please log in to update your profile");
      return;
    }

    const reqBody = new FormData();
    reqBody.append("username", username.trim());
    reqBody.append("bio", bio);
    if (password) reqBody.append("password", password);
    if (profileImage) reqBody.append("profileImage", profileImage);

    setIsSubmitting(true);
    let result;
    try {
      result = await updateProfileAPI(reqBody, {
        Authorization: `Bearer ${token}`,
      });
    } finally {
      setIsSubmitting(false);
    }

    if (result?.status === 200) {
      onProfileUpdated(result.data);
      toast.success("Profile updated successfully");
      closeEditor();
      return;
    }

    const errorMessage = result?.response?.data;
    toast.error(
      typeof errorMessage === "string"
        ? errorMessage
        : result?.message || "Failed to update profile",
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={openEditor}
        className="text-blue-500 border border-blue-500 rounded p-3 hover:bg-blue-500 hover:text-white transition-colors duration-200 cursor-pointer"
      >
        <FontAwesomeIcon icon={faPenSquare} /> Edit
      </button>

      {offCanvasStatus && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close profile editor"
            onClick={closeEditor}
            className="absolute inset-0 h-full w-full bg-gray-900/60"
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
            className="absolute left-0 top-0 h-full w-full max-w-md overflow-y-auto bg-gray-100 shadow-xl"
          >
            <div className="flex items-center justify-between bg-gray-900 px-4 py-4 text-xl text-white">
              <h2 id="edit-profile-title">Edit Your Profile</h2>
              <button
                type="button"
                onClick={closeEditor}
                aria-label="Close"
                className="cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5">
              <div className="mb-5 flex flex-col items-center">
                <label
                  htmlFor="profileImage"
                  className="cursor-pointer text-center"
                >
                  <img
                    src={preview || getProfileImage(user?.profile)}
                    alt="Profile preview"
                    className="h-36 w-36 rounded-full border-4 border-white object-cover shadow"
                  />
                  <span className="mt-2 inline-flex items-center gap-2 text-sm text-blue-700">
                    <FontAwesomeIcon icon={faPenNib} />
                    Change profile photo
                  </span>
                </label>
                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </div>

              <label className="mb-1 block font-medium" htmlFor="profileUsername">
                Username
              </label>
              <input
                id="profileUsername"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="mb-4 w-full rounded border bg-white p-2"
                required
              />

              <label className="mb-1 block font-medium" htmlFor="profileBio">
                Bio
              </label>
              <textarea
                id="profileBio"
                rows={4}
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                className="mb-4 w-full rounded border bg-white p-2"
              />

              <p className="mb-2 text-sm text-gray-600">
                Leave password fields blank to keep your current password.
              </p>
              <label className="mb-1 block font-medium" htmlFor="profilePassword">
                New password
              </label>
              <input
                id="profilePassword"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                className="mb-4 w-full rounded border bg-white p-2"
              />

              <label
                className="mb-1 block font-medium"
                htmlFor="confirmProfilePassword"
              >
                Confirm new password
              </label>
              <input
                id="confirmProfilePassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                className="mb-6 w-full rounded border bg-white p-2"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded border border-amber-500 px-4 py-2 text-amber-700 hover:bg-amber-500 hover:text-white"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
};

export default EditProfile;
