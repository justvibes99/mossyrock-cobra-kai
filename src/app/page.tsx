import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import SenseiProfile from "@/components/SenseiProfile";
import FanFiction from "@/components/FanFiction";
import Roster from "@/components/Roster";
import BeltQuiz from "@/components/BeltQuiz";
import DojoRules from "@/components/DojoRules";
import EnrollForm from "@/components/EnrollForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <SenseiProfile />
        <FanFiction />
        <Roster />
        <BeltQuiz />
        <DojoRules />
        <EnrollForm />
      </main>
      <Footer />
    </>
  );
}
