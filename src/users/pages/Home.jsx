import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "../components/Header";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { getHomeBookAPI } from "../../services/allApi";
import { serverURL } from "../../services/serverURL";
import { searchKeyContext } from "../../context/searchKeyContext";

const Home = () => {
  const navigate = useNavigate();
  const { searchKey, setSearchKey } = useContext(searchKeyContext);
  const [bookSearch, setBookSearch] = useState(searchKey);
  const [homeBooks, setHomeBooks] = useState([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [booksError, setBooksError] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    const query = bookSearch.trim();

    if (!query) {
      toast.info("Please enter the title of a book.");
      return;
    }

    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.info("Please log in to search all books.");
      setTimeout(() => navigate("/login"), 2500);
      return;
    }

    setSearchKey(query);
    navigate("/all-books");
  };

  useEffect(() => {
    const fetchHomeBooks = async () => {
      const result = await getHomeBookAPI();
      if (result.status === 200) {
        setHomeBooks(result.data);
      } else {
        setBooksError("Unable to load books. Please try again later.");
      }
      setIsLoadingBooks(false);
    };

    fetchHomeBooks();
  }, []);

  return (
    <>
      <Header />
      <main className="fade-in">
        <header className="flex items-center justify-center text-center text-white">
          <div className="w-full max-w-4xl px-4">
            <h1 className="whitespace-nowrap text-[clamp(1rem,5vw,3rem)] font-bold">
              Find Your Next Favorite Book
            </h1>
            <p className="mt-2 text-xl">Gift your friends and family a book</p>
            <form
              onSubmit={handleSearch}
              className="mx-auto mt-8 flex max-w-2xl items-center gap-3 rounded-full bg-white px-5 py-3 shadow-xl ring-1 ring-black/10 transition focus-within:ring-2 focus-within:ring-blue-500"
            >
              <input
                value={bookSearch}
                onChange={(event) => setBookSearch(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-left text-gray-900 outline-none placeholder-gray-400"
                type="search"
                placeholder="Search by title, author, or genre"
                aria-label="Search books"
              />
              <button
                type="submit"
                aria-label="Search books"
                className="text-blue-700"
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </form>
          </div>
        </header>

        <section className="flex flex-col items-center justify-center p-5 md:px-40 md:py-10">
          <h2 className="text-xl">NEW ARRIVALS</h2>
          <h3 className="text-3xl">Explore Our Latest Collection</h3>
          <div className="mt-5 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {isLoadingBooks ? (
              <p className="col-span-full text-center text-gray-600">
                Loading books...
              </p>
            ) : booksError ? (
              <p
                className="col-span-full text-center text-red-600"
                role="alert"
              >
                {booksError}
              </p>
            ) : homeBooks.length > 0 ? (
              homeBooks.map((book) => (
                <article
                  key={book._id}
                  className="p-3 shadow-md"
                >
                  <img
                    className="h-[300px] w-full bg-gray-50 object-contain"
                    src={
                      book.uploadedImg?.[0]
                        ? `${serverURL}/upload/${encodeURIComponent(book.uploadedImg[0])}`
                        : book.imageurl
                    }
                    alt={`${book.title} book cover`}
                  />
                  <div className="mt-3 flex flex-col items-center text-center">
                    <p className="text-blue-700">{book.author}</p>
                    <h4 className="font-semibold">{book.title}</h4>
                    <p>${book.dprice}</p>
                  </div>
                </article>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-600">
                No books are available yet.
              </p>
            )}
          </div>
          <div className="my-6 flex justify-center sm:my-8">
            <Link to={"/all-books"}>
              <button className="cursor-pointer rounded border border-blue-900 bg-blue-900 px-5 py-2.5 text-white transition-colors hover:bg-white hover:text-blue-900">
                Explore More
              </button>
            </Link>
          </div>
        </section>

        <section className="bg-white px-6 py-16 md:px-12 lg:px-16">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 md:grid-cols-2 lg:gap-16">
            {/* Left Side - Text */}
            <div>
              <p className="mb-2 text-center text-sm uppercase tracking-widest text-gray-700">
                Featured Authors
              </p>

              <h2 className="mb-10 text-center font-serif text-3xl font-medium text-gray-900 md:text-4xl">
                Captivates with every word
              </h2>

              <p className="mb-6 text-base leading-6 text-gray-700">
                Authors in a bookstore application are the visionaries behind
                the books that fill the shelves, each contributing their own
                unique voice, creativity, and perspective to the world of
                literature. Whether writing fiction, non-fiction, poetry, or
                educational works, authors bring stories, ideas, and knowledge
                to life in ways that resonate with readers of all backgrounds.
              </p>

              <p className="text-base leading-6 text-gray-700">
                Their work spans a wide array of genres, from thrilling
                mysteries and heartwarming romances to thought-provoking memoirs
                and insightful self-help books. Through their words, authors not
                only entertain and inform but also inspire and challenge readers
                to think deeply, reflect, and grow. In a bookstore application,
                authors' works become accessible to readers everywhere, offering
                a diverse and rich tapestry of voices and experiences.
              </p>
            </div>

            {/* Right Side - Author Image */}
            <div className="h-87.5 overflow-hidden md:h-112">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=1000&q=80"
                alt="Featured author"
                className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900">
              What Our Readers Say
            </h2>

            <p className="text-gray-500 text-center mt-3 mb-10">
              Hear from our happy book lovers
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: "Ananya Sharma",
                  review:
                    "A wonderful bookstore with amazing book collections!",
                },
                {
                  name: "Rahul Menon",
                  review: "Great prices, fast delivery, and excellent service.",
                },
                {
                  name: "Priya Nair",
                  review:
                    "A perfect place for book lovers. Highly recommended!",
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className="bg-white p-6 rounded-xl shadow-sm"
                >
                  <p className="text-yellow-500 text-xl">★★★★★</p>

                  <p className="text-gray-600 my-4 leading-7">
                    "{item.review}"
                  </p>

                  <h3 className="font-semibold text-amber-900">{item.name}</h3>

                  <p className="text-sm text-gray-400">Verified Reader</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
};

export default Home;
