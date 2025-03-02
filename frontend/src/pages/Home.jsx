import { useState } from "react";
import { scrapeWebsite } from "../api";
import { motion } from "framer-motion";

function Home() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScrape = async () => {
    if (!url) return alert("Please enter a URL");
    setLoading(true);
    const result = await scrapeWebsite(url);
    setData(result);
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      style={{
        textAlign: "center",
        padding: "20px",
        background: "#f4f4f4",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ color: "#333" }}>Web Scraper</h1>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL"
        style={{
          padding: "10px",
          width: "300px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          marginRight: "10px",
        }}
      />
      <button
        onClick={handleScrape}
        style={{
          padding: "10px 15px",
          borderRadius: "5px",
          border: "none",
          background: "#007bff",
          color: "#fff",
          cursor: "pointer",
        }}
        disabled={loading}
      >
        {loading ? "Scraping..." : "Scrape"}
      </button>

      {data && (
        <div style={{ marginTop: "20px", textAlign: "left" }}>
          <h2 style={{ color: "#333" }}>Scraped Data</h2>
          <ul>
            {data.text?.map((text, index) => (
              <li key={index}>{text}</li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}

export default Home;
