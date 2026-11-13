import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import {
  allBookAdminApi,
  allUsersAdminApi,
  approveBookAdminApi,
} from "../../services/allApi";
import { serverURL } from "../../services/serverURL";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const TABS = ["Book List", "Users"];

const DefaultAvatar = () => (
  <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
    <rect width="64" height="64" fill="#8a8a8a" />
    <circle cx="32" cy="25" r="10" fill="#e5e7eb" />
    <path d="M10 64c2-14 12-22 22-22s20 8 22 22z" fill="#e5e7eb" />
  </svg>
);

const BookCard = ({ book, isApproving, onApprove }) => {
  const cover = book.uploadedImg?.[0]
    ? `${serverURL}/upload/${encodeURIComponent(book.uploadedImg[0])}`
    : book.imageurl;
  const isPending = book.status?.toLowerCase() === "pending";
  const isApproved = book.status?.toLowerCase() === "approved";
  const statusClass =
    isPending
      ? "bg-amber-500"
      : book.status?.toLowerCase() === "sold"
        ? "bg-gray-500"
        : "bg-green-500";

  return (
    <div className="flex flex-col rounded bg-white p-3 text-center shadow-md">
      <div className="h-[300px] w-full overflow-hidden bg-gray-200">
        {cover && (
          <img
            src={cover}
            alt={`${book.title} book cover`}
            className="h-full w-full object-contain"
          />
        )}
      </div>
      <div className="mt-3 flex flex-col items-center gap-2">
        <p className="text-blue-700">{book.author}</p>
        <h2 className="text-gray-900">{book.title}</h2>
        <p className="text-blue-600">${book.dprice ?? book.price}</p>
        {isPending ? (
          <button
            type="button"
            onClick={() => onApprove(book._id)}
            disabled={isApproving}
            className="w-full bg-green-800 p-2 text-white transition-colors hover:border hover:border-green-800 hover:bg-white hover:text-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isApproving ? "Approving..." : "Approve"}
          </button>
        ) : isApproved ? (
          <div className="flex w-full items-center justify-end text-green-800" aria-label="Approved">
            <FontAwesomeIcon icon={faCheck} className="text-2xl" />
          </div>
        ) : (
          <span className={`w-full rounded px-3 py-2 text-sm text-white ${statusClass}`}>
            {book.status || "Available"}
          </span>
        )}
      </div>
    </div>
  );
};

