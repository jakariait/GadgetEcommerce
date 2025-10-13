import React, { useEffect, useState } from "react";
import axios from "axios";

const MarqueeModern = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchMarquee = async () => {
      try {
        const res = await axios.get(`${apiUrl}/marquee`);
        if (res.data.isActive && Array.isArray(res.data.messages)) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        console.error("Failed to load marquee messages:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMarquee();
  }, []);

  if (loading) return null;
  if (messages.length === 0) return null;

  return (
    <div className="xl:container xl:mx-auto">
      <div className="mx-3 mb-3 rounded-lg shadow-sm p-3 overflow-hidden">
        <div className="relative overflow-hidden">
          <div
            className="marquee-track flex gap-12 whitespace-nowrap text-sm sm:text-base font-medium animate-marquee"
            style={{
              paddingLeft: "5rem", // space before start
              paddingRight: "5rem", // space after end
            }}
          >
            {[...messages, ...messages].map((msg, index) => (
              <span key={index}>{msg}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarqueeModern;
