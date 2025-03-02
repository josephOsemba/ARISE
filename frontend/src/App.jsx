import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Loader from "./components/Loader";
import Home from "./pages/Home";
import LabScene from "./pages/LabScene";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/lab" element={<LabScene />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000); // Simulate loading delay
  }, []);

  return (
    <Router>
      {loading ? (
        <Loader />
      ) : (
        <div className="app-container">
          <Navbar />
          <div className="content">
            <AnimatedRoutes />
          </div>
        </div>
      )}
    </Router>
  );
};

export default App;
