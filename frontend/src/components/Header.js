import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Header() {
  return (
    <header className="text-center py-5 bg-success text-white">
      <h1 className="fw-bold">PayMates</h1>
      <p className="tagline fs-5">
        Easily split group expenses, track payments, and settle up — together.
      </p>
    </header>
  );
}

export default Header;
