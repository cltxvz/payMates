import React, { useEffect } from "react";
import { Alert } from "react-bootstrap";

const ToastMessage = ({ message, variant = "info", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        minWidth: "300px",
        maxWidth: "90%",
      }}
    >
      <Alert variant={variant} className="text-center m-0 shadow">
        {message}
      </Alert>
    </div>
  );
};

export default ToastMessage;
