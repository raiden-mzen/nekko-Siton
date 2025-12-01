import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "80px", paddingBottom: "200px" }}>
        {children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
