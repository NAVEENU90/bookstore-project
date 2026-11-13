import {
  faBackward,
  faCamera,
  faEye,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import Footer from "../../components/Footer";
import Header from "../components/Header";
import {
  createCheckoutSessionAPI,
  viewBookAPI,
} from "../../services/allApi";
import { serverURL } from "../../services/serverURL";

const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : Promise.resolve(null);

const ViewBook = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const initialBook =
    location.state?.book?._id === id ? location.state.book : null;
  const [book, setBook] = useState(initialBook);
  const [isLoading, setIsLoading] = useState(!initialBook);
  const [error, setError] = useState("");
  const [isPhotosOpen, setIsPhotosOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [token] = useState(() => sessionStorage.getItem("token") || "");

  useEffect(() => {
    if (book?._id === id) return;

    let isCurrent = true;

    const fetchBook = async () => {
      try {
        const result = await viewBookAPI(id);
        if (!isCurrent) return;

        if (result.status === 200 && result.data?._id) {
          setBook(result.data);
          setError("");
        } else {
          setError("Unable to load this book. Please try again later.");
        }
      } catch {
        if (isCurrent) {
          setError("Unable to load this book. Please try again later.");
        }
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    fetchBook();
    return () => {
      isCurrent = false;
    };
  }, [id, book?._id]);

  const bookPhotos = book?.uploadedImg?.length
    ? book.uploadedImg.map(
        (image) => `${serverURL}/upload/${encodeURIComponent(image)}`,
      )
    : book?.imageurl
      ? [book.imageurl]
      : [];

  useEffect(() => {
    if (!isPhotosOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsPhotosOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPhotosOpen]);

  const handleBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate("/all-books");
    }
  };

  const handleBuy = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    setPaymentError("");
    setIsPaying(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error(
          "Stripe is not configured. Set VITE_STRIPE_PUBLISHABLE_KEY in the frontend environment.",
        );
      }

      const result = await createCheckoutSessionAPI(book._id, {
        Authorization: `Bearer ${token}`,
      });
      if (result?.status !== 200 || !result.data?.url) {
        const message = result?.response?.data;
        throw new Error(
          typeof message === "string"
            ? message
            : message?.message || result?.message || "Unable to start checkout.",
        );
      }

      window.location.assign(result.data.url);
    } catch (paymentRequestError) {
      setPaymentError(
        paymentRequestError.message || "Unable to start checkout.",
      );
      setIsPaying(false);
    }
  };

  const coverImage = book?.uploadedImg?.[0]
    ? `${serverURL}/upload/${encodeURIComponent(book.uploadedImg[0])}`
    : book?.imageurl;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />

      <main className="mx-auto flex min-h-[65vh] max-w-7xl items-center px-4 py-10 md:px-8">
        {isLoading ? (
          <p className="w-full text-center text-slate-600">Loading book...</p>
        ) : error ? (
          <div className="w-full text-center">
            <p className="text-lg text-red-600" role="alert">{error}</p>
            <button
              type="button"
              onClick={handleBack}
              className="mt-5 rounded border border-blue-800 px-4 py-2 text-blue-800 transition hover:bg-blue-50"
            >
              <FontAwesomeIcon icon={faBackward} className="mr-2" />
              Back
            </button>
          </div>
        ) : book ? (
          <article className="grid w-full gap-8 rounded-sm p-5 shadow-md sm:p-8 md:grid-cols-[minmax(220px,0.8fr)_2fr] md:gap-10 lg:p-10">
            <div className="flex items-center justify-center">
              <img
                className="max-h-[480px] w-full max-w-[320px] object-contain"
                src={coverImage}
                alt={`${book.title} book cover`}
              />
            </div>

            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => setIsPhotosOpen(true)}
                aria-label="View book photos"
                className="flex justify-end text-slate-500 transition hover:text-slate-900"
              >
                <FontAwesomeIcon icon={faEye} aria-hidden="true" />
              </button>

              <h1 className="mt-2 text-2xl font-semibold">{book.title}</h1>
              <p className="text-blue-600">{book.author}</p>

              <dl className="mt-8 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-3">
                <div>
                  <dt className="inline font-medium">Publisher: </dt>
                  <dd className="inline">{book.publisher}</dd>
                </div>
                <div className="sm:text-center">
                  <dt className="inline font-medium">Language: </dt>
                  <dd className="inline">{book.language}</dd>
                </div>
                <div className="sm:text-right">
                  <dt className="inline font-medium">No. of pages: </dt>
                  <dd className="inline">{book.noofpages}</dd>
                </div>
                <div>
                  <dt className="inline font-medium">Seller Mail: </dt>
                  <dd className="inline">{book.userMail}</dd>
                </div>
                <div className="sm:text-center">
                  <dt className="inline font-medium">Real Price: </dt>
                  <dd className="inline">${book.price}</dd>
                </div>
                <div className="sm:text-right">
                  <dt className="inline font-medium">ISBN: </dt>
                  <dd className="inline">{book.isbn}</dd>
                </div>
              </dl>

              <p className="mt-8 whitespace-pre-line">{book.abstract}</p>

              <div className="mt-auto flex flex-wrap justify-end gap-3 pt-10">
                <button
                  type="button"
                  onClick={handleBack}
                  className="rounded border border-blue-800 px-4 py-2 text-blue-800 transition hover:bg-blue-50"
                >
                  <FontAwesomeIcon icon={faBackward} className="mr-2" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleBuy}
                  disabled={
                    isPaying ||
                    book.status?.trim().toLowerCase() !== "approved" ||
                    Boolean(book.brought)
                  }
                  className="rounded bg-green-700 px-4 py-2 text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPaying ? "Redirecting to checkout..." : `Buy $${book.dprice}`}
                </button>
              </div>
              {paymentError && (
                <p className="mt-4 text-right text-sm text-red-600" role="alert">
                  {paymentError}
                </p>
              )}
            </div>
          </article>
        ) : (
          <div className="w-full text-center">
            <p className="text-lg text-slate-700">
              Book details are unavailable. Open a book from the collections
              page.
            </p>
            <button
              type="button"
              onClick={handleBack}
              className="mt-5 rounded border border-blue-800 px-4 py-2 text-blue-800 transition hover:bg-blue-50"
            >
              <FontAwesomeIcon icon={faBackward} className="mr-2" />
              Back
            </button>
          </div>
        )}
      </main>

      {isPhotosOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[1000] overflow-y-auto"
            onClick={() => setIsPhotosOpen(false)}
          >
            <div
              aria-hidden="true"
              className="fixed inset-0 bg-gray-500/75 transition-opacity"
            />
            <div className="relative z-10 flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <section
                role="dialog"
                aria-labelledby="book-photos-title"
                aria-modal="true"
                onClick={(event) => event.stopPropagation()}
                className="relative my-8 w-full max-w-4xl transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all"
              >
                <div className="flex justify-between bg-gray-900 p-3 text-white">
                  <h2 id="book-photos-title">Book Photos</h2>
                  <button
                    type="button"
                    onClick={() => setIsPhotosOpen(false)}
                    aria-label="Close book photos"
                    className="rounded p-1 transition hover:bg-white/10"
                  >
                    <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
                  </button>
                </div>

                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <p className="mb-5 text-sm text-blue-500">
                    <FontAwesomeIcon icon={faCamera} className="mr-3" />
                    Camera click of the book in the hand of seller
                  </p>
                  {bookPhotos.length > 0 ? (
                    <div className="flex flex-wrap items-center justify-center gap-4">
                      {bookPhotos.map((photo, index) => (
                        <img
                          key={`${photo}-${index}`}
                          src={photo}
                          alt={`${book.title} photo ${index + 1}`}
                          className="max-h-[60vh] max-w-full object-contain"
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-600">No photos are available.</p>
                  )}
                </div>
              </section>
            </div>
          </div>,
          document.body,
        )}

      <Footer />
    </div>
  );
};

export default ViewBook;