const UserCard = ({ user }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const profileImage = user.profile
    ? user.profile.startsWith("http")
      ? user.profile
      : `${serverURL}${user.profile}`
    : "";

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100">
          {profileImage && !imgFailed ? (
            <img
              src={profileImage}
              alt={`${user.username}'s profile`}
              onError={() => setImgFailed(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <DefaultAvatar />
          )}
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-gray-900">
            {user.username}
          </h2>
          <p className="break-all text-sm text-gray-600">{user.email}</p>
        </div>
      </div>
      <p className="mt-4 line-clamp-3 min-h-12 text-sm text-gray-600">
        {user.bio || "No bio added"}
      </p>
      <p className="mt-3 border-t border-gray-100 pt-3 text-xs text-gray-500">
        User ID: <span className="break-all">{user._id}</span>
      </p>
    </article>
  );
};

const AdminBooks = () => {
  const [activeTab, setActiveTab] = useState("Book List");
  const [bookDetails, setBookDetails] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [booksError, setBooksError] = useState("");
  const [usersError, setUsersError] = useState("");
  const [approvingBookId, setApprovingBookId] = useState("");
  const [approvalError, setApprovalError] = useState("");

  const handleApproveBook = async (id) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setApprovalError("Your session is missing. Please log in again.");
      return;
    }

    setApprovingBookId(id);
    setApprovalError("");
    const result = await approveBookAdminApi(id, {
      Authorization: `Bearer ${token}`,
    });

    if (result.status === 200) {
      setBookDetails((currentBooks) =>
        currentBooks.map((book) => (book._id === id ? result.data : book)),
      );
    } else if (result.response?.status === 401) {
      setApprovalError("Your session is invalid or expired. Please log in again.");
    } else if (result.response?.status === 403) {
      setApprovalError("Admin access is required to approve books.");
    } else if (result.response?.status === 404) {
      setApprovalError("This book could not be found. Refresh the list and try again.");
    } else {
      setApprovalError("Unable to approve this book. Please try again.");
    }
    setApprovingBookId("");
  };

  useEffect(() => {
    const fetchAdminBooks = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setBooksError("Please log in as an admin to view all books.");
        setIsLoadingBooks(false);
        setUsersError("Please log in as an admin to view users.");
        setIsLoadingUsers(false);
        return;
      }

      const reqHeader = {
        Authorization: `Bearer ${token}`,
      };
      const [booksResult, usersResult] = await Promise.all([
        allBookAdminApi(reqHeader),
        allUsersAdminApi(reqHeader),
      ]);

      if (booksResult.status === 200 && Array.isArray(booksResult.data)) {
        setBookDetails(booksResult.data);
      } else if (booksResult.response?.status === 401) {
        setBooksError("Your session is invalid or expired. Please log in again.");
      } else if (booksResult.response?.status === 403) {
        setBooksError("Admin access is required to view all books.");
      } else {
        setBooksError("Unable to load books. Please try again.");
      }

      if (usersResult.status === 200 && Array.isArray(usersResult.data)) {
        setUserDetails(usersResult.data);
      } else if (usersResult.response?.status === 401) {
        setUsersError("Your session is invalid or expired. Please log in again.");
      } else if (usersResult.response?.status === 403) {
        setUsersError("Admin access is required to view users.");
      } else {
        setUsersError("Unable to load users. Please try again.");
      }
      setIsLoadingBooks(false);
      setIsLoadingUsers(false);
    };

    fetchAdminBooks();
  }, []);

  return (
    <>
      <AdminHeader />
      <div className="grid grid-cols-[1fr_4fr]">
        <div className="bg-blue-100 flex flex-col items-center">
          <AdminSidebar />
        </div>

        <main className="px-6 py-6 font-['Playfair_Display',serif] sm:px-10">
          <h1 className="text-center text-2xl text-gray-900">All Books</h1>

          {/* Tabs */}
          <div role="tablist" className="mt-8 flex justify-center">
            {TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab)}
                  className={`border px-3 py-2 transition-colors ${
                    isActive
                      ? "border-gray-200 bg-white text-blue-700"
                      : "border-transparent text-gray-900 hover:text-blue-700"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Book list */}
          {activeTab === "Book List" && (
            <>
              {approvalError && (
                <p className="mt-4 text-center text-red-600" role="alert">
                  {approvalError}
                </p>
              )}
              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {isLoadingBooks ? (
                <p className="col-span-full text-center text-gray-500">
                  Loading books...
                </p>
              ) : booksError ? (
                <p className="col-span-full text-center text-red-600" role="alert">
                  {booksError}
                </p>
              ) : bookDetails.length > 0 ? (
                bookDetails.map((book) => (
                  <BookCard
                    key={book._id}
                    book={book}
                    isApproving={approvingBookId === book._id}
                    onApprove={handleApproveBook}
                  />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">
                  No books yet.
                </p>
              )}
              </div>
            </>
          )}

          {/* Users */}
          {activeTab === "Users" && (
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {isLoadingUsers ? (
                <p className="col-span-full text-center text-gray-500">
                  Loading users...
                </p>
              ) : usersError ? (
                <p className="col-span-full text-center text-red-600" role="alert">
                  {usersError}
                </p>
              ) : userDetails.length > 0 ? (
                userDetails.map((user) => (
                  <UserCard key={user._id} user={user} />
                ))
              ) : (
                <p className="col-span-full rounded-lg bg-white py-12 text-center text-gray-500">
                  No users registered yet.
                </p>
              )}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default AdminBooks;