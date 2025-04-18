import "../assets/style/globals.css";  
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthProvider from "../components/AuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GlobalProvider } from "../context/GlobalContext";
import "photoswipe/dist/photoswipe.css";
import { LocalBusinessSchema } from "@/components/SchemaMarkup";

export const metadata = {
  title: "RentOfficeSpace.co.uk | Hot Desks, Coworking & Office Space to Rent",
  description: "Find affordable hot desks, coworking spaces and private offices to rent in Nottingham, Derby, Beeston & across the East Midlands. Daily, weekly and monthly options.",
  keywords: "office space, coworking, hot desk, hot desking, office rental, workspace, Nottingham, Derby, Beeston, East Midlands, rent a desk, day office, meeting room",
  openGraph: {
    title: "RentOfficeSpace.co.uk | Hot Desks, Coworking & Office Space to Rent",
    description: "Find affordable hot desks, coworking spaces and private offices across the East Midlands. Daily, weekly and monthly rates available.",
    type: "website",
    url: "https://rentOfficespace.co.uk/",
    siteName: "RentOfficeSpace",
    images: [
      {
        url: "https://rentOfficespace.co.uk/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "RentOfficeSpace.co.uk - Office Space and Coworking",
      },
    ],
  },
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
            <LocalBusinessSchema />
          </GlobalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}