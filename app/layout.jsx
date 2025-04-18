import "../assets/style/globals.css";  
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthProvider from "../components/AuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GlobalProvider } from "../context/GlobalContext";
import "photoswipe/dist/photoswipe.css";

export const metadata = {
  title:   "RentOfficeSpace.co.uk | Find an office in Long Eaton",
  description: "Affordable desks and offices to rent in Derbyshire",
  keywords:    "office, coworking, Long Eaton",
};

export default function MainLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <GlobalProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <ToastContainer />
          </GlobalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
