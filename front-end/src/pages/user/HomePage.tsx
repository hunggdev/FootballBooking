import { HeroSection } from "../../features/user-homepage/HeroSection";
import { QuickFeatures } from "../../features/user-homepage/QuickFeatures";
import { FeaturedFields } from "../../features/user-homepage/FeaturedFields";
import { PromotionSection } from "../../features/user-homepage/PromotionSection";
import { Testimonials } from "../../features/user-homepage/Testimonials";
import { ChatWidget} from "@/features/user-chatbot/ChatWidget"

const HomePage = () => {
  return (
    <div className="flex min-h-screen flex-col w-full">
      <main className="flex-1">
        <HeroSection />
        <QuickFeatures />
        <FeaturedFields />
        <PromotionSection />
        <Testimonials />
        <ChatWidget/>
      </main>
    </div>
  );
};

export default HomePage;