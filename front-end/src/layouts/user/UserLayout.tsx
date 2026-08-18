import { Outlet } from "react-router";

import { Header } from "./Header";
import { FooterSection } from "./FooterSection";
import { TopBar } from "./TopBar";

export default function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col max-w-[1126px] mx-auto border border-border bg-base text-text-primary">
      <TopBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <FooterSection />

    </div>
  );
}