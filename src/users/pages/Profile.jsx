import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import EditProfile from "../components/EditProfile";
import { ToastContainer, toast } from "react-toastify";
import {
  addBookAPI,
  allUserBookAPI,
  allUserBroughtBookAPI,
  deleteUserBookAPI,
  getProfileAPI,
} from "../../services/allApi";
import { serverURL } from "../../services/serverURL";

const getBookCover = (book) =>
  book.uploadedImg?.[0]
    ? `${serverURL}/upload/${encodeURIComponent(book.uploadedImg[0])}`
    : book.imageurl || "";

const BookHistoryCard = ({ book, onDelete, isDeleting, allowDelete }) => {
  const status = book.status?.toLowerCase();
  const statusLabel =
    status === "sold"
      ? "Sold"
      : status === "pending"
        ? "Awaiting admin approval"
        : status === "approved"
          ? "Approved by admin"
          : book.status || "Status unavailable";
  const statusColor =
    status === "approved"
      ? "bg-green-100 text-green-800"
      : status === "pending"
        ? "bg-amber-100 text-amber-800"
        : status === "sold"
          ? "bg-gray-200 text-gray-800"
          : "bg-blue-50 text-blue-800";

  return (
    <article className="grid gap-5 rounded-lg bg-white p-5 shadow-sm sm:grid-cols-[160px_1fr]">
      {getBookCover(book) ? (
        <img
          src={getBookCover(book)}
          alt={`${book.title} cover`}
          className="h-52 w-full rounded object-cover sm:w-40"
        />
      ) : (
        <div className="flex h-52 items-center justify-center rounded bg-gray-100 text-gray-500 sm:w-40">
          No cover image
        </div>
      )}
      <div className="flex flex-col">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">{book.title}</h2>
            <p className="text-gray-600">by {book.author}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-sm capitalize ${statusColor}`}
          >
            {statusLabel}
          </span>
        </div>
        <p className="mt-3 line-clamp-3 text-gray-700">{book.abstract}</p>
        <p className="mt-3 font-medium text-blue-700">
          ${book.dprice ?? book.price}
        </p>
        {allowDelete && (
          <button
            type="button"
            onClick={() => onDelete(book._id)}
            disabled={isDeleting}
            className="mt-4 self-end rounded bg-red-600 px-4 py-2 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete listing"}
          </button>
        )}
      </div>
    </article>
  );
};

const Profile = () => {
  const [sellStatus, setSellStatus] = useState(true);
  const [bookStatus, setBookStatus] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState(false);
  const [token] = useState(() => sessionStorage.getItem("token") || "");
  const [userBooks, setUserBooks] = useState([]);
  const [broughtBooks, setBroughtBooks] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [deletingBookId, setDeletingBookId] = useState("");
  const [profileUser, setProfileUser] = useState(() => {
    const storedUser = sessionStorage.getItem("existingUser");
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Could not read the cached profile", error);
      return null;
    }
  });
  const [isLoadingProfile, setIsLoadingProfile] = useState(Boolean(token));
  const [bookDetails, setBookDetails] = useState({
    title: "",
    author: "",
    noofpages: "",
    imageurl: "",
    price: "",
    dprice: "",
    abstract: "",
    publisher: "",
    language: "",
    isbn: "",
    category: "",
    uploadedImages: [],
  });

  const [preview, setPreview] = useState("");
  const [previewList, setPreviewList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const previewUrls = useRef(new Set());
  const imageFileInputRef = useRef(null);
  const historyRequestId = useRef(0);

  const handleUploadImg = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const availableSlots = 3 - bookDetails.uploadedImages.length;
    if (availableSlots <= 0) {
      toast.info("You can upload up to 3 images");
      e.target.value = "";
      return;
    }

    const files = selectedFiles.slice(0, availableSlots);
    if (files.length < selectedFiles.length) {
      toast.info("You can upload up to 3 images");
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    newPreviews.forEach((url) => previewUrls.current.add(url));

    setBookDetails((previousDetails) => ({
      ...previousDetails,
      uploadedImages: [...previousDetails.uploadedImages, ...files],
    }));
    setPreviewList((previousPreviews) => [...newPreviews, ...previousPreviews]);
    setPreview(newPreviews[0]);
    e.target.value = "";
  };

  useEffect(() => {
    const urls = previewUrls.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    const loadProfile = async () => {
      const result = await getProfileAPI({
        Authorization: `Bearer ${token}`,
      });

      if (!isMounted) return;
      setIsLoadingProfile(false);
      if (result?.status === 200) {
        setProfileUser(result.data);
        sessionStorage.setItem("existingUser", JSON.stringify(result.data));
      } else {
        const errorMessage = result?.response?.data;
        toast.error(
          typeof errorMessage === "string"
            ? errorMessage
            : result?.message || "Failed to load profile",
        );
      }
    };

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const loadBookHistory = async (historyType) => {
    if (!token) {
      toast.error("Please log in to view your book history.");
      return;
    }

    const requestId = ++historyRequestId.current;
    setIsLoadingHistory(true);
    try {
      const result =
        historyType === "sold"
          ? await allUserBookAPI({ Authorization: `Bearer ${token}` })
          : await allUserBroughtBookAPI({
              Authorization: `Bearer ${token}`,
            });

      if (requestId !== historyRequestId.current) return;
      if (result?.status === 200) {
        if (historyType === "sold") setUserBooks(result.data);
        else setBroughtBooks(result.data);
      } else {
        const errorMessage = result?.response?.data;
        toast.error(
          typeof errorMessage === "string"
            ? errorMessage
            : result?.message || "Failed to load book history.",
        );
      }
    } catch (error) {
      console.error("Could not load book history", error);
      toast.error("Failed to load book history.");
    } finally {
      if (requestId === historyRequestId.current) setIsLoadingHistory(false);
    }
  };

  const handleDeleteUserBook = async (bookId) => {
    if (!window.confirm("Delete this book listing? This cannot be undone.")) {
      return;
    }

    setDeletingBookId(bookId);
    try {
      const result = await deleteUserBookAPI(bookId, {
        Authorization: `Bearer ${token}`,
      });
      if (result?.status === 200) {
        setUserBooks((currentBooks) =>
          currentBooks.filter((book) => book._id !== bookId),
        );
        toast.success("Book listing deleted.");
      } else {
        const errorMessage = result?.response?.data;
        toast.error(
          typeof errorMessage === "string"
            ? errorMessage
            : result?.message || "Failed to delete book listing.",
        );
      }
    } catch (error) {
      console.error("Could not delete book listing", error);
      toast.error("Failed to delete book listing.");
    } finally {
      setDeletingBookId("");
    }
  };

  const handleProfileUpdated = (updatedUser) => {
    setProfileUser(updatedUser);
    sessionStorage.setItem("existingUser", JSON.stringify(updatedUser));
  };

  const handleReset = () => {
    previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
    previewUrls.current.clear();
    setBookDetails({
      title: "",
      author: "",
      noofpages: "",
      imageurl: "",
      price: "",
      dprice: "",
      abstract: "",
      publisher: "",
      language: "",
      isbn: "",
      category: "",
      uploadedImages: [],
    });
    setPreview("");
    setPreviewList([]);
  };

  const handleSubmit = async () => {
    const {
      title,
      author,
      noofpages,
      imageurl,
      price,
      dprice,
      abstract,
      publisher,
      language,
      isbn,
      category,
      uploadedImages,
    } = bookDetails;
    if (
      !title ||
      !author ||
      !noofpages ||
      !imageurl ||
      !price ||
      !dprice ||
      !abstract ||
      !publisher ||
      !language ||
      !isbn ||
      !category ||
      uploadedImages.length === 0
    ) {
      toast.info("Please fill the form completely and upload at least one image");
      return;
    }

    if (uploadedImages.length > 3) {
      toast.info("You can upload up to 3 images");
      return;
    }

    if (!token) {
      toast.error("Please log in before adding a book");
      return;
    }

    const reqHeader = {
      Authorization: `Bearer ${token}`,
    };
    const reqBody = new FormData();

    for (const key in bookDetails) {
      if (key !== "uploadedImages") {
        reqBody.append(key, bookDetails[key]);
      } else {
        bookDetails.uploadedImages.forEach((image) => {
          reqBody.append("uploadImages", image);
        });
      }
    }

    setIsSubmitting(true);
    let result;
    try {
      result = await addBookAPI(reqBody, reqHeader);
      console.log(result);
    } finally {
      setIsSubmitting(false);
    }

    if (result.status === 200) {
      toast.success("Book added successfully");
      handleReset();
    } else {
      const errorMessage = result.response?.data;
      toast.error(
        typeof errorMessage === "string"
          ? errorMessage
          : result.message || "Failed to add book",
      );
    }
  };

  return (
    <>
      <Header />
      <div style={{ height: "200px" }} className="bg-gray-500"></div>
      <div
        style={{
          width: "230px",
          height: "230px",
          borderRadius: "50%",
          marginLeft: "70px",
          marginTop: "-130px",
        }}
        className="bg-white p-3"
      >
        <img
          src={
            profileUser?.profile
              ? profileUser.profile.startsWith("http")
                ? profileUser.profile
                : `${serverURL}${profileUser.profile}`
              : "https://cdn-icons-png.flaticon.com/512/8792/8792047.png"
          }
          alt={profileUser?.username || "User profile"}
          className="h-full w-full rounded-full object-cover"
        />
      </div>
      <div className="flex justify-between px-20 mt-5">
        <p className="flex justify-center items-center">
          <span className="text-3xl">
            {isLoadingProfile
              ? "Loading profile..."
              : profileUser?.username || "My Profile"}
          </span>{" "}
          <FontAwesomeIcon
            icon={faCircleCheck}
            className="text-blue-500 ms-3"
          />
        </p>
        {token && (
          <EditProfile
            user={profileUser}
            token={token}
            onProfileUpdated={handleProfileUpdated}
          />
        )}
      </div>
      <p className="md:px-20 px-5 my-5 text-justify">
        {profileUser?.bio || "BookStore user..."}
      </p>

      {/* Tab */}
      <div className="md:px-40">
        <div className="flex justify-center items-center my-5">
          <button
            type="button"
            onClick={() => {
              setSellStatus(true);
              setBookStatus(false);
              setPurchaseStatus(false);
            }}
            aria-pressed={sellStatus}
            className={`p-4 ${
              sellStatus
                ? "text-blue-800 border-t border-l border-r border-gray-200 rounded"
                : "text-black border-b border-gray-200"
            }`}
          >
            Sell Book
          </button>
          <button
            type="button"
            onClick={() => {
              setSellStatus(false);
              setBookStatus(true);
              setPurchaseStatus(false);
              loadBookHistory("sold");
            }}
            aria-pressed={bookStatus}
            className={`p-4 ${
              bookStatus
                ? "text-blue-800 border-l border-t border-r border-gray-200 rounded"
                : "text-black border-b border-gray-200"
            }`}
          >
            Sold History
          </button>
          <button
            type="button"
            onClick={() => {
              setSellStatus(false);
              setBookStatus(false);
              setPurchaseStatus(true);
              loadBookHistory("purchase");
            }}
            aria-pressed={purchaseStatus}
            className={`p-4 ${
              purchaseStatus
                ? "text-blue-800 border-t border-l border-r border-gray-200 rounded"
                : "text-black border-b border-gray-200"
            }`}
          >
            Purchase History
          </button>
        </div>
      </div>

      {/* Contents */}
      {sellStatus && (
        <div className="bg-gray-200 p-10 mt-20">
          <h1 className="text-center text-3xl font-medium">Book Details</h1>
          <div className="md:grid grid-cols-2 mt-5 w-full">
            <div>
              <div className="mb-3">
                <input
                  name="title"
                  value={bookDetails.title}
                  onChange={(e) =>
                    setBookDetails({ ...bookDetails, title: e.target.value })
                  }
                  type="text"
                  placeholder="title"
                  className="p-2 bg-white rounded placeholder-gray-400 w-full "
                />
              </div>
              <div className="mb-3">
                <input
                  name="author"
                  value={bookDetails.author}
                  onChange={(e) =>
                    setBookDetails({ ...bookDetails, author: e.target.value })
                  }
                  type="text"
                  placeholder="Author"
                  className="p-2 bg-white rounded placeholder-gray-400 w-full "
                />
              </div>
              <div className="mb-3">
                <input
                  name="noofpages"
                  value={bookDetails.noofpages}
                  onChange={(e) =>
                    setBookDetails({
                      ...bookDetails,
                      noofpages: e.target.value,
                    })
                  }
                  type="number"
                  placeholder="Number of pages"
                  className="p-2 bg-white rounded placeholder-gray-400 w-full "
                />
              </div>
              <div className="mb-3">
                <input
                  name="imageurl"
                  value={bookDetails.imageurl}
                  onChange={(e) =>
                    setBookDetails({ ...bookDetails, imageurl: e.target.value })
                  }
                  type="text"
                  placeholder="Image URL "
                  className="p-2 bg-white rounded placeholder-gray-400 w-full "
                />
              </div>
              <div className="mb-3">
                <input
                  name="price"
                  value={bookDetails.price}
                  onChange={(e) =>
                    setBookDetails({ ...bookDetails, price: e.target.value })
                  }
                  type="number"
                  placeholder="Price"
                  className="p-2 bg-white rounded placeholder-gray-400 w-full "
                />
              </div>
              <div className="mb-3">
                <input
                  name="dprice"
                  value={bookDetails.dprice}
                  onChange={(e) =>
                    setBookDetails({ ...bookDetails, dprice: e.target.value })
                  }
                  type="number"
                  placeholder="Discount Price"
                  className="p-2 bg-white rounded placeholder-gray-400 w-full "
                />
              </div>
              <div className="mb-3">
                <textarea
                  name="abstract"
                  value={bookDetails.abstract}
                  onChange={(e) =>
                    setBookDetails({ ...bookDetails, abstract: e.target.value })
                  }
                  rows={5}
                  placeholder="Abstract"
                  className="p-2 bg-white rounded placeholder-gray-400 w-full "
                />
              </div>
            </div>
            <div>
              <div className="mb-3 ms-3 ">
                <input
                  name="publisher"
                  value={bookDetails.publisher}
                  onChange={(e) =>
                    setBookDetails({
                      ...bookDetails,
                      publisher: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="Publisher"
                  className="p-2 bg-white rounded placeholder-gray-400 w-full "
                />
              </div>
              <div className="mb-3 ms-3 ">
                <input
                  name="language"
                  value={bookDetails.language}
                  onChange={(e) =>
                    setBookDetails({ ...bookDetails, language: e.target.value })
                  }
                  type="text"
                  placeholder="Language"
                  className="p-2 bg-white rounded placeholder-gray-400 w-full "
                />
              </div>
              <div className="mb-3 ms-3 ">
                <input
                  name="isbn"
                  value={bookDetails.isbn}
                  onChange={(e) =>
                    setBookDetails({ ...bookDetails, isbn: e.target.value })
                  }
                  type="text"
                  placeholder="ISBN"
                  className="p-2 bg-white rounded placeholder-gray-400 w-full "
                />
              </div>
              <div className="mb-3 ms-3 ">
                <input
                  name="category"
                  value={bookDetails.category}
                  onChange={(e) =>
                    setBookDetails({ ...bookDetails, category: e.target.value })
                  }
                  type="text"
                  placeholder="Category "
                  className="p-2 bg-white rounded placeholder-gray-400 w-full "
                />
              </div>

              <div className="mb-3 flex justify-center items-center w-full mt-10">
                {preview ? (
                  <img
                    src={preview}
                    alt="Selected book cover preview"
                    style={{
                      width: "200px",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <label htmlFor="imageFile">
                    <input
                      ref={imageFileInputRef}
                      type="file"
                      id="imageFile"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleUploadImg(e)}
                      style={{ display: "none" }}
                    />
                    <img
                      src="https://cdn-icons-png.magnific.com/256/10024/10024501.png?semt=ais_white_label"
                      alt="Upload a book cover"
                      style={{ width: "200px", height: "200px" }}
                    />
                  </label>
                )}
              </div>

              {preview && (
                <div className="flex justify-center items-center">
                  {previewList.map((item, index) => (
                    <img
                      key={`${item}-${index}`}
                      src={item}
                      alt={`Selected book cover ${index + 1}`}
                      onClick={() => setPreview(item)}
                      className="me-1 cursor-pointer"
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                      }}
                    />
                  ))}
                  <label htmlFor="imageFile">
                    <input
                      ref={imageFileInputRef}
                      type="file"
                      id="imageFile"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleUploadImg(e)}
                      style={{ display: "none" }}
                    />
                    <FontAwesomeIcon
                      icon={faSquarePlus}
                      className="fa-2x shadow ms-3 cursor-pointer"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleReset}
              className="bg-amber-500 rounded text-black p-3  hover:bg-white hover:border hover:border-amber-500 hover:text-amber-500 transition-colors duration-200"
            >
              Reset
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-green-500 rounded text-white p-3 hover:bg-white hover:border hover:border-green-500 hover:text-green-500 ms-2 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      )}

      {bookStatus && (
        <div className="my-12 space-y-5 px-5 md:px-12">
          <h1 className="text-2xl font-semibold">Your book listings</h1>
          {isLoadingHistory ? (
            <p role="status" className="py-10 text-center text-gray-600">
              Loading your listings...
            </p>
          ) : userBooks.length ? (
            userBooks.map((book) => (
              <BookHistoryCard
                key={book._id}
                book={book}
                onDelete={handleDeleteUserBook}
                isDeleting={deletingBookId === book._id}
                allowDelete
              />
            ))
          ) : (
            <p className="rounded bg-gray-100 py-10 text-center text-gray-600">
              You haven’t listed any books yet.
            </p>
          )}
        </div>
      )}
      {purchaseStatus && (
        <div className="my-12 space-y-5 px-5 md:px-12">
          <h1 className="text-2xl font-semibold">Your purchase history</h1>
          {isLoadingHistory ? (
            <p role="status" className="py-10 text-center text-gray-600">
              Loading your purchase history...
            </p>
          ) : broughtBooks.length ? (
            broughtBooks.map((book) => (
              <BookHistoryCard key={book._id} book={book} />
            ))
          ) : (
            <p className="rounded bg-gray-100 py-10 text-center text-gray-600">
              No purchase history is recorded for your account yet.
            </p>
          )}
        </div>
      )}

      <ToastContainer theme="colored" position="top-center" autoClose={2000} />
      <Footer />
    </>
  );
};

export default Profile;
