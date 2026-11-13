import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useSearchParams } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../components/Header";
import { verifyCheckoutSessionAPI } from "../../services/allApi";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [token] = useState(() => sessionStorage.getItem("token") || "");
  const [paymentStatus, setPaymentStatus] = useState(() =>
    sessionId && token ? "checking" : "failed",
  );
  const [error, setError] = useState(
    sessionId && token
      ? ""
      : "We could not verify this payment. Please check your purchase history or try again.",
  );

  useEffect(() => {
    if (!sessionId || !token) return;

    let isCurrent = true;
    const verifyPayment = async () => {
      try {
        const result = await verifyCheckoutSessionAPI(sessionId, {
          Authorization: `Bearer ${token}`,
        });
        if (!isCurrent) return;

        if (result?.status === 200) {
          setPaymentStatus("success");
          setError("");
        } else {
          const message = result?.response?.data;
          setError(
            typeof message === "string"
              ? message
              : result?.message || "We could not verify this payment.",
          );
          setPaymentStatus("failed");
        }
      } catch {
        if (isCurrent) {
          setError("We could not verify this payment. Please try again.");
          setPaymentStatus("failed");
        }
      }
    };

    verifyPayment();
    return () => {
      isCurrent = false;
    };
  }, [sessionId, token]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto grid min-h-[65vh] w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 py-12 lg:grid-cols-2 lg:gap-16">
        <section
          role={paymentStatus === "failed" ? "alert" : "status"}
          aria-live="polite"
          className="order-2 lg:order-1"
        >
          <FontAwesomeIcon
            icon={faCircleCheck}
            aria-hidden="true"
            className="mb-5 text-4xl text-emerald-600"
          />
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Payment status
          </p>
          {paymentStatus === "checking" ? (
            <>
              <h1 className="font-serif text-4xl font-medium leading-tight text-slate-800 sm:text-5xl">
                Confirming your payment...
              </h1>
              <p className="mt-4 text-lg text-slate-600">
                Please wait while we verify your checkout.
              </p>
            </>
          ) : paymentStatus === "success" ? (
            <>
              <h1 className="font-serif text-4xl font-medium leading-tight text-emerald-700 sm:text-5xl">
                Your payment was successful!
              </h1>
              <p className="mt-4 max-w-xl text-lg text-slate-600">
                Thank you for your purchase. We hope you enjoy your next great
                read.
              </p>
            </>
          ) : (
            <>
              <h1 className="font-serif text-4xl font-medium leading-tight text-red-600 sm:text-5xl">
                We couldn’t verify your payment.
              </h1>
              <p className="mt-4 max-w-xl text-lg text-slate-600">{error}</p>
            </>
          )}
          {paymentStatus !== "checking" && (
            <Link
              to={paymentStatus === "failed" ? "/payment-error" : "/all-books"}
              className="mt-8 inline-flex items-center gap-2 rounded bg-emerald-700 px-5 py-3 font-medium text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
              {paymentStatus === "failed"
                ? "Back to payment"
                : "Continue browsing"}
            </Link>
          )}
        </section>
        <div className="order-1 mx-auto aspect-square w-full max-w-xl overflow-hidden rounded-lg bg-emerald-50 lg:order-2">
          <img
            src={
              paymentStatus === "failed"
                ? "https://i.pinimg.com/originals/9d/16/7e/9d167e72839894c971c90f60ab00d916.gif"
                : "https://cdn.dribbble.com/userupload/42114349/file/original-11935f8a5fc880b7d58e72e9731c1409.gif"
            }
            alt={
              paymentStatus === "failed"
                ? "Animated payment error illustration"
                : "Animated payment success illustration"
            }
            className="h-full w-full object-contain"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
