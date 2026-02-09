import AboutSection from "@/components/AboutSection";
import ClientEffects from "@/components/ClientEffects";
import ContactSection from "@/components/ContactSection";
import FavoritesSection from "@/components/FavoritesSection";
import HeroSection from "@/components/HeroSection";
import LoadingScreen from "@/components/LoadingScreen";
import MovieSection from "@/components/MovieSection";
import Navigation from "@/components/Navigation";

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <div id="canvas-container" aria-hidden="true" />

      <div className="page-container">
        <Navigation />
        <HeroSection />
        <AboutSection />
        <MovieSection />
        <FavoritesSection />
        <ContactSection />
      </div>

      <ClientEffects />
    </>
  );
}
