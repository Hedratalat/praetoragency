import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import "./index.css";
import { lazy, Suspense } from "react";
import Portfolio from "./pages/Portfolio";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Services = lazy(() => import("./pages/Services"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Blog = lazy(() => import("./pages/Blog"));

const DashBoardLayout = lazy(() =>
  import("./components/DashboardLayout/DashboardLayout")
);
const AddServices = lazy(() => import("./pages/ServicesDash"));

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

              {/* <Route path="Feedback" element={<FeedbackDash />} />
              <Route path="message" element={<MessageDash />} /> */}
            </Route>
          </Routes>
        </Suspense>
      </HashRouter>
    </>
  );
}

export default App;
