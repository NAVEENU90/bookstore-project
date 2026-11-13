import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import { allBookApi } from "../../services/allApi";
import { serverURL } from "../../services/serverURL";
import { searchKeyContext } from "../../context/searchKeyContext";

const filters = [
  "Literary Fiction",
  "Novel",
  "Romance",
  "AutoBiography",
  "Self Help",
  "Politics",
  "Detective",
  "No Filter",
];

const AllBooks = () => {
  const [token] = useState(() => sessionStorage.getItem("token") || "");
  const [tempAllBooks, setTempAllBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("No Filter");
  const [searchTrigger, setSearchTrigger] = useState(0);

  const { searchKey, setSearchKey } = useContext(searchKeyContext);

  const filterBooks = (filter) => {
    setActiveFilter(filter);
  };

  useEffect(() => {
    if (!token) return;
    let isCurrent = true;

    const getAllBooks = async () => {
      try {
        const reqHeader = {
          Authorization: `Bearer ${token}`,
        };
        const result = await allBookApi(searchKey, reqHeader);
        if (!isCurrent) return;

        if (result.status === 200) {
          setTempAllBooks(result.data);
          setError("");
        } else {
          setError(
            result.response?.status === 401
              ? "Your session has expired. Please log in again."
              : "Unable to load books. Please try again later.",
          );
        }
      } catch {
        if (isCurrent) {
          setError("Unable to load books. Please try again later.");
        }
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    getAllBooks();
    return () => {
      isCurrent = false;
    };
  }, [token, searchKey, searchTrigger]);

  const showAllCategories =
    activeFilter.trim().toLowerCase().replaceAll("-", " ") === "no filter";
  const normalizedFilter = activeFilter.trim().toLowerCase();
  const books = tempAllBooks.filter((book) => {
    const status = book.status?.trim().toLowerCase();
    const isAvailable = status === "approved";
    const matchesCategory =
      showAllCategories ||
      book.category?.trim().toLowerCase() === normalizedFilter;

    return isAvailable && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#f4f4f4] text-slate-900">
      <Header />

      <main className="mx-auto max-w-300 px-4 pb-10 pt-10 md:px-6">
        {token ? (
          <>
            <h1 className="mb-10 text-center font-serif text-4xl font-medium tracking-tight md:text-5xl">
              Collections
            </h1>

            <form
              className="mx-auto mb-12 flex max-w-155 items-stretch"
              onSubmit={(event) => {
                event.preventDefault();
                setSearchKey((currentSearch) => currentSearch.trim());
                setSearchTrigger((trigger) => trigger + 1);
              }}
            >
              <input
                value={searchKey}
                onChange={(event) => setSearchKey(event.target.value)}
                type="search"
                aria-label="Search by title"
                placeholder="Search books by title"
                className="flex-1 border border-slate-400 border-r-0 bg-transparent px-4 py-2.5 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="w-28 bg-blue-600 px-3 text-base font-medium text-white shadow-md transition hover:bg-blue-700"
              >
                Search
              </button>
            </form>

            <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
              <aside className="w-full lg:w-64">
                <h2 className="mb-5 font-serif text-4xl font-medium tracking-tight text-slate-900">
                  Filters
                </h2>

                <ul className="space-y-4">
                  {filters.map((filter) => (
                    <li key={filter}>
                      <label className="flex cursor-pointer items-center gap-3 text-[1.15rem] text-slate-800">
                        <input
                          type="radio"
                          name="book-filter"
                          checked={activeFilter === filter}
                          onChange={() => filterBooks(filter)}
                          className="sr-only"
                        />
                        <span
                          className={`relative inline-block h-4 w-4 rounded-full border border-slate-800 ${
                            activeFilter === filter
                              ? "bg-slate-900"
                              : "bg-transparent"
                          }`}
                        >
                          {activeFilter === filter && (
                            <span className="absolute inset-1 rounded-full bg-white" />
                          )}
                        </span>
                        <span>{filter}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </aside>

              <section className="flex-1">
                {isLoading ? (
                  <p className="text-slate-600">Loading books...</p>
                ) : error ? (
                  <p className="text-red-600" role="alert">
                    {error}
                  </p>
                ) : books.length === 0 ? (
                  <p className="text-slate-600">
                    {activeFilter === "No Filter"
                      ? "No books are available yet."
                      : `No books found in ${activeFilter}.`}
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
                    {books.map((book) => (
                      <article key={book._id} className="w-full max-w-85">
                        <div className="h-105 overflow-hidden border border-slate-300 bg-white shadow-[0_10px_25px_rgba(15,23,42,0.15)]">
                          <img
                            className="h-full w-full object-cover"
                            src={
                              book.uploadedImg?.[0]
                                ? `${serverURL}/upload/${encodeURIComponent(book.uploadedImg[0])}`
                                : book.imageurl
                            }
                            alt={`${book.title} book cover`}
                          />
                        </div>

                        <div className="mt-5 flex flex-col items-center gap-2 text-center">
                          <span className="text-[1.05rem] text-blue-600">
                            {book.author}
                          </span>
                          <span className="text-[1.12rem] font-semibold text-slate-900">
                            {book.title}
                          </span>
                          <span className="text-slate-700">${book.dprice}</span>
                        </div>

                        <Link
                          to={`/view-book/${book._id}`}
                          state={{ book }}
                          className="mt-4 block w-full rounded-md bg-blue-600 px-4 py-3 text-center text-lg font-medium text-white shadow-[0_8px_18px_rgba(37,99,235,0.25)] transition hover:bg-blue-700"
                        >
                          View Book
                        </Link>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </>
        ) : (
          <div className="grid min-h-[50vh] grid-cols-1 items-center gap-6 md:grid-cols-3">
            <div />
            <div className="flex w-full flex-col items-center justify-center text-center">
              <img
                className="max-h-64 w-full object-contain"
                src="https://i.pinimg.com/originals/eb/17/d0/eb17d0925c49ef13af6e84cdfeaad079.gif"
                alt="Browse books after logging in"
              />
              <p className="mt-3 text-2xl">
                Please{" "}
                <Link to="/login" className="text-red-500 underline">
                  Login
                </Link>{" "}
                to Explore more...
              </p>
            </div>
            <div />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AllBooks;
