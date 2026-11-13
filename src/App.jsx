import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./users/pages/Home";
import Auth from "./pages/Auth";
import PagenotFound from "./pages/PagenotFound";
import { useEffect, useState } from "react";
import Preloader from "./components/Preloader";
import AllBooks from "./users/pages/AllBooks";
import Contact from "./users/pages/Contact";
import Careers from "./users/pages/Careers";
import Profile from "./users/pages/Profile";
import AdminHome from "./admin/pages/AdminHome";
import AdminCareers from "./admin/pages/AdminCareers";
import AdminBooks from "./admin/pages/AdminBooks";
import AdminSettings from "./admin/pages/AdminSettings";
import ViewBook from "./users/pages/ViewBook";
import PaymentSuccess from "./users/pages/PaymentSuccess";
import PaymentError from "./users/pages/PaymentError";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={isLoading ? <Preloader /> : <Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth register />} />
        <Route path="/all-books" element={<AllBooks />} />
        {/* <Route path="/careers" element={<Careers />} /> */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/view-book/:id" element={<ViewBook />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-error" element={<PaymentError />} />

        <Route
          path="/admin-home"
          element={isLoading ? <Preloader /> : <AdminHome />}
        />
        <Route path="admin-books" element={<AdminBooks />}></Route>
        {/* <Route path="/admin-careers" element={<AdminCareers />}></Route> */}
        <Route path="/admin-settings" element={<AdminSettings />}></Route>
        <Route path="/*" element={<PagenotFound />} />
      </Routes>
    </>
  );
}

export default App;
