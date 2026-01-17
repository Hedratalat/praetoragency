import { lazy } from "react";

const Navbar = lazy(() => import("../components/Navbar/Navbar"));
const HeroSection = lazy(() => import("../components/HeroSection/HeroSection"));
const AboutSection = lazy(() =>
  import("../components/AboutSection/AboutSection")
);
export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <AboutSection />
    </>
  );
}
