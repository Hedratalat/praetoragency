import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import "./index.css";
import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Contact = lazy(() => import("./pages/Contact"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetails = lazy(() => import("./pages/ServiceDetails"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Blog = lazy(() => import("./pages/Blog"));

const DashBoardLayout = lazy(
  () => import("./components/DashboardLayout/DashboardLayout"),
);
const AddServices = lazy(() => import("./pages/ServicesDash"));
const ManageServices = lazy(() => import("./pages/ManageServices"));
const MessageDash = lazy(() => import("./pages/MessageDash"));
const PricingDash = lazy(() => import("./pages/PricingDash"));
const BlogDash = lazy(() => import("./pages/BlogDash"));
const PortfolioDash = lazy(() => import("./pages/PortfolioDash"));

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
        <Toaster position="top-center" reverseOrder={false} />

        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetails />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route
              path="/dashboard"
              element={
                // <ProtectedRoute>
                <DashBoardLayout />
                // </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="AddServices" replace />} />
              <Route path="AddServices" element={<AddServices />} />
              <Route path="ManageServices" element={<ManageServices />} />
              <Route path="message" element={<MessageDash />} />
              <Route path="pricingDash" element={<PricingDash />} />
              <Route path="blogDash" element={<BlogDash />} />
              <Route path="portfolioDash" element={<PortfolioDash />} />
            </Route>
          </Routes>
        </Suspense>
      </HashRouter>
    </>
  );
}

export default App;
