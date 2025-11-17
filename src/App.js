// src/App.js
import React, { useState } from "react";
import "./index.css";

function App() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // TODO: replace this with your real API Gateway invoke URL
  const API_URL = "https://YOUR-API-ID.execute-api.YOUR-REGION.amazonaws.com/prod/signup";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setMessage(data.message || "Signup saved successfully!");
      } else {
        setMessage(data.message || "Server returned an error.");
      }
    } catch (err) {
      console.error("Request error:", err);
      setMessage("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="App">
      <h1>Signup Demo</h1>
      <form className="card" onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginLeft: "0.5rem" }}
          />
        </label>

        <button type="submit" disabled={loading} style={{ marginTop: "1rem" }}>
          {loading ? "Sending..." : "Submit"}
        </button>
      </form>

      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </main>
  );
}

export default App;
