import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Footer() {
  return (
    <footer className="text-center py-3 bg-light text-black mt-auto">
      <p>
        Created by{" "}
        <a
          href="https://github.com/cltxvz"
          target="_blank"
          rel="noopener noreferrer"
          className="text-success text-decoration-none"
        >
          Carlos A. Cárdenas
        </a>{" "}
      </p>
    </footer>
  );
}

export default Footer;
