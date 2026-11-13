import { commonApi } from "./commonApi";
import { serverURL } from "./serverURL";

// Register content type: application/json
export const registerAPI = async(reqBody)=>{
  return await commonApi(`POST`,`${serverURL}/register`,reqBody)
}

// Login content type: application/json
export const loginAPI = async(reqBody)=>{
  return await commonApi(`POST`,`${serverURL}/login`,reqBody)
}

// Get the signed-in user's profile
export const getProfileAPI = async (reqHeader) => {
  return await commonApi(`GET`, `${serverURL}/profile`, "", reqHeader);
};

// Update the signed-in user's profile
export const updateProfileAPI = async (reqBody, reqHeader) => {
  return await commonApi(`PATCH`, `${serverURL}/profile`, reqBody, reqHeader);
};

//google Login content type: application/json
export const googleLoginAPI = async(reqBody)=>{
  return await commonApi(`POST`,`${serverURL}/google-login`,reqBody)
}

// Users
// Upload a book
export const addBookAPI = async (reqBody, reqHeader) => {
  return await commonApi(`POST`, `${serverURL}/add-book`, reqBody, reqHeader);
};

// get all books
export const allBookApi = async (searchKey = "", reqHeader) => {
  return await commonApi(
    `GET`,
    `${serverURL}/all-book?search=${encodeURIComponent(searchKey.trim())}`,
    "",
    reqHeader,
  );
};

// Get books listed by the signed-in user
export const allUserBookAPI = async (reqHeader) => {
  return await commonApi(`GET`, `${serverURL}/all-user-book`, "", reqHeader);
};

// Get books brought by the signed-in user
export const allUserBroughtBookAPI = async (reqHeader) => {
  return await commonApi(
    `GET`,
    `${serverURL}/all-user-brought-book`,
    "",
    reqHeader,
  );
};

// Delete a book listed by the signed-in user
export const deleteUserBookAPI = async (id, reqHeader) => {
  return await commonApi(
    `DELETE`,
    `${serverURL}/user-book/${encodeURIComponent(id)}`,
    "",
    reqHeader,
  );
};

// Create a Stripe Checkout session for a book
export const createCheckoutSessionAPI = async (bookId, reqHeader) => {
  return await commonApi(
    `POST`,
    `${serverURL}/create-checkout-session`,
    { bookId },
    reqHeader,
  );
};

// Verify a completed Stripe Checkout session
export const verifyCheckoutSessionAPI = async (sessionId, reqHeader) => {
  return await commonApi(
    `POST`,
    `${serverURL}/make-payment`,
    { sessionId },
    reqHeader,
  );
};

// Get the latest books for the home page
export const getHomeBookAPI = async () => {
  return await commonApi(`GET`, `${serverURL}/all-home-book`);
};

// get a viewbook

export const viewBookAPI = async (id) => {
  return await commonApi(`GET`,`${serverURL}/view-book/${id}`)
}

// Get all books for the admin
export const allBookAdminApi = async (reqHeader) => {
  return await commonApi(`GET`, `${serverURL}/admin-all-books`, "", reqHeader);
};

// Get all users for the admin
export const allUsersAdminApi = async (reqHeader) => {
  return await commonApi(`GET`, `${serverURL}/admin-all-users`, "", reqHeader);
};

// Approve a book as admin
export const approveBookAdminApi = async (id, reqHeader) => {
  return await commonApi(
    `PATCH`,
    `${serverURL}/admin-book/${id}/approve`,
    {},
    reqHeader,
  );
};