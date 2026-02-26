import "./Layout.css";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

function Layout({ children, variant = "full" }) {
  const isFullLayout = variant === "full";

  return (
    <div className={`layout layout-${variant}`}>
      <Navbar />
      <div className="layout-content">
        {isFullLayout && <Sidebar />}
        <main className={`main-content ${!isFullLayout ? "full-width" : ""}`}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
