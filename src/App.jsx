import { HashRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "./index.css";
import { lazy, Suspense } from "react";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Services = lazy(() => import("./pages/Services"));
const Pricing = lazy(() => import("./pages/Pricing"));

// Spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div
      className="w-16 h-16 border-4 border-t-primary border-b-gray-300 border-l-gray-300 border-r-gray-300 
      rounded-full animate-spin"
    ></div>
  </div>
);

function App() {
  return (
    <>
      <HashRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<Services />} />
            <Route path="/pricing" element={<Pricing />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </>
  );
}

export default App;
