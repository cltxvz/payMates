import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const EventHeader = ({ eventName, createdAt }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!createdAt) return;

    const expirationTime = new Date(createdAt).getTime() + 7 * 24 * 60 * 60 * 1000;

    const updateCountdown = () => {
      const now = Date.now();
      const diff = expirationTime - now;

      if (diff <= 0) {
        setTimeLeft("Event has expired.");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown(); // Run immediately
    const interval = setInterval(updateCountdown, 1000); // Update every second

    return () => clearInterval(interval); 
  }, [createdAt]);

  return (
    <header className="bg-success text-white py-4 mb-4 shadow-sm">
      <Container className="text-center">
        <h2 className="fw-bold">{eventName}</h2>

        {timeLeft && (
          <p className="mt-3 text-white">
            ⏳ This event will expire in <strong>{timeLeft}</strong>
          </p>
        )}
      </Container>
    </header>
  );
};

export default EventHeader;
