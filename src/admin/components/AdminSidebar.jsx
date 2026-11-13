import { faBook, faGear, faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useNavigate } from "react-router-dom";
import { serverURL } from "../../services/serverURL";

const fallbackProfileImage =
  "https://cdn-icons-png.flaticon.com/512/8792/8792047.png";

const navigationItems = [
  { label: "Home", path: "/admin-home", icon: faHouse },
  { label: "All Books", path: "/admin-books", icon: faBook },
  { label: "Settings", path: "/admin-settings", icon: faGear },
];

const AdminSidebar = ({ profileImage: updatedProfileImage }) => {
  const navigate = useNavigate();
  const location = useLocation();
  let savedProfile = null;
  try {
    savedProfile = JSON.parse(sessionStorage.getItem("existingUser") || "null");
  } catch (error) {
    console.error("Could not read the cached admin profile", error);
  }

  const savedProfileImage = savedProfile?.profile
    ? savedProfile.profile.startsWith("http")
      ? savedProfile.profile
      : `${serverURL}${savedProfile.profile}`
    : fallbackProfileImage;

  return (
    <>
      <img
        src={updatedProfileImage || savedProfileImage}
        alt="Admin profile"
        className="h-[150px] w-[150px] rounded-full object-cover"
      />
      <h1 className="mt-5">{savedProfile?.username || "Admin"}</h1>

      <nav aria-label="Admin navigation" className="my-5">
        {navigationItems.map(({ label, path, icon }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              type="button"
              onClick={() => navigate(path)}
              aria-current={isActive ? "page" : undefined}
              className={`mb-3 block cursor-pointer rounded px-2 py-1 text-left ${
                isActive ? "font-semibold text-blue-800" : "text-gray-900"
              }`}
            >
              <FontAwesomeIcon icon={icon} className="mr-3" />
              {label}
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default AdminSidebar;
