import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../components/Header";

const PaymentError = () => (
  <div className="min-h-screen bg-slate-50 text-slate-900">
    <Header />
    <main className="mx-auto grid min-h-[65vh] w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 py-12 lg:grid-cols-2 lg:gap-16">
      <section role="alert" className="order-2 lg:order-1">
        <FontAwesomeIcon
          icon={faCircleXmark}
          aria-hidden="true"
          className="mb-5 text-4xl text-red-600"
        />
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-red-700">
          Payment status
        </p>
        <h1 className="font-serif text-4xl font-medium leading-tight text-red-600 sm:text-5xl">
          Sorry! Your payment was unsuccessful.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-slate-600">
          We apologize for the inconvenience. Please try again or explore more
          books.
        </p>
        <Link
          to="/all-books"
          className="mt-8 inline-flex items-center gap-2 rounded bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
          Explore more books
        </Link>
      </section>
      <div className="order-1 mx-auto aspect-square w-full max-w-xl overflow-hidden rounded-lg bg-red-50 lg:order-2">
        <img
          src="https://i.pinimg.com/originals/9d/16/7e/9d167e72839894c971c90f60ab00d916.gif"
          alt="Animated payment declined illustration"
          className="h-full w-full object-contain"
        />
      </div>
    </main>
    <Footer />
  </div>
);

export default PaymentError;
