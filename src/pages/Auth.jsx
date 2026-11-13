import {
  faEnvelope,
  faLock,
  faRightToBracket,
  faUser,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../users/components/Header";
import Footer from "../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import { googleLoginAPI, loginAPI, registerAPI } from "../services/allApi";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

// Inline styles for the input icons, so their position doesn't depend on which Tailwind classes your build generates
const fieldStyle = { position: "relative" };
const iconStyle = {
  position: "absolute",
  left: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  pointerEvents: "none",
};
const inputStyle = { paddingLeft: "40px" };

const Auth = ({ register }) => {
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    password: "",
  });

  console.log(userDetails);

  const navigate = useNavigate();

  const handleRegister = async () => {
    const { username, email, password } = userDetails;
    if (!username || !email || !password) {
      toast.info("Please fill the form completely");
    } else {
      const result = await registerAPI({ username, email, password });
      console.log(result);
      if (result.status == 200) {
        toast.success("Register Successfull...");
        setUserDetails({
          username: "",
          email: "",
          password: "",
        });
        navigate("/login");
      } else if (result.status == 400) {
        toast.warning(result.response.data);
        setUserDetails({
          username: "",
          email: "",
          password: "",
        });
      }
    }
  };

  const handleLogin = async () => {
    const { email, password } = userDetails;

    if (!email || !password) {
      toast.info("Please fill the form completely");
    } else {
      const result = await loginAPI({ email, password });
      console.log(result);
      if (result.status == 200) {
        toast.success("Login Successfull...");
        sessionStorage.setItem(
          "existingUser",
          JSON.stringify(result.data.existingUser),
        );
        sessionStorage.setItem("token", result.data.token);

        setTimeout(() => {
          if (result.data.existingUser.email == "bookAdmin@gmail.com") {
            navigate("/admin-home");
          } else {
            navigate("/");
          }
        }, 2500);
      } else if (result.status == 404) {
        toast.warning(result.response.data);
        setUserDetails({
          username: "",
          email: "",
          password: "",
        });
      }
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    const details = jwtDecode(credentialResponse.credential);
    console.log(details);

    const result = await googleLoginAPI({
      username: details.name,
      email: details.email,
      password: "googlepswd",
      profile: details.picture,
    });
    console.log(result);
    if (result.status == 200) {
      toast.success("Login Successful");
      sessionStorage.setItem(
        "existingUser",
        JSON.stringify(result.data.existingUser),
      );
      sessionStorage.setItem("token", result.data.token);

      setTimeout(() => {
        if (result.data.existingUser.email == "bookAdmin@gmail.com") {
          navigate("/admin-home");
        } else {
          navigate("/");
        }
      }, 2500);
    } else {
      toast.error("Something went wrong !! ");
    }
  };

  return (
    <>
      <Header />
      <div id="authPage" className="fade-in">
        <div className="flex justify-center items-center flex-col">
          <h1 className="text-3xl font-bold mb-4 mt-10">BOOK STORE</h1>

          <form className="w-full max-w-lg bg-gray-900 p-10 flex justify-center items-center flex-col mb-5 rounded-2xl">
            <div
              style={{ width: "70px", height: "70px", borderRadius: "50%" }}
              className="border border-white flex justify-center items-center"
            >
              <FontAwesomeIcon icon={faUser} size="2x" className="text-white" />
            </div>
            {register ? (
              <h1 className="text-white mt-6 text-3xl">REGISTER</h1>
            ) : (
              <h1 className="text-white mt-6 text-3xl">LOGIN</h1>
            )}

            {register && (
              <div style={fieldStyle} className="mb-3 w-full mt-4">
                <FontAwesomeIcon
                  icon={faUser}
                  style={iconStyle}
                  className="text-gray-500"
                />
                <input
                  value={userDetails.username}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, username: e.target.value })
                  }
                  type="text"
                  placeholder="Username"
                  style={inputStyle}
                  className="bg-white p-2 placeholder-gray-600 rounded w-full"
                />
              </div>
            )}

            <div style={fieldStyle} className="mb-3 w-full mt-4">
              <FontAwesomeIcon
                icon={faEnvelope}
                style={iconStyle}
                className="text-gray-500"
              />
              <input
                value={userDetails.email}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, email: e.target.value })
                }
                type="email"
                placeholder="Email id"
                style={inputStyle}
                className="bg-white p-2 placeholder-gray-600 rounded w-full"
              />
            </div>

            <div style={fieldStyle} className="mb-3 w-full mt-4">
              <FontAwesomeIcon
                icon={faLock}
                style={iconStyle}
                className="text-gray-500"
              />
              <input
                value={userDetails.password}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, password: e.target.value })
                }
                type="password"
                placeholder="Password"
                style={inputStyle}
                className="bg-white p-2 placeholder-gray-600 rounded w-full"
              />
            </div>

            <div className="mb-5 w-full flex justify-between">
              <p className="text-amber-300 text-xs">
                Never Share your password with others
              </p>
              <p className="text-white text-xs underline hover:text-red-600 cursor-pointer">
                Forgot Password
              </p>
            </div>

            {register ? (
              <button
                type="button"
                onClick={handleRegister}
                className="bg-green-700 text-white w-full px-3 py-2 rounded mb-2"
              >
                <FontAwesomeIcon icon={faRightToBracket} className="mr-2" />
                REGISTER
              </button>
            ) : (
              <button
                onClick={handleLogin}
                type="button"
                className="bg-green-700 text-white w-full px-3 py-2 rounded mb-2"
              >
                <FontAwesomeIcon icon={faRightToBracket} className="mr-2" />
                LOGIN
              </button>
            )}

            {!register && (
              // <button
              //   type="button"
              //   className="bg-white text-black w-full p-3 rounded mb-4"
              // >
              //   <FontAwesomeIcon icon={faGoogle} className="mr-2" />
              //   Sign in with Google
              // </button>
              <div className="mb-2 w-full flex items-center justify-center">
                <GoogleLogin
                  width={"650px"}
                  onSuccess={(credentialResponse) => {
                    console.log(credentialResponse);
                    handleGoogleLogin(credentialResponse);
                  }}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                  useOneTap
                />
              </div>
            )}

            {register ? (
              <p className="text-white mt-3">
                Already a User?{" "}
                <Link to={"/login"} className="underline">
                  Login
                </Link>{" "}
              </p>
            ) : (
              <p className="text-white">
                Are you a new User?
                <span className="text-blue-400 underline cursor-pointer ml-2">
                  <Link to={"/register"}>
                    <FontAwesomeIcon icon={faUserPlus} className="mr-1" />
                    Register
                  </Link>
                </span>
              </p>
            )}
          </form>
        </div>
      </div>
      <ToastContainer theme="colored" position="top-center" autoClose={2000} />
      <Footer />
    </>
  );
};

export default Auth;
