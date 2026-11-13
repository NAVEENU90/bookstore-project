import { useState } from "react";
import logo from "../../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import {
  faAddressCard,
  faBars,
  faPowerOff,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState(false);
  const [dropDownStatus, setDropDownStatus] = useState(false);
  const [token, setToken] = useState(
    () => sessionStorage.getItem("token") || "",
  );

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("existingUser");
    setToken("");
    setDropDownStatus(false);
    navigate("/login", { replace: true });
  };

  return (
    <>
      <div className="md:grid grid-cols-3 p-3 border-b border-b-slate-300 shadow-lg">
        <div className="flex items-center">
          <img
            src={logo}
            alt="Logo"
            style={{ width: "40px ", height: "30px" }}
          />
          <h1 className="text-3xl md:hidden ms-2">BOOK STORE</h1>
        </div>
        <div className="md:flex justify-center items-center hidden">
          <h1 className="text-3xl">BOOK STORE</h1>
        </div>
        <div className="md:flex justify-end items-center hidden">
          <FontAwesomeIcon
            icon={faInstagram}
            className="me-3 text-3xl hover:text-pink-500 transition-colors duration-200 cursor-pointer"
          />
          <FontAwesomeIcon
            icon={faXTwitter}
            className="me-3 text-3xl hover:text-slate-600 transition-colors duration-200 cursor-pointer"
          />
          <FontAwesomeIcon
            icon={faFacebook}
            className="me-3 text-3xl hover:text-blue-500 transition-colors duration-200 cursor-pointer"
          />

          {!token ? (
            <Link
              to="/login"
              className="ms-3 me-3 inline-flex items-center rounded border border-black px-3 py-2 transition-colors duration-200 hover:bg-gray-100"
              aria-label="Login"
            >
              <FontAwesomeIcon icon={faUser} className="me-2" />
              Login
            </Link>
          ) : (
            <div className="relative inline-block text-left">
              <div>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  id="account-menu-button"
                  aria-expanded={dropDownStatus}
                  aria-haspopup="true"
                  onClick={() => setDropDownStatus(!dropDownStatus)}
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/8792/8792047.png"
                    alt="User Login"
                    style={{ width: "40px", height: "40px" }}
                  />
                </button>
              </div>
              {dropDownStatus && (
                <div
                  className="absolute right-10 z-50 mt-2 w-40 max-w-[calc(100vw-1rem)] overflow-hidden rounded-md bg-white py-1 text-left shadow-lg ring-1 ring-black/10"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="account-menu-button"
                >
                  <Link
                    to="/profile"
                    onClick={() => setDropDownStatus(false)}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    <FontAwesomeIcon icon={faAddressCard} className="w-4" />
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    <FontAwesomeIcon icon={faPowerOff} className="w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <nav className="p-3 w-full bg-gray-900 text-white md:flex justify-center items-center shadow-xl">
        <div className="flex justify-between px-3 md:hidden items-center">
          <span onClick={() => setStatus(!status)} className="text-2xl">
            <FontAwesomeIcon icon={faBars} />
          </span>
          {!token ? (
            <Link
              to="/login"
              className="inline-flex items-center rounded border border-white px-3 py-2 transition-colors duration-200 hover:bg-white hover:text-gray-900"
              aria-label="Login"
            >
              <FontAwesomeIcon icon={faUser} className="me-2" />
              Login
            </Link>
          ) : (
            <div className="relative">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                id="mobile-account-menu-button"
                aria-expanded={dropDownStatus}
                aria-haspopup="true"
                aria-label="Open account menu"
                onClick={() => setDropDownStatus(!dropDownStatus)}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/8792/8792047.png"
                  alt=""
                  className="h-10 w-10"
                />
              </button>
              {dropDownStatus && (
                <div
                  className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-md bg-white py-1 text-left shadow-lg ring-1 ring-black/10"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="mobile-account-menu-button"
                >
                  <Link
                    to="/profile"
                    onClick={() => setDropDownStatus(false)}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    <FontAwesomeIcon icon={faAddressCard} className="w-4" />
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    <FontAwesomeIcon icon={faPowerOff} className="w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <ul className={status ? "md:flex" : "md:flex justify-center hidden"}>
          <Link to={"/"}>
            <li className="mx-4 mt-3 md:mt-0 hover:text-pink-300 cursor-pointer">
              HOME
            </li>
          </Link>
          <Link to={"/all-books"}>
            <li className="mx-4 mt-3 md:mt-0 hover:text-pink-300 cursor-pointer">
              BOOKS
            </li>
          </Link>
          {/* <Link to={"/careers"}>
            <li className="mx-4 mt-3 md:mt-0 hover:text-pink-300 cursor-pointer">
              CAREERS
            </li>
          </Link> */}
          <Link to={"/contact"}>
            <li className="mx-4 mt-3 md:mt-0 hover:text-pink-300 cursor-pointer">
              CONTACT
            </li>
          </Link>
        </ul>
      </nav>
    </>
  );
};

export default Header;
