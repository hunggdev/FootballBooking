import { FilterPanel } from "./FilterPanel";
import { FeaturedTournaments } from "./FeaturedTournaments";
import { CreateMatchCTA } from "./CreateMatchCTA";
import { GuideList } from "./GuideList";
import type { GuideItem, Tournament } from "./types";

interface SidebarProps {
  tournaments: Tournament[];
  guideItems: GuideItem[];
}

export function Sidebar({ tournaments, guideItems }: SidebarProps) {
  return (
    <aside className="space-y-4">
      <FilterPanel />
      <FeaturedTournaments tournaments={tournaments} />
      <CreateMatchCTA />
      <GuideList items={guideItems} />
    </aside>
  );
}
