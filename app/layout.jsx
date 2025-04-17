import "@/assets/style/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { GlobalProvider } from "@/context/GlobalContext";
import 'photoswipe/dist/photoswipe.css' 

export const metadata = {
  title: "RentOfficeSpace.co.uk | Find an office in Long Eaton",
  description: "Affordable desks and offices to rent in Derbyshire",
  keywords: "office, coworking, Long Eaton",
};

const MainLayout = ({ children }) => {
  return (
    <GlobalProvider>
    <AuthProvider>
      <html lang="en">
        <body>
          <div>
            <Navbar></Navbar>
            <main> {children} </main>
            <Footer></Footer>
          </div>
          <ToastContainer/>
        </body>
      </html>
    </AuthProvider>
    </GlobalProvider>
  );
};

export default MainLayout;
