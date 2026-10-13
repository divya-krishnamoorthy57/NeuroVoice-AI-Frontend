import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const AppLayout = ({ children }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#D9F7EE" }}>
      <Navbar />
      <main style={{ flex: 1, padding: "28px 20px", maxWidth: "1280px", width: "100%", margin: "0 auto" }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
